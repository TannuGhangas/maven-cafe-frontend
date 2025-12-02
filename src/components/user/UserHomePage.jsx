import React, { useState, useEffect } from 'react';
import { FaCoffee, FaMugHot, FaGlassWhiskey, FaTint, FaLemon, FaCube, FaUtensilSpoon, FaSpinner } from 'react-icons/fa'; // Added FaLemon and FaCube for new items
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
        backgroundColor: VARS.COLOR_PRIMARY, // Dark Blue PRIMARY
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
        backgroundColor: VARS.COLOR_ACCENT, // Green ACCENT for secondary
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
        height: '200px',
        width: '100%',
        marginBottom: '30px', // Reduced margin
        borderRadius: `0 0 ${VARS.BORDER_RADIUS_LG} ${VARS.BORDER_RADIUS_LG}`,
        overflow: 'hidden',
        boxShadow: VARS.SHADOW_ELEVATION_3,
        position: 'relative',
    },
    backgroundImage: (url) => ({
        // Reduced dark overlay (0.4 max) for brighter header image
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
bannerTitle: {
fontSize: '2rem',
fontWeight: '900',
color: '#ffffff',
textShadow: '0 3px 8px rgba(0, 0, 0, 0.9)',
lineHeight: '1.1',
margin: '0',
fontFamily: 'Cambria, serif',
},
    bannerSubtitle: {
        fontSize: '1rem',
        color: 'rgba(255, 255, 255, 0.95)',
        fontWeight: '500',
        marginTop: '8px',
        textShadow: '0 1px 3px rgba(0, 0, 0, 0.8)',
        margin: '0',
    },

    // --- COMPONENT: SLOT SELECTION ---
    slotContainer: {
        display: 'flex',
        gap: '10px', // Reduced gap
        marginBottom: '30px', // Reduced margin
        flexWrap: 'wrap',
        justifyContent: 'space-between', // Use space-between for better small button layout
    },
    slotButton: (isSelected) => ({
        // MADE BUTTONS MUCH SMALLER
        flex: '1 1 48%',
        minWidth: '100px',
        padding: '10px 15px', // Reduced padding significantly
        borderRadius: VARS.BORDER_RADIUS_SM,
        border: isSelected ? 'none' : `1px solid #e0e0e0`,
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        textAlign: 'center',
        backgroundColor: isSelected ? VARS.COLOR_PRIMARY : '#ffffff', // Dark Blue PRIMARY
        color: isSelected ? '#ffffff' : VARS.COLOR_TEXT_DARK,
        fontWeight: isSelected ? '700' : '600',
        fontSize: '0.9rem', // Reduced font size
        boxShadow: isSelected ? VARS.SHADOW_ELEVATION_2 : VARS.SHADOW_ELEVATION_1,
        transform: isSelected ? 'scale(1.03)' : 'scale(1)',
        display: 'flex',
        flexDirection: 'column',
    }),
    smallText: (isSelected) => ({
        fontSize: '0.75rem', // Reduced font size
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
        marginBottom: '30px', // Reduced margin
    },
    itemButton: {
        // FIX: Removed redundant 'display: 'block'' that caused the warning.
        width: '100%',
        height: '150px', // Keep height consistent for now
        padding: '0',
        borderRadius: VARS.BORDER_RADIUS_SM,
        border: 'none',
        overflow: 'hidden',
        position: 'relative',
        cursor: 'pointer',
        boxShadow: VARS.SHADOW_ELEVATION_1,
        backgroundColor: '#ffffff', // Card background color
        textAlign: 'left',
        transition: 'transform 0.2s, box-shadow 0.2s',
        display: 'flex', // Make button a flex container (KEEP THIS)
        flexDirection: 'column', // Stack image and text
        justifyContent: 'space-between', // Distribute space
    },
imageContainer: (itemName, itemImages) => ({
width: '100%',
height: '100%', // Take up most of the card height
// Removed linear gradient for a bright image
backgroundImage: itemImages[itemName] ? `url(${itemImages[itemName]})` : 'none',
backgroundSize: 'cover',
backgroundPosition: 'center',
backgroundRepeat: 'no-repeat',
// Removed flex properties as text will be separate
// Removed color and text-shadow as text is now outside this container
}),
    itemText: {
        margin: '0',
        display: 'block', // Ensure text is visible
        padding: '10px 15px', // Padding for the text at the bottom
        color: VARS.COLOR_TEXT_DARK, // Dark text color
        fontWeight: '600', // Semibold
        fontSize: '1.1rem', // Adjust font size
    },

    // --- COMPONENT: BREAK CARD ---
    breakCard: {
        marginTop: '40px', // Reduced margin
        backgroundColor: '#FFFFFF',
        borderRadius: VARS.BORDER_RADIUS_LG,
        padding: '30px 25px',
        boxShadow: VARS.SHADOW_ELEVATION_3,
        textAlign: 'center',
        margin: '40px 24px 0 24px', // Consolidated margin. Top margin is the one that's reduced
        width: 'auto',
        border: `1px solid #f0f0f0`,
    },
breakTitle: {
fontSize: '1.6rem',
fontWeight: '900',
color: VARS.COLOR_PRIMARY, // Dark Blue PRIMARY
marginBottom: '10px',
fontFamily: 'Cambria, serif',
},
    breakSubtitle: {
        fontSize: '0.9rem',
        color: VARS.COLOR_TEXT_MUTED,
        margin: '0 0 10px 0'
    },
    breakInspiration: {
        fontSize: '1rem',
        color: VARS.COLOR_TEXT_DARK,
        fontWeight: '600',
        marginTop: '10px',
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
        { name: 'shikanji', icon: FaLemon },
        { name: 'jaljeera', icon: FaCube },
        { name: 'soup', icon: FaUtensilSpoon },
        { name: 'maggie', icon: FaUtensilSpoon },
        { name: 'oats', icon: FaUtensilSpoon },
    ];
};


// -----------------

const timeSlots = [
    // Added description for the small text
    { title: 'Morning', slot: 'morning (9:00-12:00)'},
    { title: 'Afternoon', slot: 'afternoon (1:00 - 5:30)'},
];

const UserHomePage = ({ setPage, currentOrder, setCurrentOrder, user, styles: _propStyles }) => {
const [itemButtons, setItemButtons] = useState([]);
const [itemImages, setItemImages] = useState({});
const [loading, setLoading] = useState(true);

// KEPT ORIGINAL USER URL
const HEADER_IMAGE_URL = 'https://tmdone-cdn.s3.me-south-1.amazonaws.com/store-covers/133003776906429295.jpg';

const currentHour = new Date().getHours();
const greeting = currentHour < 12 ? 'Good Morning!' : 'Hello there!';
const primaryMessage = `${greeting} Ready to order?`;

const currentSlotTitle = timeSlots.find(s => s.slot === currentOrder.slot)?.title || 'Your Slot';

useEffect(() => {
    const fetchMenu = async (silent = false) => {
        try {
            const menu = await callApi(`/menu?userId=${user.id}&userRole=${user.role}`, 'GET', null, silent);
            if (menu && menu.categories) {
                // Filter out 'milk' category, but keep all items (available and unavailable)
                const filteredCategories = menu.categories.filter(cat => cat.name.toLowerCase() !== 'milk');
                const buttons = filteredCategories.map(cat => ({
                    name: cat.name.toLowerCase(),
                    icon: cat.icon === 'FaCoffee' ? FaCoffee :
                          cat.icon === 'FaMugHot' ? FaMugHot :
                          cat.icon === 'FaGlassWhiskey' ? FaGlassWhiskey :
                          cat.icon === 'FaTint' ? FaTint :
                          cat.icon === 'FaLemon' ? FaLemon :
                          cat.icon === 'FaCube' ? FaCube :
                          FaUtensilSpoon,
                    items: cat.items || [] // Include items for availability check
                }));
                setItemButtons(buttons);
                setItemImages(menu.itemImages || {});
            } else {
                // Fallback
                setItemButtons([
                    { name: 'coffee', icon: FaCoffee },
                    { name: 'tea', icon: FaMugHot },
                    { name: 'water', icon: FaTint },
                    { name: 'shikanji', icon: FaLemon },
                    { name: 'jaljeera', icon: FaCube },
                    { name: 'soup', icon: FaUtensilSpoon },
                    { name: 'maggie', icon: FaUtensilSpoon },
                    { name: 'oats', icon: FaUtensilSpoon },
                ]);
                setItemImages({
                    tea: 'https://tmdone-cdn.s3.me-south-1.amazonaws.com/store-covers/133003776906429295.jpg',
                    coffee: 'https://i.pinimg.com/474x/7a/29/df/7a29dfc903d98c6ba13b687ef1fa1d1a.jpg',
                    water: 'https://images.stockcake.com/public/d/f/f/dffca756-1b7f-4366-8b89-4ad6f9bbf88a_large/chilled-water-glass-stockcake.jpg',
                    shikanji: 'https://i.pinimg.com/736x/1f/fd/08/1ffd086ffef72a98f234162a312cfe39.jpg',
                    jaljeera: 'https://i.ndtvimg.com/i/2018-02/jaljeera_620x330_81517570928.jpg',
                    soup: 'https://www.inspiredtaste.net/wp-content/uploads/2018/10/Homemade-Vegetable-Soup-Recipe-2-1200.jpg',
                    maggie: 'https://i.pinimg.com/736x/5c/6d/9f/5c6d9fe78de73a7698948e011d6745f1.jpg',
                    oats: 'https://images.moneycontrol.com/static-mcnews/2024/08/20240827041559_oats.jpg?impolicy=website&width=1600&height=900',
                });
            }
            setLoading(false);
        } catch (error) {
            console.error('Failed to fetch menu:', error);
            // Fallback
            setItemButtons([
                { name: 'coffee', icon: FaCoffee },
                { name: 'tea', icon: FaMugHot },
                { name: 'water', icon: FaTint },
                { name: 'shikanji', icon: FaLemon },
                { name: 'jaljeera', icon: FaCube },
                { name: 'soup', icon: FaUtensilSpoon },
                { name: 'maggie', icon: FaUtensilSpoon },
                { name: 'oats', icon: FaUtensilSpoon },
            ]);
        }
    };
    fetchMenu();
    // Refetch every 30 seconds to get updates (silently)
    const interval = setInterval(() => fetchMenu(true), 30000);
    return () => clearInterval(interval);
}, [user]);

if (loading) {
return (
<div style={STYLES_THEME.centeredContainer}>
<div style={{ ...STYLES_THEME.screenPadding, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
<FaSpinner className="spinner" size={30} /> Loading menu...
</div>
</div>
);
}

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

{/* Break Card */}
<div style={STYLES_THEME.breakCard}>
<h3 style={STYLES_THEME.breakTitle}>☕ Time for a break ☕</h3>
<p style={STYLES_THEME.breakSubtitle}>
-Crafted with 💖 in Maven jobs, Panipat-
</p>
<p style={STYLES_THEME.breakInspiration}>
The next slot is available for you to plan your perfect pause.
</p>
</div>
</div>
</div>
);
};

export default UserHomePage;