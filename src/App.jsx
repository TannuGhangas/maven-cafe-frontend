// src/App.jsx - FINAL UPDATED + MERGED VERSION

import React, { useState, useEffect } from 'react';
import { FaSpinner } from 'react-icons/fa';
import { callApi } from './api/apiService';
import { styles } from './styles/styles';

// Imported Components
import NavBar from './components/common/NavBar';
import ProfileModal from './components/common/ProfileModal';
import LoginPage from './components/common/AuthPage';

// User Screens
import UserHomePage from './components/user/UserHomePage';
import ItemSelectionPage from './components/user/ItemSelectionPage';
import ItemConfigPage from './components/user/ItemConfigPage';
import OrderConfirmationPage from './components/user/OrderConfirmationPage';
import UserOrdersListPage from './components/user/UserOrdersListPage';

// Kitchen/Admin Screens
import KitchenDashboard from './components/kitchen/KitchenDashboard';
import AdminUsersPage from './components/admin/AdminUsersPage';

function App() {
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || null);
    const [page, setPage] = useState(user ? 'home' : 'login'); 
    const [modal, setModal] = useState(null); 
    
    // Order state
    const [currentOrder, setCurrentOrder] = useState({ 
        slot: 'morning (9:00-12:00)', 
        items: [] 
    });

    const isLoggedIn = !!user;

    // --- ROLE-BASED LOGIN REDIRECTION ---
    useEffect(() => {
        if (user) {
            if (user.role === 'kitchen' || user.role === 'admin') {
                setPage('kitchen-dashboard');
            } else {
                setPage('home');
            }
        } else {
            setPage('login');
        }
    }, [user]);

    // --- LOGIN HANDLER ---
    const handleLogin = async (username, password) => {
        const data = await callApi('/login', 'POST', { username, password });
        if (data && data.success) {
            const loggedInUser = data.user;
            localStorage.setItem('user', JSON.stringify(loggedInUser));
            setUser(loggedInUser);
        }
    };

    // --- LOGOUT HANDLER ---
    const handleLogout = () => {
        localStorage.removeItem('user');
        setUser(null);
        setPage('login');
        setModal(null);
        setCurrentOrder({ slot: 'morning (9:00-12:00)', items: [] });
    };

    // SHOW LOGIN PAGE
    if (!isLoggedIn) {
        return <LoginPage onLogin={handleLogin} styles={styles} />;
    }

    // ------------------------------
    // PAGE RENDERING LOGIC
    // ------------------------------
    const renderPage = () => {

        // USER PAGES
        if (page === 'home') {
            return (
                <UserHomePage 
                    setPage={setPage} 
                    currentOrder={currentOrder} 
                    setCurrentOrder={setCurrentOrder} 
                    styles={styles} 
                />
            );
        }

        if (page === 'item-selection') {
            return (
                <ItemSelectionPage 
                    setPage={setPage} 
                    currentOrder={currentOrder} 
                    styles={styles} 
                />
            );
        }

        // --- ITEM CONFIGURATION (Add/Edit) ---
        if (page.startsWith('item-config-')) {

            // Supports both:
            // item-config-coffee
            // item-config-edit-0-coffee
            const parts = page.split('-');

            let isEditMode = false;
            let itemIndex = -1;
            let itemType = null;

            if (parts.includes('edit')) {
                isEditMode = true;
                itemIndex = parseInt(parts[3]);
                itemType = parts[4];
            } else {
                itemType = parts[2];
            }

            return (
                <ItemConfigPage
                    itemType={itemType}
                    setPage={setPage}
                    currentOrder={currentOrder}
                    setCurrentOrder={setCurrentOrder}
                    isEditMode={isEditMode}
                    itemIndex={itemIndex}
                    styles={styles}
                />
            );
        }

        if (page === 'order-confirmation') {
            return (
                <OrderConfirmationPage
                    setPage={setPage}
                    currentOrder={currentOrder}
                    setCurrentOrder={setCurrentOrder}
                    user={user}
                    callApi={callApi}
                    styles={styles}
                />
            );
        }

        if (page === 'orders-list') {
            return (
                <UserOrdersListPage
                    setPage={setPage}
                    user={user}
                    callApi={callApi}
                    styles={styles}
                />
            );
        }

        // ------------------------------
        // KITCHEN + ADMIN PAGES
        // ------------------------------
        if (page === 'kitchen-dashboard') {
            return (
                <KitchenDashboard 
                    user={user} 
                    callApi={callApi} 
                    setPage={setPage} 
                    styles={styles} 
                />
            );
        }

        // ADMIN ONLY
        if (page === 'admin-users') {
            if (user.role === 'admin') {
                return (
                    <AdminUsersPage 
                        user={user} 
                        callApi={callApi} 
                        setPage={setPage} 
                        styles={styles} 
                    />
                );
            } else {
                return (
                    <div style={styles.loadingContainer}>
                        Access Denied. Only Admins can view this page.
                    </div>
                );
            }
        }

        return <div style={styles.screenPadding}>Page Not Found!</div>;
    };

    // ------------------------------
    // FINAL RETURN
    // ------------------------------
    return (
        <div style={styles.appContainer}>
            <NavBar user={user} setPage={setPage} setModal={setModal} styles={styles} />

            {/* Added content wrapper */}
            <div style={styles.contentArea}>
                {renderPage()}
            </div>

            {modal === 'profile' && (
                <ProfileModal
                    user={user}
                    onClose={() => setModal(null)}
                    handleLogout={handleLogout}
                    setUser={setUser}
                    setPage={setPage}
                    callApi={callApi}
                    styles={styles}
                />
            )}
        </div>
    );
}

export default App;
