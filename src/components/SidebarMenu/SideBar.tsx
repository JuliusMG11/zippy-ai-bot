import React from 'react';
import { Link, useLocation } from 'react-router-dom'; 

import Btn from '../UI/Btn/Btn.tsx'

import './sidebar.css';

const SideBar = () => {
    const location = useLocation();
    return (
        <div className="p-4">
            <div className="sidebar flex flex-col justify-between">
                <div className="">
                    <div className="font-xl font-bold sidebar-logo">
                        LOGO
                    </div>
                    <div className="flex flex-col gap-2">
                        <Link 
                            to="/dashboard" 
                            className={location.pathname === '/dashboard' ? 'active' : ''}
                        >
                            Dashboard
                        </Link>
                        <Link 
                            to="/dashboard/tweet" 
                            className={location.pathname === '/dashboard/tweet' ? 'active' : ''}
                        >
                            Tweet
                        </Link>
                        <Link 
                            to="/dashboard/twitter-accounts" 
                            className={location.pathname === '/dashboard/twitter-accounts' ? 'active' : ''}
                        >
                            Twitter Accounts
                        </Link>
                        <Link 
                            to="/dashboard/profile" 
                            className={location.pathname === '/dashboard/profile' ? 'active' : ''}
                        >
                            Profile
                        </Link>
                    </div>
                </div>
                
                <div className="">
                    <Btn 
                        text="Logout" 
                        type="outline"
                    />
                </div>
            </div>
        </div>
    )
};

export default SideBar;