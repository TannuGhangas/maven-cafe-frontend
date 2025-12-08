import React, { useState, useEffect } from 'react';
import { FaCoffee, FaMugHot, FaGlassWhiskey, FaTint, FaLemon, FaCube, FaUtensilSpoon } from 'react-icons/fa'; // Added FaLemon and FaCube for new items
import { callApi } from '../../api/apiService';

/**
 * 🎨 THEME VARIABLES - PRESERVED KEYS
 * Changed values for a fresher, cleaner aesthetic.
 */
const VARS = {
    // ☕ Color Palette - UPDATED TO USER REQUESTED COLORS
    COLOR_PRIMARY: '#103c7f', // Dark Blue
    COLOR_ACCENT: '#a1db40', // Green
    COLOR_BG_LIGHT: '#fcfcfc',
    COLOR_TEXT_DARK: '#212121',
    COLOR_TEXT_MUTED: '#757575',
    
    // 📐 Sizing & Radius
    BORDER_RADIUS_LG: '18px',
    BORDER_RADIUS_SM: '10px',

    // ✨ Shadows (Updated to use new ACCENT color)
    SHADOW_ELEVATION_1: '0 2px 8px rgba(0, 0, 0, 0.05)',
    SHADOW_ELEVATION_2: '0 8px 20px rgba(161, 219, 64, 0.5)', // Using new Green ACCENT color for selection shadow
    SHADOW_ELEVATION_3: '0 10px 30px rgba(0, 0, 0, 0.1)',
};

/**
 * 💅 STYLES_THEME - BEAUTIFIED & ORGANIZED (KEYS PRESERVED)
 * Adjusted vertical margins for less gap/space.
 */
