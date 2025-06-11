import React, { useEffect, useState } from 'react';
import { updateDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { firestore } from '../../firebase.ts';
import { TwitterInformation } from '../../types/types.ts';
import Input from '../UI/Input/Input.tsx';
import Button from '../UI/Btn/Btn.tsx';
import notyf from '../../utyls/notyfConfig.ts';

import './editProfilePopup.css';

interface EditProfilePopupProps {
    isOpen: boolean;
    onClose: () => void;
    account: TwitterInformation;
    userId: string;
}

const EditProfilePopup: React.FC<EditProfilePopupProps> = ({ isOpen, onClose, account, userId }) => {
    const [name, setName] = useState('');
    const [appKey, setAppKey] = useState('');
    const [appSecret, setAppSecret] = useState('');
    const [accessToken, setAccessToken] = useState('');
    const [accessSecret, setAccessSecret] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (account) {
            setName(account.name);
            setAppKey(account.app_key);
            setAppSecret(account.app_secret);
            setAccessToken(account.access_token);
            setAccessSecret(account.access_token_secret);
        }
    }, [account]);

    const handleSave = async () => {
        try {
            setLoading(true);
            const accountsCollection = collection(firestore, `users/${userId}/twitter_accounts`);
            const q = query(accountsCollection, where('id', '==', account.id));
            const querySnapshot = await getDocs(q);
            
            if (!querySnapshot.empty) {
                const docRef = querySnapshot.docs[0].ref;
                await updateDoc(docRef, {
                    name,
                    app_key: appKey,
                    app_secret: appSecret,
                    access_token: accessToken,
                    access_token_secret: accessSecret,
                });
                notyf.success('Twitter account updated successfully');
                onClose();
            } else {
                throw new Error('Account not found');
            }
        } catch (error) {
            console.error('Error updating account:', error);
            notyf.error('Failed to update Twitter account');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="edit-profile-popup-overlay">
            <div className="edit-profile-popup">
                <h2 className="text-2xl font-bold mb-4 text-white">Edit Twitter Account</h2>
                <div className="flex flex-col gap-4">
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
                    <div className="flex justify-end gap-4 mt-4">
                        <Button
                            type="secondary"
                            text="Cancel"
                            onClick={onClose}
                            icon={false}
                            children={null}
                        />
                        <Button
                            type="primary"
                            text={loading ? "Saving..." : "Save"}
                            onClick={handleSave}
                            icon={false}
                            children={null}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditProfilePopup;
