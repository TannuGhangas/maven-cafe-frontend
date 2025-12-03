import React, { useState, useEffect } from 'react';
import { FaChevronLeft, FaMinus, FaPlus, FaSpinner } from 'react-icons/fa'; // Import FaMinus and FaPlus
import { callApi } from '../../api/apiService';
// Import the centralized theme styles and external constants
import { STYLES_THEME } from './UserHomePage';
import {
TABLE_NUMBERS,
// 🔑 UPDATED IMPORTS: Removed LOCATIONS and added necessary location logic
getAllowedLocations, USER_LOCATIONS_DATA
} from '../../config/constants';

// --- Configuration Image URL ---
const HEADER_IMAGE_URL = 'https://png.pngtree.com/thumb_back/fh260/background/20250808/pngtree-steaming-cup-of-tea-with-lavender-on-blue-fabric-background-cozy-image_17717402.webp';
// ---------------------------------

// --- NEW/OVERRIDDEN STYLES FOR THEME ENHANCEMENT ---
// NOTE: Assuming STYLES_THEME imports base styles. We override/add necessary custom styles here.
const THEME_COLORS = {
    PRIMARY: '#103c7f', // Dark Blue
    ACCENT: '#a1db40', // Green
    TEXT_DARK: '#2c3e50', // Darker text for readability
    TEXT_MUTED: '#7f8c8d', // Muted text
    BACKGROUND_LIGHT: '#f9f9f9', // Light background for contrast
    BORDER_LIGHT: '#e0e0e0', // Light border
};

const ENHANCED_STYLES = {
    ...STYLES_THEME, // Keep original base styles (e.g., BORDER_RADIUS_LG)
    // ADDED PILL-LIKE BORDER RADIUS FOR BUTTONS
    BORDER_RADIUS_PILL: '25px',

    // Override or add key visual styles
    COLOR_PRIMARY: THEME_COLORS.PRIMARY,
    COLOR_ACCENT: THEME_COLORS.ACCENT,
    COLOR_TEXT_DARK: THEME_COLORS.TEXT_DARK,
    COLOR_TEXT_MUTED: THEME_COLORS.TEXT_MUTED,
    
    // Consistent Box Shadow
    SHADOW_ELEVATION_1: '0 1px 3px rgba(0, 0, 0, 0.1)',
    SHADOW_ELEVATION_2: '0 4px 8px rgba(0, 0, 0, 0.15)',
    SHADOW_ELEVATION_3: '0 8px 16px rgba(0, 0, 0, 0.2)',

    // Enhanced Header/Label
    headerText: {
        fontSize: '1.6rem',
        fontWeight: '700',
        color: THEME_COLORS.PRIMARY,
        margin: '0 0 10px 0',
    },
    label: {
        fontSize: '1rem',
        fontWeight: '600',
        color: THEME_COLORS.TEXT_DARK,
        display: 'block',
        marginBottom: '8px',
        marginTop: '20px',
    },

    // Enhanced Input/Select
    inputField: {
        padding: '12px 15px',
        border: `1px solid ${THEME_COLORS.BORDER_LIGHT}`,
        borderRadius: STYLES_THEME.BORDER_RADIUS_SM,
        width: '100%',
        boxSizing: 'border-box',
        fontSize: '1rem',
        color: THEME_COLORS.TEXT_DARK,
        transition: 'border-color 0.2s',
        marginBottom: '15px',
    },
selectField: {
padding: '12px 15px',
border: `2px solid ${THEME_COLORS.BORDER_LIGHT}`,
borderRadius: STYLES_THEME.BORDER_RADIUS_SM,
width: '100%',
boxSizing: 'border-box',
fontSize: '1rem',
color: THEME_COLORS.TEXT_DARK,
backgroundColor: '#ffffff',
appearance: 'none',
marginBottom: '20px',
fontWeight: '500',
cursor: 'pointer',
transition: 'border-color 0.2s ease',
backgroundImage: 'url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%23666\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3e%3cpolyline points=\'6,9 12,15 18,9\'%3e%3c/polyline%3e%3c/svg%3e")',
backgroundRepeat: 'no-repeat',
backgroundPosition: 'right 15px center',
backgroundSize: '16px',
paddingRight: '45px', // Make room for the custom arrow
},

    // Enhanced Primary Button (Save/Update)
    primaryButton: {
        padding: '15px 25px',
        backgroundColor: THEME_COLORS.PRIMARY,
        color: '#ffffff',
        border: 'none',
        borderRadius: STYLES_THEME.BORDER_RADIUS_SM,
        fontSize: '1.1rem',
        fontWeight: '700',
        cursor: 'pointer',
        width: '100%',
        boxShadow: THEME_COLORS.SHADOW_ELEVATION_2,
        transition: 'background-color 0.2s ease, transform 0.1s ease',
        marginTop: '20px',
    },

    // Enhanced Secondary Button (Back)
    secondaryButton: {
        padding: '12px 25px',
        backgroundColor: 'transparent',
        color: THEME_COLORS.TEXT_MUTED,
        border: `1px solid ${THEME_COLORS.BORDER_LIGHT}`,
        borderRadius: STYLES_THEME.BORDER_RADIUS_SM,
        fontSize: '1rem',
        fontWeight: '600',
        cursor: 'pointer',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px', // Added gap for spacing between icon and text
        transition: 'color 0.2s, border-color 0.2s',
        whiteSpace: 'nowrap', // Prevents wrapping the text/icon if possible
    },
};
// ---------------------------------

