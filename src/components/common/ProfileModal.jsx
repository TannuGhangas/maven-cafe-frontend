// src/components/common/ProfileModal.jsx

import React, { useState, useEffect } from 'react';
// Added FaTimes for the modern close icon
import { FaUserCircle, FaSignOutAlt, FaEdit, FaListAlt, FaUsers, FaTimes } from 'react-icons/fa'; 

const ProfileModal = ({ user, onClose, handleLogout, setUser, setPage, callApi, styles }) => {
    const [userData, setUserData] = useState({ name: user.name, email: user.email || '' });
    const [isEditing, setIsEditing] = useState(false);
    const [profilePic, setProfilePic] = useState(localStorage.getItem(`profilePic_${user.id}`) || null);

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

    const fetchUserData = async () => {
        // Using existing user object for initial data, but fetching for latest updates
        const data = await callApi(`/user/${user.id}?userId=${user.id}&userRole=${user.role}`);
        if (data) {
            setUserData({ name: data.name, email: data.email || '' });
        }
    };

    const handleUpdate = async () => {
        if (!userData.name) {
            alert("Name cannot be empty.");
            return;
        }
        const data = await callApi(`/user/${user.id}`, 'PUT', { 
            userId: user.id, 
            userRole: user.role, 
            name: userData.name, 
            email: userData.email,
        });
        if (data && data.success) {
            alert('Profile updated successfully!');
            // Update app-level user state and localStorage
            const updatedUser = { ...user, name: data.user.name, email: data.user.email };
            setUser(updatedUser);
            localStorage.setItem('user', JSON.stringify(updatedUser));
            setIsEditing(false);
        }
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfilePic(reader.result);
                localStorage.setItem(`profilePic_${user.id}`, reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    useEffect(() => {
        fetchUserData();
    }, []);

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
                    <div style={styles.profilePicContainer}>
                        <div style={styles.profileFrame(profilePic)}>
                            {!profilePic && <FaUserCircle size={60} style={{ color: '#ccc' }} />}
                        </div>
                        {/* File input is hidden */}
                        <input type="file" id="file-upload" accept="image/*" onChange={handleImageUpload} style={styles.fileInput} />
                        {/* Label acts as the visible upload button */}
                        <label htmlFor="file-upload" style={{ color: ACCENT_COLOR, cursor: 'pointer', fontSize: '0.9em', marginTop: '5px', display: 'block' }}>
                           <FaEdit size={10} style={{marginRight: '5px'}}/> Upload Photo
                        </label>
                    </div>

                    <h2 style={localStyles.profileName}>{userData.name}'s Profile</h2>
                </div>
                
                {/* Detail Rows - Using local clean style */}
                
                {/* Name */}
                <div style={localStyles.cleanDetailRow}>
                    <label>Name:</label>
                    {isEditing ? (
                        <input 
                            style={localStyles.detailInputField}
                            value={userData.name} 
                            onChange={(e) => setUserData({...userData, name: e.target.value})} 
                        />
                    ) : (
                        <span style={styles.detailValue} onClick={() => setIsEditing(true)}>
                            {userData.name} <FaEdit size={14} style={{color: ACCENT_COLOR}}/>
                        </span>
                    )}
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

                {/* Email */}
                <div style={localStyles.cleanDetailRow}>
                    <label>Email (Optional):</label>
                    {isEditing ? (
                        <input 
                            style={localStyles.detailInputField}
                            value={userData.email} 
                            onChange={(e) => setUserData({...userData, email: e.target.value})} 
                        />
                    ) : (
                        <span style={styles.detailValue} onClick={() => setIsEditing(true)}>
                            {userData.email || 'N/A'} 
                            <FaEdit size={14} style={{color: ACCENT_COLOR}}/>
                        </span>
                    )}
                </div>
                
                {/* Action Buttons */}
                <div style={{ marginTop: '30px', padding: '0 5px' }}>
                    {isEditing && (
                        <button style={localStyles.actionButton()} onClick={handleUpdate}>Save Changes</button>
                    )}

                    <button style={localStyles.actionButton(false)} onClick={() => navigateToPage('orders-list')}>
                        <FaListAlt /> View My Orders
                    </button>

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