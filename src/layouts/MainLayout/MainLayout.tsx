import React from 'react';
import { Outlet } from 'react-router-dom';
import SideBar from '../../components/SidebarMenu/SideBar.tsx';

const MainLayout = () => {
    return (
        <div className="flex flex-row bg-[#18181A] gap-6 h-screen">
            <SideBar />
            <div className="flex-1 pt-4 pr-10">
                <Outlet />
            </div>
        </div>
    );
};

export default MainLayout;      