// Helper component for the image banner
const ImageBanner = ({ itemType, imageUrl }) => {
    const title = `${itemType.charAt(0).toUpperCase() + itemType.slice(1)} Configuration`;
    // Use the enhanced styles
    const styles = ENHANCED_STYLES;
    
    const bannerStyle = {
        height: '200px',
        width: '100%',
        marginBottom: '30px',
        borderRadius: `0 0 ${styles.BORDER_RADIUS_LG} ${styles.BORDER_RADIUS_LG}`,
        overflow: 'hidden',
        boxShadow: styles.SHADOW_ELEVATION_3,
        position: 'relative',
    };

    const imageStyle = {
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.7)), url(${imageUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        height: '100%',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '0 24px',
        textAlign: 'center',
        display: 'flex', // Ensure display is set
    };

    const textStyle = {
        fontSize: '2rem',
        fontWeight: '900',
        color: '#ffffff',
        textShadow: '0 3px 8px rgba(0, 0, 0, 0.9)',
        margin: 0,
    };

    return (
        <div style={bannerStyle}>
            <div style={imageStyle}>
                <h1 style={textStyle}>{title}</h1>
            </div>
        </div>
    );
};

// Helper function to get menu types from menu object
const getMenuTypes = async (itemType, user, menu) => {
    if (menu && menu.categories) {
        const cat = menu.categories.find(c => c.name.toLowerCase() === itemType);
        if (cat && cat.items) {
            // For specific items, only show "normal"
            const specificItems = [];
            if (specificItems.includes(itemType.toLowerCase())) {
                return [{ name: 'normal', available: true }];
            }
            // Return all items with availability status
            return cat.items.map(item => typeof item === 'string' ? { name: item, available: true } : { name: item.name || item, available: item.available !== false });
        }
    }
    // Default fallbacks
    const defaults = {
        coffee: [{ name: "Black", available: true }, { name: "Milk", available: true }, { name: "Simple", available: true }, { name: "Cold", available: true }],
        tea: [{ name: "Black", available: true }, { name: "Milk", available: true }, { name: "Green", available: true }],
        water: [{ name: "Warm", available: true }, { name: "Cold", available: true }, { name: "Hot", available: true }, { name: "Lemon", available: true }],
    };
    return defaults[itemType] || [];
};

// Removed localStorage functions, now fetching from server

