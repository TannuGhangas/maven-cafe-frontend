// src/components/kitchen/KitchenDashboard.jsx

import React, { useState, useEffect } from 'react';
import { FaSpinner, FaUsers, FaChevronLeft } from 'react-icons/fa';
import OrderDetailModal from './OrderDetailModal';

const KitchenDashboard = ({ user, callApi, setPage, styles }) => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState(null);

    const fetchOrders = async () => {
        setLoading(true);
        const data = await callApi(`/orders?userId=${user.id}&userRole=${user.role}`);
        if (data) setOrders(data);
        setLoading(false);
    };

    const updateOrderStatus = async (orderId, newStatus) => {
        const data = await callApi(`/orders/${orderId}/status`, 'PUT', { 
            status: newStatus,
            userId: user.id,
            userRole: user.role
        });
        if (data && data.success) {
            alert(`Order ${orderId.substring(18)} updated to ${newStatus}.`);
            fetchOrders(); 
            setSelectedOrder(null); 
        }
    };

    useEffect(() => {
        fetchOrders();
        const interval = setInterval(fetchOrders, 10000); 
        return () => clearInterval(interval);
    }, []);

    const groupedOrders = orders.reduce((acc, order) => {
        acc[order.status] = acc[order.status] || [];
        acc[order.status].push(order);
        return acc;
    }, {});

    const renderOrderCard = (order) => (
        <div 
            key={order._id} 
            style={{
                ...styles.kitchenCard,
                borderRadius: 12,
                padding: 16,
                marginBottom: 12,
                backgroundColor: "#ffffff",
                boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                cursor: "pointer"
            }}
            onClick={() => setSelectedOrder(order)}
        >
            <div style={{ flexGrow: 1 }}>
                <strong style={{ color: order.status === 'Ready' ? 'green' : '#333' }}>
                    {order.userName} - {order.slot.split('(')[0].trim()}
                </strong>
                <small style={{ display: 'block', color: '#666' }}>
                    {order.items.reduce((sum, item) => sum + item.quantity, 0)} Total Items
                </small>
                <small style={{ display: 'block', color: 'gray' }}>
                    Status: {order.status}
                </small>
            </div>
            <FaChevronLeft style={{ transform: 'rotate(-90deg)', color: "#333" }} />
        </div>
    );

    if (loading)
        return (
            <div style={styles.loadingContainer}>
                <FaSpinner className="spinner" size={30} /> Loading Kitchen Board...
            </div>
        );

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
        <div style={{
            ...styles.screenPadding,
            minHeight: "100vh",
            backgroundColor: "#ffffff"
        }}>
            
            {/* TOP BANNER IMAGE FROM HOMESCREEN */}
            <div style={{
                width: '100%',
                height: 140,
                backgroundImage: "url('https://img.freepik.com/free-photo/flat-lay-vegetables-pan-with-vegetable-soup-with-fusilli-wooden-frame_23-2148369750.jpg?semt=ais_hybrid&w=740&q=80')",  // ← REPLACE THIS
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                borderRadius: 12,
                marginBottom: 20,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                padding: "20px",
            }}>
                <span style={{ color: "#fff", fontSize: 22, fontWeight: "700" }}>Kitchen Dashboard</span>
                <span style={{ color: "#fff", fontSize: 14 }}>Manage & track all active orders</span>
            </div>

            <h2 style={{ marginBottom: 4 }}>Orders</h2>
            <p style={{ color: '#666', fontSize: '0.9em', marginBottom: 15 }}>
                Displays orders not yet delivered. Auto-refresh every 10s.
            </p>

            {user.role === 'admin' && (
                <button 
                    style={{
                        ...styles.adminLinkButton,
                        marginBottom: 18,
                        borderRadius: 8,
                        padding: "10px 14px",
                        fontSize: 15,
                        backgroundColor: "#FF5F1F",
                        color: "#fff",
                        border: "none",
                        boxShadow: "0 2px 4px rgba(255,95,31,0.2)"
                    }}
                    onClick={() => setPage('admin-users')}
                >
                    <FaUsers /> Go to Admin Users
                </button>
            )}
            
            {['Placed', 'Making', 'Ready'].map(status => (
                <div key={status} style={{
                    marginBottom: 20,
                    backgroundColor: "#F4F4F4",
                    padding: 12,
                    borderRadius: 12
                }}>
                    <h3 style={{
                        fontSize: 18,
                        marginBottom: 10,
                        fontWeight: "700",
                        color: "#333"
                    }}>
                        {status.toUpperCase()} ({groupedOrders[status]?.length || 0})
                    </h3>

                    {groupedOrders[status]?.length > 0 ? (
                        groupedOrders[status].map(renderOrderCard)
                    ) : (
                        <p style={{ color: '#999', margin: 0 }}>No {status} orders.</p>
                    )}
                </div>
            ))}

        </div>
    );
};

export default KitchenDashboard;
