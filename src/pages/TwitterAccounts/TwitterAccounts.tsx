import React, { useEffect, useState, useCallback } from 'react';

import './twitterAccounts.css'

import { onAuthStateChanged } from 'firebase/auth';
import { auth, firestore } from '../../firebase.ts';
import { collection, addDoc, onSnapshot } from 'firebase/firestore';

import { v4 as uuidv4 } from 'uuid'; 
import  notyf from '../../utyls/notyfConfig.ts'

import { TwitterInformation } from '../../types/types.ts';

// import Loader from '../../components/UI/Loader/Loader.tsx';
import Input from '../../components/UI/Input/Input.tsx';
import Button from '../../components/UI/Btn/Btn.tsx';

import EditIcon from '../../assets/icons/edit.svg'
import TrashIcon from '../../assets/icons/trash.svg'

import EditProfilePopup from '../../components/EditProfilePopup/EditProfilePopup.tsx';
import DeleteProfilePopup from '../../components/DeleteProfilePopup/DeleteProfilePopup.tsx';

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

    const [selectedAccount, setSelectedAccount] = useState<TwitterInformation | null>(null);
    const [isEditPopupOpen, setIsEditPopupOpen] = useState(false);
    const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);

    const loadTwitterAccounts = useCallback((userId: string) => {
        const accountsCollection = collection(db, `users/${userId}/twitter_accounts`);
        console.log(accountsCollection);
        const unsubscribeSnapshot = onSnapshot(accountsCollection, (snapshot) => {
            const accountsList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as TwitterInformation[];
            setTwitterAccounts(accountsList);
        });

        return () => unsubscribeSnapshot(); // Clean up listener
    }, [db]);

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

    const deleteProfilePopup = (account: TwitterInformation) => {
        setSelectedAccount(account);
        setIsDeletePopupOpen(true);
    };

    const handleCloseDeletePopup = () => {
        setIsDeletePopupOpen(false);
        setSelectedAccount(null);
    };

    const editProfilePopup = (account: TwitterInformation) => {
        setSelectedAccount(account);
        setIsEditPopupOpen(true);
    };

    const handleCloseEditPopup = () => {
        setIsEditPopupOpen(false);
        setSelectedAccount(null);
    };

    useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        setUser(user);
        setLoading(false);
      });
  
      return () => unsubscribe();
    }, []);

    useEffect(() => {
        if (user) {
            loadTwitterAccounts(user.uid);
        }
    }, [user, loadTwitterAccounts]);
    
    return (
           <>
                <div className="container mx-auto w-full pt-4 gap-12">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        <div>
                            <h2 className="text-2xl font-bold pb-4 text-white">Create Twitter Account</h2>
                                <div className="bg-[#27292B] rounded-2xl p-6 flex flex-col gap-4 shadow-[4px_4px_14px_2px_rgb(34,_34,_34,_0.6)] border-2 border-[#313131]">
                                    {loading ? (
                                        <p className="text-white">Loading...</p>
                                    ) : (
                                        <>
                                            <Input
                                                label="Account name"
                                                htmlFor="name"
                                                type="text"
                                                placeholder="Account name"
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                            />
                                            <Input
                                                label="Twitter App Key"
                                                htmlFor="appKey"
                                                type="text"
                                                placeholder="Twitter App Key"
                                                value={appKey}
                                                onChange={(e) => setAppKey(e.target.value)}
                                            />
                                            <Input
                                                label="Twitter App Secret"
                                                htmlFor="appSecret"
                                                type="text"
                                                placeholder="Twitter App Secret"
                                                value={appSecret}
                                                onChange={(e) => setAppSecret(e.target.value)}
                                            />
                                            <Input
                                                label="Twitter Access Token"
                                                htmlFor="accessToken"
                                                type="text"
                                                placeholder="Twitter Access Token"
                                                value={accessToken}
                                                onChange={(e) => setAccessToken(e.target.value)}
                                            />
                                            <Input
                                                label="Twitter Access Secret"
                                                htmlFor="accessSecret"
                                                type="text"
                                                placeholder="Twitter Access Secret"
                                                value={accessSecret}
                                                onChange={(e) => setAccessSecret(e.target.value)}
                                            />
                                            <Button
                                                icon={false}
                                                text={creating ? "Creating..." : "Create Account"}
                                                type="primary"
                                                onClick={handleCreateAccount}
                                                children={null}
                                            />
                                        </>
                                    )}
                                </div>
                            </div>
                        {user ? (
                            <div>
                                <h2 className="text-2xl font-bold pb-4 text-white">Twitter accounts</h2>
                                <div className="bg-[#27292B] rounded-2xl p-6 flex flex-col gap-4 ">
                                    {twitterAccounts.length === 0 ? (
                                        <p>No Twitter accounts found. Please create one.</p>
                                    ) : (
                                        <ul>
                                            {twitterAccounts.map(account => (
                                                <li key={account.id}>
                                                    <div className="flex items-center justify-between py-4 bg-[#18181A] rounded-2xl p-6 mb-4">
                                                        <p className="text-white"> {account.name}</p>
                                                        <div className="flex items-center gap-2">
                                                            <Button
                                                                type="icon secondary"
                                                                icon={true}
                                                                onClick={() => deleteProfilePopup(account)}
                                                                text=""
                                                                children={<img src={TrashIcon} alt="" />}
                                                            />
                                                             <Button
                                                                type="icon primary"
                                                                icon={true}
                                                                onClick={() => editProfilePopup(account)}
                                                                text=""
                                                                children={<img src={EditIcon} alt="" />}
                                                            />
                                                        </div>
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <h2>NENI</h2>
                        )}
                    </div>
                </div>
                {isDeletePopupOpen && selectedAccount && (
                    <DeleteProfilePopup
                        isOpen={isDeletePopupOpen}
                        onClose={handleCloseDeletePopup}
                        account={selectedAccount}
                        userId={user.uid}
                    />
                )}
                {isEditPopupOpen && selectedAccount && (
                    <EditProfilePopup
                        isOpen={isEditPopupOpen}
                        onClose={handleCloseEditPopup}
                        account={selectedAccount}
                        userId={user.uid}
                    />
                )}
        </>
    )
}

export default TwitterAccounts;