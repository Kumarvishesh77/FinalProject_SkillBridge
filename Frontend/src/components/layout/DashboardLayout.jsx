import React from 'react';
import { Outlet } from 'react-router';
import Header from './Header';
import Footer from './Footer';
import Sidebar from './Sidebar';
import './DashboardLayout.scss';

const DashboardLayout = () => {
    return (
        <div className="dashboard-layout">
            <Header />
            <div className="dashboard-container">
                <Sidebar />
                <main className="dashboard-main">
                    <Outlet />
                </main>
            </div>
            <Footer />
        </div>
    );
};

export default DashboardLayout;
