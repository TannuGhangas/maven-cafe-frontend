import React, { useState, useEffect } from 'react';
import { FaUsers, FaClipboardList, FaUser, FaExclamationTriangle, FaBars, FaHome } from 'react-icons/fa';
import '../../styles/AdminDashboard.css';

const AdminLayout = ({ user, setPage, children, activeSection, setActiveSection, callApi }) => {
    const [sidebarOpen, setSidebarOpen] = useState(() => {
        // Load sidebar state from localStorage or default to true (always visible)
        return localStorage.getItem('adminSidebarOpen') !== 'false';
    });

    // Save sidebar state to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem('adminSidebarOpen', sidebarOpen.toString());
    }, [sidebarOpen]);

    const sidebarItems = [
        {
            id: 'dashboard',
            title: 'Dashboard',
            icon: <FaHome />,
            action: 'navigate',
            page: 'admin-dashboard'
        },
        {
            id: 'orders',
            title: 'Order Management',
            icon: <FaClipboardList />,
            action: 'navigate',
            page: 'admin-dashboard' // Orders are part of dashboard
        },
        {
            id: 'members',
            title: 'Member Management',
            icon: <FaUser />,
            action: 'navigate',
            page: 'admin-members'
        },
        {
            id: 'complaints',
            title: 'Complaint Management',
            icon: <FaExclamationTriangle />,
            action: 'navigate',
            page: 'admin-complaints'
        },
    ];

    // Always show sidebar but only toggle on button click
    const sidebarClass = `sidebar ${sidebarOpen ? 'open' : 'closed'}`;

    // Enhanced navigation handler with debugging
    const handleNavigation = (item) => {
        console.log('Navigating to:', item.page, 'for item:', item.id);
        setActiveSection(item.id);
        if (item.action === 'navigate') {
            setPage(item.page);
        }
    };

    return (
        <div className="admin-layout">
            {/* Persistent Sidebar - Only show for admin users */}
            {user.role === 'admin' && (
                <div className={sidebarClass}>
                    <div className="sidebar-header">
                        <h3>Admin Panel</h3>
                        <button
                            className="sidebar-toggle"
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            title={sidebarOpen ? "Collapse Sidebar" : "Expand Sidebar"}
                        >
                            <FaBars />
                        </button>
                    </div>
                    <nav className="sidebar-nav">
                        {sidebarItems.map(item => (
                            <div
                                key={item.id}
                                className={`sidebar-item ${activeSection === item.id ? 'active' : ''}`}
                                data-title={item.title}
                                onClick={() => handleNavigation(item)}
                                style={{ cursor: 'pointer' }}
                            >
                                {item.icon}
                                <span className="sidebar-text">{item.title}</span>
                            </div>
                        ))}
                    </nav>
                </div>
            )}

            {/* Main Content Area */}
            <div className="main-area">
                {children}
            </div>
        </div>
    );
};

export default AdminLayout;