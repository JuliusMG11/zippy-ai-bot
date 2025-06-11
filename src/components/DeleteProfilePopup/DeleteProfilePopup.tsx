import React from 'react';
import { TwitterInformation } from '../../types/types.ts';
import Button from '../UI/Btn/Btn.tsx';
import { collection, deleteDoc, getDocs, query, where } from 'firebase/firestore';
import { firestore } from '../../firebase.ts';
import notyf from '../../utyls/notyfConfig.ts';

interface DeleteProfilePopupProps {
    isOpen: boolean;
    onClose: () => void;
    account: TwitterInformation;
    userId: string;
}

const DeleteProfilePopup: React.FC<DeleteProfilePopupProps> = ({ isOpen, onClose, account, userId }) => {
    if (!isOpen) return null;

    const handleDelete = async () => {
        try {
            const accountsCollection = collection(firestore, `users/${userId}/twitter_accounts`);
            const q = query(accountsCollection, where('id', '==', account.id));
            const querySnapshot = await getDocs(q);
            await deleteDoc(querySnapshot.docs[0].ref);
            notyf.success('Twitter account deleted successfully');
            onClose();
        } catch (error) {
            console.error('Error deleting account:', error);
            notyf.error('Failed to delete Twitter account');
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-[#27292B] rounded-2xl p-6 w-full max-w-md">
                <h2 className="text-2xl font-bold text-white mb-4">Delete Twitter Account</h2>
                <p className="text-white mb-6">Are you sure you want to delete the Twitter account "{account.name}"? This action cannot be undone.</p>
                <div className="flex justify-end gap-4">
                    <Button
                        type="secondary"
                        text="Cancel"
                        onClick={onClose}
                        icon={false}
                        children={null}
                    />
                    <Button
                        type="primary"
                        text="Delete"
                        onClick={handleDelete}
                        icon={false}
                        children={null}
                    />
                </div>
            </div>
        </div>
    );
};

export default DeleteProfilePopup;
