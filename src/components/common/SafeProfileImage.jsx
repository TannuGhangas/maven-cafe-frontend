// src/components/common/SafeProfileImage.jsx

import React from 'react';

/**
 * Safe ProfileImage component that handles React hook errors gracefully
 * This is a fallback when the main ProfileImage component fails
 */
const SafeProfileImage = ({
    userId,
    userName,
    userProfile,
    size = 'medium',
    className = '',
    style = {},
    showPlaceholder = true,
    alt = 'Profile Image',
    refreshKey = null
}) => {
    // Simple size configurations without using complex hooks
    const sizeConfig = {
        small: { width: 32, height: 32, fontSize: 14 },
        medium: { width: 48, height: 48, fontSize: 18 },
        large: { width: 64, height: 64, fontSize: 24 },
        xlarge: { width: 85, height: 85, fontSize: 36 }
    };

    const { width, height, fontSize } = sizeConfig[size] || sizeConfig.medium;

    // Simple function to get profile image with error handling and cache busting
    const getProfileImage = () => {
        try {
            // 1. Try server profile image first
            if (userProfile?.profileImage) {
                return userProfile.profileImage;
            }

            // 2. Try localStorage using userName as key
            if (userName) {
                const userNameKey = userName.replace(/\s+/g, '_');
                const localImage = localStorage.getItem(`profilePic_${userNameKey}`);
                if (localImage) {
                    // Add cache busting parameter if refreshKey is provided
                    return refreshKey ? `${localImage}?refresh=${refreshKey}` : localImage;
                }
            }

            // 3. Try localStorage using userId as key
            if (userId) {
                const localImage = localStorage.getItem(`profilePic_${userId}`);
                if (localImage) {
                    // Add cache busting parameter if refreshKey is provided
                    return refreshKey ? `${localImage}?refresh=${refreshKey}` : localImage;
                }
            }
        } catch (error) {
            console.warn('⚠️ SafeProfileImage: Error getting profile image:', error);
        }

        return null;
    };

    // Simple image load error handler
    const handleImageError = () => {
        console.warn('⚠️ SafeProfileImage: Image failed to load');
    };

    // Get display name for placeholder
    const getDisplayName = () => {
        try {
            if (userProfile?.name) {
                return userProfile.name.charAt(0).toUpperCase();
            }
            if (userName) {
                return userName.charAt(0).toUpperCase();
            }
        } catch (error) {
            console.warn('⚠️ SafeProfileImage: Error getting display name:', error);
        }
        return 'U'; // Default fallback
    };

    const profileImageUrl = getProfileImage();

    // Container styles
    const containerStyle = {
        width: `${width}px`,
        height: `${height}px`,
        borderRadius: '50%',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: profileImageUrl ? 'transparent' : '#cbd5e1',
        background: profileImageUrl ? 'transparent' : 'linear-gradient(135deg, #cbd5e1 0%, #94a3b8 100%)',
        border: profileImageUrl ? 'none' : '2px solid #cbd5e1',
        boxShadow: profileImageUrl ? 'none' : '0 4px 12px rgba(148, 163, 184, 0.3)',
        ...style
    };

    // If we have a profile image, show it
    if (profileImageUrl) {
        return (
            <div className={className} style={containerStyle}>
                <img
                    src={profileImageUrl}
                    alt={alt}
                    style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                    }}
                    onError={handleImageError}
                    draggable={false}
                />
            </div>
        );
    }

    // Show placeholder if enabled
    if (showPlaceholder) {
        return (
            <div className={className} style={containerStyle}>
                <span style={{
                    fontSize: `${fontSize}px`,
                    fontWeight: 'bold',
                    color: '#1e293b',
                    userSelect: 'none'
                }}>
                    {getDisplayName()}
                </span>
            </div>
        );
    }

    // Return empty div if no image and no placeholder
    return (
        <div className={className} style={containerStyle} />
    );
};

export default SafeProfileImage;