// Color Palette: White (#ffffff), Dark Blue (#103c7f), Green (#a1db40)

const PRIMARY_COLOR = '#103c7f'; // Dark Blue (Main action/text/logo color)
const ACCENT_COLOR = '#a1db40'; // Green (Success, highlights)
const TEXT_COLOR = '#103c7f'; // Dark Blue for main text
const DANGER_COLOR = '#e74c3c'; // Red for delete (Kept as an exception for danger, but used sparingly)
const BACKGROUND_COLOR = '#ffffff'; // White body background
const CARD_RADIUS = '12px'; // Standard rounded corners

// --- IMAGE FILE REFERENCES (Retained) ---
const PLACEHOLDER_HOME_BG = 'uploaded:image_92fbe9.jpg';
const PLACEHOLDER_TEA_CARD = 'https://tmdone-cdn.s3.me-south-1.amazonaws.com/store-covers/133003776906429295.jpg';
const PLACEHOLDER_COFFEE_CARD = 'https://i.pinimg.com/474x/7a/29/df/7a29dfc903d98c6ba13b687ef1fa1d1a.jpg';
const PLACEHOLDER_WATER_CARD = 'https://images.stockcake.com/public/d/f/f/dffca756-1b7f-4366-8b89-4ad6f9bbf88a_large/chilled-water-glass-stockcake.jpg';
const PLACEHOLDER_CONFIRM_BG = 'uploaded:image_92fc9d.jpg';
// --------------------------------------------------------