// Main Component
const ItemConfigPage = ({
 itemType, setPage, currentOrder,
 setCurrentOrder, isEditMode, itemIndex, user, styles: _propStyles, callApi
 }) => {
// Use the enhanced styles
const styles = ENHANCED_STYLES;

const [userLocations, setUserLocations] = useState([]);

// State for dynamic data
const [typeOptions, setTypeOptions] = useState([]);
const [sugarLevels, setSugarLevels] = useState([]);
const [addOns, setAddOns] = useState([]);

useEffect(() => {
    // Locations are now handled statically from constants
    setUserLocations(USER_LOCATIONS_DATA);

    // Fetch menu data
    const fetchMenuData = async () => {
        try {
            const menu = await callApi(`/menu?userId=${user.id}&userRole=${user.role}`);
            const options = await getMenuTypes(itemType, user, menu);
            setTypeOptions(options);
            setAddOns(menu.addOns || []);
            setSugarLevels(menu.sugarLevels || []);
        } catch (error) {
            console.error('Failed to fetch menu:', error);
            // Fallback
            setAddOns([
                { name: "Ginger", available: true },
            ]);
            setSugarLevels([{ level: 0, available: true }, { level: 1, available: true }, { level: 2, available: true }, { level: 3, available: true }]);
        }
    };
    fetchMenuData();
}, [itemType, user]);

// --- START USER LOCATION LOGIC ---
// Use the actual logged-in user
const currentUser = userLocations.find(u => u.name === user.name) || userLocations[0];

// Calculate allowed locations for the current user
const allowedLocations = currentUser ? getAllowedLocations(currentUser.location, currentUser.access) : [];
const defaultLocationKey = allowedLocations[0]?.key || user.location || 'Others';
// --- END USER LOCATION LOGIC ---


// **CORE LOGIC**: Set default type to the first available type, or item name if no sub-types exist.
const defaultType = typeOptions.length > 0 ? (typeOptions.find(t => t.available !== false)?.name || typeOptions[0].name) : itemType;

    // State for managing custom sugar input
    const [customSugar, setCustomSugar] = useState(''); 
    
    const [itemConfig, setItemConfig] = useState(
        isEditMode ? currentOrder.items[itemIndex] :
        {
            item: itemType,
            // Use the determined default type
            type: defaultType, 
            sugarLevel: 1, // Default to 1
            selectedAddOns: [],
            quantity: 1,
            // Uses the filtered default location
            location: defaultLocationKey, 
            tableNo: null,
            customLocation: '',
            notes: ''
        }
    );

// Effect to handle setting the custom sugar input if the sugar level is not standard
useEffect(() => {
if (itemConfig.sugarLevel !== null && !sugarLevels.some(s => s.level === itemConfig.sugarLevel)) {
setCustomSugar(String(itemConfig.sugarLevel));
} else if (itemConfig.sugarLevel !== null && customSugar !== '') {
setCustomSugar('');
}
}, [itemConfig.sugarLevel, sugarLevels]);

useEffect(() => {
    // Ensure the type is set, defaulting to itemType if no options exist.
    if (!isEditMode && typeOptions.length > 0) {
        if (itemConfig.type === itemType || !itemConfig.type) {
            // Set to first available option name
            const firstAvailable = typeOptions.find(t => t.available !== false) || typeOptions[0];
            setItemConfig(prev => ({ ...prev, type: firstAvailable.name }));
        }
    }

    // If in edit mode, ensure the default location is set if the current one is somehow invalid
    if (isEditMode && !itemConfig.location && defaultLocationKey) {
        setItemConfig(prev => ({ ...prev, location: defaultLocationKey }));
    }
}, [isEditMode, itemType, typeOptions, defaultLocationKey]);
    
    // Handler for toggling Type/Add-Ons/Sugar Level
    const handleToggle = (key, value) => {
        if (key === 'selectedAddOns') {
            setItemConfig(prev => {
                const isSelected = prev.selectedAddOns.includes(value);
                return {
                    ...prev,
                    selectedAddOns: isSelected
                        ? prev.selectedAddOns.filter(a => a !== value)
                        : [...prev.selectedAddOns, value]
                };
            });
        } else {
            setItemConfig(prev => ({ ...prev, [key]: value }));
        }
    };

    // Handler for selecting standard sugar level
    const handleSugarSelect = (level) => {
        setItemConfig(prev => ({ ...prev, sugarLevel: level }));
        setCustomSugar('');
    };

    // Handler for custom sugar input change
    const handleCustomSugarChange = (value) => {
        setCustomSugar(value);
        const parsedValue = parseFloat(value);
        if (!isNaN(parsedValue)) {
            setItemConfig(prev => ({ ...prev, sugarLevel: parsedValue }));
        } else {
            if (value === '') {
                 setItemConfig(prev => ({ ...prev, sugarLevel: 0 }));
            }
        }
    };

// Handler for quantity change
const handleQuantityChange = (delta) => {
    setItemConfig(prev => {
        const newQuantity = prev.quantity + delta;
        // Ensure quantity is between 1 and 5
        return { ...prev, quantity: Math.max(1, Math.min(5, newQuantity)) };
    });
};

const handleSave = () => {
    // Type validation is only required if type options exist and a selection is expected
    if (typeOptions.length > 0 && !itemConfig.type) {
        alert("Please select a type.");
        return;
    }

    if (itemConfig.quantity < 1 || isNaN(itemConfig.quantity)) {
         alert("Quantity must be at least 1.");
         return;
    }

    // Validate custom sugar input
    if (customSugar && isNaN(parseFloat(customSugar))) {
         alert("Please enter a valid number for custom sugar level.");
         return;
    }


        if (isEditMode) {
            const newItems = [...currentOrder.items];
            newItems[itemIndex] = itemConfig;
            setCurrentOrder(prev => ({ ...prev, items: newItems }));
        } else {
            setCurrentOrder(prev => ({ ...prev, items: [...prev.items, itemConfig] }));
        }

        // Go directly to the Order Confirmation Page
        setPage('order-confirmation');
    };

    const contentPaddingStyle = {
        padding: '0 24px',
    };

// Style for all button options (Type, Sugar, Add-ons)
const buttonStyle = (isSelected, isAccent = true) => ({
// SMALLER PADDING FOR COMPACT BUTTONS
padding: '8px 12px',
// APPLIED PILL-LIKE ROUND CORNERS
borderRadius: styles.BORDER_RADIUS_PILL,
// REMOVED BORDER
border: 'none',
// Use ACCENT (Green) for main choice (Type/Sugar) and PRIMARY (Blue) for Add-Ons
backgroundColor: isSelected ? (isAccent ? styles.COLOR_ACCENT : styles.COLOR_PRIMARY) : styles.BACKGROUND_LIGHT,
color: isSelected ? (isAccent ? styles.COLOR_TEXT_DARK : '#ffffff') : styles.COLOR_TEXT_DARK,
fontWeight: isSelected ? '700' : '500',
cursor: 'pointer',
transition: 'all 0.2s ease',
// Added stronger shadow for unselected buttons, stronger/darker for selected
boxShadow: isSelected ? styles.SHADOW_ELEVATION_2 : styles.SHADOW_ELEVATION_1,
fontSize: '0.9rem', // Smaller font size
flexGrow: 0, // Resetting flexGrow to 0
textAlign: 'center',
whiteSpace: 'nowrap',
minWidth: '60px', // Smaller minimum width
});
    
    // Style for sugar custom input
    const customSugarInputStyle = {
        ...styles.inputField,
        flexGrow: 1,
        width: 'auto',
        textAlign: 'center',
        padding: '10px',
        fontWeight: '600',
borderColor: (customSugar && !sugarLevels.some(s => s.level === itemConfig.sugarLevel)) ? styles.COLOR_PRIMARY : styles.BORDER_LIGHT,
        marginBottom: 0, // Adjusted for layout in the flex container
        boxShadow: styles.SHADOW_ELEVATION_1,
    };

    // Style for Quantity control
    const quantityControlStyle = {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start', // Align to left for better flow
        marginBottom: '30px',
        width: '100%',
        maxWidth: '250px', 
    };

const quantityButtonStyle = {
// Smaller buttons for quantity control
...buttonStyle(true, false), // Use primary blue for counter buttons
flexGrow: 0,
width: '35px',
height: '35px',
padding: '0',
display: 'flex',
alignItems: 'center',
justifyContent: 'center',
// Override to ensure standard dark blue color
backgroundColor: styles.COLOR_PRIMARY,
color: '#ffffff',
borderRadius: styles.BORDER_RADIUS_PILL, // Ensure pill shape
boxShadow: styles.SHADOW_ELEVATION_2,
border: 'none',
// Set specific width for counter buttons
minWidth: '35px',
fontSize: '0.8rem',
};

const quantityDisplay = {
...styles.inputField,
flexGrow: 1,
textAlign: 'center',
fontWeight: '700',
fontSize: '1.1rem',
// Keep a distinct border for the counter display
border: `2px solid ${styles.COLOR_ACCENT}`, // Green border
margin: '0 8px',
height: '35px',
display: 'flex',
alignItems: 'center',
justifyContent: 'center',
boxShadow: styles.SHADOW_ELEVATION_1,
backgroundColor: '#ffffff', // White background
marginBottom: 0, // Adjusted for layout
color: styles.COLOR_TEXT_DARK,
// Make the counter display rounded too
borderRadius: styles.BORDER_RADIUS_PILL,
};


return (
<div style={styles.centeredContainer}>
<div style={{ ...styles.screenPadding, padding: '0' }}>

                {/* --- HEADER IMAGE BANNER --- */}
                <ImageBanner
                    itemType={itemType}
                    imageUrl={HEADER_IMAGE_URL}
                />

                <div style={contentPaddingStyle}>
                    {/* Main Content Area */}
<h3 style={{ ...styles.headerText, color: styles.COLOR_PRIMARY }}>
    {isEditMode ? 'Edit' : 'Configure'} Your {itemType.charAt(0).toUpperCase() + itemType.slice(1)}
</h3>

<hr style={{ border: 'none', borderTop: `1px solid ${styles.BORDER_LIGHT}`, marginBottom: '20px' }} />

{/* SELECT TYPE (BUTTONS) - CONDITIONALLY RENDERED */}
{/* Only show this section if type options exist (e.g., for Coffee, Tea, Milk, Water). Hides completely for Jaljeera, Shikanji, Maggie. */}
{typeOptions.length > 0 && (
    <>
        <label style={styles.label}>☕ Select Type:</label>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '20px' }}>
            {typeOptions.map(typeObj => (
                <button
                    key={typeObj.name}
                    // Type buttons use Accent (Green)
                    style={{
                        ...buttonStyle(itemConfig.type === typeObj.name, true),
                        flex: '1 1 auto',
                        opacity: typeObj.available ? 1 : 0.5,
                        cursor: typeObj.available ? 'pointer' : 'not-allowed'
                    }} // Added flex for even spacing/wrapping
                    onClick={typeObj.available ? () => handleToggle('type', typeObj.name) : undefined}
                    disabled={!typeObj.available}
                >
                    {typeObj.name}
                    {!typeObj.available && ' (Unavailable)'}
                </button>
            ))}
        </div>
    </>
)}

