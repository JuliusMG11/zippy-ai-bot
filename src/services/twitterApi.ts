
import { httpsCallable } from 'firebase/functions';
import { functions } from '../firebase.ts';
import { GenerateTweet } from '../types/types.ts';


export const postTweet = async (data: GenerateTweet, id: string) => {
  const postTweetFunction = httpsCallable(functions, 'postTweet');
  
  try {
    console.log(data);
    const response = await postTweetFunction({ userId: id, twitterId: data.twitter_id, content: data.generated_content });
    console.log('Tweet odoslaný:', response.data);
    return response.data;
  } catch (error) {
    console.error('Chyba pri odosielaní tweetu:', error);
    throw error;
  }
};