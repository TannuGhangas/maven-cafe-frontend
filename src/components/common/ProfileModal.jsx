// src/components/common/ProfileModal.jsx

import React, { useState, useEffect } from 'react';
import { FaSignOutAlt, FaListAlt, FaUsers, FaTimes, FaUserCircle, FaEdit, FaCamera, FaTrash } from 'react-icons/fa';

const ProfileModal = ({ user, onClose, handleLogout, setPage, styles }) => {
    const [profilePic, setProfilePic] = useState(localStorage.getItem(`profilePic_${user.id}`) || null);
    const [showImageOptions, setShowImageOptions] = useState(false);

    // --- LOCAL STYLES to achieve the Side Drawer look for mobile ---
    const ACCENT_COLOR = styles.PRIMARY_COLOR || '#FF7A3D';
    const SECONDARY_COLOR = styles.SECONDARY_COLOR || '#333333';
    
    const localStyles = {
        // --- Side Drawer Content (The main sliding panel) ---
        sideDrawerContent: {
            // Overrides styles.modalContent to force side drawer appearance
            width: '85%',
            maxWidth: '350px',
            height: '100%',
            padding: '20px', // Adjusted padding inside the drawer
            backgroundColor: '#ffffff', // Clean white background
            borderRadius: '0', 
            boxShadow: '-5px 0 20px rgba(0, 0, 0, 0.2)',
            position: 'absolute', 
            top: 0,
            right: 0,
            overflowY: 'auto',
            transition: 'transform 0.3s ease-out',
        },
        // --- Profile Header ---
        profileHeader: {
            textAlign: 'center',
            marginBottom: '20px',
            paddingBottom: '15px',
            borderBottom: '1px solid #eee',
        },
        profileName: {
            fontSize: '1.5rem',
            fontWeight: '700',
            color: SECONDARY_COLOR,
            margin: '10px 0 5px 0',
        },
        // --- Detail Rows (Cleaner, side-by-side display for mobile) ---
        cleanDetailRow: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '12px 0',
            borderBottom: '1px solid #f0f0f0',
            fontSize: '1em',
            color: SECONDARY_COLOR,
        },
        // Overriding the default input field for a better fit in the detail row
        detailInputField: {
            ...styles.inputField,
            margin: '0',
            padding: '8px',
            fontSize: '1em',
            textAlign: 'right',
            width: '60%',
        },
        // --- Action Buttons ---
        actionButton: (isPrimary = true) => ({
            ...styles.primaryButton, // Inherit base style
            width: '100%',
            marginTop: '15px',
            backgroundColor: isPrimary ? ACCENT_COLOR : SECONDARY_COLOR,
            boxShadow: isPrimary ? `0 4px 8px rgba(255, 122, 61, 0.3)` : 'none',
        }),
        logoutButton: {
            ...styles.logoutButton,
            width: '100%',
            marginTop: '15px',
        },
        // --- Close Button ---
        closeButtonIcon: {
            position: 'absolute',
            top: '15px',
            right: '15px',
            background: 'none',
            border: 'none',
            color: SECONDARY_COLOR,
            fontSize: '1.5em',
            cursor: 'pointer',
        }
    };
    // ---------------------------------------------------------------------

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfilePic(reader.result);
                localStorage.setItem(`profilePic_${user.id}`, reader.result);
                setShowImageOptions(false);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleDeleteImage = () => {
        setProfilePic(null);
        localStorage.removeItem(`profilePic_${user.id}`);
        setShowImageOptions(false);
    };

    const navigateToPage = (pageName) => {
        setPage(pageName);
        onClose();
    };

    return (
        <div style={styles.modalOverlay}>
            
            {/* THIS IS THE SIDE DRAWER CONTENT (overriding styles.modalContent) */}
            <div style={localStyles.sideDrawerContent}>
                
                {/* Close Button using FaTimes */}
                <button style={localStyles.closeButtonIcon} onClick={onClose}>
                    <FaTimes />
                </button>
                
                {/* Profile Header Section */}
                <div style={localStyles.profileHeader}>
                    <div style={{ position: 'relative', display: 'inline-block' }}>
                        <div style={styles.profilePicContainer}>
                            <div style={styles.profileFrame(profilePic)}>
                                {!profilePic && <FaUserCircle size={60} style={{ color: '#ccc' }} />}
                            </div>
                        </div>
                        <button
                            onClick={() => setShowImageOptions(!showImageOptions)}
                            style={{
                                position: 'absolute',
                                bottom: '5px',
                                right: '5px',
                                backgroundColor: ACCENT_COLOR,
                                color: 'white',
                                border: 'none',
                                borderRadius: '50%',
                                width: '30px',
                                height: '30px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                fontSize: '0.8rem'
                            }}
                            title="Edit Image"
                        >
                            <FaEdit />
                        </button>

                        {showImageOptions && (
                            <div style={{
                                position: 'absolute',
                                top: '100%',
                                right: '0',
                                backgroundColor: 'white',
                                border: '1px solid #ddd',
                                borderRadius: '8px',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                                zIndex: 1000,
                                minWidth: '150px',
                                marginTop: '5px'
                            }}>
                                <div style={{ padding: '10px', borderBottom: '1px solid #eee' }}>
                                    <strong style={{ fontSize: '0.9rem', color: SECONDARY_COLOR }}>Edit Profile Image</strong>
                                </div>
                                <button
                                    onClick={() => document.getElementById('profile-image-upload').click()}
                                    style={{
                                        width: '100%',
                                        padding: '10px 15px',
                                        border: 'none',
                                        backgroundColor: 'transparent',
                                        textAlign: 'left',
                                        cursor: 'pointer',
                                        fontSize: '0.9rem',
                                        color: SECONDARY_COLOR,
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px'
                                    }}
                                >
                                    <FaCamera /> Change Image
                                </button>
                                {profilePic && (
                                    <button
                                        onClick={handleDeleteImage}
                                        style={{
                                            width: '100%',
                                            padding: '10px 15px',
                                            border: 'none',
                                            backgroundColor: 'transparent',
                                            textAlign: 'left',
                                            cursor: 'pointer',
                                            fontSize: '0.9rem',
                                            color: '#e74c3c',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '8px'
                                        }}
                                    >
                                        <FaTrash /> Delete Image
                                    </button>
                                )}
                            </div>
                        )}
                    </div>

                    <input
                        type="file"
                        id="profile-image-upload"
                        accept="image/*"
                        onChange={handleImageUpload}
                        style={{ display: 'none' }}
                    />

                    <h2 style={localStyles.profileName}>{user.name}'s Profile</h2>
                </div>
                
                {/* Detail Rows - Using local clean style */}
                
                {/* Name */}
                <div style={localStyles.cleanDetailRow}>
                    <label>Name:</label>
                    <span style={styles.detailValue}>{user.name}</span>
                </div>

                {/* Username */}
                <div style={localStyles.cleanDetailRow}>
                    <label>Username:</label>
                    <span style={styles.detailValue}>{user.username}</span>
                </div>

                {/* Role */}
                <div style={localStyles.cleanDetailRow}>
                    <label>Role:</label>
                    <span style={styles.detailValue}>{user.role.toUpperCase()}</span>
                </div>
                
                {/* Action Buttons */}
                <div style={{ marginTop: '30px', padding: '0 5px' }}>
                    {user.role === 'user' && (
                        <button style={localStyles.actionButton(false)} onClick={() => navigateToPage('orders-list')}>
                            <FaListAlt /> View My Orders
                        </button>
                    )}

                    {user.role === 'admin' && (
                        <button style={localStyles.actionButton(false)} onClick={() => navigateToPage('admin-users')}>
                            <FaUsers /> Admin Users
                        </button>
                    )}

                    <button style={localStyles.logoutButton} onClick={handleLogout}>
                        <FaSignOutAlt /> Logout
                    </button>
                </div>

            </div>
        </div>
    );
};

export default ProfileModal;