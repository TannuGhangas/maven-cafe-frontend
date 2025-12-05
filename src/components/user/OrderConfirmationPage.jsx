import React, { useState } from 'react';
import { FaTrash, FaEdit, FaCheckCircle, FaPlus, FaExclamationTriangle } from 'react-icons/fa';
import { ALL_LOCATIONS_MAP, getAllowedLocations, USER_LOCATIONS_DATA } from '../../config/constants';
import '../../styles/OrderConfirmationPage.css';

// --- Configuration Image URL ---
const HEADER_IMAGE_URL = 'https://png.pngtree.com/thumb_back/fh260/background/20240614/pngtree-cup-of-tea-and-a-bouquet-of-white-flowering-jasmine-image_15754628.jpg'; 
// ---------------------------------

// --- STYLES UPDATED ---
const THEME_COLORS = {
    PRIMARY: '#103c7f', // Dark Blue
    ACCENT: '#a1db40', // Green
    TEXT_DARK: '#333333', // Dark text (for labels/values)
    TEXT_MUTED: '#7f8c8d', // Gray for minor details
    DANGER: '#e74c3c', // Red for delete
    // Colors matching the image environment
    BACKGROUND_MAIN: '#e8f3f4', // Very light teal/blue for page background (based on image)
    BACKGROUND_CARD: '#ffffff', // Pure white for cards/elements (as in image)
    BORDER_LIGHT: '#dddddd', // Very light border
    SHADOW_ELEVATION_2: '0 4px 10px rgba(0, 0, 0, 0.15)', // Darker shadow for pronounced lift
};

const ENHANCED_STYLES = {
    PRIMARY_COLOR: THEME_COLORS.PRIMARY,
    SECONDARY_COLOR: THEME_COLORS.ACCENT,
    
    // Layout
appContainer: {
    maxWidth: '480px',
    margin: '0 auto',
    backgroundColor: THEME_COLORS.BACKGROUND_MAIN,
    minHeight: '100vh',
    padding: '15px 0',
},

    // Buttons (Kept for functionality, styles are same)
    primaryButton: {
        padding: '15px 25px',
        backgroundColor: THEME_COLORS.ACCENT, 
        color: THEME_COLORS.TEXT_DARK,
        border: 'none',
        borderRadius: '8px',
        fontSize: '1.1rem',
        fontWeight: '700',
        cursor: 'pointer',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '10px',
        boxShadow: THEME_COLORS.SHADOW_ELEVATION_2,
        transition: 'all 0.2s ease',
        marginTop: '20px',
    },
    secondaryButton: {
        padding: '12px 25px',
        backgroundColor: THEME_COLORS.PRIMARY, 
        color: '#ffffff', 
        border: 'none',
        borderRadius: '8px',
        fontSize: '1rem',
        fontWeight: '600',
        cursor: 'pointer',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '10px',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.08)',
        transition: 'all 0.2s ease',
        marginTop: '15px',
    },

    // Card styling specifically matching the image
    simpleCard: {
        backgroundColor: THEME_COLORS.BACKGROUND_CARD, 
        borderRadius: '15px', 
        boxShadow: THEME_COLORS.SHADOW_ELEVATION_2, 
        padding: '20px',
        // ADJUSTED: Removed bottom margin, will be controlled by list container spacing
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
        // ADDED LINE: Separator above Add-Ons/Notes
        borderTop: `1px solid ${THEME_COLORS.BORDER_LIGHT}`,
        marginTop: '15px',
        paddingTop: '10px',
    },

    // Action Buttons in Card (Only icons)
    actionButton: {
        backgroundColor: 'transparent',
        color: THEME_COLORS.PRIMARY,
        border: 'none',
        padding: '0 5px',
        fontSize: '1.0em',
        cursor: 'pointer',
        transition: 'color 0.2s',
        flexShrink: 0,
    },
    // Style for the main "Order Summary" header
    mainHeader: {
        fontSize: '1.2rem', 
        fontWeight: '700', 
        color: THEME_COLORS.TEXT_DARK, 
        margin: '0 0 10px 0',
    }
};
// ---------------------------------


// Helper component for the image banner
const ConfirmationBanner = ({ styles, imageUrl }) => {
    const bannerStyle = {
        height: '180px', 
        width: '90%',
        margin: '0 auto 25px auto',
        borderRadius: '15px', 
        overflow: 'hidden',
        boxShadow: THEME_COLORS.SHADOW_ELEVATION_2,
        position: 'relative',
        backgroundColor: '#2c3e50', 
    };

    const imageStyle = {
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.5)), url(${imageUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        color: '#ffffff', 
    };

const textStyle = {
fontSize: '1.8rem',
fontWeight: '800',
margin: '0',
color: '#ffffff',
textShadow: '0 3px 6px rgba(0, 0, 0, 0.9)',
};

const subtitleStyle = {
fontSize: '1.1rem',
fontWeight: '500',
margin: '8px 0 0 0',
color: 'rgba(255, 255, 255, 0.95)',
textShadow: '0 2px 4px rgba(0, 0, 0, 0.8)',
};

const checkIconStyle = {
        backgroundColor: '#ffffff',
color: THEME_COLORS.PRIMARY,
width: '70px',
height: '70px',
borderRadius: '50%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
fontSize: '2.2em',
position: 'absolute',
        // Centering the tick icon visually
top: '35%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
boxShadow: THEME_COLORS.SHADOW_ELEVATION_2,
border: `3px solid ${THEME_COLORS.ACCENT}`,
};

return (
<div style={bannerStyle}>
<div style={imageStyle}>
                <div style={{ position: 'absolute', bottom: '20px', left: '50%', transform: 'translateX(-50%)', textAlign: 'center' }}>
<p style={textStyle}>Ready to Order?</p>
<p style={subtitleStyle}>Review your items below</p>
                </div>
</div>
</div>
);
};


// --- Custom Order Confirmed Modal (Improved Design) ---
const OrderConfirmedModal = ({ styles, onClose }) => {
    const modalOverlayStyle = {
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.7)', display: 'flex',
        justifyContent: 'center', alignItems: 'center', zIndex: 1000,
    };

    const modalContentStyle = {
        backgroundColor: THEME_COLORS.BACKGROUND_CARD,
        borderRadius: '25px',
        width: '90%',
        maxWidth: '400px',
        padding: '40px 30px',
        textAlign: 'center',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4)',
        color: THEME_COLORS.TEXT_DARK,
        border: `3px solid ${THEME_COLORS.ACCENT}`,
    };

    const checkIconStyle = {
        backgroundColor: THEME_COLORS.ACCENT,
        color: THEME_COLORS.PRIMARY,
        width: '80px',
        height: '80px',
        fontSize: '3em',
        borderRadius: '50%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        margin: '0 auto 25px auto',
        boxShadow: '0 4px 15px rgba(161, 219, 64, 0.4)',
        border: `4px solid ${THEME_COLORS.PRIMARY}`,
    };

    const titleStyle = {
        fontSize: '2rem',
        fontWeight: '900',
        marginBottom: '15px',
        color: THEME_COLORS.PRIMARY,
        textShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
    };

    const messageStyle = {
        fontSize: '1.1rem',
        fontWeight: '500',
        color: THEME_COLORS.TEXT_MUTED,
        marginBottom: '30px',
        lineHeight: '1.5',
    };

    return (
        <div style={modalOverlayStyle} onClick={onClose}>
            <div style={modalContentStyle} onClick={(e) => e.stopPropagation()}>
                <div style={checkIconStyle}>
                    <FaCheckCircle />
                </div>
                <h2 style={titleStyle}>🎉 Order Confirmed!</h2>
                <p style={messageStyle}>Your order has been successfully placed and will be prepared shortly.</p>

                <button
                    style={{
                        ...styles.primaryButton,
                        backgroundColor: THEME_COLORS.ACCENT,
                        color: THEME_COLORS.TEXT_DARK,
                        border: `2px solid ${THEME_COLORS.ACCENT}`,
                        marginTop: '0',
                        fontSize: '1.1rem',
                        fontWeight: '700',
                        padding: '15px 30px',
                        borderRadius: '15px',
                        boxShadow: `0 6px 20px ${THEME_COLORS.ACCENT}50`,
                        transition: 'all 0.3s ease',
                    }}
                    onClick={onClose}
                    onMouseOver={(e) => {
                        e.target.style.transform = 'translateY(-2px)';
                        e.target.style.boxShadow = `0 8px 25px ${THEME_COLORS.ACCENT}60`;
                    }}
                    onMouseOut={(e) => {
                        e.target.style.transform = 'translateY(0)';
                        e.target.style.boxShadow = `0 6px 20px ${THEME_COLORS.ACCENT}50`;
                    }}
                >
                    Back to Home 🍽️
                </button>
            </div>
        </div>
    );
};
// --- END Custom Order Confirmed Modal ---

// --- Custom Network Error Modal ---
const NetworkErrorModal = ({ styles, onClose }) => {
    const modalOverlayStyle = {
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.9)', display: 'flex',
        justifyContent: 'center', alignItems: 'center', zIndex: 9999,
    };

    const modalContentStyle = {
        backgroundColor: THEME_COLORS.BACKGROUND_CARD,
        borderRadius: '25px',
        width: '90%',
        maxWidth: '400px',
        padding: '40px 30px',
        textAlign: 'center',
        boxShadow: '0 20px 40px rgba(231, 76, 60, 0.4)',
        color: THEME_COLORS.TEXT_DARK,
        border: `3px solid ${THEME_COLORS.DANGER}`,
        transition: 'all 0.3s ease',
    };

    const errorIconStyle = {
        backgroundColor: THEME_COLORS.DANGER,
        color: '#ffffff',
        width: '80px',
        height: '80px',
        fontSize: '3em',
        borderRadius: '50%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        margin: '0 auto 25px auto',
        boxShadow: '0 4px 15px rgba(231, 76, 60, 0.4)',
        border: `4px solid #ffffff`,
    };

    const titleStyle = {
        fontSize: '2rem',
        fontWeight: '900',
        marginBottom: '15px',
        color: THEME_COLORS.DANGER,
        textShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
    };

    const messageStyle = {
        fontSize: '1.1rem',
        fontWeight: '500',
        color: THEME_COLORS.TEXT_MUTED,
        marginBottom: '30px',
        lineHeight: '1.5',
    };

    return (
        <div style={modalOverlayStyle} onClick={onClose}>
            <div style={modalContentStyle} onClick={(e) => e.stopPropagation()}>
                <div style={errorIconStyle}>
                    <FaExclamationTriangle />
                </div>
                <h2 style={titleStyle}>Network Error</h2>
                <p style={messageStyle}>Unable to place order due to network connectivity problems. Please check your connection and try again.</p>

                <button
                    style={{
                        ...styles.primaryButton,
                        backgroundColor: THEME_COLORS.PRIMARY,
                        color: '#ffffff',
                        border: `2px solid ${THEME_COLORS.PRIMARY}`,
                        marginTop: '0',
                        fontSize: '1.1rem',
                        fontWeight: '700',
                        padding: '15px 30px',
                        borderRadius: '15px',
                        boxShadow: `0 6px 20px ${THEME_COLORS.PRIMARY}50`,
                        transition: 'all 0.3s ease',
                    }}
                    onClick={onClose}
                    onMouseOver={(e) => {
                        e.target.style.transform = 'translateY(-2px)';
                        e.target.style.boxShadow = `0 8px 25px ${THEME_COLORS.PRIMARY}60`;
                    }}
                    onMouseOut={(e) => {
                        e.target.style.transform = 'translateY(0)';
                        e.target.style.boxShadow = `0 6px 20px ${THEME_COLORS.PRIMARY}50`;
                    }}
                >
                    Retry Order 🔄
                </button>
            </div>
        </div>
    );
};
// --- END Network Error Modal ---


