// src/components/user/ItemConfigPage.jsx

import React, { useState, useEffect } from 'react';
import { FaChevronLeft } from 'react-icons/fa';
import { 
    LOCATIONS, COFFEE_TYPES, TEA_TYPES, 
    MILK_TYPES, WATER_TYPES, SUGAR_LEVELS, 
    TABLE_NUMBERS 
} from '../../config/constants';

// --- Configuration Image URL ---
// 🔑 You can paste the image URL for the configuration banner here:
const HEADER_IMAGE_URL = 'https://png.pngtree.com/thumb_back/fh260/background/20250808/pngtree-steaming-cup-of-tea-with-lavender-on-blue-fabric-background-cozy-image_17717402.webp'; 
// ---------------------------------

// Helper component for the image banner (Re-used structure from previous pages)
const ImageBanner = ({ itemType, styles, imageUrl }) => {
    const title = `${itemType.charAt(0).toUpperCase() + itemType.slice(1)} Configuration`;
    
    // Apply professional styling to the banner container
    const bannerStyle = {
        height: '150px',
        width: '100%',
        marginBottom: '25px',
        borderRadius: '0 0 16px 16px', 
        overflow: 'hidden',
        boxShadow: '0 5px 15px rgba(0, 0, 0, 0.1)',
        position: 'relative',
    };

    const imageStyle = {
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.6)), url(${imageUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        height: '100%',
        display: 'flex',
        alignItems: 'flex-end',
        padding: '15px 20px',
    };

    const textStyle = {
        fontSize: '1.6rem',
        fontWeight: '800',
        color: '#ffffff',
        textShadow: '0 1px 4px rgba(0, 0, 0, 0.8)',
    };

    return (
        <div style={bannerStyle}>
            <div style={imageStyle}>
                <h1 style={textStyle}>{title}</h1>
            </div>
        </div>
    );
};

// Main Component
const ItemConfigPage = ({ 
    itemType, setPage, currentOrder, 
    setCurrentOrder, isEditMode, itemIndex, styles 
}) => {
    
    const typeOptions = 
        itemType === 'coffee' ? COFFEE_TYPES :
        itemType === 'tea' ? TEA_TYPES :
        itemType === 'milk' ? MILK_TYPES :
        itemType === 'water' ? WATER_TYPES : [];

    // Initialize itemConfig state
    const [itemConfig, setItemConfig] = useState(
        isEditMode ? currentOrder.items[itemIndex] : 
        {
            item: itemType,
            type: typeOptions.length > 0 ? typeOptions[0] : '', // Set default type if available
            sugarLevel: 1,
            quantity: 1,
            location: LOCATIONS[0],
            tableNo: null,
            customLocation: '', 
            notes: ''
        }
    );

    useEffect(() => {
        // This ensures if the component is mounted for a new item, it gets the correct default type
        if (!isEditMode && typeOptions.length > 0 && itemConfig.type === '') {
            setItemConfig(prev => ({ ...prev, type: typeOptions[0] }));
        }
    }, [isEditMode, itemType]);

    const handleSave = () => {
        if (!itemConfig.type) {
             alert("Please select a type.");
             return;
        }
        
        // Validation for 'Others' location
        if (itemConfig.location === 'Others') {
             if (itemConfig.tableNo === null) {
                alert("Please select a table number.");
                return;
             }
        }

        if (isEditMode) {
            const newItems = [...currentOrder.items];
            newItems[itemIndex] = itemConfig;
            setCurrentOrder(prev => ({ ...prev, items: newItems }));
        } else {
            setCurrentOrder(prev => ({ ...prev, items: [...prev.items, itemConfig] }));
        }
        setPage('item-selection');
    };
    
    // Apply base screen padding for the content below the banner
    const contentPaddingStyle = {
        padding: '0 20px', // Horizontal padding to align with other pages
    };

    return (
        <div style={{ ...styles.appContainer, padding: '0' }}>
            
            {/* Image Banner Component */}
            <ImageBanner 
                itemType={itemType} 
                styles={styles} 
                imageUrl={HEADER_IMAGE_URL} 
            />

            <div style={contentPaddingStyle}>
                {/* Main Content Area */}
                <h3 style={{ fontSize: '1.4rem', color: styles.SECONDARY_COLOR }}>
                    {isEditMode ? 'Edit' : 'Configure'} {itemType.charAt(0).toUpperCase() + itemType.slice(1)}
                </h3>
                
                <hr style={{ border: 'none', borderTop: '1px solid #eee', marginBottom: '20px' }} />
                
                {/* Type Selection */}
                <label style={styles.label}>Select Type:</label>
                <select 
                    style={styles.selectField}
                    value={itemConfig.type} 
                    onChange={e => setItemConfig({...itemConfig, type: e.target.value})}
                >
                    {typeOptions.map(t => <option key={t} value={t}>{t}</option>)}
                </select>

                {/* Sugar Level (if applicable) */}
                {(itemType === 'coffee' || itemType === 'tea') && (
                    <>
                        <label style={styles.label}>Sugar Level (Spoons):</label>
                        <select 
                            style={styles.selectField}
                            value={itemConfig.sugarLevel} 
                            onChange={e => setItemConfig({...itemConfig, sugarLevel: parseInt(e.target.value)})}
                        >
                            {SUGAR_LEVELS.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                    </>
                )}

                {/* Quantity */}
                <label style={styles.label}>Quantity (Cups/Glasses):</label>
                <input 
                    style={styles.inputField}
                    type="number" 
                    min="1" 
                    value={itemConfig.quantity} 
                    onChange={e => setItemConfig({...itemConfig, quantity: parseInt(e.target.value)})}
                />

                {/* Location Selection */}
                <label style={styles.label}>Delivery Location:</label>
                <select 
                    style={styles.selectField}
                    value={itemConfig.location} 
                    // Clear tableNo/customLocation when location changes
                    onChange={e => setItemConfig({...itemConfig, location: e.target.value, tableNo: null, customLocation: ''})}
                >
                    {LOCATIONS.map(l => <option key={l} value={l}>{l}</option>)}
                </select>

                {/* Table Number */}
                {itemConfig.location === 'Others' && (
                    <>
                        <label style={styles.label}>Table Number (1-25):</label>
                        <select 
                            style={styles.selectField}
                            value={itemConfig.tableNo || ''} 
                            onChange={e => setItemConfig({...itemConfig, tableNo: parseInt(e.target.value)})}
                        >
                            <option value="">Select Table</option>
                            {TABLE_NUMBERS.map(n => <option key={n} value={n}>{n}</option>)}
                        </select>
                    </>
                )}
                
                {/* Notes */}
                <label style={styles.label}>Notes / Preferences:</label>
                <textarea 
                    style={{ ...styles.inputField, height: '60px', marginBottom: '30px' }}
                    value={itemConfig.notes} 
                    onChange={e => setItemConfig({...itemConfig, notes: e.target.value})}
                    placeholder="E.g., Extra hot, light milk"
                />

                <button style={styles.primaryButton} onClick={handleSave}>
                    {isEditMode ? 'Update Item' : 'Add Item'}
                </button>
                
                <button 
                    style={{ ...styles.secondaryButton, marginBottom: '20px' }} 
                    onClick={() => setPage('item-selection')}
                >
                    <FaChevronLeft /> Back to Items
                </button>
            </div>
        </div>
    );
};

export default ItemConfigPage;