export const STYLES_THEME = {
    // --- LAYOUT & BASE STYLES ---
    centeredContainer: {
        maxWidth: '480px',
        margin: '0 auto',
        boxShadow: VARS.SHADOW_ELEVATION_1,
        backgroundColor: VARS.COLOR_BG_LIGHT,
        minHeight: '100vh',
    },
    screenPadding: {
        padding: '0 0 30px 0', // Reduced bottom padding
        fontFamily: 'Inter, system-ui, sans-serif',
        minHeight: '100vh',
        backgroundColor: VARS.COLOR_BG_LIGHT,
    },
    contentArea: {
        padding: '0 24px',
    },
    
    // --- TYPOGRAPHY & HEADERS ---
headerText: {
fontSize: '1.3rem',
fontWeight: '800',
color: VARS.COLOR_TEXT_DARK,
marginBottom: '20px', // Reduced margin
borderLeft: `5px solid ${VARS.COLOR_ACCENT}`, // Use Green ACCENT color
paddingLeft: '10px',
fontFamily: 'Cambria, serif',
},
    label: {
        display: 'block',
        fontSize: '0.95rem',
        fontWeight: '700',
        color: VARS.COLOR_TEXT_DARK,
        marginTop: '20px',
        marginBottom: '8px',
    },

    // --- FORMS & INPUTS ---
    inputField: {
        width: '100%',
        padding: '14px',
        borderRadius: VARS.BORDER_RADIUS_SM,
        border: '1px solid #e0e0e0',
        boxSizing: 'border-box',
        fontSize: '1rem',
        backgroundColor: '#ffffff',
        boxShadow: 'inset 0 1px 3px rgba(0, 0, 0, 0.03)',
        transition: 'border-color 0.3s',
    },
    selectField: {
        width: '100%',
        padding: '14px',
        borderRadius: VARS.BORDER_RADIUS_SM,
        border: '1px solid #e0e0e0',
        boxSizing: 'border-box',
        fontSize: '1rem',
        backgroundColor: '#ffffff',
        appearance: 'none',
        backgroundImage: 'url("https://tmdone-cdn.s3.me-south-1.amazonaws.com/store-covers/133003776906429295.jpg")',
backgroundRepeat: 'no-repeat',
backgroundPosition: 'right 15px center',
backgroundSize: '12px',
},

// --- BUTTONS ---
primaryButton: {
width: '100%',
padding: '18px',
borderRadius: VARS.BORDER_RADIUS_SM,
backgroundColor: VARS.COLOR_PRIMARY,
color: 'white',
border: 'none',
fontSize: '1.1rem',
fontWeight: 'bold',
cursor: 'pointer',
boxShadow: `0 6px 15px ${VARS.COLOR_PRIMARY}60`,
transition: 'all 0.3s ease',
marginTop: '30px',
},
secondaryButton: {
width: '100%',
padding: '15px',
borderRadius: VARS.BORDER_RADIUS_SM,
backgroundColor: VARS.COLOR_ACCENT,
color: VARS.COLOR_TEXT_DARK,
border: `1px solid ${VARS.COLOR_ACCENT}50`,
fontSize: '1rem',
fontWeight: '600',
cursor: 'pointer',
display: 'flex',
alignItems: 'center',
justifyContent: 'center',
gap: '8px',
boxShadow: VARS.SHADOW_ELEVATION_1,
transition: 'all 0.3s ease',
},

// --- COMPONENT: HEADER BANNER ---
headerBanner: {
height: '120px',
width: '100%',
marginBottom: '20px',
borderRadius: `0 0 ${VARS.BORDER_RADIUS_LG} ${VARS.BORDER_RADIUS_LG}`,
overflow: 'hidden',
boxShadow: VARS.SHADOW_ELEVATION_3,
position: 'relative',
marginTop: '0', // Attach directly to navbar
},
bannerTitle: {
fontSize: '1.5rem',
fontWeight: '900',
color: '#ffffff',
textShadow: '0 2px 4px rgba(0, 0, 0, 0.9)',
lineHeight: '1.1',
margin: '0',
fontFamily: 'Cambria, serif',
},
bannerSubtitle: {
fontSize: '0.9rem',
color: 'rgba(255, 255, 255, 0.95)',
fontWeight: '500',
marginTop: '4px',
textShadow: '0 1px 2px rgba(0, 0, 0, 0.8)',
margin: '0',
},
backgroundImage: (url) => ({
backgroundImage: `linear-gradient(to top, rgba(0, 0, 0, 0.4) 0%, rgba(0, 0, 0, 0.1) 100%), url(${url || 'https://placehold.co/800x230/4a4a4a/ffffff?text=Add+Image+URL'})`,
backgroundSize: 'cover',
backgroundPosition: 'center',
height: '100%',
display: 'flex',
flexDirection: 'column',
justifyContent: 'center',
alignItems: 'center',
padding: '0 24px',
textAlign: 'center',
}),

// --- COMPONENT: SLOT SELECTION ---
slotContainer: {
display: 'flex',
gap: '10px',
marginBottom: '30px',
flexWrap: 'wrap',
justifyContent: 'space-between',
},
slotButton: (isSelected) => ({
flex: '1 1 48%',
minWidth: '100px',
padding: '10px 15px',
borderRadius: VARS.BORDER_RADIUS_SM,
border: isSelected ? 'none' : `1px solid #e0e0e0`,
cursor: 'pointer',
transition: 'all 0.3s ease',
textAlign: 'center',
backgroundColor: isSelected ? VARS.COLOR_PRIMARY : '#ffffff',
color: isSelected ? '#ffffff' : VARS.COLOR_TEXT_DARK,
fontWeight: isSelected ? '700' : '600',
fontSize: '0.9rem',
boxShadow: isSelected ? VARS.SHADOW_ELEVATION_2 : VARS.SHADOW_ELEVATION_1,
transform: isSelected ? 'scale(1.03)' : 'scale(1)',
display: 'flex',
flexDirection: 'column',
}),
smallText: (isSelected) => ({
fontSize: '0.75rem',
color: isSelected ? 'rgba(255, 255, 255, 0.9)' : VARS.COLOR_TEXT_MUTED,
fontWeight: '500',
display: 'block',
marginTop: '5px',
}),

// --- COMPONENT: ITEM SELECTION ---
itemHeader: {
fontSize: '1.2rem',
fontWeight: '800',
color: VARS.COLOR_TEXT_DARK,
marginBottom: '20px',
textAlign: 'left',
},
itemSelectionGrid: {
display: 'grid',
gridTemplateColumns: '1fr 1fr',
gap: '15px',
marginBottom: '30px',
},
itemButton: {
width: '100%',
height: '150px',
padding: '0',
borderRadius: VARS.BORDER_RADIUS_SM,
border: 'none',
overflow: 'hidden',
position: 'relative',
cursor: 'pointer',
boxShadow: VARS.SHADOW_ELEVATION_1,
backgroundColor: '#ffffff',
textAlign: 'left',
transition: 'transform 0.2s, box-shadow 0.2s',
display: 'flex',
flexDirection: 'column',
justifyContent: 'space-between',
},
imageContainer: (itemName, itemImages) => ({
width: '100%',
height: '100%',
backgroundImage: itemImages[itemName] ? `url(${itemImages[itemName]})` : 'none',
backgroundSize: 'cover',
backgroundPosition: 'center',
backgroundRepeat: 'no-repeat',
}),
itemText: {
margin: '0',
display: 'block',
padding: '10px 15px',
color: VARS.COLOR_TEXT_DARK,
fontWeight: '600',
fontSize: '1.1rem',
},

// --- COMPONENT: FOOTER ---
footerCard: {
marginTop: '40px',
backgroundColor: '#FFFFFF',
borderRadius: VARS.BORDER_RADIUS_LG,
padding: '0',
boxShadow: VARS.SHADOW_ELEVATION_3,
textAlign: 'center',
margin: '40px 24px 0 24px',
width: 'auto',
height: '120px', // Match header banner height
border: `1px solid #f0f0f0`,
display: 'flex',
flexDirection: 'column',
justifyContent: 'center',
alignItems: 'center',
position: 'relative',
overflow: 'hidden',
background: `linear-gradient(135deg, ${VARS.COLOR_PRIMARY}15 0%, ${VARS.COLOR_ACCENT}10 100%)`,
},
footerContent: {
padding: '0 20px',
zIndex: 1,
},
footerTitle: {
fontSize: '1.4rem',
fontWeight: '900',
color: VARS.COLOR_PRIMARY,
marginBottom: '8px',
fontFamily: 'Cambria, serif',
textShadow: '0 1px 2px rgba(0,0,0,0.1)',
},
footerSubtitle: {
fontSize: '0.95rem',
color: VARS.COLOR_TEXT_MUTED,
margin: '0',
fontWeight: '500',
lineHeight: '1.4',
},
footerInspiration: {
fontSize: '0.85rem',
color: VARS.COLOR_TEXT_DARK,
fontWeight: '600',
marginTop: '6px',
fontStyle: 'italic',
},
};

