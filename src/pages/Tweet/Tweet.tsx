import React, { useEffect, useState } from 'react';

import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../firebase.ts';

import { getTwitterAccounts, saveGeneratePrompt, saveGenerateTweet, fetchPrompt, getTweets } from '../../services/apiFirebase.ts';
import { postTweet } from '../../services/twitterApi.ts';

import { v4 as uuidv4 } from 'uuid';

import { OpenAI } from 'openai';

import './tweet.css'

import { SchedulePrompt, GenerateTweet } from '../../types/types.ts';

import notyf from '../../utyls/notyfConfig.ts';


import Loader from '../../components/UI/Loader/Loader.tsx';
import PromptSection from '../../components/PromptSection/PromptSection.tsx';
import Select from '../../components/UI/Select/Select.tsx'
import TweetList from '../../components/TweetsList/TweetList.tsx';

const Tweet = () => {

    const [user, setUser] = useState(null); 
    const [loading, setLoading] = useState(false);

    const [prompt, setPrompt] = useState('');
    const [schedulePrompt, setSchedulePrompt] = useState('');
    const [generatedContent, setGeneratedContent] = useState('');

    const [twitterAccounts, setTwitterAccounts] = useState([]);
    const [selectedAccount, setSelectedAccount] = useState('');

    const [schedule, setSchedule] = useState('');

    const [tweets, setTweets] = useState([]);


    const openai = new OpenAI({ 
        apiKey: process.env.REACT_APP_OPENAI_API_KEY || '',
        dangerouslyAllowBrowser: true
    });
    
    const runOpenAICompletion = async (prompt: string) => {
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
    };

    const handleGenerate = async () => {
        setLoading(true);
        try {
            const content = await runOpenAICompletion(prompt);
            setGeneratedContent(content);
            console.log('Generated content:', content);
        } catch (error) {
            console.error('Error generating content:', error);
        } finally {
            setLoading(false);
        }
    };

    // FORMAT DATE AND TIME
    const formatDate = (date: Date) => {
        return date.toISOString().split('T')[0];
    };

    const formatTime = (date: Date) => {
        return date.getHours().toString();
    };

    const updatePrompt = async (newPrompt: string) => {
        setLoading(true);
        try {
            const existingPrompt = JSON.parse(schedulePrompt || '{}');
            if (existingPrompt?.id) {
                // Update only the prompt field in the existing document
                const updatedPrompt: SchedulePrompt = {
                    ...existingPrompt,
                    prompt: newPrompt,
                    updated_at: `${formatDate(new Date())} ${formatTime(new Date())}`,
                };
                
                // Use the existing prompt's ID to update the correct document
                await saveGeneratePrompt(updatedPrompt, user.uid);
                setSchedulePrompt(JSON.stringify(updatedPrompt));
                notyf.success('Prompt updated successfully');
            }
        } catch (error) {
            console.error('Error updating prompt:', error);
            notyf.error('Failed to update prompt');
        } finally {
            setLoading(false);
        }
    };

    // POST TWEET NOW
    const tweetNow = async (editedContent?: string) => {
        setLoading(true);
        
        // Check if we have an existing prompt
        const existingPrompt = JSON.parse(schedulePrompt || '{}');
        
        // SAVE GENERATE TWEET
        const generateTweet: GenerateTweet = {
            id: uuidv4(),
            prompt: prompt,
            generated_content: editedContent || '',
            twitter_id: selectedAccount,
            created_at: `${formatDate(new Date())} ${formatTime(new Date())}`,
        };

        console.table(generateTweet);

        await saveGenerateTweet(generateTweet, user.uid);

        // Create new prompt only if it doesn't exist
        if (!existingPrompt?.id) {
            const newPrompt: SchedulePrompt = {
                id: uuidv4(),
                prompt: prompt,
                twitter_id: selectedAccount,
                user_id: user.uid,
                created_at: `${formatDate(new Date())} ${formatTime(new Date())}`,
                updated_at: `${formatDate(new Date())} ${formatTime(new Date())}`,
                schedule: {
                    interval: '',
                    next_run: '',
                    enabled: false
                }
            };
            await saveGeneratePrompt(newPrompt, user.uid);
        }

        // POST TWEET
        await postTweet(generateTweet, user.uid);
        notyf.success('Tweet posted successfully');
        setLoading(false);
    }
    
    // const handleSchedule = async () => {
    //     // SAVE BASE PROMPT
    //     const intervalInHours = parseInt(schedule);
    //     const nextRun = new Date();
    //     nextRun.setHours(nextRun.getHours() + intervalInHours);
    //     nextRun.setMinutes(0, 0, 0);


    //     const schedulePrompt: SchedulePrompt = {
    //         id: uuidv4(),
    //         prompt: prompt,
    //         schedule: {
    //             interval: schedule,
    //             next_run: `${formatDate(nextRun)} ${formatTime(nextRun)}`,
    //             enabled: true,
    //         },
    //         twitter_id: selectedAccount,
    //         user_id: user.uid,
    //         created_at: `${formatDate(new Date())} ${formatTime(new Date())}`,
    //         updated_at: `${formatDate(new Date())} ${formatTime(new Date())}`,
    //     };

    //     await saveGeneratePrompt(schedulePrompt, user.uid);

    //     // SAVE GENERATE TWEET
    //     const generateTweet: GenerateTweet = {
    //         id: uuidv4(),
    //         prompt: prompt,
    //         generated_content: generatedContent,
    //         twitter_id: selectedAccount,
    //         created_at: `${formatDate(new Date())} ${formatTime(new Date())}`,
    //     };

    //    await saveGenerateTweet(generateTweet, user.uid);
        
    //     // POST FIRST TWEET
    //    //  await postTweet(generateTweet, user.uid);
    // };


    // const fetchSchedulePrompt = async (twitterId: string) => {
    //     console.log(twitterId);
    //     const loadPrompt = await fetchPrompt(twitterId);
    //     console.log(loadPrompt);
    //     setSchedulePrompt(loadPrompt);
    // };


    const handleSelectAccount = async (value: any) => {
        const loadPrompt = await fetchPrompt(value);
        setSelectedAccount(value);
        setSchedulePrompt(loadPrompt);
        
        // Set the prompt value if it exists
        const parsedPrompt = JSON.parse(loadPrompt || '{}');
        if (parsedPrompt?.prompt) {
            setPrompt(parsedPrompt.prompt);
        } else {
            setPrompt('');
        }

        const tweets = await getTweets(user.uid, value);
        setTweets(tweets);
    };  

    useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        setUser(user);
        setLoading(false);
      });

      return () => unsubscribe();
    }, []);

    useEffect(() => {
        const fetchTwitterAccounts = async () => {
            const accounts = await getTwitterAccounts(user.uid);
            setTwitterAccounts(accounts);   
        };
    
        if (user) {
            fetchTwitterAccounts();
        }
    }, [user]);

    
    return (
           <>
            {user ? (
                <div className="container mx-auto pt-4">
                    <div className="flex-1">
                        <div className="grid grid-cols-2 gap-8">
                            <div className="">
                                
                                <div className="pb-4">
                                    <h2 className="text-2xl font-bold text-white">Generate your tweets</h2>
                                </div>

                                <div className="bg-[#27292B] rounded-2xl p-6 relative overflow-hidden">
                                    {loading && <Loader />}
                                    <div className="">
                                        <h3 className="text-white text-lg pb-4">Select your twitter profile</h3>
                                        <Select
                                            value={selectedAccount} 
                                            onChange={(e) => handleSelectAccount(e.target.value)} 
                                            options={twitterAccounts}
                                            title="Select twitter profile"
                                        />
                                    </div>
                                
                                    <div className="pt-8 relative">
                                        {selectedAccount && (
                                            <>
                                                <PromptSection 
                                                    schedulePrompt={JSON.parse(schedulePrompt || '{}')} 
                                                    value={prompt} 
                                                    onChange={(e) => setPrompt(e.target.value)} 
                                                    handleGenerate={handleGenerate}
                                                    generatedContent={generatedContent}
                                                    schedule={schedule}
                                                    setSchedule={setSchedule}
                                                    tweetNow={tweetNow}
                                                    updatePrompt={updatePrompt}
                                                />
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="">
                                <TweetList 
                                    tweets={tweets}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <h2>NENI</h2>
            )}
        </>
    )
}

export default Tweet;