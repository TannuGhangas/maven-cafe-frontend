// src/components/kitchen/OrderDetailModal.jsx

import React, { useMemo } from 'react';
import { FaCheckCircle } from 'react-icons/fa';

const OrderDetailModal = ({ order, onClose, onUpdateStatus, currentUser, styles }) => {
    const nextStatus = useMemo(() => {
        if (order.status === 'Placed') return 'Making';
        if (order.status === 'Making') return 'Ready';
        if (order.status === 'Ready') return 'Delivered';
        return null;
    }, [order.status]);

    return (
        <div style={styles.modalOverlay}>
            <div style={{ ...styles.modalContent, width: '90%' }}>
                <h2 style={{ color: 'blue' }}>Order #{order._id.substring(18)}</h2>
                <p><strong>Customer:</strong> {order.userName}</p>
                <p><strong>Slot:</strong> {order.slot}</p>
                <p><strong>Current Status:</strong> <span style={{ color: nextStatus ? 'orange' : 'green' }}>{order.status}</span></p>
                <p><strong>Time Placed:</strong> {new Date(order.timestamp).toLocaleString()}</p>
                
                <h4 style={{ borderBottom: '1px solid #eee', paddingBottom: '5px' }}>Items:</h4>
                
                {order.items.map((item, index) => (
                    <div key={index} style={styles.detailItemRow}>
                        <p style={{ margin: '5px 0' }}>
                            <strong>{item.quantity}x {item.type} {item.item.toUpperCase()}</strong>
                        </p>
                        <small>
                            Delivery: **{item.location}{item.tableNo ? ` (Table ${item.tableNo})` : ''}** {item.customLocation && ` | ${item.customLocation}`}
                        </small>
                        <small style={{ display: 'block', color: '#888' }}>
                            Sugar: {item.sugarLevel !== undefined ? item.sugarLevel : 'N/A'} | Notes: {item.notes || 'None'}
                        </small>
                    </div>
                ))}

                {nextStatus && (
                    <button 
                        style={styles.primaryButton} 
                        onClick={() => onUpdateStatus(order._id, nextStatus)}
                    >
                        <FaCheckCircle /> Mark as {nextStatus}
                    </button>
                )}
                
                <button 
                    style={styles.secondaryButton} 
                    onClick={() => onUpdateStatus(order._id, 'Delivered')}
                >
                     Mark as Delivered (Final)
                </button>
                
                <button style={styles.closeButton} onClick={onClose}>Close Detail</button>
            </div>
        </div>
    );
};

export default OrderDetailModal;