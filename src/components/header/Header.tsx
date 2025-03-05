import React, { useState, useEffect } from 'react';
import { auth } from '../../firebase.ts';
import { onAuthStateChanged, signOut } from 'firebase/auth';

import LoginPopup from '../LoginPopup/LoginPopup.tsx';
import RegisterPopup from '../RegisterPopup/RegisterPopup.tsx';

const Header = () => {
    const [isLoginPopupOpen, setLoginPopupOpen] = useState(false);
    const [isRegisterPopupOpen, setRegisterPopupOpen] = useState(false);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user);
        });
        return () => unsubscribe();
    }, []);

    const toggleLoginPopup = (isOpen: boolean) => {
        setLoginPopupOpen(isOpen);
    };

    const toggleRegisterPopup = (isOpen: boolean) => {
        setRegisterPopupOpen(isOpen);
    };

    const handleLogout = async () => {
        try {
            await signOut(auth); // Sign out user
        } catch (error) {
            console.error("Error signing out: ", error);
        }
    };

    return (
        <>
            <header className="pt-2">
                <div className="container mx-auto flex justify-between items-center">
                    <h1>LOGO</h1>
                    <div className="flex gap-2 items-center">
                        {user ? (
                            <button 
                                onClick={handleLogout}
                                className="bg-red-500 text-white px-4 py-2 rounded">
                                Logout
                            </button>
                        ) : (
                            <>
                                <button 
                                    onClick={() => toggleLoginPopup(true)}
                                    className="bg-blue-500 text-white px-4 py-2 rounded">
                                    Login
                                </button>
                                <button 
                                    onClick={() => toggleRegisterPopup(true)}
                                    className="bg-green-500 text-white px-4 py-2 rounded">
                                    Register
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </header>
            {isLoginPopupOpen && <LoginPopup onClose={() => toggleLoginPopup(false)} />}
            {isRegisterPopupOpen && <RegisterPopup onClose={() => toggleRegisterPopup(false)} />}
        </>
    )
}   

export default Header;