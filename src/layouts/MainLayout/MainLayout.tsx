import React from 'react';
import { Outlet } from 'react-router-dom';
import SideBar from '../../components/SidebarMenu/SideBar.tsx';

const MainLayout = () => {
    return (
        <div className="flex flex-row gap-12">
            <SideBar />
            <div className="flex-1">
                <Outlet />
            </div>
        </div>
    );
};

export default MainLayout;      