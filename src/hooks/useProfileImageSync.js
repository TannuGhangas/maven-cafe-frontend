// src/hooks/useProfileImageSync.js

import { useEffect, useRef } from 'react';

/**
 * Custom hook for syncing profile image updates across components
 * Ensures profile images update instantly across all components and browser tabs
 */
export const useProfileImageSync = (userId, userName, onImageUpdate) => {
    const userNameKey = userName ? userName.replace(/\s+/g, '_') : null;
    const isUpdatingRef = useRef(false);

    useEffect(() => {
        const handleProfileImageUpdate = (event) => {
            const { userId: updatedUserId, userName: updatedUserName, action } = event.detail;
            
            // Check if this update is relevant to this component
            const isRelevantUpdate = 
                (userId && updatedUserId === userId) || 
                (userName && updatedUserName === userName);
            
            if (isRelevantUpdate && !isUpdatingRef.current) {
                console.log(`ProfileImageSync: Profile image updated for user ${updatedUserName || updatedUserId}`);
                isUpdatingRef.current = true;
                
                // Call the update callback
                if (onImageUpdate) {
                    onImageUpdate();
                }
                
                // Reset the updating flag after a short delay
                setTimeout(() => {
                    isUpdatingRef.current = false;
                }, 100);
            }
        };

        const handleStorageChange = (e) => {
            if (e.key && e.key.startsWith('profilePic_')) {
                const keyUserId = e.key.replace('profilePic_', '');
                
                // Check if this storage change is relevant
                const isRelevantStorage = 
                    (userId && keyUserId === userId) ||
                    (userNameKey && keyUserId === userNameKey);
                
                if (isRelevantStorage && !isUpdatingRef.current) {
                    console.log(`ProfileImageSync: Profile image storage updated for ${keyUserId}`);
                    isUpdatingRef.current = true;
                    
                    // Call the update callback
                    if (onImageUpdate) {
                        onImageUpdate();
                    }
                    
                    // Reset the updating flag after a short delay
                    setTimeout(() => {
                        isUpdatingRef.current = false;
                    }, 100);
                }
            }
        };

        // Listen for custom events (same tab)
        window.addEventListener('profileImageUpdated', handleProfileImageUpdate);
        
        // Listen for storage events (cross-tab)
        window.addEventListener('storage', handleStorageChange);

        return () => {
            window.removeEventListener('profileImageUpdated', handleProfileImageUpdate);
            window.removeEventListener('storage', handleStorageChange);
        };
    }, [userId, userNameKey, onImageUpdate]);

    /**
     * Helper function to get profile image from localStorage
     */
    const getProfileImageFromStorage = () => {
        // Try userName key first
        if (userNameKey) {
            const userNameImage = localStorage.getItem(`profilePic_${userNameKey}`);
            if (userNameImage) {
                return userNameImage;
            }
        }
        
        // Try userId key
        if (userId) {
            const userIdImage = localStorage.getItem(`profilePic_${userId}`);
            if (userIdImage) {
                return userIdImage;
            }
        }
        
        return null;
    };

    /**
     * Helper function to save profile image to localStorage
     */
    const saveProfileImageToStorage = (imageData) => {
        // Save using userName key
        if (userNameKey) {
            localStorage.setItem(`profilePic_${userNameKey}`, imageData);
        }
        
        // Save using userId key
        if (userId) {
            localStorage.setItem(`profilePic_${userId}`, imageData);
        }
        
        // Dispatch custom event for same-tab updates
        window.dispatchEvent(new CustomEvent('profileImageUpdated', {
            detail: { userId, userName, action: imageData ? 'updated' : 'removed' }
        }));
    };

    /**
     * Helper function to remove profile image from localStorage
     */
    const removeProfileImageFromStorage = () => {
        // Remove using userName key
        if (userNameKey) {
            localStorage.removeItem(`profilePic_${userNameKey}`);
        }
        
        // Remove using userId key
        if (userId) {
            localStorage.removeItem(`profilePic_${userId}`);
        }
        
        // Dispatch custom event for same-tab updates
        window.dispatchEvent(new CustomEvent('profileImageUpdated', {
            detail: { userId, userName, action: 'removed' }
        }));
    };

    return {
        getProfileImageFromStorage,
        saveProfileImageToStorage,
        removeProfileImageFromStorage
    };
};

/**
 * Global function to force refresh all profile images across the application
 * This can be called to update all ProfileImage components immediately
 */
export const refreshAllProfileImages = () => {
    console.log('Global: Refreshing all profile images across the application');
    
    // Dispatch global refresh event
    window.dispatchEvent(new CustomEvent('refreshAllProfileImages', {
        detail: { action: 'global-refresh', timestamp: Date.now() }
    }));
    
    // Use localStorage for cross-tab communication
    try {
        localStorage.setItem('globalProfileImageRefresh', Date.now().toString());
        setTimeout(() => {
            localStorage.removeItem('globalProfileImageRefresh');
        }, 100);
    } catch (error) {
        console.warn('Global profile refresh: Could not use localStorage:', error);
    }
};

export default useProfileImageSync;