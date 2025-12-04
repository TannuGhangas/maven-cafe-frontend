// src/components/common/ProfileImageDebugger.jsx

import React, { useState, useEffect } from 'react';
import ProfileImage from './ProfileImage';

/**
 * Debug component to test profile image synchronization
 * This component helps verify that profile images update instantly across all components
 */
const ProfileImageDebugger = ({ user }) => {
    const [debugInfo, setDebugInfo] = useState([]);
    const [profileImageRefresh, setProfileImageRefresh] = useState(0);

    useEffect(() => {
        const handleProfileImageUpdate = (event) => {
            const { userId, userName, action } = event.detail;
            const timestamp = new Date().toLocaleTimeString();
            
            const message = `[${timestamp}] Profile image ${action} for user: ${userName || userId}`;
            console.log('ProfileImageDebugger:', message);
            
            setDebugInfo(prev => [...prev.slice(-4), message]);
            setProfileImageRefresh(prev => prev + 1);
        };

        const handleStorageChange = (e) => {
            if (e.key && e.key.startsWith('profilePic_')) {
                const timestamp = new Date().toLocaleTimeString();
                const keyUserId = e.key.replace('profilePic_', '');
                const message = `[${timestamp}] Storage updated for key: ${keyUserId}`;
                
                console.log('ProfileImageDebugger:', message);
                setDebugInfo(prev => [...prev.slice(-4), message]);
                setProfileImageRefresh(prev => prev + 1);
            }
        };

        window.addEventListener('profileImageUpdated', handleProfileImageUpdate);
        window.addEventListener('storage', handleStorageChange);

        return () => {
            window.removeEventListener('profileImageUpdated', handleProfileImageUpdate);
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);

    const checkProfileImages = () => {
        const checks = [
            { key: `profilePic_${user.id}`, label: 'User ID Key' },
            { key: `profilePic_${user.name.replace(/\s+/g, '_')}`, label: 'UserName Key' }
        ];

        const results = checks.map(check => {
            const value = localStorage.getItem(check.key);
            return {
                ...check,
                exists: !!value,
                length: value ? value.length : 0
            };
        });

        console.log('ProfileImageDebugger - Current storage status:', results);
        setDebugInfo(prev => [...prev.slice(-3), `Storage check at ${new Date().toLocaleTimeString()}`]);
    };

    return (
        <div style={{
            position: 'fixed',
            top: '10px',
            right: '10px',
            width: '300px',
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            color: 'white',
            padding: '10px',
            borderRadius: '5px',
            fontSize: '12px',
            zIndex: 9999,
            maxHeight: '200px',
            overflowY: 'auto'
        }}>
            <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>
                Profile Image Debugger
            </div>
            
            <div style={{ marginBottom: '10px' }}>
                <ProfileImage
                    key={`debugger-${profileImageRefresh}`}
                    userId={user.id}
                    userName={user.name}
                    userProfile={user}
                    size="small"
                    showPlaceholder={true}
                    alt="Debug profile"
                />
                <div style={{ fontSize: '10px', marginTop: '2px' }}>
                    User: {user.name}
                </div>
            </div>

            <button
                onClick={checkProfileImages}
                style={{
                    backgroundColor: '#007bff',
                    color: 'white',
                    border: 'none',
                    padding: '5px 10px',
                    borderRadius: '3px',
                    fontSize: '10px',
                    cursor: 'pointer',
                    marginBottom: '5px',
                    width: '100%'
                }}
            >
                Check Storage
            </button>

            <div style={{ maxHeight: '80px', overflowY: 'auto' }}>
                {debugInfo.map((info, index) => (
                    <div key={index} style={{ 
                        fontSize: '10px', 
                        marginBottom: '2px',
                        opacity: 0.8
                    }}>
                        {info}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProfileImageDebugger;