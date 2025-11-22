// src/components/user/OrderConfirmationPage.jsx

import React, { useState } from 'react'; // <--- 1. Import useState
import { FaTrash, FaEdit, FaCheckCircle, FaPlus } from 'react-icons/fa';

// --- Configuration Image URL ---
// 🔑 Placeholder for the Confirmation Banner image (you can update this URL)
const HEADER_IMAGE_URL = 'https://png.pngtree.com/thumb_back/fh260/background/20240614/pngtree-cup-of-tea-and-a-bouquet-of-white-flowering-jasmine-image_15754628.jpg'; 
// ---------------------------------

// Helper component for the image banner (Confirmation Style)
const ConfirmationBanner = ({ slot, styles, imageUrl }) => {
    const bannerStyle = {
        height: '160px',
        width: '100%',
        marginBottom: '25px',
        borderRadius: '0 0 16px 16px', 
        overflow: 'hidden',
        boxShadow: '0 5px 15px rgba(0, 0, 0, 0.1)',
        position: 'relative',
        backgroundColor: styles.PRIMARY_COLOR, // Fallback color
    };

    const imageStyle = {
        // Apply a gradient to make text pop and use the image
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.7)), url(${imageUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '15px 20px',
    };

    const textStyle = {
        fontSize: '1.7rem',
        fontWeight: '900',
        color: '#ffffff',
        textShadow: '0 1px 4px rgba(0, 0, 0, 0.8)',
        margin: '5px 0',
    };
    
    const subTextStyle = {
        fontSize: '1.0rem',
        fontWeight: '500',
        color: 'rgba(255, 255, 255, 0.85)',
        textShadow: '0 1px 2px rgba(0, 0, 0, 0.8)',
    };

    return (
        <div style={bannerStyle}>
            <div style={imageStyle}>
                <div style={{ ...styles.circularCheck, backgroundColor: 'white', color: styles.PRIMARY_COLOR, width: '40px', height: '40px', fontSize: '1.5em' }}>
                    <FaCheckCircle />
                </div>
                <p style={subTextStyle}>Reviewing Order for:</p>
                <h1 style={textStyle}>{slot}</h1>
            </div>
        </div>
    );
};

// --- NEW COMPONENT: Custom Order Confirmed Modal ---
const OrderConfirmedModal = ({ styles, onClose }) => {
    const primaryGreen = '#4CAF50'; // Use a strong green for the confirmation box

    const modalOverlayStyle = {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.6)', // Dark, semi-transparent background
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
    };

    const modalContentStyle = {
        backgroundColor: primaryGreen,
        borderRadius: '20px',
        width: '90%',
        maxWidth: '350px',
        padding: '30px 20px',
        textAlign: 'center',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
        color: 'white',
    };

    const checkIconStyle = {
        ...styles.circularCheck, 
        backgroundColor: 'white', 
        color: primaryGreen, 
        width: '60px', 
        height: '60px', 
        fontSize: '2.5em',
        margin: '0 auto 20px auto',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
    };

    const titleStyle = {
        fontSize: '1.8rem',
        fontWeight: '900',
        marginBottom: '10px',
        textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)',
    };

    const messageStyle = {
        fontSize: '1.0rem',
        fontWeight: '400',
        color: 'rgba(255, 255, 255, 0.9)',
        marginBottom: '20px',
    };

    return (
        <div style={modalOverlayStyle} onClick={onClose}>
            <div style={modalContentStyle} onClick={(e) => e.stopPropagation()}>
                <div style={checkIconStyle}>
                    <FaCheckCircle />
                </div>
                <h2 style={titleStyle}>Order Confirmed!</h2>
                <p style={messageStyle}>Your order has been successfully placed</p>
                
                {/* Optional: Add a button to close the modal and go home */}
                <button 
                    style={{
                        ...styles.primaryButton,
                        backgroundColor: 'white',
                        color: primaryGreen,
                        border: `2px solid white`,
                        marginTop: '15px',
                    }}
                    onClick={onClose}
                >
                    Continue
                </button>
            </div>
        </div>
    );
};
// --- END NEW COMPONENT ---


