// src/components/common/ProfileImage.jsx

import React, { useState, useEffect, useCallback } from 'react';
import { useProfileImageSync } from '../../hooks/useProfileImageSync';

/**
 * Reusable ProfileImage component that provides instant profile image updates
 * @param {Object} props
 * @param {string} props.userId - User ID for localStorage key
 * @param {string} props.userName - User name for localStorage key
 * @param {Object} props.userProfile - User profile object from server
 * @param {string} props.size - Size of the profile image (small, medium, large)
 * @param {string} props.className - CSS class name
 * @param {Object} props.style - Additional styles
 * @param {boolean} props.showPlaceholder - Whether to show placeholder when no image
 * @param {string} props.alt - Alt text for the image
 */
const ProfileImage = ({
    userId,
    userName,
    userProfile,
    size = 'medium',
    className = '',
    style = {},
    showPlaceholder = true,
    alt = 'Profile Image'
}) => {
    const [profileImageUrl, setProfileImageUrl] = useState(null);
    const [imageKey, setImageKey] = useState(0); // Force re-render when image updates
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    // Size configurations
    const sizeConfig = {
        small: { width: 32, height: 32, fontSize: 14 },
        medium: { width: 48, height: 48, fontSize: 18 },
        large: { width: 64, height: 64, fontSize: 24 },
        xlarge: { width: 85, height: 85, fontSize: 36 }
    };

    const { width, height, fontSize } = sizeConfig[size] || sizeConfig.medium;

    // Function to get profile image from multiple sources
    const getProfileImage = useCallback(() => {
        let imageUrl = null;

        // 1. Try server profile image first
        if (userProfile?.profileImage) {
            imageUrl = userProfile.profileImage;
        }

        // 2. Try localStorage using userName as key
        if (!imageUrl && userName) {
            const userNameKey = userName.replace(/\s+/g, '_');
            const localImage = localStorage.getItem(`profilePic_${userNameKey}`);
            if (localImage) {
                imageUrl = localImage;
            }
        }

        // 3. Try localStorage using userId as key
        if (!imageUrl && userId) {
            const localImage = localStorage.getItem(`profilePic_${userId}`);
            if (localImage) {
                imageUrl = localImage;
            }
        }

        return imageUrl;
    }, [userId, userName, userProfile]);

    // Load profile image
    useEffect(() => {
        const imageUrl = getProfileImage();
        setProfileImageUrl(imageUrl);
    }, [getProfileImage, imageKey, refreshTrigger]);

    // Use the sync hook for profile image updates
    useProfileImageSync(userId, userName, () => {
        console.log(`ProfileImage: Profile image sync triggered for user ${userName || userId}`);
        setRefreshTrigger(prev => prev + 1);
        setImageKey(prev => prev + 1);
    });

    // Handle image load error
    const handleImageError = () => {
        setProfileImageUrl(null);
    };

    // Get display name for placeholder
    const getDisplayName = () => {
        if (userProfile?.name) {
            return userProfile.name.charAt(0).toUpperCase();
        }
        if (userName) {
            return userName.charAt(0).toUpperCase();
        }
        return 'U'; // Default fallback
    };

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
                    key={`profile-img-${imageKey}`}
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

export default ProfileImage;