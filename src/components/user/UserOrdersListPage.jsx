import React, { useState, useEffect } from 'react';
import { FaSpinner, FaChevronLeft, FaMapMarkerAlt, FaCalendarAlt, FaCoffee, FaExclamationCircle } from 'react-icons/fa';
import { STYLES_THEME } from './UserHomePage'; // Assuming you expose the theme styles here

// --- ENHANCED STYLES (matching OrderConfirmationPage) ---
const THEME_COLORS = {
    PRIMARY: '#103c7f', // Dark Blue
    ACCENT: '#a1db40', // Green
    TEXT_DARK: '#333333', // Dark text (for labels/values)
    TEXT_MUTED: '#7f8c8d', // Gray for minor details
    DANGER: '#e74c3c', // Red for delete
    BACKGROUND_MAIN: '#e8f3f4', // Very light teal/blue for page background
    BACKGROUND_CARD: '#ffffff', // Pure white for cards/elements
    BORDER_LIGHT: '#dddddd', // Very light border
    SHADOW_ELEVATION_2: '0 4px 10px rgba(0, 0, 0, 0.15)', // Darker shadow for pronounced lift
};

const ENHANCED_STYLES = {
    ...STYLES_THEME,
    PRIMARY_COLOR: THEME_COLORS.PRIMARY,
    SECONDARY_COLOR: THEME_COLORS.ACCENT,
    BORDER_LIGHT: THEME_COLORS.BORDER_LIGHT,

    // Card styling specifically matching the image
    simpleCard: {
        backgroundColor: THEME_COLORS.BACKGROUND_CARD,
        borderRadius: '15px',
        boxShadow: THEME_COLORS.SHADOW_ELEVATION_2,
        padding: '20px',
        margin: '0 0 0 0',
    },

    // Line item style for the Order Summary Card
    summaryRow: {
        display: 'flex',
        justifyContent: 'space-between',
        padding: '3px 0',
        alignItems: 'center',
    },
    summaryLabel: {
        fontSize: '1em',
        fontWeight: '500',
        color: THEME_COLORS.TEXT_DARK,
        minWidth: '100px',
    },
    summaryValue: {
        fontSize: '1em',
        fontWeight: '700',
        color: THEME_COLORS.TEXT_DARK,
        textAlign: 'right',
    },

    // Line and padding added back for the secondary details section
    notesSection: {
        borderTop: `1px solid ${THEME_COLORS.BORDER_LIGHT}`,
        marginTop: '15px',
        paddingTop: '10px',
    },
};
// ---------------------------------

// --- Configuration Image URL ---
const HEADER_IMAGE_URL = 'https://i.pinimg.com/474x/7a/29/df/7a29dfc903d98c6ba13b687ef1fa1d1a.jpg'; 
// ---------------------------------

// Helper component for the Image Banner (Reusable)
const ListPageBanner = ({ styles, imageUrl }) => {
    const bannerStyle = {
        height: '180px',
        width: '100%',
        marginBottom: '30px',
        borderRadius: `0 0 ${styles.BORDER_RADIUS_SM} ${styles.BORDER_RADIUS_SM}`,
        overflow: 'hidden',
        boxShadow: styles.SHADOW_ELEVATION_1,
    };

    const imageStyle = {
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.7)), url(${imageUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '24px',
    };

    const textStyle = {
        fontSize: '1.8rem',
        fontWeight: '800',
        color: '#ffffff',
        textShadow: '0 1px 4px rgba(0, 0, 0, 0.8)',
        margin: 0,
    };

    return (
        <div style={bannerStyle}>
            <div style={imageStyle}>
                <h1 style={textStyle}>My Active Orders</h1>
            </div>
        </div>
    );
};

