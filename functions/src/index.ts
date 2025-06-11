/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

// import {onRequest} from "firebase-functions/v2/https";
// import * as logger from "firebase-functions/logger";

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

// export const helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { TwitterApi } from 'twitter-api-v2';
import { onSchedule } from 'firebase-functions/v2/scheduler';
import OpenAI from 'openai';

import { v4 as uuidv4 } from 'uuid';


admin.initializeApp();
const db = admin.firestore();


// POST FIRST TWEET
export const postTweet = functions.https.onCall(async (request: functions.https.CallableRequest, context) => {
  const { userId, twitterId, content } = request.data;

  if (!userId || !twitterId || !content) {
    throw new functions.https.HttpsError('invalid-argument', 'Chýbajú požadované údaje.');
  }

  try {
 
    const accountsRef = db.collection(`users/${userId}/twitter_accounts`);
    const snapshot = await accountsRef.where('id', '==', twitterId).get();

    if (snapshot.empty) {
      throw new functions.https.HttpsError('not-found', 'Twitter účet neexistuje.');
    }

    const accountData = snapshot.docs[0].data();

    const client = new TwitterApi({
      appKey: accountData.app_key,
      appSecret: accountData.app_secret,
      accessToken: accountData.access_token,
      accessSecret: accountData.access_token_secret,
    });

    // Odošli tweet
    const tweet = await client.v2.tweet(content);

    return { success: true, tweetId: tweet.data.id };
  } catch (error: any) {
    console.error('Chyba pri odosielaní tweetu:', error);
    throw new functions.https.HttpsError('internal', error.message);
  }
});


// AUTOMATIC TWEET
export const scheduledTweetGenerator = onSchedule("every 1 hours", async () => {
  console.log("✅ Scheduled tweet generator triggered");

  try {
    // GET ALL ENABLED SCHEDULED TWEETS
    const snapshot = await db.collection("schedule").get();
    console.log(`✅ Found ${snapshot.docs.length} scheduled tweets`);

    const openai = new OpenAI({ 
      apiKey: process.env.REACT_APP_OPENAI_API_KEY || '',
      dangerouslyAllowBrowser: true,
    });

    const runOpenAICompletion = async (prompt: string) => {
      try {
        const completion = await openai.chat.completions.create({
          model: "gpt-4o-mini",
          messages: [
            { 
              role: "system", 
              content: "You are a marketing copywriter assistant for creating tweets." 
            },
            {
              role: "user",
              content: prompt,
            },
          ],
        });
        return completion.choices[0].message.content;
      } catch (error) {
        console.error("❌ Error in OpenAI completion", error);
        throw error;
      }
    };

    for (const doc of snapshot.docs) {
      const data = doc.data();
      const userId = data.user_id;
      const twitterId = data.twitter_id;
      const schedule = data.schedule;
      const interval = data.interval;

      console.log('✅ DATA', doc);

      const nextRunDate = new Date(schedule.next_run.replace(' ', 'T') + ':00'); 

      const currentTime = new Date();

      if (nextRunDate <= currentTime && (currentTime.getHours() % interval === 0)) {
        try {
          // SELECT TWITTER ACCOUNT
          const accountsRef = db.collection(`users/${userId}/twitter_accounts`);
          const twitterAccount = await accountsRef.where('id', '==', twitterId).get();

          if (twitterAccount.empty) {
            console.error('❌ Twitter account not found');
            throw new Error('Twitter account not found');
          }

          console.log('✅ Twitter account found:', twitterAccount.docs[0].data());

          const accountData = twitterAccount.docs[0].data();
          const client = new TwitterApi({
            appKey: accountData.app_key,
            appSecret: accountData.app_secret,
            accessToken: accountData.access_token,
            accessSecret: accountData.access_token_secret,
          });

          // GENERATE OPENAI TWEET FROM PROMPT
          const prompt = data.prompt;
          const tweet = await runOpenAICompletion(prompt);

          console.log('✅ Generated tweet:', tweet);

          // POST TWEET TO TWITTER
          if (tweet) {
            try {
              await client.v2.tweet(tweet);
              console.log('✅ Tweet posted to Twitter');
            } catch (error: any) {
              console.error('❌ Error posting tweet:', error);
            }

            // SAVE NEW TWEET TO FIRESTORE
            const tweetRef = db.collection(`users/${userId}/generate_tweets`);
            await tweetRef.add({
              id: uuidv4(),
              prompt: prompt,
              generated_content: tweet,
              twitter_id: twitterId,
              created_at: new Date().toISOString(),
            });

            console.log('✅ Saved tweet to Firestore');

            // UPDATE SCHEDULE
            const nextRunSchedule = new Date();
            nextRunSchedule.setHours(nextRunSchedule.getHours() + interval);

            const scheduleSnapshot = await db.collection("schedule").where("id", "==", data.id).get();

            const scheduleDoc = scheduleSnapshot.docs[0];
            console.log('✅ SCHEDULE ID', scheduleDoc.id);

            await scheduleDoc.ref.update({
                "schedule.next_run": `${nextRunSchedule.toISOString().slice(0, 13).replace('T', ' ')}`,
                updated_at: new Date().toISOString(),
            });

            console.log('✅ Schedule updated');
          }
        } catch (error: any) {
          console.error('❌ Error processing scheduled tweet:', error);
        }
      }
    }
  } catch (error) {
    console.error("❌ Error in scheduled tweet generator:", error);
  }
});



