import React from 'react';
import { FaUsers, FaUtensilSpoon, FaMapMarkerAlt } from 'react-icons/fa';

const AdminDashboard = ({ user, setPage, styles }) => {
    // Enhanced styles with Calibri/Cambria fonts and specified colors
    const enhancedStyles = {
        ...styles,
        appContainer: {
            ...styles.appContainer,
            fontFamily: 'Calibri, Arial, sans-serif',
        },
        headerText: {
            ...styles.headerText,
            fontFamily: 'Cambria, serif',
            color: '#103c7f', // Dark Blue
            fontSize: '2.5rem',
            fontWeight: '700',
            marginBottom: '20px',
            textAlign: 'center',
        },
        dashboardCard: {
            backgroundColor: '#ffffff',
            borderRadius: '15px',
            padding: '30px',
            margin: '20px 0',
            boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
            border: '1px solid #ddd',
            textAlign: 'center',
            fontFamily: 'Calibri, Arial, sans-serif',
            transition: 'transform 0.2s, box-shadow 0.2s',
            cursor: 'pointer',
        },
        cardIcon: {
            fontSize: '3rem',
            color: '#103c7f', // Dark Blue
            marginBottom: '15px',
        },
        cardTitle: {
            fontSize: '1.5rem',
            fontWeight: '700',
            color: '#103c7f', // Dark Blue
            fontFamily: 'Cambria, serif',
            marginBottom: '10px',
        },
        cardDescription: {
            fontSize: '1rem',
            color: '#666',
            fontFamily: 'Calibri, Arial, sans-serif',
            lineHeight: '1.5',
        },
        secondaryButton: {
            ...styles.secondaryButton,
            fontFamily: 'Calibri, Arial, sans-serif',
            fontSize: '1rem',
            fontWeight: '600',
            marginTop: '30px',
        },
        screenPadding: {
            ...styles.screenPadding,
            fontFamily: 'Calibri, Arial, sans-serif',
        },
    };

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
        <div style={enhancedStyles.screenPadding}>
            <h2 style={enhancedStyles.headerText}>
                Admin Dashboard
            </h2>

            <div style={{ marginBottom: '30px', textAlign: 'center' }}>
                <p style={{
                    fontSize: '1.2rem',
                    color: '#666',
                    fontFamily: 'Calibri, Arial, sans-serif',
                    marginBottom: '20px'
                }}>
                    Welcome back, {user.name}! Manage your cafe system efficiently.
                </p>
            </div>

            {/* Admin Function Cards */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '20px',
                marginBottom: '40px'
            }}>
                {adminFunctions.map(func => (
                    <div
                        key={func.id}
                        style={{
                            ...enhancedStyles.dashboardCard,
                            ':hover': {
                                transform: 'translateY(-5px)',
                                boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
                            }
                        }}
                        onClick={() => setPage(func.page)}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-5px)';
                            e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.15)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.1)';
                        }}
                    >
                        <div style={{ ...enhancedStyles.cardIcon, color: func.color }}>
                            {func.icon}
                        </div>
                        <h3 style={enhancedStyles.cardTitle}>
                            {func.title}
                        </h3>
                        <p style={enhancedStyles.cardDescription}>
                            {func.description}
                        </p>
                    </div>
                ))}
            </div>

            <div style={{ textAlign: 'center', marginTop: '30px' }}>
                <p style={{
                    color: '#666',
                    fontFamily: 'Calibri, Arial, sans-serif',
                    fontSize: '0.9rem',
                    marginBottom: '15px'
                }}>
                    Admin Dashboard - Manage your cafe system efficiently
                </p>
            </div>
        </div>
    );
};

export default AdminDashboard;