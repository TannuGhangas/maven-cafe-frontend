import React from 'react';
// The FaChevronLeft import is present but not used on this page, as per your original file.

// Defining the inline CSS styles based on the image's aesthetics (orange accents, rounded corners, shadows).
const styles = {
    screenPadding: {
        padding: '0 0 24px 0', // Remove horizontal padding for full-width banner
        fontFamily: 'Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif',
        minHeight: '100vh',
        backgroundColor: '#fcfcfc',
    },
    // --- NEW STYLES FOR IMAGE HEADER ---
    headerBanner: {
        height: '250px', // Height remains 250px
        width: '100%',
        marginBottom: '25px',
        position: 'relative',
        borderRadius: '0 0 24px 24px', // Rounded bottom edge for the banner
        overflow: 'hidden',
        boxShadow: '0 5px 15px rgba(0, 0, 0, 0.1)',
    },
    backgroundImage: (url) => ({
        // Using a slightly lighter gradient for a softer look
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.4)), url(${url || 'https://placehold.co/800x250/4a4a4a/ffffff?text=Add+Image+URL'})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start', 
        padding: '50px 24px 24px 24px', // Added top padding (50px) to move text down slightly
    }),
    bannerTitle: {
        fontSize: '1.8rem',
        fontWeight: '800',
        color: '#ffffff',
        textShadow: '0 2px 4px rgba(0, 0, 0, 0.7)', 
    },
    bannerSubtitle: {
        fontSize: '0.95rem',
        color: 'rgba(255, 255, 255, 0.85)',
        fontWeight: '500',
        marginTop: '5px',
        textShadow: '0 1px 3px rgba(0, 0, 0, 0.7)',
    },
    // ------------------------------------
    contentArea: {
        padding: '0 24px', // Re-introduce horizontal padding for content
    },
    headerText: {
        fontSize: '1.5rem',
        fontWeight: '800', // Bold header
        color: '#333333',
        marginBottom: '20px',
        textAlign: 'left',
    },
    slotContainer: {
        display: 'flex',
        gap: '20px', // Increased gap
        marginTop: '25px',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
    },
    slotButton: (isSelected) => ({
        // Base styling for the buttons (rounded, soft shadow)
        flexGrow: 1,
        minWidth: '150px', // Slightly wider min width
        maxWidth: '250px',
        padding: '25px 15px', // Slightly increased vertical padding
        borderRadius: '16px',
        border: 'none',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        textAlign: 'center',
        lineHeight: '1.4',

        // Conditional styling (Orange is the highlight color from the image)
        backgroundColor: isSelected ? '#FF7A3D' : '#ffffff',
        color: isSelected ? '#ffffff' : '#4a4a4a',
        fontWeight: isSelected ? '700' : '600',
        fontSize: '1.2rem', // Slightly larger text
        boxShadow: isSelected
            ? '0 10px 25px rgba(255, 122, 61, 0.6)' // Stronger shadow for selected
            : '0 5px 15px rgba(0, 0, 0, 0.08)', // Refined subtle shadow for unselected

        // Adding a pseudo-element or class for hover effects is complex with inline styles. 
        // We'll rely on the transition for smooth interaction.
        ':hover': {
            transform: 'translateY(-2px)', // Subtle lift on hover (not fully supported in inline styles, but good intent)
            boxShadow: isSelected 
                ? '0 12px 30px rgba(255, 122, 61, 0.7)' 
                : '0 7px 20px rgba(0, 0, 0, 0.12)',
        }
    }),
    smallText: (isSelected) => ({
        fontSize: '0.9rem',
        color: isSelected ? 'rgba(255, 255, 255, 0.85)' : '#888888',
        fontWeight: 'normal',
    }),
    // --- NEW STYLES FOR BREAK CARD ---
    breakCard: {
        marginTop: '55px',
        backgroundColor: '#FFFFFF',
        borderRadius: '25px', // Even larger radius
        padding: '50px 30px', 
        alignItems: 'center',
        // Floating effect
        boxShadow: '0 15px 30px rgba(0, 0, 0, 0.1)', 
        textAlign: 'center',
        margin: '0 auto',
        width: '100%',
        boxSizing: 'border-box',
        border: 'none', // Remove subtle border
        transition: 'all 0.5s ease',
    },
    breakTitle: {
        fontSize: '32px', // Larger title
        fontWeight: '900', // Extra bold
        color: '#FF7A3D', 
        marginBottom: '15px', 
        margin: 0,
        // Adding a subtle shake or pulse animation would require defining a <style> block, 
        // which we avoid in React components if possible. I'll rely on large font/color contrast.
    },
    breakSubtitle: {
        fontSize: '16px', // Slightly larger subtitle
        color: '#555', 
        margin: '0 0 5px 0'
    },
    breakInspiration: {
        fontSize: '18px', // Larger and clearer
        color: '#333',
        fontWeight: '600',
        marginTop: '15px',
    }
};

const UserHomePage = ({ setPage, currentOrder, setCurrentOrder, styles: _propStyles }) => {
    // === HERE IS WHERE YOU CAN PASTE YOUR IMAGE ADDRESS ===
    // Replace the empty string '' below with the URL of your desired background image.
    const HEADER_IMAGE_URL = 'https://tmdone-cdn.s3.me-south-1.amazonaws.com/store-covers/133003776906429295.jpg'; 
    // Example: const HEADER_IMAGE_URL = 'https://i.imgur.com/your-cafe-image.jpg';
    // ======================================================

    return (
        <div style={styles.screenPadding}>
            {/* Image Header Section */}
            <div style={styles.headerBanner}>
                <div style={styles.backgroundImage(HEADER_IMAGE_URL)}>
                    <h1 style={styles.bannerTitle}>Hello</h1>                                              
                    {/* Greeting text add "Hello" instead of Good Morning */}
                    <p style={styles.bannerSubtitle}>Start your day with a warm cup</p>
                </div>
            </div>

            <div style={styles.contentArea}>
                {/* Slot Selection Content */}
                <h2 style={styles.headerText}>Select Slot:</h2>
                <div style={styles.slotContainer}>
                    {['morning (9:00-12:00)', 'afternoon (1:00 - 5:30)'].map(slot => (
                        <button 
                            key={slot}
                            style={styles.slotButton(currentOrder.slot === slot)}
                            onClick={() => {
                                setCurrentOrder(prev => ({ ...prev, slot }));
                                setPage('item-selection');
                            }}
                        >
                            {slot.split('(')[0].trim()}
                            <br /><small style={styles.smallText(currentOrder.slot === slot)}>({slot.split('(')[1]}</small>
                        </button>
                    ))}
                </div>

                {/* Updated "Time for a break" card with better aesthetics and additional text */}
                <div style={styles.breakCard}>
                    <h3 style={styles.breakTitle}>☕ Time for a break ☕</h3>
                    <p style={styles.breakSubtitle}>
                        -Crafted with 💖 in Maven jobs, Panipat
                    </p>
                    <p style={styles.breakInspiration}>
                        The next slot is available for you to plan your perfect pause.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default UserHomePage;