export const styles = {
    // Expose the color and image constants
    PRIMARY_COLOR,
    ACCENT_COLOR,
    TEXT_COLOR,
    DANGER_COLOR,
    BACKGROUND_COLOR,
    CARD_RADIUS,

    PLACEHOLDER_TEA_CARD,
    PLACEHOLDER_COFFEE_CARD,
    PLACEHOLDER_WATER_CARD,
    PLACEHOLDER_CONFIRM_BG,
    PLACEHOLDER_HOME_BG,

    // I. Layout and Base
    appContainer: {
        fontFamily: 'Calibri, Arial, sans-serif',
        width: '100%',
        margin: '0',
        minHeight: '100vh',
        backgroundColor: BACKGROUND_COLOR, // White
        overflowX: 'hidden',
    },

    kitchenAppContainer: {
        fontFamily: 'Calibri, Arial, sans-serif',
        maxWidth: '1400px',
        width: 'auto',
        margin: '0 auto',
        minHeight: '100vh',
        backgroundColor: 'white', // White
        overflowX: 'hidden',
        boxShadow: '0 0 20px rgba(0,0,0,0.05)',
    },

    contentWrapper: {
        width: '100%', 
        margin: '0', 
        boxShadow: '0 0 10px rgba(0,0,0,0.05)', 
        minHeight: '100vh',
        backgroundColor: BACKGROUND_COLOR, // White
    },

    contentArea: {
        flexGrow: 1,
        paddingTop: '80px', // Account for fixed navbar height (70px for kitchen, 50px for mobile + some buffer)
    },
    screenPadding: {
        padding: '20px',
        paddingBottom: '100px',
    },
    screenPaddingKitchen: { 
        padding: '30px', 
        paddingBottom: '40px',
    },

    // II. Navigation Bar Styles

    // MOBILE NAV BAR (Used for regular 'user')
    navBar: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '10px 5px',
        backgroundColor: 'white', // White
        color: TEXT_COLOR, // Dark Blue
        boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 10,
        height: '50px',
        maxWidth: '450px',
        margin: '0 auto',
    },
    mobileLogoStyle: { 
        height: '70px', 
        width: 'auto',
        objectFit: 'contain',
    },
    mobileNavIcons: {
        display: 'flex',
        gap: '12px',
    },
    mobileNavButton: {
        background: 'none',
        border: 'none',
        color: TEXT_COLOR, // Dark Blue
        cursor: 'pointer',
        padding: '5px',
        borderRadius: '50%',
        width: '40px',
        height: '40px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '1.6em', 
    },

    // KITCHEN/ADMIN NAV BAR (Full Width, Larger Elements)
    kitchenNavBar: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '8px 0',
        backgroundColor: 'white', // White
        color: TEXT_COLOR, // Dark Blue
        boxShadow: '0 1px 6px rgba(0,0,0,0.1)',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 10,
        height: '50px',
        width: '100%',
        maxWidth: '450px',
        margin: '0 auto',
    },
    kitchenLogoStyle: { 
        height: '70px', 
        width: 'auto',
        objectFit: 'contain',
    },
    kitchenNavIcons: {
        display: 'flex',
        gap: '12px', 
    },
    kitchenNavButton: {
        background: 'none',
        border: 'none',
        color: TEXT_COLOR, // Dark Blue
        cursor: 'pointer',
        padding: '5px',
        borderRadius: '50%',
        width: '40px',
        height: '40px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '1.6em', 
    },

    // Bottom Navigation Bar (Mobile-specific)
    bottomNav: {
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        height: '80px',
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        backgroundColor: 'white', // White
        boxShadow: '0 -4px 15px rgba(0,0,0,0.15)',
        zIndex: 100,
        maxWidth: '450px',
        margin: '0 auto',
        paddingBottom: '20px',
    },
    bottomNavItem: (isActive) => ({
        flex: 1,
        padding: '10px 0',
        color: isActive ? PRIMARY_COLOR : '#ccc', // Dark Blue when active, light gray when inactive
        backgroundColor: 'transparent',
        border: 'none',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        fontSize: '0.8em',
        fontWeight: '600',
    }),

    // III. Buttons
    primaryButton: {
        width: '100%',
        padding: '18px',
        margin: '15px 0',
        backgroundColor: PRIMARY_COLOR, // Dark Blue
        color: 'white',
        border: 'none',
        borderRadius: CARD_RADIUS,
        cursor: 'pointer',
        fontSize: '1.15em',
        fontWeight: '900',
        boxShadow: `0 0 15px ${PRIMARY_COLOR}99, 0 6px 12px rgba(0, 0, 0, 0.2)`,
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
        backgroundColor: 'white', // White
        color: TEXT_COLOR, // Dark Blue
        border: `2px solid ${PRIMARY_COLOR}`, // Dark Blue border
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
    successButton: {
        backgroundColor: ACCENT_COLOR, // Green
        color: 'white',
        border: 'none',
        padding: '12px 18px',
        borderRadius: CARD_RADIUS,
        cursor: 'pointer',
        fontSize: '1em',
        fontWeight: '600',
        boxShadow: `0 2px 5px ${ACCENT_COLOR}40`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
    },
    deleteButton: {
        background: 'none',
        border: 'none',
        color: DANGER_COLOR, // Retained for semantic meaning (Red)
        marginLeft: '10px',
        cursor: 'pointer',
        fontSize: '1.3em',
        padding: '5px',
    },
    editButton: {
        background: 'none',
        border: 'none',
        color: PRIMARY_COLOR, // Dark Blue
        marginLeft: '10px',
        cursor: 'pointer',
        fontSize: '1.3em',
        padding: '5px',
    },
    cancelButton: {
        background: DANGER_COLOR, // Retained for semantic meaning (Red)
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
        color: TEXT_COLOR, // Dark Blue
        fontSize: '1.8em',
        cursor: 'pointer',
        zIndex: 10,
    },
    logoutButton: {
        width: '100%',
        padding: '16px',
        margin: '20px 0 10px 0',
        backgroundColor: PRIMARY_COLOR, // Dark Blue
        color: 'white',
        border: 'none',
        borderRadius: '12px',
        cursor: 'pointer',
        fontSize: '1.1em',
        fontWeight: 'bold',
        boxShadow: `0 4px 8px ${PRIMARY_COLOR}40`,
    },

    // IV. Forms / Inputs
    inputField: {
        width: '100%',
        padding: '15px',
        margin: '5px 0 18px 0',
        border: '1px solid #ddd',
        borderRadius: '12px',
        boxSizing: 'border-box',
        backgroundColor: 'white', // White
        boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
    },
    selectField: {
        width: '100%',
        padding: '15px',
        margin: '5px 0 18px 0',
        border: '1px solid #ddd',
        borderRadius: '12px',
        backgroundColor: 'white', // White
        boxSizing: 'border-box',
        boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
    },
    label: {
        display: 'block',
        fontWeight: '600',
        marginBottom: '8px',
        fontSize: '1em',
        color: TEXT_COLOR, // Dark Blue
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
        backgroundColor: 'white', // White
        padding: '25px',
        borderTopLeftRadius: CARD_RADIUS,
        borderBottomLeftRadius: CARD_RADIUS,
        width: '85%',
        maxWidth: '450px', 
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
        border: `3px solid ${PRIMARY_COLOR}`, // Dark Blue border
        backgroundColor: BACKGROUND_COLOR, // White
        backgroundImage: profilePic ? `url(${profilePic})` : `url(${'https://placehold.co/85x85/103c7f/ffffff?text=P'})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        marginBottom: '10px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
    }),
    profileDetailCard: {
        backgroundColor: 'white', // White
        padding: '18px',
        borderRadius: '12px',
        marginBottom: '15px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '15px',
        fontWeight: '500',
        color: TEXT_COLOR, // Dark Blue
    },

    // VII. User Order Selection & List Items (Mobile-focused)
    slotContainer: {
        display: 'flex',
        gap: '0px',
        justifyContent: 'space-around',
        margin: '20px 0',
        backgroundColor: 'white', // White
        borderRadius: CARD_RADIUS,
        overflow: 'hidden',
        boxShadow: '0 4px 10px rgba(0,0,0,0.08)',
        border: '1px solid #ddd',
    },
    slotButton: (isActive) => ({
        flex: 1,
        padding: '15px 10px',
        backgroundColor: isActive ? PRIMARY_COLOR : 'transparent', // Dark Blue when active
        color: isActive ? 'white' : TEXT_COLOR, // Dark Blue when inactive
        border: 'none',
        cursor: 'pointer',
        fontWeight: 'bold',
        textAlign: 'center',
        fontSize: '1em',
        transition: 'all 0.3s',
    }),

    itemButton: {
        width: '100%',
        height: '150px',
        backgroundColor: 'white', // White
        borderRadius: '10px',
        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
        border: 'none',
        cursor: 'pointer',
        overflow: 'hidden',
        padding: '0',
        transition: 'transform 0.2s',
        position: 'relative',
    },

    /**
     * UPDATED: itemImageOverlay using Dark Blue in the gradient for theme consistency
     */
    itemImageOverlay: (imageUrl) => ({
        width: '100%',
        height: '120px', 
        // Gradient uses dark blue theme color over the image
        backgroundImage: `linear-gradient(to top, ${PRIMARY_COLOR}b3 0%, ${PRIMARY_COLOR}80 40%, rgba(0, 0, 0, 0) 80%), url(${imageUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center', 
        justifyContent: 'center', 
        padding: '0', 
        boxSizing: 'border-box',
        color: 'white',
        fontWeight: '900',
        fontSize: '24px', 
        letterSpacing: '1px',
        textShadow: '0 2px 4px rgba(0, 0, 0, 0.9)',
        textTransform: 'uppercase',
        lineHeight: '1',
    }),

    itemWhiteLine: {
        backgroundColor: 'white', // White
        height: '4px',
        width: '60px',
        marginTop: '6px',
        marginBottom: '0',
        borderRadius: '2px',
    },

    configButtonContainer: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: '10px',
        marginBottom: '20px',
    },
    configButton: (isActive) => ({
        padding: '12px 20px',
        backgroundColor: isActive ? PRIMARY_COLOR : 'white', // Dark Blue when active, White otherwise
        color: isActive ? 'white' : TEXT_COLOR, // White when active, Dark Blue otherwise
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
        background: 'white', // White
        border: '1px solid #ddd',
        borderRadius: '10px',
        padding: '10px 15px',
        fontSize: '1.2em',
        fontWeight: 'bold',
        cursor: 'pointer',
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
        color: TEXT_COLOR, // Dark Blue
    },

    listContainer: {
        margin: '15px 0',
    },
    orderItemCard: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'white', // White
        padding: '18px',
        margin: '10px 0',
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        border: '1px solid #ddd',
        color: TEXT_COLOR, // Dark Blue text
    },

    // VIII. Confirmation Screen Specific 
    confirmationCard: {
        backgroundColor: 'white', // White
        borderRadius: CARD_RADIUS,
        padding: '25px',
        margin: '20px 0',
        boxShadow: '0 5px 15px rgba(0,0,0,0.1)',
    },
    confirmationImageBanner: (imageUrl = PLACEHOLDER_CONFIRM_BG) => ({
        backgroundColor: PRIMARY_COLOR, // Dark Blue
        borderRadius: CARD_RADIUS,
        overflow: 'hidden',
        minHeight: '200px',
        marginBottom: '25px',
        boxShadow: '0 5px 15px rgba(0,0,0,0.2)',
        position: 'relative',
        // Dark Blue overlay for consistency
        backgroundImage: `linear-gradient(${PRIMARY_COLOR}80, ${PRIMARY_COLOR}99), url(${imageUrl})`, 
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
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
        backgroundColor: ACCENT_COLOR, // Green
        color: PRIMARY_COLOR, // Dark Blue checkmark
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
        borderBottom: '1px dashed #ddd',
        fontSize: '1em',
        color: TEXT_COLOR, // Dark Blue text
    },

    // IX. Kitchen Dashboard & Admin
    kitchenNotification: {
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        backgroundColor: ACCENT_COLOR, // Green
        color: PRIMARY_COLOR, // Dark Blue text on green
        padding: '10px',
        paddingBottom: '50px',
        borderRadius: '20px',
        textAlign: 'center',
        zIndex: 2000,
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)',
        border: '5px solid white', // White border
        width: '90%',
        maxWidth: '600px',
    },
    kitchenOverlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        zIndex: 1999,
    },
    kitchenCard: {
        backgroundColor: 'white', // White
        padding: '30px', 
        borderRadius: '15px', 
        boxShadow: '0 4px 15px rgba(0,0,0,0.1)', 
        marginBottom: '20px', 
        transition: 'all 0.3s',
    },
    kitchenDetailRow: {
        display: 'flex',
        justifyContent: 'space-between',
        padding: '8px 0',
        borderBottom: '1px solid #ddd',
        fontSize: '1.2em', 
        fontWeight: '500',
        color: TEXT_COLOR, // Dark Blue
    },
    kitchenItemList: {
        listStyleType: 'none',
        padding: 0,
        margin: '15px 0 0 0',
    },
    kitchenItem: {
        padding: '10px 0',
        fontSize: '1.4em', 
        fontWeight: '700',
        color: TEXT_COLOR, // Dark Blue
        borderBottom: '1px dashed #ddd',
    },
    orderGroup: {
        marginBottom: '25px',
    },
    groupHeader: {
        fontSize: '1.8em',
        fontWeight: 'bold',
        color: PRIMARY_COLOR, // Dark Blue
        marginBottom: '15px',
        borderBottom: `3px solid ${ACCENT_COLOR}b3`, // Green underline
        paddingBottom: '10px',
        marginTop: '25px',
        fontFamily: 'Cambria, serif',
    },

    // X. Admin User Management 
    adminControlGroup: {
        display: 'flex',
        gap: '8px',
    },
    controlButton: (color) => ({
        // color is passed from component (e.g., DANGER_COLOR or PRIMARY_COLOR)
        background: color, 
        border: 'none',
        color: 'white',
        padding: '12px 15px', 
        borderRadius: '8px',
        cursor: 'pointer',
        fontSize: '1.1em', 
        fontWeight: '600',
    }),
    userCard: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '18px',
        margin: '10px 0',
        borderRadius: '12px',
        backgroundColor: 'white', // White
        boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
        borderLeft: `5px solid ${PRIMARY_COLOR}`, // Dark Blue accent line
    },
    adminLinkButton: {
        width: '100%',
        padding: '14px',
        margin: '10px 0 20px 0',
        backgroundColor: ACCENT_COLOR, // Green
        color: PRIMARY_COLOR, // Dark Blue text on green
        border: 'none',
        borderRadius: CARD_RADIUS,
        cursor: 'pointer',
        fontSize: '1.1em',
        fontWeight: 'bold',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        boxShadow: `0 4px 8px ${ACCENT_COLOR}40`,
    },
};