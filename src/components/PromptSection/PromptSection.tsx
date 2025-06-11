import React, { useState, useEffect } from 'react';

import './promptSection.css';

import Button from '../UI/Btn/Btn.tsx';

const PromptSection = (
    {
        schedulePrompt, 
        value, 
        onChange, 
        handleGenerate,
        generatedContent,
        schedule,
        setSchedule,
        tweetNow,
        updatePrompt
    }) => {

    const [editableContent, setEditableContent] = useState('');
    const hasExistingPrompt = schedulePrompt?.id;
    

    //  const scheduleOptions = [
    //     { id: 1, name: 'every hour' },
    //     { id: 2, name: 'every 2 hours' },
    // ];

    // const handleSchedule = () => {
    //     console.log(schedule);
    // }

    // const handleTweetNow = () => {
    //     tweetNow(editableContent);
    // }

    useEffect(() => {
        const cleanContent = generatedContent.replace(/^["']|["']$/g, '');
        setEditableContent(cleanContent);
    }, [generatedContent]);

    const handleSavePrompt = () => {
        updatePrompt(value);
    };

    return (    
        <>
            <div className="pt-4 pb-12">
                <h3 className="text-white text-lg pb-4">Write prompt for your tweet</h3>
                <textarea 
                    value={value} 
                    onChange={onChange} 
                    placeholder="Write the prompt..."
                    rows={3}
                    className="w-full h-30 p-4 bg-[#18181A] rounded-lg mb-4 text-white"
                />
                <Button
                    text="Generate tweet"
                    type="secondary"
                    onClick={handleGenerate}
                    children={false}
                />
            </div>
                {generatedContent ? (
                    <div className="mt-4">
                        <h3 className="text-white text-lg pb-4">Edit or post your final tweet</h3>
                        <textarea 
                            value={editableContent} 
                            onChange={(e) => setEditableContent(e.target.value)} 
                            placeholder="Edit generated content"
                            rows={4}
                            className="w-full h-30 p-2 bg-[#18181A] rounded-md text-white mb-4"
                        />
                        <Button
                            text={hasExistingPrompt ? "Save prompt" : "Post now"}
                            type="primary"
                            onClick={hasExistingPrompt ? handleSavePrompt : () => tweetNow(editableContent)}
                            children={false}
                        />
                    </div>
                ) : null}
        </>
    )
};  

export default PromptSection;      