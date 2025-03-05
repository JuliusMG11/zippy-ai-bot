import React, { useEffect, useState } from 'react';

import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../firebase.ts';

import Loader from '../../components/UI/Loader/Loader.tsx';

const Dashboard = () => {

    const [user, setUser] = useState(null); 
    const [loading, setLoading] = useState(true);

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
                <div className="container mx-auto">
                    <div className="flex-1">
                        <div className="">
                        <h1>DASHBOARD</h1>
                        </div>
                    </div>
                </div>
            ) : (
                <h2>NENI</h2>
            )}
           </>
        )}
        </>
    )
}

export default Dashboard;