{/* SUGAR LEVEL (BUTTONS + CUSTOM INPUT) */}
{(itemType === 'coffee' || itemType === 'tea') && (
    <>
        <label style={styles.label}>🍬 Sugar Level (Spoons):</label>
<div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '20px' }}>
{/* Standard Levels (0, 1, 2, 3) */}
{sugarLevels.filter(s => s.available || s.enabled).map(s => (
<button
key={s.level}
// Sugar buttons use Accent (Green)
style={{ ...buttonStyle(itemConfig.sugarLevel === s.level), flex: '1 1 auto' }} // Added flex for even spacing/wrapping
onClick={() => handleSugarSelect(s.level)}
>
{s.level}
</button>
))}
</div>
                        </>
                    )}

{/* Add-Ons (BUTTONS) - For Coffee and Tea */}
{(() => {
    const filteredAddOns = addOns.filter(addOn => (addOn.available || addOn.enabled) && !(itemType === 'coffee' && addOn.name === 'Ginger'));
    return (itemType === 'coffee' || itemType === 'tea') && filteredAddOns.length > 0 && (
<>
<label style={styles.label}>🌿 Spice Add-Ons (Select Multiple):</label>
<div style={{
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
    gap: '12px',
    marginBottom: '20px'
}}>
{filteredAddOns.map(addOn => (
<button
key={addOn.name}
// For Add-Ons, use primary blue color scheme
style={{
    ...buttonStyle(itemConfig.selectedAddOns.includes(addOn.name), false),
    width: '100%',
    minHeight: '40px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    opacity: (addOn.available || addOn.enabled) ? 1 : 0.5,
    cursor: addOn.available ? 'pointer' : 'not-allowed'
}}
onClick={(addOn.available || addOn.enabled) ? () => handleToggle('selectedAddOns', addOn.name) : undefined}
disabled={!(addOn.available || addOn.enabled)}
>
{addOn.name}
{!addOn.available && ' (Unavailable)'}
</button>
))}
</div>
</>
);
})()}

