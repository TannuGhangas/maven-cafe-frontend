// src/components/common/ProfileImage.jsx

import React from 'react';
import SafeProfileImage from './SafeProfileImage';

// Error boundary for ProfileImage component
class ProfileImageErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        console.error('❌ ProfileImage Error Boundary caught error:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            console.warn('⚠️ Using SafeProfileImage due to error');
            return <SafeProfileImage {...this.props} />;
        }

        return this.props.children;
    }
}

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
 * @param {number|string} props.refreshKey - Optional refresh key to force re-render
 */
const ProfileImage = (props) => {
    // Use SafeProfileImage by default to avoid hook errors
    // This prevents the "Invalid hook call" error that causes white screens
    return <SafeProfileImage {...props} />;
};

// Wrap the main component with error boundary for automatic fallback
const ProfileImageWithErrorBoundary = (props) => (
    <ProfileImageErrorBoundary {...props}>
        <ProfileImage {...props} />
    </ProfileImageErrorBoundary>
);

export default ProfileImageWithErrorBoundary;