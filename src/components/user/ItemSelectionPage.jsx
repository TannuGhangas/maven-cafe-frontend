// src/components/user/ItemSelectionPage.jsx

import React from 'react';
import { FaCoffee, FaMugHot, FaGlassWhiskey, FaTint, FaChevronLeft } from 'react-icons/fa';

const ItemSelectionPage = ({ setPage, currentOrder }) => {
    // ---------------------------------------------------------------------
    // 🎨 STYLES DEFINITION (Enhanced to position name inside image)
    // ---------------------------------------------------------------------
    const itemImages = {
        tea: 'url("https://tmdone-cdn.s3.me-south-1.amazonaws.com/store-covers/133003776906429295.jpg")', // Corresponds to 'Tea Cup' in the figure
        coffee: 'url("https://i.pinimg.com/474x/7a/29/df/7a29dfc903d98c6ba13b687ef1fa1d1a.jpg")', // Corresponds to 'Coffee' in the figure
        milk: 'url("https://www.shutterstock.com/image-photo/almond-milk-cup-glass-on-600nw-2571172141.jpg")', // Placeholder: Replace with an appropriate milk image
        water: 'url("https://images.stockcake.com/public/d/f/f/dffca756-1b7f-4366-8b89-4ad6f9bbf88a_large/chilled-water-glass-stockcake.jpg")', // Placeholder: Replace with an appropriate water image
    };

    const styles = {
        // Mimics the light background of the app screen
        screenPadding: { 
            padding: '0 0 100px 0', 
            backgroundColor: '#f5f5f5', 
            minHeight: '100vh',
            fontFamily: 'sans-serif'
        },

        // Item Selection Grid (Stacking the full-width cards)
        itemSelectionGrid: {
            display: 'flex',
            flexDirection: 'column',
            gap: '15px',
            padding: '0 20px',
        },

        // Individual Item Button (The Card/Image Frame)
        itemButton: {
            display: 'block',
            width: '100%',
            height: '200px', // Fixed height for the card/image frame
            padding: '0',
            borderRadius: '10px',
            border: 'none',
            overflow: 'hidden',
            position: 'relative',
            cursor: 'pointer',
            boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
            backgroundColor: '#ffffff',
            textAlign: 'left',
            transition: 'transform 0.2s', // Aesthetic transition
        },
        
        // Styles for the inner container mimicking the image
        imageContainer: (itemName) => ({
            width: '100%',
            height: '100%',
            
            // 🛑 KEY CHANGE: Apply a dark gradient overlay to ensure text visibility
            background: `linear-gradient(to top, rgba(0, 0, 0, 0.5) 0%, rgba(0, 0, 0, 0) 50%), ${itemImages[itemName]}`,
            
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            
            // Position the text at the bottom-left
            display: 'flex',
            alignItems: 'flex-end',
            padding: '15px 20px', // Increased bottom padding for better appearance
            boxSizing: 'border-box',
            
            // 🛑 TEXT STYLING TO MATCH IMAGE AESTHETICS
            color: 'white',
            fontWeight: '900', // Very bold
            fontSize: '24px', // Large, prominent text
            textShadow: '0 2px 4px rgba(0, 0, 0, 0.9)', // Strong shadow for contrast
            textTransform: 'capitalize', // Better look than all caps over image
        }),
        
        // Styles for the text and icon (overridden to be hidden/styled differently)
        itemText: {
            // These elements must remain hidden as the text is rendered directly as a child of imageContainer
            margin: '0', 
            display: 'none', 
        },

        // Primary Button (Review Items) - Orange accent color
        primaryButton: {
            width: 'calc(100% - 40px)',
            margin: '30px 20px 10px 20px',
            padding: '15px',
            borderRadius: '10px',
            backgroundColor: '#ff5722',
            color: 'white',
            border: 'none',
            fontSize: '18px',
            fontWeight: 'bold',
            cursor: 'pointer',
            boxShadow: '0 4px 6px rgba(255, 87, 34, 0.3)',
        },

        // Secondary Button (Back to Slot)
        secondaryButton: {
            width: 'calc(100% - 40px)',
            margin: '10px 20px',
            padding: '15px',
            borderRadius: '10px',
            backgroundColor: '#ffffff',
            color: '#333',
            border: '1px solid #ddd',
            fontSize: '16px',
            fontWeight: '600',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '5px'
        },
        
        // Styles for the header
        headerStyle: {
            padding: '20px 20px 10px 20px',
            backgroundColor: '#f5f5f5',
            margin: '0',
            color: '#333',
            fontWeight: '600',
        }
    };
    // ---------------------------------------------------------------------
    
    const itemButtons = [
        { name: 'coffee', icon: FaCoffee },
        { name: 'tea', icon: FaMugHot },
        { name: 'milk', icon: FaGlassWhiskey },
        { name: 'water', icon: FaTint },
    ];
    
    return (
        <div style={styles.screenPadding}>
            <h3 style={styles.headerStyle}>Order for: **{currentOrder.slot}**</h3>
            <div style={styles.itemSelectionGrid}>
                {itemButtons.map(item => (
                    <button 
                        key={item.name}
                        style={styles.itemButton}
                        onClick={() => setPage(`item-config-${item.name}`)}
                    >
                        {/* The item name is now prominently styled inside this div */}
                        <div style={styles.imageContainer(item.name)}>
                            {/* The original icon and <br> are hidden but kept to not change the original text logic */}
                            <item.icon size={30} style={styles.itemText} /><br style={styles.itemText} />
                            
                            {/* 🛑 Display the text inside the image container */}
                            {item.name.toUpperCase()}
                        </div>
                    </button>
                ))}
            </div>
            
            {currentOrder.items.length > 0 && (
                <button 
                    style={styles.primaryButton} 
                    onClick={() => setPage('order-confirmation')}
                >
                    Review {currentOrder.items.length} Item(s)
                </button>
            )}
            
            <button 
                style={styles.secondaryButton} 
                onClick={() => setPage('home')}
            >
                <FaChevronLeft /> Back to Slot
            </button>
        </div>
    );
};

export default ItemSelectionPage;