// Main Component
const OrderConfirmationPage = ({ setPage, currentOrder, setCurrentOrder, user, callApi, styles }) => {
    // 2. Add local state to control the modal visibility
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    
    const handleDelete = (index) => {
        const newItems = currentOrder.items.filter((_, i) => i !== index);
        setCurrentOrder(prev => ({ ...prev, items: newItems }));
        // If the last item is deleted, go back to item selection
        if (newItems.length === 0) setPage('item-selection');
    };
    
    const handleProceed = async () => {
        // Basic check to prevent placing empty order
        if (currentOrder.items.length === 0) {
            // Keep the alert for the specific error, or replace with an error toast/modal
            alert("Your order is empty. Add items before placing the order."); 
            return;
        }

        const orderData = {
            userId: user.id,        
            userName: user.name,
            slot: currentOrder.slot, // Contains clean slot name (e'g., 'morning')
            items: currentOrder.items,
            userRole: user.role, 
        };

        const data = await callApi('/orders', 'POST', orderData);
        if (data && data.success) {
            // 3. CHANGE: Show the custom modal instead of native alert
            setShowSuccessModal(true); 
            // The state reset and page change are now handled by the modal's onClose callback
        } else {
            // Keep the native alert for failure (for simplicity) or replace with a custom error modal/toast
            alert('Failed to place order. Please try again.'); 
        }
    };
    
    // Function to handle modal closing and state reset
    const handleModalClose = () => {
        setShowSuccessModal(false);
        // Reset the order state
        setCurrentOrder(prev => ({ ...prev, items: [] })); // Keep the slot, just clear items
        setPage('home'); // Go back to home page
    }
    
    // Determine the slot name for the banner (capitalized clean name)
    const slotName = currentOrder.slot.charAt(0).toUpperCase() + currentOrder.slot.slice(1);
    
    // Style for content area padding
    const contentPaddingStyle = {
        padding: '0 20px', 
        paddingBottom: '20px', // Added bottom padding to space out last button
    };
    
    const itemDetailStyle = { 
        display: 'block', 
        color: '#666', 
        fontSize: '0.9em',
        marginTop: '2px',
    };


    return (
        <div style={{ ...styles.appContainer, padding: '0' }}>
            
            {/* 4. Render the Modal when showSuccessModal is true */}
            {showSuccessModal && (
                <OrderConfirmedModal 
                    styles={styles} 
                    onClose={handleModalClose} 
                />
            )}
            {/* Header Banner */}
            <ConfirmationBanner 
                slot={slotName} 
                styles={styles} 
                imageUrl={HEADER_IMAGE_URL} 
            />

            <div style={contentPaddingStyle}>
                <h3 style={{ 
                    fontSize: '1.2rem', 
                    fontWeight: '700', 
                    color: styles.SECONDARY_COLOR, 
                    marginBottom: '15px' 
                }}>
                    Your Items ({currentOrder.items.length})
                </h3>
                
                {currentOrder.items.length === 0 ? (
                    <p style={{ textAlign: 'center', color: '#888', padding: '20px', backgroundColor: '#fff', borderRadius: '10px' }}>
                        No items added yet. Click "Add More Items" to start.
                    </p>
                ) : (
                    <div style={styles.listContainer}>
                        {currentOrder.items.map((item, index) => (
                            <div key={index} style={styles.orderItemCard}>
                                <div style={{ flexGrow: 1 }}>
                                    <strong>{item.quantity}x {item.type} {item.item.charAt(0).toUpperCase() + item.item.slice(1)}</strong>
                                    
                                    <small style={itemDetailStyle}>
                                        To: **{item.location}** {item.tableNo ? `(Table ${item.tableNo})` : ''}
                                        {item.customLocation && `(${item.customLocation})`}
                                    </small>
                                    
                                    <small style={itemDetailStyle}>
                                        Sugar: **{item.sugarLevel !== undefined ? item.sugarLevel : 'N/A'}** | Notes: {item.notes || 'None'}
                                    </small>
                                </div>
                                <button 
                                    style={styles.editButton} 
                                    onClick={() => setPage(`item-config-edit-${index}-${item.item}`)}
                                >
                                    <FaEdit />
                                </button>
                                <button 
                                    style={styles.deleteButton} 
                                    onClick={() => handleDelete(index)}
                                >
                                    <FaTrash />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
                

                <div style={{ marginTop: '30px' }}>
                    <button style={styles.primaryButton} onClick={handleProceed} disabled={currentOrder.items.length === 0}>
                        <FaCheckCircle /> Proceed & Place Order
                    </button>
                    <button 
                        style={styles.secondaryButton} 
                        onClick={() => setPage('item-selection')}
                    >
                        <FaPlus /> Add More Items
                    </button>
                </div>
            </div>
        </div>
    );
};

export default OrderConfirmationPage;

// The file should not contain a second default export, 
// so the line 'export default NavBar;' is removed/ignored. 
// If it was supposed to be a different component, it needs its own file.