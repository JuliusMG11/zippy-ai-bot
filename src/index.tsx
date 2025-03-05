import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import './index.css';

import reportWebVitals from './reportWebVitals.ts';

import HomePage from './pages/Home/Home.tsx';
import DashboardPage from './pages/Dashboard/Dashboard.tsx';
import ProfilePage from './pages/Profile/Profile.tsx';
import MainLayout from './layouts/MainLayout/MainLayout.tsx';
import TwitterAccounts from './pages/TwitterAccounts/TwitterAccounts.tsx';
import Tweet from './pages/Tweet/Tweet.tsx';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

const App = () => {
 

  return (
    <Routes>
       <Route path="/" element={<HomePage />} />
       <Route path="/dashboard" element={<MainLayout />}>
            <Route index element={<DashboardPage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="twitter-accounts" element={<TwitterAccounts />} />
            <Route path="tweet" element={<Tweet />} />
        </Route>  
    </Routes>
  );
};

root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);

// ... existing code ...
reportWebVitals();