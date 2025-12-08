// Refactored ChefCallNotification Component
// Uses centralized utilities for cleaner code and better performance

import React, { useState, useEffect } from 'react';
import { FaPhone, FaCheck, FaTimes, FaMapMarkerAlt, FaUser, FaClock, FaRunning } from 'react-icons/fa';
import NotificationModal from '../common/NotificationModal';
import speechManager from '../../utils/speechSynthesis';

const ChefCallNotification = ({ call, onRespond, pendingOrderNotifications = 0 }) => {
    // Check if required props are missing
    if (!call) {
        console.log('ChefCallNotification not showing (call is null/undefined)');
        return null;
    }
    
    if (!onRespond) {
        console.error('Missing onRespond prop in ChefCallNotification');
        return null;
    }



    // Build speech message for chef calls
    const buildSpeechMessage = () => {
        try {
            const userName = String(call.userName || 'Customer');
            const seatNumber = String(call.seatNumber || 'unknown seat');
            return `Attention! ${userName} at ${seatNumber} is calling you.`;
        } catch (error) {
            console.error('Error building chef call message:', error);
            return 'Chef call received!';
        }
    };

    // Handle chef call response
    const handleResponse = (response) => {
        console.log(`Chef responding with: ${response}`);
        
        try {
            if (onRespond && typeof onRespond === 'function') {
                onRespond(call.id, response);
            } else {
                console.error('onRespond is not a function or is missing');
            }
        } catch (error) {
            console.error('Error in onRespond:', error);
        }
        
        speechManager.cancel();
    };

    // Format time for display
    const formatTime = (timestamp) => {
        const date = new Date(timestamp);
        return date.toLocaleTimeString('en-IN', { 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: true 
        });
    };

    // Render chef call content
    const renderChefCallContent = () => {
        const infoBoxStyle = {
            backgroundColor: '#f8f9fa',
            borderRadius: '15px',
            padding: '20px',
            marginBottom: '30px',
        };

        const infoRowStyle = {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            marginBottom: '15px',
        };

        const userNameStyle = {
            fontSize: '24px',
            fontWeight: '700',
            color: '#103c7f',
        };

        const seatStyle = {
            fontSize: '20px',
            fontWeight: '600',
            color: '#28a745',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
        };

        const buttonContainerStyle = {
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            justifyContent: 'center',
        };

        const buttonStyle = {
            border: 'none',
            borderRadius: '12px',
            padding: '15px 30px',
            fontSize: '18px',
            fontWeight: '700',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            transition: 'all 0.3s ease',
            color: 'white',
        };

        const comingButtonStyle = {
            ...buttonStyle,
            backgroundColor: '#28a745',
            boxShadow: '0 4px 15px rgba(40, 167, 69, 0.4)',
        };

        const coming5MinButtonStyle = {
            ...buttonStyle,
            backgroundColor: '#ffc107',
            color: '#333',
            boxShadow: '0 4px 15px rgba(255, 193, 7, 0.4)',
        };

        const dismissButtonStyle = {
            ...buttonStyle,
            backgroundColor: '#dc3545',
            boxShadow: '0 4px 15px rgba(220, 53, 69, 0.4)',
        };

        const timeStyle = {
            fontSize: '14px',
            color: '#999',
            marginTop: '20px',
        };

        return (
            <>
                <div style={infoBoxStyle}>
                    <div style={infoRowStyle}>
                        <FaUser style={{ color: '#103c7f', fontSize: '20px' }} />
                        <span style={userNameStyle}>{call.userName}</span>
                    </div>
                    <div style={seatStyle}>
                        <FaMapMarkerAlt />
                        <span>{call.seatNumber}</span>
                    </div>
                </div>
                
                <div style={buttonContainerStyle}>
                    <button 
                        style={comingButtonStyle}
                        onClick={() => handleResponse('coming')}
                        onMouseOver={(e) => e.target.style.transform = 'scale(1.02)'}
                        onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
                    >
                        <FaRunning /> Coming Now
                    </button>
                    <button 
                        style={coming5MinButtonStyle}
                        onClick={() => handleResponse('coming_5min')}
                        onMouseOver={(e) => e.target.style.transform = 'scale(1.02)'}
                        onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
                    >
                        <FaClock /> Coming in 5 Minutes
                    </button>
                    <button 
                        style={dismissButtonStyle}
                        onClick={() => handleResponse('dismiss')}
                        onMouseOver={(e) => e.target.style.transform = 'scale(1.02)'}
                        onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
                    >
                        <FaTimes /> Dismiss
                    </button>
                </div>
                
                <p style={timeStyle}>Called at {formatTime(call.timestamp)}</p>
                

            </>
        );
    };

    return (
        <NotificationModal
            isVisible={true}
            onClose={() => handleResponse('dismiss')}
            title="🔔 Chef Called!"
            subtitle="A customer needs your assistance"
            speechText={buildSpeechMessage()}
            speechOptions={{
                rate: 0.8,
                pitch: 1.2,
                volume: 1.0
            }}
            showVolumeControl={true}
            volumeControlPosition="inline"
        >
            {renderChefCallContent()}
        </NotificationModal>
    );
};

export default ChefCallNotification;