{/* QUANTITY CONTROL (- 1 +) */}
<label style={styles.label}>🔢 Quantity (Cups/Glasses):</label>
                    <div style={quantityControlStyle}>
                        <button 
                            style={quantityButtonStyle} 
                            onClick={() => handleQuantityChange(-1)} 
                            disabled={itemConfig.quantity <= 1} 
                        >
                            <FaMinus />
                        </button>
                        <div style={quantityDisplay}>
                            {itemConfig.quantity}
                        </div>
                        <button 
                            style={quantityButtonStyle} 
                            onClick={() => handleQuantityChange(1)}
                        >
                            <FaPlus />
                        </button>
                    </div>

{/* LOCATION SELECTION */}
<label style={styles.label}>📍 Delivery Location:</label>
{allowedLocations.length > 1 ? (
    <select
        style={styles.selectField}
        value={itemConfig.location}
        onChange={(e) => setItemConfig(prev => ({ ...prev, location: e.target.value }))}
    >
        {allowedLocations.map(loc => (
            <option key={loc.key} value={loc.key}>
                {loc.name}
            </option>
        ))}
    </select>
) : (
    <div style={{
        ...styles.inputField,
        backgroundColor: '#f5f5f5',
        cursor: 'default',
        color: styles.COLOR_TEXT_DARK
    }}>
        {allowedLocations.find(loc => loc.key === defaultLocationKey)?.name || 'Default Location'}
    </div>
)}

                    {/* Notes */}
                    <label style={styles.label}>📝 Notes / Preferences:</label>
                    <textarea
                        style={{ ...styles.inputField, height: '80px', marginBottom: '30px' }}
                        value={itemConfig.notes}
                        onChange={e => setItemConfig({...itemConfig, notes: e.target.value})}
                        placeholder="E.g., Extra hot, light milk"
                    />

                    <button style={styles.primaryButton} onClick={handleSave}>
                        {isEditMode ? 'Update Item' : 'Add Item'}
                    </button>

                    <button
                        style={{ ...styles.secondaryButton, marginTop: '15px', marginBottom: '30px' }} 
                        onClick={() => setPage('home')}
                    >
                        <FaChevronLeft /> Back to Slot Selection
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ItemConfigPage;