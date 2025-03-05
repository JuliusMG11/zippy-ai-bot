import React, { useState } from 'react';
import notyf from '../../utyls/notyfConfig.ts';
import { auth } from '../../firebase.ts';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import { User } from '../../types/types.ts';

const RegisterPopup = ({ onClose }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState(''); 
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleRegister = async () => {
        if (password !== confirmPassword) {
            notyf.error("Heslá sa nezhodujú.");
            return;
        }
    
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user: User = {
                id: userCredential.user.uid,
                name,
                email,
            };
    
            const db = getFirestore();
            await setDoc(doc(db, 'users', user.id), user);
    
            notyf.success("Account created successfully"); 
            onClose();
        } catch (error) {
            notyf.error("Error creating account: " + error.message);
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded shadow-md">
                <h1 className="text-xl font-bold">Register</h1>
                <input 
                    type="text" 
                    placeholder="Meno" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                    className="mt-4 p-2 border rounded w-full"
                />
                <input 
                    type="email"
                    placeholder="Email"
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    className="mt-4 p-2 border rounded w-full"
                />
                <input 
                    type="password" 
                    placeholder="Password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    className="mt-4 p-2 border rounded w-full"
                />
                <input 
                    type="password" 
                    placeholder="Repeat password"
                    value={confirmPassword} 
                    onChange={(e) => setConfirmPassword(e.target.value)} 
                    className="mt-4 p-2 border rounded w-full"
                />
                <button onClick={handleRegister} className="mt-4 bg-blue-500 text-white px-4 py-2 rounded">Register</button>
                <button onClick={onClose} className="mt-4 bg-green-500 text-white px-4 py-2 rounded">Close</button>
            </div>
        </div>
    )
}

export default RegisterPopup;