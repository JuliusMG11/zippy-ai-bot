import React, { useEffect, useState } from 'react';

import { onAuthStateChanged } from 'firebase/auth';
import { auth, firestore } from '../../firebase.ts';
import { collection, addDoc, onSnapshot } from 'firebase/firestore';

import { v4 as uuidv4 } from 'uuid'; 
import  notyf from '../../utyls/notyfConfig.ts'

import { TwitterInformation } from '../../types/types.ts';

import Loader from '../../components/UI/Loader/Loader.tsx';

// TODO: EDIT TWITTER ACCOUNT

const TwitterAccounts = () => {

    const db = firestore;

    const [user, setUser] = useState(null); 

    const [loading, setLoading] = useState(true);
    const [creating, setCreating] = useState(false);

    const [name, setName] = useState('');
    const [twitterAccounts, setTwitterAccounts] = useState([]);
    const [appKey, setAppKey] = useState('');
    const [appSecret, setAppSecret] = useState('');
    const [accessToken, setAccessToken] = useState('');
    const [accessSecret, setAccessSecret] = useState('');

    const loadTwitterAccounts = (userId: string) => {
        const accountsCollection = collection(db, `users/${userId}/twitter_accounts`);
        const unsubscribeSnapshot = onSnapshot(accountsCollection, (snapshot) => {
            const accountsList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as TwitterInformation[];
            setTwitterAccounts(accountsList);
        });

        return () => unsubscribeSnapshot(); // Clean up listener
    };

    const handleCreateAccount = async () => {
        if (user) {
            setCreating(true);
            const accountsCollection = collection(db, `users/${user.uid}/twitter_accounts`);
            await addDoc(accountsCollection, {
                id: uuidv4(),
                name: name,
                app_key: appKey,
                app_secret: appSecret,
                access_token: accessToken,
                access_token_secret: accessSecret,
            } as TwitterInformation);
            loadTwitterAccounts(user.uid);
            notyf.success('Twitter account created successfully');
            setName('');
            setAppKey('');
            setAppSecret('');
            setAccessToken('');
            setAccessSecret('');
            setCreating(false);
        }
    };

    useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        setUser(user);
        setLoading(false);
      });
  
      return () => unsubscribe();
    }, []);
    
    return (
        <>
        {loading ? (
            <Loader />
        ) : (
           <>
            {user ? (
                <div className="container mx-auto flex flex-col w-full p-10 gap-12">
                    <div className="w-1/2">
                        <h2 className="text-2xl font-bold pb-4">TWITTER ACCOUNTS</h2>
                        {twitterAccounts.length === 0 ? (
                            <p>No Twitter accounts found. Please create one.</p>
                        ) : (
                            <ul>
                                {twitterAccounts.map(account => (
                                    <li key={account.id}>{account.name}</li>
                                ))}
                            </ul>
                        )}
                    </div>
                    <div className="w-1/2">
                        <h2 className="text-2xl font-bold pb-4">Create Twitter Account</h2>
                        <input 
                            className="w-full p-2 border border-gray-300 rounded-md mb-2"
                            type="text" 
                            placeholder="Account name" 
                            value={name} 
                            onChange={(e) => setName(e.target.value)} 
                        />  
                        <input 
                            className="w-full p-2 border border-gray-300 rounded-md mb-2"
                            type="text" 
                            placeholder="Twitter App Key" 
                            value={appKey} 
                            onChange={(e) => setAppKey(e.target.value)} 
                        />
                        <input 
                            className="w-full p-2 border border-gray-300 rounded-md mb-2"
                            type="text" 
                            placeholder="Twitter App Secret" 
                            value={appSecret} 
                            onChange={(e) => setAppSecret(e.target.value)} 
                        />
                        <input 
                            className="w-full p-2 border border-gray-300 rounded-md mb-2"
                            type="text" 
                            placeholder="Twitter Access Token" 
                            value={accessToken} 
                            onChange={(e) => setAccessToken(e.target.value)} 
                        />
                        <input 
                            className="w-full p-2 border border-gray-300 rounded-md mb-2"
                            type="text" 
                            placeholder="Twitter Access Secret" 
                            value={accessSecret} 
                            onChange={(e) => setAccessSecret(e.target.value)} 
                        />
                        <button 
                            onClick={handleCreateAccount} 
                            className="w-full p-2 bg-blue-500 text-white rounded-md"
                        >
                            Create Account
                        </button>
                    </div>
                    { creating &&  <Loader /> }
                </div>
            ) : (
                <h2>NENI</h2>
            )}
           </>
        )}
        </>
    )
}

export default TwitterAccounts;