// --- Component for individual Item details using image style ---
const OrderSummaryCard = ({ item, styles, index, setPage, handleDelete, defaultLocationName }) => {
    
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
    }
    
    const locationValue = `${item.location === 'Others' ? defaultLocationName : (ALL_LOCATIONS_MAP[item.location] || item.location)} ${item.tableNo ? `(Table ${item.tableNo})` : ''}`;
    
    // Helper function to format date and time for order items
    const formatOrderDateTime = (timestamp) => {
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

    // Define the data points to be displayed (Primary details first)
    const dataPoints = [
        { label: "Item", value: `${item.item.charAt(0).toUpperCase() + item.item.slice(1)}` },
        { label: "Type", value: item.type || 'Standard' },
        { label: "Sugar", value: item.sugarLevel !== undefined ? item.sugarLevel : 'N/A' },
        { label: "Quantity", value: item.quantity },
        { label: "Ordered", value: formatOrderDateTime(item.timestamp || Date.now()) },
        { label: "Location", value: locationValue },
    ];
    
    // Define secondary details (Add-Ons/Notes)
    const secondaryDetails = [
        { label: "Add-Ons", value: item.selectedAddOns && item.selectedAddOns.length > 0 ? item.selectedAddOns.join(', ') : 'None' },
        { label: "Notes", value: item.notes || 'None' },
    ];
    
    const hasSecondaryDetails = secondaryDetails.some(d => d.value && d.value !== 'None' && d.value !== 'N/A');

    return (
        // The list item spacing is now handled by the outer container (OrderConfirmationPage)
        <div style={styles.simpleCard}>
            
            {/* --- Main Item Details and Actions --- */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ flexGrow: 1 }}>
                    
                    {/* Primary Details (No line separation) */}
                    <div>
                        {dataPoints.map((point, i) => (
                            <DetailRow 
                                key={i}
                                label={point.label} 
                                value={point.value}
                            />
                        ))}
                    </div>
                    
                    {/* Secondary Details (Add-Ons/Notes) - Now includes the top line */}
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
                
                {/* Action Buttons (Edit/Delete) */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', marginLeft: '10px' }}>
                    <button 
                        style={{...styles.actionButton, color: THEME_COLORS.PRIMARY}} 
                        onClick={() => setPage(`item-config-edit-${index}-${item.item}`)}
                        title="Edit Item"
                    >
                        <FaEdit />
                    </button>
                    <button 
                        style={{...styles.actionButton, color: THEME_COLORS.DANGER, marginTop: '5px'}} 
                        onClick={() => handleDelete(index)}
                        title="Remove Item"
                    >
                        <FaTrash />
                    </button>
                </div>
            </div>
            
        </div>
    );
}


