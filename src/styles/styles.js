// src/styles/styles.js

const PRIMARY_COLOR = '#FF7F41'; // Bright Orange (Maven Cafe theme)
const SECONDARY_COLOR = '#333333'; // Dark Gray for text/icons
const DANGER_COLOR = '#dc3545'; // Red for cancellation/logout
const SUCCESS_COLOR = '#4CAF50'; // Bright Green for confirmation
const BACKGROUND_COLOR = '#fbfbfb'; // Light body background (Updated for better contrast)
const CARD_RADIUS = '12px'; // Standard rounded corners for aesthetic fit

// --- IMAGE FILE REFERENCES ---
const PLACEHOLDER_HOME_BG = 'uploaded:image_92fbe9.jpg';
const PLACEHOLDER_TEA_CARD = 'https://tmdone-cdn.s3.me-south-1.amazonaws.com/store-covers/133003776906429295.jpg';
const PLACEHOLDER_COFFEE_CARD = 'https://i.pinimg.com/474x/7a/29/df/7a29dfc903d98c6ba13b687ef1fa1d1a.jpg';
const PLACEHOLDER_MILK_CARD = 'https://www.shutterstock.com/image-photo/almond-milk-cup-glass-on-600nw-2571172141.jpg';
const PLACEHOLDER_WATER_CARD = 'https://images.stockcake.com/public/d/f/f/dffca756-1b7f-4366-8b89-4ad6f9bbf88a_large/chilled-water-glass-stockcake.jpg';
const PLACEHOLDER_CONFIRM_BG = 'uploaded:image_92fc9d.jpg';
// --------------------------------------------------------


