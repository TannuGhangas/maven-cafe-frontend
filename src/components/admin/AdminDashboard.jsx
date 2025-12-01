import React from 'react';
import { FaUsers, FaUtensilSpoon, FaMapMarkerAlt } from 'react-icons/fa';
import '../../styles/AdminDashboard.css';

const AdminDashboard = ({ user, setPage, styles }) => {
    const adminFunctions = [
        {
            id: 'members',
            title: 'Member Management',
            description: 'Add, edit, and delete user accounts. Manage roles and access permissions.',
            icon: <FaUsers />,
            page: 'admin-members',
            color: '#103c7f'
        },
        {
            id: 'menu',
            title: 'Menu Management',
            description: 'View and manage menu items, categories, and pricing information.',
            icon: <FaUtensilSpoon />,
            page: 'admin-menu',
            color: '#a1db40'
        },
        {
            id: 'locations',
            title: 'Location Management',
            description: 'Configure delivery locations and access permissions for different areas.',
            icon: <FaMapMarkerAlt />,
            page: 'admin-locations',
            color: '#103c7f'
        },
    ];

    return (
        <div className="admin-dashboard-container">
            <h2 className="admin-dashboard-header">
                Admin Dashboard
            </h2>

            <div className="admin-dashboard-welcome">
                <p className="admin-dashboard-welcome-text">
                    Welcome back, {user.name}! Manage your cafe system efficiently.
                </p>
            </div>

            {/* Admin Function Cards */}
            <div className="admin-dashboard-grid">
                {adminFunctions.map(func => (
                    <div
                        key={func.id}
                        className="admin-dashboard-card"
                        onClick={() => setPage(func.page)}
                    >
                        <div className="admin-dashboard-card-icon" style={{ color: func.color }}>
                            {func.icon}
                        </div>
                        <h3 className="admin-dashboard-card-title">
                            {func.title}
                        </h3>
                        <p className="admin-dashboard-card-description">
                            {func.description}
                        </p>
                    </div>
                ))}
            </div>

            <div className="admin-dashboard-footer">
                <p className="admin-dashboard-footer-text">
                    Admin Dashboard - Manage your cafe system efficiently
                </p>
            </div>
        </div>
    );
};

export default AdminDashboard;