import React, { useState, useEffect } from 'react';
import { FaSpinner, FaChevronLeft, FaMapMarkerAlt, FaCoffee, FaClipboardList, FaClock, FaBoxOpen } from 'react-icons/fa';
import { STYLES_THEME } from './UserHomePage'; // Assuming you expose the theme styles here

// --- ENHANCED STYLES (matching OrderConfirmationPage) ---
const THEME_COLORS = {
    PRIMARY: '#103c7f', // Dark Blue
    ACCENT: '#151615ff', // Green
    TEXT_DARK: '#333333', // Dark text (for labels/values)
    TEXT_MUTED: '#7f8c8d', // Gray for minor details
    DANGER: '#e74c3c', // Red for delete
    BACKGROUND_MAIN: 'white', // Light sea green for page background
    BACKGROUND_CARD: '#e4ebf4ff', // Sea green background for cards
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
        borderRadius: '8px',
        boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
        padding: '5px',
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

const itemImages = {
    'tea': 'https://i.pinimg.com/474x/7a/29/df/7a29dfc903d98c6ba13b687ef1fa1d1a.jpg',
    'coffee': 'https://tmdone-cdn.s3.me-south-1.amazonaws.com/store-covers/133003776906429295.jpg',
    'coldcoffee': 'https://images.unsplash.com/photo-1517705008128-361805f42e86?w=400&h=300&fit=crop',
    'water': 'https://images.stockcake.com/public/d/f/f/dffca756-1b7f-4366-8b89-4ad6f9bbf88a_large/chilled-water-glass-stockcake.jpg',
    'saltwater': 'https://images.unsplash.com/photo-1548839140-29a3df4b0d0a?w=400&h=300&fit=crop',
};
// ---------------------------------

// --- Dynamic Header Image Selector ---
const getDynamicHeaderImage = (orders, selectedOrder = null) => {
    // Priority 1: If a specific order is selected/expanded, use its first item
    if (selectedOrder && selectedOrder.items && selectedOrder.items.length > 0) {
        const firstItem = selectedOrder.items[0].item?.toLowerCase();
        if (firstItem && itemImages[firstItem]) {
            return itemImages[firstItem];
        }
    }

    // Priority 2: If orders exist, use the first item of the most recent order
    if (orders && orders.length > 0) {
        const mostRecentOrder = orders[0]; // Orders are already sorted by timestamp desc
        if (mostRecentOrder.items && mostRecentOrder.items.length > 0) {
            const firstItem = mostRecentOrder.items[0].item?.toLowerCase();
            if (firstItem && itemImages[firstItem]) {
                return itemImages[firstItem];
            }
        }
    }

    // Default fallback
    return itemImages['tea'];
};
// ---------------------------------

// Helper component for the Image Banner (Reusable)
const ListPageBanner = ({ styles, imageUrl, orders, selectedOrder }) => {
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

    // Dynamic banner text based on current selection
    const getBannerText = (orders, selectedOrder = null) => {
        // Priority 1: If a specific order is selected/expanded, use its first item
        if (selectedOrder && selectedOrder.items && selectedOrder.items.length > 0) {
            const firstItem = selectedOrder.items[0].item?.toLowerCase();
            const itemEmojis = {
                'tea': '🍵',
                'coffee': '☕', 
                'water': '💧'
            };
            const emoji = itemEmojis[firstItem] || '🍽️';
            return `Your ${firstItem} ${emoji} is being prepared!`;
        }

        // Priority 2: If orders exist, use the first item of the most recent order
        if (orders && orders.length > 0) {
            const mostRecentOrder = orders[0];
            if (mostRecentOrder.items && mostRecentOrder.items.length > 0) {
                const firstItem = mostRecentOrder.items[0].item?.toLowerCase();
                const itemEmojis = {
                    'tea': '🍵',
                    'coffee': '☕',
                    'water': '💧'
                };
                const emoji = itemEmojis[firstItem] || '🍽️';
                return `Your latest ${firstItem} ${emoji} order!`;
            }
        }

        // Default fallback
        return "Ready to order something delicious?";
    };

    return (
        <div style={bannerStyle}>
            <div style={imageStyle}>
                <h1 style={textStyle}>{getBannerText(orders, selectedOrder)}</h1>
            </div>
        </div>
    );
};

// --- COLLAPSIBLE ORDER LIST CARD ---
const OrderListCard = ({ order, orderNumber, handleCancelOrder, styles, setSelectedOrder, isSelected }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const handleCardClick = () => {
        const newExpandedState = !isExpanded;
        setIsExpanded(newExpandedState);
        
        // Update selected order for header image
        if (newExpandedState) {
            setSelectedOrder(order);
        } else {
            setSelectedOrder(null);
        }
    };

    const firstItem = order.items[0];
    const itemImage = itemImages[firstItem.item.toLowerCase()] || itemImages['tea'];

    // Helper function to format date and time nicely
    const formatDateTime = (timestamp) => {
        const date = new Date(timestamp);
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        // Check if it's today
        if (date.toDateString() === today.toDateString()) {
            return `Today, ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
        }
        // Check if it's yesterday
        else if (date.toDateString() === yesterday.toDateString()) {
            return `Yesterday, ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
        }
        // For other days, show full date
        else {
            return `${date.toLocaleDateString([], { 
                month: 'short', 
                day: 'numeric' 
            })}, ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
        }
    };

    const DetailRow = ({ label, value }) => {
        if (value === 'N/A' || (Array.isArray(value) && value.length === 0)) {
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
        <div style={{
            ...styles.simpleCard,
            border: isSelected ? `2px solid ${styles.PRIMARY_COLOR}` : 'none',
            transform: isSelected ? 'scale(1.02)' : 'scale(1)',
            transition: 'all 0.3s ease'
        }}>
            {/* Order Header - Clickable to expand/collapse */}
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    cursor: 'pointer',
                    padding: '10px',
                    borderRadius: isExpanded ? '8px 8px 0 0' : '8px',
                    backgroundColor: isExpanded ? '#f8f9fa' : '#ffffff',
                    transition: 'all 0.2s ease'
                }}
                onClick={handleCardClick}
            >
                <img
                    src={itemImage}
                    alt={firstItem.item}
                    style={{
                        width: '50px',
                        height: '50px',
                        borderRadius: '50%',
                        objectFit: 'cover',
                        border: '2px solid #ddd'
                    }}
                />
                <div style={{ flex: 1 }}>
                    <h3 style={{
                        color: styles.SECONDARY_COLOR,
                        margin: '0 0 5px 0',
                        fontSize: '1.1rem',
                        fontWeight: '700'
                    }}>
                        {firstItem.item.charAt(0).toUpperCase() + firstItem.item.slice(1)}
                    </h3>
                    <div style={{ display: 'flex', gap: '15px', fontSize: '0.8rem', color: '#666' }}>
                        <span><FaClock style={{ marginRight: '3px' }} /> {formatDateTime(order.timestamp)}</span>
                        <span><FaBoxOpen style={{ marginRight: '3px' }} /> {order.items.length} item{order.items.length !== 1 ? 's' : ''}</span>
                    </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px' }}>
                    <span style={{
                        color: statusColor,
                        fontWeight: '700',
                        fontSize: '0.8rem',
                        backgroundColor: `${statusColor}20`,
                        padding: '4px 8px',
                        borderRadius: '12px'
                    }}>
                        {order.status === 'Ready' ? '✅' : (order.status === 'Making' ? '👨‍🍳' : '📋')} {order.status}
                    </span>


                    {/* Cancel Button - Only show for Placed orders */}
                    {order.status === 'Placed' && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation(); // Prevent card expansion
                                handleCancelOrder(order._id);
                            }}
                            style={{
                                backgroundColor: '#e74c3c',
                                color: 'white',
                                border: 'none',
                                padding: '4px 12px 4px 12px',
                                borderRadius: '12px',
                                fontSize: '0.8rem',
                                fontWeight: '700',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                                minWidth: '70px'
                            }}
                            onMouseOver={(e) => {
                                e.target.style.backgroundColor = '#c0392b';
                                e.target.style.transform = 'translateY(-1px)';
                            }}
                            onMouseOut={(e) => {
                                e.target.style.backgroundColor = '#e74c3c';
                                e.target.style.transform = 'translateY(0)';
                            }}
                        >
                            Cancel
                        </button>
                    )}

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
                            const renderLocation = () => {
                                const loc = item.location;
                                const table = item.tableNo ? `(Table ${item.tableNo})` : '';
                                if (loc && loc.startsWith('Seat_')) {
                                    const seatNum = loc.substring(5);
                                    return (
                                        <>
                                            <span style={{
                                                display: 'inline-block',
                                                backgroundColor: '#4CAF50',
                                                color: 'white',
                                                borderRadius: '50%',
                                                width: '20px',
                                                height: '20px',
                                                textAlign: 'center',
                                                lineHeight: '20px',
                                                fontSize: '0.7rem',
                                                fontWeight: 'bold',
                                                marginRight: '6px'
                                            }}>
                                                {seatNum}
                                            </span>
                                            {loc} {table}
                                        </>
                                    );
                                }
                                return <>{loc} {table}</>;
                            };

                            // Define the data points to be displayed
                            const dataPoints = [
                                { label: "Item", value: `${item.item.charAt(0).toUpperCase() + item.item.slice(1)}` },
                                { label: "Type", value: item.type || 'Standard' },
                                { label: "Sugar", value: item.sugarLevel !== undefined ? item.sugarLevel : 'N/A' },
                                { label: "Quantity", value: item.quantity },
                                { label: "Ordered", value: formatDateTime(order.timestamp) },
                                { label: "Location", value: renderLocation() },
                            ];

                            // Define secondary details (Add-Ons/Notes)
                            const secondaryDetails = [
                                { label: "Add-Ons", value: item.selectedAddOns && item.selectedAddOns.length > 0 ? item.selectedAddOns.join(', ') : 'None' },
                                { label: "Notes", value: item.notes || 'None' },
                            ];

                            const hasSecondaryDetails = secondaryDetails.some(d => d.value && d.value !== 'None' && d.value !== 'N/A');

                            return (
                                <div key={index} style={{
                                    backgroundColor: '#f8f9fa',
                                    borderRadius: '10px',
                                    padding: '15px',
                                    marginBottom: index < order.items.length - 1 ? '10px' : '0',
                                    border: '1px solid #e0e0e0',
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
    const [selectedOrder, setSelectedOrder] = useState(null); // Track currently expanded/selected order

    const fetchOrders = async () => {
        // Fetch fresh data in background
        try {
            // Construct query string for authorization data (required for GET requests)
            const queryString = `?userId=${user.id}&userRole=${user.role}`;
            const data = await callApi(`/orders/${user.id}${queryString}`, 'GET', null, true);
            if (data && Array.isArray(data)) {
                // Sort by latest order first
                const sortedData = data.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
                setUserOrders(sortedData);
                // Cache the data
                localStorage.setItem(`cachedOrders_${user.id}`, JSON.stringify(sortedData));
            }
        } catch (error) {
            console.warn('Failed to fetch orders:', error);
            // Try to load from cache
            const cachedOrders = localStorage.getItem(`cachedOrders_${user.id}`);
            if (cachedOrders) {
                try {
                    const parsedOrders = JSON.parse(cachedOrders);
                    setUserOrders(parsedOrders);
                } catch (e) {
                    console.warn('Failed to parse cached orders:', e);
                }
            }
        }
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
        // Load cached orders immediately for instant display
        const loadCachedOrders = () => {
            const cachedOrders = localStorage.getItem(`cachedOrders_${user.id}`);
            if (cachedOrders) {
                try {
                    const parsedOrders = JSON.parse(cachedOrders);
                    if (Array.isArray(parsedOrders)) {
                        const sortedData = parsedOrders.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
                        setUserOrders(sortedData);
                        return true;
                    }
                } catch (e) {
                    console.warn('Failed to parse cached orders:', e);
                }
            }
            return false;
        };

        // Set empty orders first for immediate display
        if (!loadCachedOrders()) {
            setUserOrders([]);
        }

        // Fetch fresh data in background
        fetchOrders();
    }, []);

    // Remove loading spinner - show content immediately
    // if (loading) return <div style={styles.loadingContainer}><FaSpinner className="spinner" size={30} /> Loading Orders...</div>;

    return (
        <div style={styles.centeredContainer}>
            <div style={styles.screenPadding}>

                {/* 1. Header Banner */}
                <ListPageBanner 
                    styles={styles} 
                    imageUrl={getDynamicHeaderImage(userOrders, selectedOrder)} 
                    orders={userOrders} 
                    selectedOrder={selectedOrder}
                />

                <div style={styles.contentArea}>
                <h3 style={{ ...styles.headerText, color: styles.COLOR_TEXT_DARK, marginTop: 0, textAlign: 'center' }}>
                    Your Delicious Orders
                </h3>
                <p style={{ color: '#555', fontSize: '0.9em', marginBottom: '20px', textAlign: 'center' }}>
                    <FaClipboardList style={{ marginRight: '5px' }} />
                    Viewing {userOrders.length} order(s). Tap an order to expand details.
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
                        gap: '15px',
                        padding: '10px 0',
                        backgroundColor: THEME_COLORS.BACKGROUND_MAIN
                    }}>
                        {userOrders.map((order, index) => (
                            <OrderListCard
                                key={order._id}
                                order={order}
                                orderNumber={index + 1}
                                handleCancelOrder={handleCancelOrder}
                                styles={styles}
                                setSelectedOrder={setSelectedOrder}
                                isSelected={selectedOrder?._id === order._id}
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
        </div>
    );
};

export default UserOrdersListPage;