// --- COLLAPSIBLE ORDER LIST CARD ---
const OrderListCard = ({ order, orderNumber, handleCancelOrder, styles }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const DetailRow = ({ label, value }) => {
        if (!value || value === 'N/A' || (Array.isArray(value) && value.length === 0)) {
            if (['Type', 'Sugar', 'Notes', 'Add-Ons'].includes(label)) return null;
        }

        return (
            <div style={styles.summaryRow}>
                <span style={styles.summaryLabel}>{label}</span>
                <span style={styles.summaryValue}>{value}</span>
            </div>
        );
    };

    // Status coloring
    const statusColors = {
        'Placed': styles.PRIMARY_COLOR,
        'Making': '#FF9800',
        'Ready': '#4CAF50',
    };
    const statusColor = statusColors[order.status] || '#607D8B';

    return (
        <div style={styles.simpleCard}>
            {/* Order Header - Clickable to expand/collapse */}
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    cursor: 'pointer',
                    padding: '15px',
                    borderRadius: isExpanded ? '15px 15px 0 0' : '15px',
                    backgroundColor: isExpanded ? '#f8f9fa' : '#ffffff',
                    transition: 'all 0.2s ease'
                }}
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <div style={{ flexGrow: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                        <h3 style={{
                            color: styles.SECONDARY_COLOR,
                            margin: '0',
                            fontSize: '1.2rem',
                            fontWeight: '700'
                        }}>
                            Order #{orderNumber}
                        </h3>
                        <span style={{
                            color: statusColor,
                            fontWeight: '700',
                            fontSize: '0.9rem',
                            backgroundColor: `${statusColor}20`,
                            padding: '4px 8px',
                            borderRadius: '12px'
                        }}>
                            {order.status === 'Ready' ? '✅' : (order.status === 'Making' ? '👨‍🍳' : '📋')} {order.status}
                        </span>
                    </div>

                    <div style={{ display: 'flex', gap: '15px', fontSize: '0.9rem', color: '#666' }}>
                        <span>📅 {order.slot.split('(')[0].trim()}</span>
                        <span>🕒 {new Date(order.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        <span>📦 {order.items.length} item{order.items.length !== 1 ? 's' : ''}</span>
                    </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    {order.status === 'Placed' && (
                        <button
                            style={{
                                backgroundColor: '#e74c3c',
                                color: '#ffffff',
                                border: 'none',
                                borderRadius: '8px',
                                padding: '8px 15px',
                                fontSize: '0.9rem',
                                fontWeight: '600',
                                cursor: 'pointer',
                                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                            }}
                            onClick={(e) => {
                                e.stopPropagation();
                                handleCancelOrder(order._id);
                            }}
                            title="Cancel Order"
                        >
                            Cancel
                        </button>
                    )}
                    <span style={{
                        fontSize: '1.2rem',
                        color: '#666',
                        transition: 'transform 0.2s ease',
                        transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)'
                    }}>
                        ▼
                    </span>
                </div>
            </div>

            {/* Expanded Details */}
            {isExpanded && (
                <div style={{
                    padding: '15px',
                    borderTop: '1px solid #eee',
                    backgroundColor: '#f8f9fa'
                }}>
                    <h4 style={{
                        color: styles.PRIMARY_COLOR,
                        margin: '0 0 15px 0',
                        fontSize: '1.1rem',
                        fontWeight: '600'
                    }}>
                        Order Details
                    </h4>

                    {/* Individual Items */}
                    <div>
                        {order.items.map((item, index) => {
                            const locationValue = `${item.location} ${item.tableNo ? `(Table ${item.tableNo})` : ''}`;

                            // Define the data points to be displayed
                            const dataPoints = [
                                { label: "Item", value: `${item.item.charAt(0).toUpperCase() + item.item.slice(1)}` },
                                { label: "Type", value: item.type || 'Standard' },
                                { label: "Sugar", value: item.sugarLevel !== undefined ? item.sugarLevel : 'N/A' },
                                { label: "Quantity", value: item.quantity },
                                { label: "Location", value: locationValue },
                            ];

                            // Define secondary details (Add-Ons/Notes)
                            const secondaryDetails = [
                                { label: "Add-Ons", value: item.selectedAddOns && item.selectedAddOns.length > 0 ? item.selectedAddOns.join(', ') : 'None' },
                                { label: "Notes", value: item.notes || 'None' },
                            ];

                            const hasSecondaryDetails = secondaryDetails.some(d => d.value && d.value !== 'None' && d.value !== 'N/A');

                            return (
                                <div key={index} style={{
                                    backgroundColor: '#ffffff',
                                    borderRadius: '10px',
                                    padding: '15px',
                                    marginBottom: index < order.items.length - 1 ? '10px' : '0',
                                    border: '1px solid #e9ecef',
                                    boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
                                }}>
                                    {/* Primary Details */}
                                    <div>
                                        {dataPoints.map((point, i) => (
                                            <DetailRow
                                                key={i}
                                                label={point.label}
                                                value={point.value}
                                            />
                                        ))}
                                    </div>

                                    {/* Secondary Details (Add-Ons/Notes) */}
                                    {hasSecondaryDetails && (
                                        <div style={styles.notesSection}>
                                            {secondaryDetails.map((point, i) => (
                                                <DetailRow
                                                    key={`sec-${i}`}
                                                    label={point.label}
                                                    value={point.value}
                                                />
                                            ))}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};
// --- END SIMPLE ORDER LIST CARD ---


// Main Component
const UserOrdersListPage = ({ setPage, user, callApi, styles: _propStyles }) => {
    const styles = { ..._propStyles, ...STYLES_THEME, ...ENHANCED_STYLES }; // Merge or ensure access to all necessary theme styles
    const [userOrders, setUserOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchOrders = async () => {
        setLoading(true);
        // Construct query string for authorization data (required for GET requests)
        const queryString = `?userId=${user.id}&userRole=${user.role}`;
        const data = await callApi(`/orders/${user.id}${queryString}`);
        if (data && Array.isArray(data)) {
            // Sort by latest order first
            const sortedData = data.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
            setUserOrders(sortedData);
        }
        setLoading(false);
    };
    
    const handleCancelOrder = async (orderId) => {
        if (window.confirm('⚠️ Are you sure you want to cancel this order?\n\nThis action cannot be undone and your order will be permanently removed.')) {
            const data = await callApi(`/orders/${orderId}`, 'PUT', {
                userId: user.id,
                userRole: user.role,
                action: 'delete' // Backend logic needs to handle this 'delete' action for soft cancellation
            });
            if (data && data.success) {
                alert('✅ Order cancelled successfully!\n\nYour order has been removed from the system.');
                fetchOrders();
            } else {
                  alert('❌ Failed to cancel order.\n\nIt might already be in preparation or there was a server error.');
            }
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    // Remove loading spinner - show content immediately
    // if (loading) return <div style={styles.loadingContainer}><FaSpinner className="spinner" size={30} /> Loading Orders...</div>;

    return (
        <div style={{ ...styles.appContainer, padding: 0 }}>
            
            {/* 1. Header Banner */}
            <ListPageBanner styles={styles} imageUrl={HEADER_IMAGE_URL} />

            <div style={styles.screenPadding}>
                <h3 style={{ ...styles.headerText, color: styles.COLOR_TEXT_DARK, marginTop: 0 }}>
                    My Orders
                </h3>
                <p style={{ color: '#888', fontSize: '0.9em', marginBottom: '20px' }}>
                    <FaExclamationCircle style={{ marginRight: '5px' }} />
                    Viewing {userOrders.length} active order(s). Tap an order to expand details.
                </p>
                
                {/* 2. Enhanced Order List */}
                {userOrders.length === 0 ? (
                    <p style={{
                        textAlign: 'center',
                        color: THEME_COLORS.TEXT_MUTED,
                        padding: '20px',
                        backgroundColor: THEME_COLORS.BACKGROUND_CARD,
                        borderRadius: '10px',
                        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.08)',
                        border: `1px solid ${THEME_COLORS.BORDER_LIGHT}`,
                        margin: '20px 0'
                    }}>
                        😔 No active orders. Ready to place a new one?
                    </p>
                ) : (
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '20px',
                        padding: '20px 0',
                        backgroundColor: THEME_COLORS.BACKGROUND_MAIN
                    }}>
                        {userOrders.map((order, index) => (
                            <OrderListCard
                                key={order._id}
                                order={order}
                                orderNumber={index + 1}
                                handleCancelOrder={handleCancelOrder}
                                styles={styles}
                            />
                        ))}
                    </div>
                )}
                
                {/* Back Button */}
                <button 
                    style={{ ...styles.secondaryButton, marginTop: '30px', marginBottom: '30px' }} 
                    onClick={() => setPage('home')}
                >
                    <FaChevronLeft /> Back to Home
                </button>
            </div>
        </div>
    );
};

export default UserOrdersListPage;