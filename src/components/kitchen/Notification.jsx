import React from 'react';
import { FaBell } from 'react-icons/fa';
import '../../styles/Notification.css';

const Notification = ({ showNotification, handleNotificationOk }) => {
    if (!showNotification) return null;

    return (
        <>
            <div className="kitchen-overlay" />
            <div className="kitchen-notification">
                <FaBell size={48} style={{ marginBottom: 15 }} />
                <div className="notification-title">
                    ORDER RECEIVED
                </div>
                <button
                    onClick={handleNotificationOk}
                    className="notification-button"
                >
                    OK, GOT IT
                </button>
            </div>
        </>
    );
};

export default Notification;