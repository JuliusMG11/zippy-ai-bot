import React, { useState, useEffect } from 'react';

import './tweetList.css';


const TweetList = ({tweets}) => {


    return (    
        <div>
            <h3>Tweets</h3>
            <ul className="flex flex-col divide-y divide-gray-300">
                {tweets.map(tweet => (
                    <li className="py-4" key={tweet.id}>
                        <p className="text-black font-bold">{tweet.generated_content}</p>
                    </li>
                ))}
            </ul>
        </div>
    )
};  

export default TweetList;      