// --- Main Order Confirmation Component ---
const OrderConfirmationPage = ({ setPage, currentOrder, setCurrentOrder, user, callApi, styles: propStyles }) => {
const styles = ENHANCED_STYLES;

const [showSuccessModal, setShowSuccessModal] = useState(false);
const [showNetworkErrorModal, setShowNetworkErrorModal] = useState(false);

// Calculate user's default location
const userLocations = USER_LOCATIONS_DATA;
const currentUser = userLocations.find(u => u.name === user.name) || userLocations[0];
const allowedLocations = currentUser ? getAllowedLocations(currentUser.location, currentUser.access) : [];
const defaultLocationKey = allowedLocations[0]?.key || user.location || 'Others';
const defaultLocationName = allowedLocations.find(loc => loc.key === defaultLocationKey)?.name || ALL_LOCATIONS_MAP[defaultLocationKey] || defaultLocationKey;
    
    const handleDelete = (index) => {
        const newItems = currentOrder.items.filter((_, i) => i !== index);
        setCurrentOrder(prev => ({ ...prev, items: newItems }));
        if (newItems.length === 0) setPage('home');
    };
    
const handleProceed = async () => {
    if (currentOrder.items.length === 0) {
        alert("Your order is empty. Add items before placing the order.");
        return;
    }

    try {
        const orderData = {
            userId: parseInt(user.id), // Ensure it's a number
            userName: user.name,
            slot: currentOrder.slot,
            items: currentOrder.items,
            userRole: user.role,
        };

        console.log('Placing order with data:', orderData);
        console.log('User object:', user);
        console.log('Current order:', currentOrder);

        // Actually call the API to place the order
        const data = await callApi('/orders', 'POST', orderData, true);

        console.log('Order API response:', data);

        if (data && data.success) {
            setShowSuccessModal(true);
        } else {
            console.log('Showing network error modal from else');
            setShowNetworkErrorModal(true);
        }
    } catch (error) {
        console.error('Order placement error:', error);
        console.log('Showing network error modal');
        setShowNetworkErrorModal(true);
    }
};
    
const handleModalClose = () => {
    setShowSuccessModal(false);
    setCurrentOrder(prev => ({ ...prev, items: [] }));
    setPage('home');
}

const handleNetworkErrorClose = () => {
    setShowNetworkErrorModal(false);
}
    
    const slotName = currentOrder.items.length; 
    
    return (
        <div style={{ ...styles.appContainer }}>
            
{showSuccessModal && (
    <OrderConfirmedModal
        styles={styles}
        onClose={handleModalClose}
    />
)}

{showNetworkErrorModal && (
    <NetworkErrorModal
        styles={styles}
        onClose={handleNetworkErrorClose}
    />
)}
            
            <ConfirmationBanner 
                slot={slotName} 
                styles={styles} 
                imageUrl={HEADER_IMAGE_URL} 
            />

            {/* Order Summary Header (New card to match the image spacing/look) */}
            <div style={{ 
                backgroundColor: THEME_COLORS.BACKGROUND_CARD, 
                borderRadius: '15px 15px 0 0', 
                boxShadow: THEME_COLORS.SHADOW_ELEVATION_2,
                padding: '15px 20px', 
                margin: '0 15px 0 15px', 
                borderBottom: `1px solid ${THEME_COLORS.BORDER_LIGHT}`
            }}>
                <h3 style={styles.mainHeader}>
                    Order Summary
                </h3>
            </div>


            <div style={{padding: '0 15px'}}>
                
                {currentOrder.items.length === 0 ? (
                    <p style={{ 
                        textAlign: 'center', 
                        color: THEME_COLORS.TEXT_MUTED, 
                        padding: '20px', 
                        backgroundColor: THEME_COLORS.BACKGROUND_CARD, 
                        borderRadius: '10px', 
                        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.08)',
                        border: `1px solid ${THEME_COLORS.BORDER_LIGHT}` 
                    }}>
                        😔 No items added yet. Click "Add More Items" below to start.
                    </p>
                ) : (
                    <div style={{ 
                        // Fix the top margin so it butts up against the header card visually
                        marginTop: '-1px', 
                        // Set the bottom border radius for the list container
                        borderRadius: '0 0 15px 15px',
                        overflow: 'hidden',
                        // ADDED GAP: Use flex/gap to space cards evenly (if supported) or use padding
                        display: 'flex',
                        flexDirection: 'column',
                        // Add spacing between cards here instead of using margin-bottom in simpleCard
                        gap: '20px', 
                        padding: '20px 0', // Add padding to the top and bottom of the list
                        backgroundColor: THEME_COLORS.BACKGROUND_MAIN // Ensure background shows between cards
                    }}>
{currentOrder.items.map((item, index) => (
    <OrderSummaryCard
        key={index}
        item={item}
        styles={styles}
        index={index}
        setPage={setPage}
        handleDelete={handleDelete}
        defaultLocationName={defaultLocationName}
    />
))}
                    </div>
                )}
                

                <div style={{ marginTop: '30px' }}>
                    {/* Primary Action - Green Accent */}
                    <button style={styles.primaryButton} onClick={handleProceed} disabled={currentOrder.items.length === 0}>
                        <FaCheckCircle /> Proceed & Place Order
                    </button>
                    {/* Secondary Action - Dark Blue Primary */}
                    <button 
                        style={styles.secondaryButton} 
                        onClick={() => setPage('home')} 
                    >
                        <FaPlus /> Add More Items
                    </button>
                </div>
            </div>
        </div>
    );
};

export default OrderConfirmationPage;
