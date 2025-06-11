import React from 'react';

import './promptSection.css';
import Select from '../UI/Select/Select.tsx';

const PromptSection = (
    {
        schedulePrompt, 
        value, 
        onChange, 
        handleGenerate,
        generatedContent,
        schedule,
        setSchedule,
        tweetNow
    }) => {

    const scheduleOptions = [
        { id: 1, name: 'every hour' },
        { id: 2, name: 'every 2 hours' },
    ];

    const handleSchedule = () => {
        console.log(schedule);
    }

    return (    
        <>
          { schedulePrompt?.prompt ? (
            <div className="">
                <h3>Your prompt on this profile is set</h3>
                <p className="py-2 font-bold text-lg">{schedulePrompt.prompt}</p>
                <p className="py-2 font-bold text-lg">{schedulePrompt.schedule.interval}h</p>
                <div className="flex">
                    <button className="bg-blue-500 text-white px-4 py-2 rounded-md mt-4">Edit prompt</button>
                    <button className="bg-red-500 text-white px-4 py-2 rounded-md mt-4">Delete prompt</button>
                </div>
                <div className="pt-6">
                    <button className="bg-blue-500 text-white px-4 py-2 rounded-md mt-4">Save prompt</button>
                </div>
            </div>
          ) : (
            <div className="">
                <h3>No prompt found and generate your first tweet</h3>
                <textarea 
                    value={value} 
                    onChange={onChange} 
                    placeholder="Write the prompt"
                    className="w-full h-30 p-2 border border-gray-300 rounded-md"
                />
                {generatedContent && <div>{generatedContent}</div>}
                <div className="pt-4">
                        {/* <select 
                            value={schedule} 
                            onChange={(e) => setSchedule(e.target.value)}
                            className="custom-select mt-4 p-2"
                        >
                            <option value="">Select your schedule</option>
                            <option value="1">every hour</option>
                            <option value="2">every 2 hours</option>
                        </select> */}
                        <Select
                            value={schedule} 
                            onChange={(e) => setSchedule(e.target.value)} 
                            options={scheduleOptions}
                            title="Set schedule"
                        />
                    </div>
                <div className="flex gap-2">
                    <button
                        className="bg-blue-500 text-white px-4 py-2 rounded-md mt-4"
                        onClick={handleGenerate}
                    >
                        Generate tweet
                    </button> 
                </div>
                <div className="pt-8">
                    <h3>Post now or schedule post</h3>
                    <div className="flex gap-4">
                        <button 
                            className="bg-blue-500 text-white px-4 py-2 rounded-md mt-4"
                            onClick={() => {tweetNow()}}
                        >
                            Post now
                        </button>
                        <button 
                            className={`bg-white outline outline-blue-500 text-blue-500 px-4 py-2 rounded-md mt-4 ${schedule <= 0 ? 'opacity-50 cursor-not-allowed' : ''}`} 
                            onClick={schedule > 0 ? () => {handleSchedule()} : undefined}
                            disabled={schedule <= 0}
                        >
                            Schedule post
                        </button>
                    </div>
                </div>
            </div>
          )}  
        </>
    )
};  

export default PromptSection;      