// --- ITEM DATA ---
const getItemButtons = () => {
try {
const saved = localStorage.getItem('adminMenuCategories');
if (saved) {
const categories = JSON.parse(saved);
return categories.map(cat => ({
name: cat.name.toLowerCase(),
icon: cat.icon === 'FaCoffee' ? FaCoffee :
cat.icon === 'FaMugHot' ? FaMugHot :
cat.icon === 'FaGlassWhiskey' ? FaGlassWhiskey :
cat.icon === 'FaTint' ? FaTint :
cat.icon === 'FaLemon' ? FaLemon :
cat.icon === 'FaCube' ? FaCube :
FaUtensilSpoon
}));
}
} catch {}
// Default
return [
{ name: 'coffee', icon: FaCoffee },
{ name: 'tea', icon: FaMugHot },
{ name: 'water', icon: FaTint },
];
};


// -----------------

const timeSlots = [
// Added description for the small text
{ title: 'Morning', slot: 'morning (9:00-12:00)'},
{ title: 'Evening', slot: 'evening (1:00 - 5:30)'},
];

const UserHomePage = ({ setPage, currentOrder, setCurrentOrder, user, styles: _propStyles }) => {
const [itemButtons, setItemButtons] = useState([]);
const [itemImages, setItemImages] = useState({});

// KEPT ORIGINAL USER URL
const HEADER_IMAGE_URL = 'https://tmdone-cdn.s3.me-south-1.amazonaws.com/store-covers/133003776906429295.jpg';

const currentHour = new Date().getHours();
const greeting = currentHour < 12 ? 'Good Morning!' : 'Hello there!';
const primaryMessage = `${greeting} Ready to order?`;

const currentSlotTitle = timeSlots.find(s => s.slot === currentOrder.slot)?.title || 'Your Slot';

useEffect(() => {
// Helper function to get icon component
const getIconForCategory = (iconName) => {
const iconMap = {
'FaCoffee': FaCoffee,
'FaMugHot': FaMugHot,
'FaGlassWhiskey': FaGlassWhiskey,
'FaTint': FaTint,
'FaLemon': FaLemon,
'FaCube': FaCube,
'FaUtensilSpoon': FaUtensilSpoon
};
return iconMap[iconName] || FaUtensilSpoon;
};

// Load cached menu immediately for instant display
const loadCachedMenu = () => {
const cachedMenu = localStorage.getItem('cachedMenu');
if (cachedMenu) {
try {
const menu = JSON.parse(cachedMenu);
if (menu && menu.categories) {
const filteredCategories = menu.categories.filter(cat => cat.name.toLowerCase() !== 'milk');
const buttons = filteredCategories.map(cat => ({
name: cat.name.toLowerCase(),
icon: getIconForCategory(cat.icon),
items: cat.items || []
}));
setItemButtons(buttons);
setItemImages(menu.itemImages || {});
return true;
}
} catch (e) {
console.warn('Failed to parse cached menu:', e);
}
}
return false;
};

// Set default menu immediately
if (!loadCachedMenu()) {
setItemButtons([
{ name: 'coffee', icon: FaCoffee },
{ name: 'tea', icon: FaMugHot },
{ name: 'water', icon: FaTint },
]);
setItemImages({
tea: 'https://tmdone-cdn.s3.me-south-1.amazonaws.com/store-covers/133003776906429295.jpg',
coffee: 'https://i.pinimg.com/474x/7a/29/df/7a29dfc903d98c6ba13b687ef1fa1d1a.jpg',
water: 'https://images.stockcake.com/public/d/f/f/dffca756-1b7f-4366-8b89-4ad6f9bbf88a_large/chilled-water-glass-stockcake.jpg',
});
}

// Fetch fresh menu data in background (no loading state)
const fetchMenuInBackground = async () => {
try {
const menu = await callApi(`/menu?userId=${user.id}&userRole=${user.role}`, 'GET', null, true);
if (menu && menu.categories) {
localStorage.setItem('cachedMenu', JSON.stringify(menu));
const filteredCategories = menu.categories.filter(cat => cat.name.toLowerCase() !== 'milk');
const buttons = filteredCategories.map(cat => ({
name: cat.name.toLowerCase(),
icon: getIconForCategory(cat.icon),
items: cat.items || []
}));
setItemButtons(buttons);
setItemImages(menu.itemImages || {});
}
} catch (error) {
console.warn('Background menu fetch failed:', error);
}
};

fetchMenuInBackground();
}, [user]);



return (
<div style={STYLES_THEME.centeredContainer}>
<div style={STYLES_THEME.screenPadding}>
{/* Image Header Section */}
<div style={STYLES_THEME.headerBanner}>
<div style={STYLES_THEME.backgroundImage(HEADER_IMAGE_URL)}>
<h1 style={STYLES_THEME.bannerTitle}>{primaryMessage}</h1>
<p style={STYLES_THEME.bannerSubtitle}>Fuel your day with a delicious order.</p>
</div>
</div>

<div style={STYLES_THEME.contentArea}>
{/* Slot Selection Content */}
<h2 style={STYLES_THEME.headerText}>Select Your Time Slot: 🕓</h2>
<div style={STYLES_THEME.slotContainer}>
{timeSlots.map(({ title, slot, description }) => (
<button
key={slot}
style={STYLES_THEME.slotButton(currentOrder.slot === slot)}
onClick={() => {
setCurrentOrder(prev => ({ ...prev, slot }));
}}
>
{title}
<small style={STYLES_THEME.smallText(currentOrder.slot === slot)}>
{description}
</small>
</button>
))}
</div>

{/* Item Selection Grid (Rendered only when a slot is selected) */}
{currentOrder.slot && (
<>
<h3 style={STYLES_THEME.itemHeader}>Select Items for {currentSlotTitle} 🍲</h3>
<div style={STYLES_THEME.itemSelectionGrid}>
{itemButtons.filter(item => {
const hasAvailableItems = (item.items || []).some(it => typeof it === 'string' || it.available !== false);
return hasAvailableItems; // Only show categories with available items
}).map(item => (
<button
key={item.name}
style={STYLES_THEME.itemButton}
onClick={() => setPage(`item-config-${item.name}`)}
>
<div style={STYLES_THEME.imageContainer(item.name, itemImages)}>
&nbsp; {/* Ensure div has content for background to show */}
</div>
<p style={STYLES_THEME.itemText}>
{item.name.charAt(0).toUpperCase() + item.name.slice(1)}
</p>
</button>
))}
</div>
</>
)}
</div>

{/* Footer */}
<div style={STYLES_THEME.footerCard}>
<div style={STYLES_THEME.footerContent}>
<h3 style={STYLES_THEME.footerTitle}>☕ Take a Moment ☕</h3>
<p style={STYLES_THEME.footerSubtitle}>
Crafted with 💖 at Maven Jobs, Panipat
</p>
<p style={STYLES_THEME.footerInspiration}>
Perfect moments deserve perfect pauses
</p>
</div>
</div>
</div>
</div>
);
};

export default UserHomePage;