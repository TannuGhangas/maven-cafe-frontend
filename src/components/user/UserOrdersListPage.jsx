// src/components/user/UserOrdersListPage.jsx

import React, { useState, useEffect } from 'react';
import { FaSpinner, FaChevronLeft } from 'react-icons/fa';

const UserOrdersListPage = ({ setPage, user, callApi, styles }) => {
    const [userOrders, setUserOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchOrders = async () => {
        setLoading(true);
        // Assuming API endpoint returns active orders for the specific user ID
        const data = await callApi(`/orders/${user.id}`); 
        if (data) {
            setUserOrders(data);
        }
        setLoading(false);
    };
    
    const handleCancelOrder = async (orderId) => {
        if (window.confirm('Are you sure you want to cancel this order? This action cannot be undone.')) {
            const data = await callApi(`/orders/${orderId}`, 'PUT', { 
                userId: user.id, 
                userRole: user.role, 
                action: 'delete' // Backend logic needs to handle this 'delete' action for soft cancellation
            });
            if (data && data.success) {
                alert(data.message);
                fetchOrders(); 
            }
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    if (loading) return <div style={styles.loadingContainer}><FaSpinner className="spinner" size={30} /> Loading Orders...</div>;

    return (
        <div style={styles.screenPadding}>
            <h3>My Current Orders ({user.name})</h3>
            <p style={{ color: '#666', fontSize: '0.9em' }}>Delivered orders are automatically hidden.</p>
            
            <div style={styles.listContainer}>
                {userOrders.length === 0 ? (
                    <p>No active orders found.</p>
                ) : (
                    userOrders.map(order => (
                        <div key={order._id} style={styles.orderItemCard}>
                            <div style={{ flexGrow: 1 }}>
                                <strong style={{ color: order.status === 'Ready' ? 'green' : (order.status === 'Making' ? 'orange' : 'blue') }}>
                                    Status: {order.status}
                                </strong>
                                <small style={{ display: 'block', color: '#666' }}>
                                    Slot: {order.slot.split('(')[0].trim()} | Placed: {new Date(order.timestamp).toLocaleTimeString()}
                                </small>
                                <ul>
                                    {order.items.map((item, i) => (
                                        <li key={i} style={{ fontSize: '14px', margin: '3px 0' }}>
                                            {item.quantity}x {item.type} {item.item} to {item.location}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            
                            {order.status === 'Placed' && (
                                <button 
                                    style={styles.cancelButton} 
                                    onClick={() => handleCancelOrder(order._id)}
                                >
                                    Cancel
                                </button>
                            )}
                        </div>
                    ))
                )}
            </div>
            <button 
                style={styles.secondaryButton} 
                onClick={() => setPage('home')}
            >
                <FaChevronLeft /> Back to Home
            </button>
        </div>
    );
};

export default UserOrdersListPage;