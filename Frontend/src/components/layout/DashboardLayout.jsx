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
                <div className="dashboard-main-wrapper">
                    <main className="dashboard-main">
                        <Outlet />
                    </main>
                    <Footer />
                </div>
            </div>
        </div>
    );
};

export default DashboardLayout;
