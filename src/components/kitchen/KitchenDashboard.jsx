// src/components/kitchen/KitchenDashboard.jsx

import React, { useState, useEffect } from 'react';
import { FaSpinner, FaUsers, FaChevronLeft } from 'react-icons/fa';
import OrderDetailModal from './OrderDetailModal'; // Import the detail modal

const KitchenDashboard = ({ user, callApi, setPage, styles }) => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState(null);

    const fetchOrders = async () => {
        setLoading(true);
        // API call gets all active orders for kitchen/admin
        const data = await callApi(`/orders?userId=${user.id}&userRole=${user.role}`);
        if (data) {
            setOrders(data);
        }
        setLoading(false);
    };
    
    const updateOrderStatus = async (orderId, newStatus) => {
        const data = await callApi(`/orders/${orderId}/status`, 'PUT', { 
            status: newStatus,
            userId: user.id,
            userRole: user.role
        });
        if (data && data.success) {
            alert(`Order ${orderId.substring(18)} status updated to ${newStatus}.`);
            fetchOrders(); 
            setSelectedOrder(null); 
        }
    };

    useEffect(() => {
        fetchOrders();
        // Setup polling interval (10 seconds)
        const interval = setInterval(fetchOrders, 10000); 
        return () => clearInterval(interval); // Cleanup on unmount
    }, []);

    const groupedOrders = orders.reduce((acc, order) => {
        acc[order.status] = acc[order.status] || [];
        acc[order.status].push(order);
        return acc;
    }, {});
    
    const renderOrderCard = (order) => (
        <div key={order._id} style={styles.kitchenCard} onClick={() => setSelectedOrder(order)}>
            <div style={{ flexGrow: 1 }}>
                <strong style={{ color: order.status === 'Ready' ? 'green' : 'inherit' }}>
                    {order.userName} - {order.slot.split('(')[0].trim()}
                </strong>
                <small style={{ display: 'block', color: '#666' }}>
                    {order.items.reduce((sum, item) => sum + item.quantity, 0)} Total Items
                </small>
                <small style={{ display: 'block', color: 'gray' }}>
                    Status: {order.status}
                </small>
            </div>
            {/* FaChevronLeft rotated 90 degrees acts as a "details" arrow */}
            <FaChevronLeft style={{ transform: 'rotate(-90deg)' }} /> 
        </div>
    );

    if (loading) return <div style={styles.loadingContainer}><FaSpinner className="spinner" size={30} /> Loading Kitchen Board...</div>;

    if (selectedOrder) {
        return (
            <OrderDetailModal 
                order={selectedOrder} 
                onClose={() => setSelectedOrder(null)} 
                onUpdateStatus={updateOrderStatus}
                currentUser={user}
                styles={styles}
            />
        );
    }

    return (
        <div style={styles.screenPadding}>
            <h2>Kitchen Dashboard</h2>
            <p style={{ color: '#666', fontSize: '0.9em' }}>Displays orders not yet delivered. Refreshes every 10s.</p>

            {user.role === 'admin' && (
                <button 
                    style={styles.adminLinkButton} 
                    onClick={() => setPage('admin-users')}
                >
                    <FaUsers /> Go to Admin Users
                </button>
            )}
            
            {/* Render groups in priority order: Placed -> Making -> Ready */}
            {['Placed', 'Making', 'Ready'].map(status => (
                <div key={status} style={styles.orderGroup}>
                    <h3 style={styles.groupHeader(status)}>{status.toUpperCase()} Orders ({groupedOrders[status]?.length || 0})</h3>
                    <div style={{ marginBottom: '15px' }}>
                        {groupedOrders[status]?.length > 0 ? (
                            groupedOrders[status].map(renderOrderCard)
                        ) : (
                            <p style={{ color: '#888' }}>No {status} orders.</p>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default KitchenDashboard;