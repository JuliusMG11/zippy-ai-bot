import React, { useEffect, useState } from 'react';

import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../firebase.ts';

import { getTwitterAccounts, saveGeneratePrompt, saveGenerateTweet, fetchPrompt, getTweets } from '../../services/apiFirebase.ts';
import { postTweet } from '../../services/twitterApi.ts';

import { v4 as uuidv4 } from 'uuid';

import { OpenAI } from 'openai';

import './tweet.css'

import { SchedulePrompt, GenerateTweet } from '../../types/types.ts';


import Loader from '../../components/UI/Loader/Loader.tsx';
import PromptSection from '../../components/PromptSection/PromptSection.tsx';
import Select from '../../components/UI/Select/Select.tsx'
import TweetList from '../../components/TweetsList/TweetList.tsx';

const Tweet = () => {

    const [user, setUser] = useState(null); 
    const [loading, setLoading] = useState(true);

    const [prompt, setPrompt] = useState('');
    const [schedulePrompt, setSchedulePrompt] = useState('');
    const [generatedContent, setGeneratedContent] = useState('');

    const [twitterAccounts, setTwitterAccounts] = useState([]);
    const [selectedAccount, setSelectedAccount] = useState('');

    const [schedule, setSchedule] = useState('');

    const [tweets, setTweets] = useState([]);


    const openai = new OpenAI({ 
        apiKey: process.env.REACT_APP_OPENAI_API_KEY, 
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
        const content = await runOpenAICompletion(prompt);
        setGeneratedContent(content);
    };

    
    const handleSchedule = async () => {
        // SAVE BASE PROMPT
        const intervalInHours = parseInt(schedule);
        const nextRun = new Date();
        nextRun.setHours(nextRun.getHours() + intervalInHours);
        nextRun.setMinutes(0, 0, 0);

        const formatDate = (date: Date) => {
            return date.toISOString().split('T')[0];
        };

        const formatTime = (date: Date) => {
            return date.getHours().toString();
        };

        const schedulePrompt: SchedulePrompt = {
            id: uuidv4(),
            prompt: prompt,
            schedule: {
                interval: schedule,
                next_run: `${formatDate(nextRun)} ${formatTime(nextRun)}`,
                enabled: true,
            },
            twitter_id: selectedAccount,
            user_id: user.uid,
            created_at: `${formatDate(new Date())} ${formatTime(new Date())}`,
            updated_at: `${formatDate(new Date())} ${formatTime(new Date())}`,
        };

        await saveGeneratePrompt(schedulePrompt, user.uid);

        // SAVE GENERATE TWEET
        const generateTweet: GenerateTweet = {
            id: uuidv4(),
            prompt: prompt,
            generated_content: generatedContent,
            twitter_id: selectedAccount,
            created_at: `${formatDate(new Date())} ${formatTime(new Date())}`,
        };

       await saveGenerateTweet(generateTweet, user.uid);
        
        // POST FIRST TWEET
       //  await postTweet(generateTweet, user.uid);
    };


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
        console.log(JSON.parse(loadPrompt || '{}')?.prompt);

        const tweets = await getTweets(user.uid, value);
        setTweets(tweets);
        console.log(tweets);
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
        {loading ? (
            <Loader />
        ) : (
           <>
            {user ? (
                <div className="container mx-auto p-10">
                    <div className="flex-1">
                        <div className="grid grid-cols-2 gap-12">
                            <div className="">
                                
                                <div className="pb-4">
                                    <h2 className="text-2xl font-bold">Generate and plane your tweets</h2>
                                </div>

                                <div className="">
                                    <div className="">
                                        <h3 className="text-lg pb-4 font-semibold">Select your twitter profile</h3>
                                        <Select
                                            value={selectedAccount} 
                                            onChange={(e) => handleSelectAccount(e.target.value)} 
                                            options={twitterAccounts}
                                            title="Select twitter profile"
                                        />
                                    </div>
                                </div>
                                
                                <div className="pt-8">
                                    <PromptSection 
                                        schedulePrompt={JSON.parse(schedulePrompt || '{}')} 
                                        value={prompt} 
                                        onChange={(e) => setPrompt(e.target.value)} 
                                        handleGenerate={handleGenerate}
                                        generatedContent={generatedContent}
                                        schedule={schedule}
                                        setSchedule={setSchedule}
                                    />
                                </div>
                              
                                    {/* <div className="">
                                            <select 
                                                value={schedule} 
                                                onChange={(e) => setSchedule(e.target.value)}
                                                className="custom-select mt-4 p-2"
                                            >
                                                <option value="">Select your schedule</option>
                                                <option value="1">every hour</option>
                                                <option value="2">every 2 hours</option>
                                            </select>
                                        </div> */}
                                    {/* <button
                                        className="bg-blue-500 text-white px-4 py-2 rounded-md mt-8"
                                        onClick={handleSchedule}
                                    >
                                        Post your twitter post
                                    </button>  */}
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
        )}
        </>
    )
}

export default Tweet;