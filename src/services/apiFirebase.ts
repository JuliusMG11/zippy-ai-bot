import { firestore } from '../firebase.ts';
import { addDoc, collection, getDocs, doc, getDoc } from 'firebase/firestore';

import { SchedulePrompt, GenerateTweet } from '../types/types';
const db = firestore;

export const getTwitterAccounts = async (uid: string) => {

    const accountsRef = collection(db, `users/${uid}/twitter_accounts`);
    const snapshot = await getDocs(accountsRef);
    const accounts: any[] = [];
        
    snapshot.forEach(doc => {
        accounts.push({ id: doc.id, ...doc.data() });
    });

    if (accounts.length === 0) {
        return []; 
    }

    return accounts;
};


// FUNCTION FOR SAVE GENERATE PROMPT
export const saveGeneratePrompt = async (data: SchedulePrompt, id: string) => {
    const userRef = collection(db, `schedule`);
    await addDoc(userRef, data);
};

// FUNCTION FOR SAVE GENERATE TWEET
export const saveGenerateTweet = async (data: GenerateTweet, id: string) => {
    const userRef = collection(db, `users/${id}/generate_tweets`);
    await addDoc(userRef, data);
};

// FUNKCIA FOR LOADING PROMS
export const fetchPrompt = async (twitterId: string) => {
    const userRef = collection(db, `schedule`);
    const promptsSnapshot = await getDocs(userRef);

    let prompt: SchedulePrompt | null = null;

    promptsSnapshot.forEach(doc => {
        const data = doc.data() as SchedulePrompt; 

        if (data.twitter_id === twitterId) {
            prompt = data;
        }
    });

    return prompt ? JSON.stringify(prompt) : null; 
    
};

// FUNCTION FOR GET TWEETS
export const getTweets = async (userId: string, twitterId: string) => {
    const userRef = collection(db, `users/${userId}/generate_tweets`);
    const tweetsSnapshot = await getDocs(userRef);
    const tweets: any[] = [];
    tweetsSnapshot.forEach(doc => {
        const data = doc.data() as GenerateTweet;
        if(data.twitter_id === twitterId) {
            tweets.push(data);
        }
    });

    return tweets;
};

// FUNCTION FOR GET TWITTER ACCOUNT DATA
export const getTwitterAccountData = async (userId: string, twitterId: string) => {
    const accountsRef = collection(db, `users/${userId}/twitter_accounts`);
    const accountsSnapshot = await getDocs(accountsRef);
    
    let foundAccount: any = null;

    accountsSnapshot.forEach(doc => {
        const accountData = doc.data();
        if (accountData.id === twitterId) {
            foundAccount = accountData;
        }
    });

    if (!foundAccount) {
        throw new Error('Účet neexistuje');
    }

    console.log(foundAccount);

    return foundAccount; 
};