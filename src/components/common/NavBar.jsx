// src/components/common/NavBar.jsx - FINALIZED UPDATE

import React from 'react';
import {
    FaUserCircle,
    FaCoffee,
    FaListAlt,
    FaExclamationTriangle, // Used for User Feedback button and Admin Complaints button
    FaRegSadTear, // NEW: Adding a specific icon for admin complaints
    FaClipboardList // For user orders list
} from 'react-icons/fa';
import MavenLogo from '../../assets/maven_logoo.png';

const NavBar = ({ user, setPage, setModal, styles }) => {
    const isKitchenOrAdmin = user.role === 'kitchen' || user.role === 'admin';

    // 🚀 Choose styles based on role
    const navBarContainerStyle = isKitchenOrAdmin 
        ? styles.kitchenNavBar 
        : styles.navBar;
        
    const logoStyle = isKitchenOrAdmin 
        ? styles.kitchenLogoStyle 
        : styles.mobileLogoStyle; 

    const navIconsContainerStyle = isKitchenOrAdmin 
        ? styles.kitchenNavIcons 
        : styles.mobileNavIcons;
        
    const navButtonStyle = isKitchenOrAdmin 
        ? styles.kitchenNavButton 
        : styles.mobileNavButton;

    // 🔥 NEW: Style to ensure logo doesn't cause overflow
    const logoWrapperStyle = {
        flexShrink: 0, 
    };

    // Determine the color for the critical complaints button (using Secondary color for warning)
    const complaintColor = styles.SECONDARY_COLOR || '#103c7f'; 

    return (
        <div style={navBarContainerStyle}>
            {/* Logo */}
            <div style={{logoWrapperStyle, marginLeft: '30px'}}>
                <img src={MavenLogo} alt="Maven Cafe" style={logoStyle} />
            </div>

            {/* Right Icons */}
            <div style={{...navIconsContainerStyle, flexShrink: 0, marginRight: '30px'}}>
                
                {/* 1. Home / Dashboard Button (Primary Action) */}
                {user.role === 'user' && (
                    <button style={navButtonStyle} onClick={() => setPage('home')}>
                        <FaCoffee size={isKitchenOrAdmin ? 28 : 22} />
                    </button>
                )}

                {/* Kitchen: Orders Dashboard */}
                {user.role === 'kitchen' && (
                    <button style={navButtonStyle} onClick={() => setPage('kitchen-dashboard')}>
                        <FaListAlt size={isKitchenOrAdmin ? 28 : 22} title="View Orders Dashboard" />
                    </button>
                )}

                {/* Admin: Admin Dashboard */}
                {user.role === 'admin' && (
                    <button style={navButtonStyle} onClick={() => setPage('admin-dashboard')}>
                        <FaListAlt size={isKitchenOrAdmin ? 28 : 22} title="Admin Dashboard" />
                    </button>
                )}

                {/* 2. Orders List Button (User Access) */}
                {user.role === 'user' && (
                    <button style={navButtonStyle} onClick={() => setPage('orders-list')}>
                        <FaClipboardList size={isKitchenOrAdmin ? 28 : 22} title="View My Orders" />
                    </button>
                )}

                {/* 3. Complaints/Feedback Button (User Access) */}
                {user.role === 'user' && (
                    <button style={navButtonStyle} onClick={() => setPage('complaint')}>
                        <FaExclamationTriangle size={isKitchenOrAdmin ? 28 : 22} color={complaintColor} title="Submit Feedback/Complaint" />
                    </button>
                )}

                {/* 3. Complaints Dashboard Button (Admin/Kitchen Access) */}
                {isKitchenOrAdmin && (
                    <button style={navButtonStyle} onClick={() => setPage('admin-complaints')}>
                        {/* Using FaRegSadTear or similar for 'issues' */}
                        <FaRegSadTear size={isKitchenOrAdmin ? 28 : 22} color={complaintColor} title="View Complaints/Feedback" />
                    </button>
                )}

                {/* 4. Profile Button */}
                <button style={navButtonStyle} onClick={() => setModal('profile')}>
                    <FaUserCircle size={isKitchenOrAdmin ? 28 : 22} />
                </button>
            </div>
        </div>
    );
};

export default NavBar;