export const styles = {
    // Expose the image constants in the exported styles object
    PLACEHOLDER_TEA_CARD,
    PLACEHOLDER_COFFEE_CARD,
    PLACEHOLDER_MILK_CARD,
    PLACEHOLDER_WATER_CARD,
    PLACEHOLDER_CONFIRM_BG,
    PLACEHOLDER_HOME_BG,

    // I. Layout and Base
    appContainer: {
        fontFamily: 'Roboto, Arial, sans-serif',
        maxWidth: '450px',
        margin: '0 auto',
        minHeight: '100vh',
        backgroundColor: BACKGROUND_COLOR,
        boxShadow: '0 0 20px rgba(0,0,0,0.15)',
        overflow: 'hidden',
    },
    contentArea: {
        flexGrow: 1,
    },
    screenPadding: {
        padding: '20px', // Slightly increased padding
        paddingBottom: '100px',
    },
    loadingContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 'calc(100vh - 60px)',
        color: PRIMARY_COLOR,
        gap: '10px',
        fontSize: '1.2em',
    },

    // II. Navigation Bar
    navBar: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '10px 15px',
        backgroundColor: 'white',
        color: SECONDARY_COLOR,
        boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
        position: 'sticky',
        top: 0,
        zIndex: 10,
        height: '60px', 
    },
    appTitle: {
        margin: 0,
        fontSize: '1.4em',
        fontWeight: 'bold',
        color: PRIMARY_COLOR,
    },
    navIcons: {
        display: 'flex',
        gap: '10px',
    },
    navButton: {
        background: 'none',
        border: 'none',
        color: SECONDARY_COLOR,
        cursor: 'pointer',
        padding: '5px',
        borderRadius: '50%',
        fontSize: '1.4em',
    },
    
    // Bottom Navigation Bar
    bottomNav: {
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        height: '80px',
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        backgroundColor: 'white',
        boxShadow: '0 -4px 15px rgba(0,0,0,0.15)',
        zIndex: 100,
        maxWidth: '450px',
        margin: '0 auto',
        paddingBottom: '20px',
    },
    bottomNavItem: (isActive) => ({
        flex: 1,
        padding: '10px 0',
        color: isActive ? PRIMARY_COLOR : '#999',
        backgroundColor: 'transparent',
        border: 'none',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        fontSize: '0.8em',
        fontWeight: '600',
    }),
    
    // III. Buttons (Updated to Aesthetic/Glow look)
    primaryButton: {
        width: '100%',
        padding: '18px',
        margin: '15px 0',
        backgroundColor: '#ff4500', 
        color: 'white',
        border: 'none',
        borderRadius: CARD_RADIUS,
        cursor: 'pointer',
        fontSize: '1.15em', 
        fontWeight: '900', 
        boxShadow: `0 0 15px #ff450099, 0 6px 12px rgba(0, 0, 0, 0.2)`,
        transition: 'all 0.2s',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        letterSpacing: '1px',
    },
    secondaryButton: {
        width: '100%',
        padding: '16px',
        margin: '5px 0 10px 0',
        backgroundColor: 'white',
        color: SECONDARY_COLOR,
        border: '2px solid #eee', 
        borderRadius: CARD_RADIUS,
        cursor: 'pointer',
        fontSize: '1.1em',
        fontWeight: '600',
        boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
    },
    deleteButton: {
        background: 'none',
        border: 'none',
        color: DANGER_COLOR, 
        marginLeft: '10px',
        cursor: 'pointer',
        fontSize: '1.3em',
        padding: '5px',
    },
    editButton: {
        background: 'none',
        border: 'none',
        color: PRIMARY_COLOR, 
        marginLeft: '10px',
        cursor: 'pointer',
        fontSize: '1.3em',
        padding: '5px',
    },
    cancelButton: { 
        background: DANGER_COLOR,
        color: 'white',
        border: 'none',
        padding: '12px 18px',
        borderRadius: '10px',
        fontSize: '15px',
        cursor: 'pointer',
        fontWeight: '600',
    },
    closeButton: { 
        position: 'absolute',
        top: '20px',
        right: '20px',
        background: 'none',
        border: 'none',
        color: SECONDARY_COLOR,
        fontSize: '1.8em',
        cursor: 'pointer',
        zIndex: 10,
    },
    logoutButton: {
        width: '100%',
        padding: '16px',
        margin: '20px 0 10px 0',
        backgroundColor: PRIMARY_COLOR,
        color: 'white',
        border: 'none',
        borderRadius: '12px',
        cursor: 'pointer',
        fontSize: '1.1em',
        fontWeight: 'bold',
        boxShadow: '0 4px 8px rgba(255, 127, 65, 0.4)',
    },

    // IV. Forms / Inputs
    inputField: {
        width: '100%',
        padding: '15px',
        margin: '5px 0 18px 0',
        border: '1px solid #ddd',
        borderRadius: '12px',
        boxSizing: 'border-box',
        backgroundColor: 'white',
        boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
    },
    selectField: {
        width: '100%',
        padding: '15px',
        margin: '5px 0 18px 0',
        border: '1px solid #ddd',
        borderRadius: '12px',
        backgroundColor: 'white',
        boxSizing: 'border-box',
        boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
    },
    label: {
        display: 'block',
        fontWeight: '600',
        marginBottom: '8px',
        fontSize: '1em',
        color: SECONDARY_COLOR,
    },
    
    // V. Modals
    modalOverlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'stretch',
        zIndex: 1000,
    },
    modalContent: {
        backgroundColor: 'white',
        padding: '25px',
        borderTopLeftRadius: CARD_RADIUS,
        borderBottomLeftRadius: CARD_RADIUS,
        width: '85%',
        maxHeight: '100vh',
        overflowY: 'auto',
        transform: 'translateX(0)',
        boxShadow: '-5px 0 20px rgba(0,0,0,0.5)',
    },

    // VI. Profile
    profilePicContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginBottom: '30px',
    },
    profileFrame: (profilePic) => ({
        width: '85px',
        height: '85px',
        borderRadius: '50%',
        overflow: 'hidden',
        border: `3px solid ${PRIMARY_COLOR}`,
        backgroundColor: BACKGROUND_COLOR,
        // Default to a placeholder if no profile picture is provided
        backgroundImage: profilePic ? `url(${profilePic})` : `url(${'https://placehold.co/85x85/FF7F41/ffffff?text=P'})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        marginBottom: '10px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
    }),
    profileDetailCard: {
        backgroundColor: 'white',
        padding: '18px',
        borderRadius: '12px',
        marginBottom: '15px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '15px',
        fontWeight: '500',
        color: SECONDARY_COLOR,
    },
    
    // VII. User Order Selection & List Items
    slotContainer: {
        display: 'flex',
        gap: '0px',
        justifyContent: 'space-around',
        margin: '20px 0',
        backgroundColor: 'white',
        borderRadius: CARD_RADIUS,
        overflow: 'hidden',
        boxShadow: '0 4px 10px rgba(0,0,0,0.08)',
        border: '1px solid #eee',
    },
    slotButton: (isActive) => ({
        flex: 1,
        padding: '15px 10px',
        backgroundColor: isActive ? PRIMARY_COLOR : 'transparent',
        color: isActive ? 'white' : SECONDARY_COLOR,
        border: 'none',
        cursor: 'pointer',
        fontWeight: 'bold',
        textAlign: 'center',
        fontSize: '1em',
        transition: 'all 0.3s',
    }),

    // 🛑 CRITICAL FIX: Ensure the itemButton (card frame) has a solid height.
    itemButton: {
        width: '100%',
        height: '150px', // Fixed height for consistency
        backgroundColor: 'white',
        borderRadius: '10px', 
        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)', 
        border: 'none',
        cursor: 'pointer',
        overflow: 'hidden', // Crucial: clips content/image to the card boundaries
        padding: '0', 
        transition: 'transform 0.2s',
        position: 'relative', 
    },
    // -----------------------------------------------------------
    
    // Home Page Banner (Good Morning)
    welcomeBanner: (imageUrl = PLACEHOLDER_HOME_BG) => ({ 
        minHeight: '180px',
        marginBottom: '25px',
        padding: '20px',
        borderRadius: CARD_RADIUS,
        boxShadow: '0 5px 15px rgba(0,0,0,0.15)',
        backgroundImage: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.1)), url(${imageUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        color: 'white',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        alignItems: 'flex-start',
    }),
    
    itemSelectionGrid: {
        display: 'flex',
        flexDirection: 'column',
        gap: '15px',
        margin: '0',
    },
    
    // 🛑 CRITICAL FIX: The container for the text and white line (must take 100% height/width)
    itemImageOverlay: (imageUrl) => ({ 
        width: '100%',
        height: '100%', // Must be 100% of itemButton height (150px) to prevent gaps
        
        // Darker, more abrupt gradient at the bottom for better text contrast
        backgroundImage: `linear-gradient(to top, rgba(0, 0, 0, 0.8) 0%, rgba(0, 0, 0, 0.5) 40%, rgba(0, 0, 0, 0) 80%), url(${imageUrl})`,
        backgroundSize: 'cover', // Ensures image covers the entire 150px height
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat', 

        // Flex settings to stack text and line at the bottom-left
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: 'flex-end', // Aligns content to the very bottom
        padding: '15px 20px 10px 20px', // Adjusted bottom padding to match image spacing
        boxSizing: 'border-box',
        
        // Text styling
        color: 'white',
        fontWeight: '900', 
        fontSize: '26px', 
        letterSpacing: '1px', 
        textShadow: '0 2px 4px rgba(0, 0, 0, 0.9)', 
        textTransform: 'uppercase',
        lineHeight: '1', 
    }),
    
    // 🛑 White line adjustment
    itemWhiteLine: {
        backgroundColor: 'white',
        height: '4px', 
        width: '60px', 
        marginTop: '6px', 
        marginBottom: '0', 
        borderRadius: '2px', 
    },
    
    // ... (rest of styles remain the same)
    
    // Item Config buttons (Type selection, Sugar level)
    configButtonContainer: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: '10px',
        marginBottom: '20px',
    },
    configButton: (isActive) => ({
        padding: '12px 20px',
        backgroundColor: isActive ? PRIMARY_COLOR : 'white',
        color: isActive ? 'white' : SECONDARY_COLOR,
        border: isActive ? `1px solid ${PRIMARY_COLOR}` : '1px solid #ddd',
        borderRadius: '10px',
        cursor: 'pointer',
        fontWeight: '600',
        boxShadow: isActive ? 'none' : '0 1px 3px rgba(0,0,0,0.05)',
        transition: 'all 0.2s',
    }),
    
    quantityControl: {
        display: 'flex',
        alignItems: 'center',
        gap: '15px',
    },
    quantityButton: {
        background: 'white',
        border: '1px solid #ddd',
        borderRadius: '10px',
        padding: '10px 15px',
        fontSize: '1.2em',
        fontWeight: 'bold',
        cursor: 'pointer',
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
    },
    
    listContainer: {
        margin: '15px 0',
    },
    orderItemCard: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'white',
        padding: '18px',
        margin: '10px 0',
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        border: '1px solid #eee',
    },

    // VIII. Confirmation Screen Specific
    confirmationCard: {
        backgroundColor: 'white',
        borderRadius: CARD_RADIUS,
        padding: '25px',
        margin: '20px 0',
        boxShadow: '0 5px 15px rgba(0,0,0,0.1)',
    },
    confirmationImageBanner: (imageUrl = PLACEHOLDER_CONFIRM_BG) => ({ 
        backgroundColor: SECONDARY_COLOR,
        borderRadius: CARD_RADIUS,
        overflow: 'hidden',
        minHeight: '200px',
        marginBottom: '25px',
        boxShadow: '0 5px 15px rgba(0,0,0,0.2)',
        position: 'relative',
        backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${imageUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        color: 'white',
        textAlign: 'center',
    }),
    circularCheck: {
        width: '70px',
        height: '70px',
        borderRadius: '50%',
        backgroundColor: 'white',
        color: PRIMARY_COLOR,
        fontSize: '2.5em',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: '10px',
    },
    orderSummaryRow: {
        display: 'flex',
        justifyContent: 'space-between',
        padding: '8px 0',
        borderBottom: '1px solid #eee',
        fontSize: '0.95em',
    },
    successContainer: {
        backgroundColor: SUCCESS_COLOR,
        color: 'white',
        padding: '30px 20px',
        borderRadius: CARD_RADIUS,
        margin: '20px 0',
        textAlign: 'center',
        boxShadow: '0 4px 10px rgba(76, 175, 80, 0.5)',
        position: 'fixed',
        bottom: '50%',
        left: '50%',
        transform: 'translate(-50%, 50%)',
        width: '80%',
        zIndex: 1000,
    },
    
    // IX. Kitchen Dashboard & Admin
    kitchenCard: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '18px',
        borderLeft: `5px solid ${PRIMARY_COLOR}`,
        borderRadius: '12px',
        backgroundColor: 'white',
        margin: '10px 0',
        boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
        cursor: 'pointer',
    },
    orderGroup: {
        marginTop: '20px',
        paddingTop: '10px',
    },
    groupHeader: (status) => ({
        fontSize: '1.4em',
        fontWeight: 'bold',
        color: SECONDARY_COLOR,
        // Dynamic accent color based on status
        borderBottom: `2px solid ${status === 'Ready' ? SUCCESS_COLOR : (status === 'Making' ? PRIMARY_COLOR : '#ccc')}`,
        paddingBottom: '5px',
        marginBottom: '15px',
    }),
    
    // X. Admin User Management
    adminControlGroup: {
        display: 'flex',
        gap: '8px',
    },
    controlButton: (color) => ({
        background: color,
        border: 'none',
        color: 'white',
        padding: '10px',
        borderRadius: '8px',
        cursor: 'pointer',
        fontSize: '1em',
        fontWeight: '600',
    }),
    userCard: { 
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '18px',
        margin: '10px 0',
        borderRadius: '12px',
        backgroundColor: 'white',
        boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
        borderLeft: '5px solid #8e8e93', 
    },
    adminLinkButton: {
        width: '100%',
        padding: '14px',
        margin: '10px 0 20px 0',
        backgroundColor: '#facc15', 
        color: SECONDARY_COLOR,
        border: 'none',
        borderRadius: CARD_RADIUS,
        cursor: 'pointer',
        fontSize: '1.1em',
        fontWeight: 'bold',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        boxShadow: '0 4px 8px rgba(250, 204, 21, 0.4)',
    },
};