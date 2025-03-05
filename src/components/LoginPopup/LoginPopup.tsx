import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 

import { auth } from '../../firebase.ts';
import { signInWithEmailAndPassword } from 'firebase/auth';

import notyf from '../../utyls/notyfConfig.ts';


const LoginPopup = ({ onClose }) => {
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const handleLogin = async () => {
        try {
            await signInWithEmailAndPassword(auth, name, password);
            notyf.success("Logged in successfully");
            onClose();
            navigate('/dashboard');
        } catch (error) {
            notyf.error("Error logging in: " + error.message);
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded shadow-md">
                <h1 className="text-xl font-bold">Login</h1>
                <input 
                    type="text" 
                    placeholder="Meno" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                    className="mt-4 p-2 border rounded w-full"
                />
                <input 
                    type="password" 
                    placeholder="Heslo" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    className="mt-4 p-2 border rounded w-full"
                />
                <button onClick={handleLogin} className="mt-4 bg-blue-500 text-white px-4 py-2 rounded">Login</button>
                <button onClick={onClose} className="mt-4 bg-green-500 text-white px-4 py-2 rounded">Close</button>
            </div>
        </div>
    )
}

export default LoginPopup;