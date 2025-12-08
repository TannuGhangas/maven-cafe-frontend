// src/components/common/ReactCompatibilityCheck.jsx

import React from 'react';

/**
 * Utility component to check React compatibility and hook availability
 * This helps debug "Invalid hook call" errors
 */
const ReactCompatibilityCheck = () => {
    // This component intentionally doesn't use any hooks to avoid triggering the error
    // It's purely for debugging React availability

    const checkReactAvailability = () => {
        const checks = {
            'React object exists': typeof React !== 'undefined',
            'React.version available': !!React?.version,
            'React.useState available': typeof React?.useState === 'function',
            'React.useEffect available': typeof React?.useEffect === 'function',
            'React.createElement available': typeof React?.createElement === 'function',
        };

        console.log('🔍 React Compatibility Check:', checks);

        // Check React version consistency
        if (typeof React !== 'undefined' && React.version) {
            console.log('📦 React version:', React.version);
        }

        return checks;
    };

    // Run check on mount (but not using hooks to avoid the error)
    if (typeof window !== 'undefined') {
        setTimeout(checkReactAvailability, 100);
    }

    // Return null - this component doesn't render anything
    return null;
};

export default ReactCompatibilityCheck;