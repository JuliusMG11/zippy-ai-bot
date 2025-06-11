import React from 'react';

import './tweetList.css';

import emptyList from '../../assets/icons/empty-list.svg';

const TweetList = ({tweets}) => {


    return (    
        <div>
            { tweets.length > 0 ? (
               <div>
                    <h3 className="text-2xl font-bold text-white pb-4">Post tweets</h3>
                    <div className="bg-[#27292B] rounded-2xl p-6 h-[80vh] overflow-y-auto overflow-x-hidden">
                        <ul className="flex flex-col">
                            {tweets.map(tweet => (
                                <li className="py-4 bg-[#18181A] rounded-2xl p-6 mb-4" key={tweet.id}>
                                    <p className="text-white">{tweet.generated_content}</p>
                                </li>
                            ))}
                        </ul>
                    </div>
               </div>
            ) : (
                <div className="flex flex-col items-center justify-center">
                    <div className="flex items-center justify-center">
                        <img className="w-16 h-16" src={emptyList} alt="empty-list" />
                    </div>
                    <h3 className="text-2xl font-bold text-white pb-4 text-center">No tweets found, please <br/>select account or generate a tweet</h3>
                </div>
            )}
        </div>
    )
};  

export default TweetList;      