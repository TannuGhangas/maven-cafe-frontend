// Refactored Notification Component
// Uses centralized utilities for cleaner code and better performance

import React from 'react';
import { FaBell, FaCheck } from 'react-icons/fa';
import NotificationModal from '../common/NotificationModal';
import speechManager from '../../utils/speechSynthesis';

const Notification = ({ showNotification, handleNotificationOk, orderData }) => {
    // Early return check - notification is hidden
    if (!showNotification) {
        return null;
    }
    
    // Check if required props are missing
    if (!handleNotificationOk) {
        console.error('Missing handleNotificationOk prop');
        return null;
    }

    // Build speech message for order notifications
    const buildOrderMessage = () => {
        try {
            let message = 'Order received! ';
            
            if (orderData?.userName) {
                message += `From ${String(orderData.userName)}. `;
            }
            
            if (orderData?.items && Array.isArray(orderData.items) && orderData.items.length > 0) {
                message += 'Items: ';
                orderData.items.forEach((item, index) => {
                    try {
                        const quantity = Number(item.quantity) || 1;
                        const itemName = String(item.item || 'item');
                        message += `${quantity} ${itemName}`;
                        
                        if (item.type && item.type !== 'Standard') {
                            message += `, ${String(item.type)}`;
                        }
                        if (index < orderData.items.length - 1) {
                            message += ', ';
                        }
                    } catch (itemError) {
                        console.warn('Error processing item:', itemError);
                    }
                });
                message += '.';
            }
            
            return message;
        } catch (error) {
            console.error('Error building notification message:', error);
            return 'Order received!';
        }
    };

    // Handle notification close
    const handleClose = () => {
        speechManager.cancel();
        handleNotificationOk();
    };

    // Render order details
    const renderOrderDetails = () => {
        if (!orderData) return null;

        const orderDetailsStyle = {
            margin: '10px 0',
            padding: '15px',
            backgroundColor: '#f0f0f0',
            borderRadius: '8px',
            fontSize: '14px',
            textAlign: 'center'
        };

        const userNameStyle = {
            fontWeight: 'bold',
            marginBottom: '8px',
            fontSize: '16px',
            color: '#333'
        };

        const itemStyle = {
            marginBottom: '4px'
        };

        return (
            <div style={orderDetailsStyle}>
                <div style={userNameStyle}>
                    {orderData.userName}
                </div>
                {orderData.items && orderData.items.map((item, index) => (
                    <div key={index} style={itemStyle}>
                        {item.quantity}x {item.item}
                        {item.type && item.type !== 'Standard' && ` (${item.type})`}
                    </div>
                ))}
            </div>
        );
    };

    return (
        <NotificationModal
            isVisible={showNotification}
            onClose={handleClose}
            title="ORDER RECEIVED"
            subtitle="New order has been placed"
            speechText={buildOrderMessage()}
            speechOptions={{
                rate: 0.9,
                pitch: 1,
                volume: 1.0
            }}
            showVolumeControl={true}
            volumeControlPosition="inline"
        >
            {renderOrderDetails()}
            
            <button
                onClick={handleClose}
                style={{
                    backgroundColor: '#103c7f',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '12px 30px',
                    fontSize: '16px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    marginTop: '20px',
                    transition: 'all 0.3s ease',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    margin: '20px auto'
                }}
                onMouseOver={(e) => e.target.style.transform = 'scale(1.02)'}
                onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
            >
                <FaCheck /> OK, GOT IT
            </button>
        </NotificationModal>
    );
};

export default Notification;