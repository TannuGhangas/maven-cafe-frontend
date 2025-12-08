// Reusable Notification Modal Component
// Eliminates code duplication and provides consistent UI/UX

import React, { useEffect } from 'react';
import { FaBell, FaVolumeUp, FaVolumeMute, FaTimes } from 'react-icons/fa';
import speechManager from '../../utils/speechSynthesis';

const NotificationModal = ({
    isVisible,
    onClose,
    title,
    subtitle,
    children,
    orderData,
    autoSpeak = true,
    speechText,
    speechOptions = {},
    showVolumeControl = true,
    volumeControlPosition = 'bottom'
}) => {
    const [isMuted, setIsMuted] = React.useState(false);

    // Handle speech synthesis
    useEffect(() => {
        if (isVisible && autoSpeak && speechText) {
            const timer = setTimeout(() => {
                speechManager.speak(speechText, {
                    ...speechOptions,
                    onEnd: () => {
                        console.log('Notification modal speech ended');
                        if (speechOptions.onEnd) speechOptions.onEnd();
                    },
                    onError: (error) => {
                        console.warn('Notification modal speech error:', error);
                        if (speechOptions.onError) speechOptions.onError(error);
                    }
                });
            }, 100); // Minimal delay for immediate response

            return () => clearTimeout(timer);
        }
    }, [isVisible, autoSpeak, speechText]);

    // Update global mute state
    useEffect(() => {
        speechManager.setMuted(isMuted);
    }, [isMuted]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            speechManager.cancel();
        };
    }, []);

    // Handle escape key
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape' && isVisible) {
                onClose();
            }
        };

        if (isVisible) {
            document.addEventListener('keydown', handleEscape);
            return () => document.removeEventListener('keydown', handleEscape);
        }
    }, [isVisible, onClose]);

    if (!isVisible) return null;

    const overlayStyle = {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.95)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10000,
        animation: 'fadeIn 0.3s ease-out',
    };

    const containerStyle = {
        backgroundColor: '#ffffff',
        borderRadius: '20px',
        padding: '40px',
        maxWidth: '90%',
        width: '450px',
        textAlign: 'center',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
        animation: 'slideUp 0.4s ease-out',
    };

    const iconContainerStyle = {
        width: '80px',
        height: '80px',
        borderRadius: '50%',
        backgroundColor: '#103c7f',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '0 auto 25px',
        animation: 'pulse 1.5s infinite',
    };

    const titleStyle = {
        fontSize: '28px',
        fontWeight: '700',
        color: '#333',
        marginBottom: '10px',
        fontFamily: 'Cambria, serif',
    };

    const subtitleStyle = {
        fontSize: '16px',
        color: '#666',
        marginBottom: '30px',
    };

    const closeButtonStyle = {
        position: 'absolute',
        top: '20px',
        right: '20px',
        background: 'none',
        border: 'none',
        color: '#fff',
        fontSize: '24px',
        cursor: 'pointer',
        zIndex: 10001,
    };

    const volumeButtonStyle = {
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        margin: '10px 0',
        color: isMuted ? '#999' : '#ff7f41',
        fontSize: '20px',
        padding: '8px',
        borderRadius: '8px',
        transition: 'all 0.3s ease'
    };

    const volumeControlStyle = {
        position: 'absolute',
        bottom: '20px',
        right: '20px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '10px'
    };

    const keyframes = `
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        @keyframes slideUp {
            from { transform: translateY(50px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
        }
        @keyframes pulse {
            0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(16, 60, 127, 0.7); }
            50% { transform: scale(1.05); box-shadow: 0 0 0 20px rgba(16, 60, 127, 0); }
            100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(16, 60, 127, 0); }
        }
    `;

    const handleClose = () => {
        speechManager.cancel();
        onClose();
    };

    return (
        <>
            <style>{keyframes}</style>
            <div style={overlayStyle}>
                <button 
                    style={closeButtonStyle} 
                    onClick={handleClose}
                    aria-label="Close notification"
                >
                    <FaTimes />
                </button>
                
                <div style={containerStyle}>
                    <div style={iconContainerStyle}>
                        <FaBell size={32} style={{ color: 'white' }} />
                    </div>
                    
                    {title && <h1 style={titleStyle}>{title}</h1>}
                    {subtitle && <p style={subtitleStyle}>{subtitle}</p>}
                    
                    {children}
                    
                    {/* Volume control */}
                    {showVolumeControl && (
                        <button
                            onClick={() => setIsMuted(!isMuted)}
                            style={volumeButtonStyle}
                            title={isMuted ? 'Unmute notifications' : 'Mute notifications'}
                        >
                            {isMuted ? <FaVolumeMute /> : <FaVolumeUp />}
                        </button>
                    )}
                </div>

                {/* Bottom volume control for mobile */}
                {showVolumeControl && volumeControlPosition === 'bottom' && (
                    <div style={volumeControlStyle}>
                        <button
                            onClick={() => setIsMuted(!isMuted)}
                            style={{
                                ...volumeButtonStyle,
                                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                borderRadius: '50%',
                                width: '50px',
                                height: '50px'
                            }}
                            title={isMuted ? 'Unmute notifications' : 'Mute notifications'}
                        >
                            {isMuted ? <FaVolumeMute size={20} /> : <FaVolumeUp size={20} />}
                        </button>
                    </div>
                )}
            </div>
        </>
    );
};

export default NotificationModal;