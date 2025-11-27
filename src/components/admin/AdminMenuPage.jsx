import React, { useState, useEffect } from 'react';
import { FaSpinner, FaChevronLeft, FaUtensilSpoon, FaCoffee, FaMugHot, FaGlassWhiskey, FaTint, FaLemon, FaCube } from 'react-icons/fa';
import {
    COFFEE_TYPES, TEA_TYPES, MILK_TYPES, WATER_TYPES,
    TABLE_NUMBERS, ADD_ONS, SUGAR_LEVELS,
    getAllowedLocations, USER_LOCATIONS_DATA
} from '../../config/constants';

const AdminMenuPage = ({ user, callApi, setPage, styles }) => {
    const [loading, setLoading] = useState(false);

    // Enhanced styles with Calibri/Cambria fonts and specified colors
    const enhancedStyles = {
        ...styles,
        appContainer: {
            ...styles.appContainer,
            fontFamily: 'Calibri, Arial, sans-serif',
        },
        headerText: {
            ...styles.headerText,
            fontFamily: 'Cambria, serif',
            color: '#103c7f', // Dark Blue
            fontSize: '2rem',
            fontWeight: '700',
            marginBottom: '20px',
        },
        secondaryButton: {
            ...styles.secondaryButton,
            fontFamily: 'Calibri, Arial, sans-serif',
            fontSize: '1rem',
            fontWeight: '600',
        },
        menuCard: {
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            padding: '20px',
            margin: '15px 0',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            border: '1px solid #ddd',
            fontFamily: 'Calibri, Arial, sans-serif',
        },
        categoryHeader: {
            fontSize: '1.4rem',
            fontWeight: '700',
            color: '#103c7f', // Dark Blue
            fontFamily: 'Cambria, serif',
            marginBottom: '15px',
            borderBottom: '2px solid #a1db40', // Green
            paddingBottom: '8px',
        },
        itemList: {
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '10px',
            marginTop: '10px',
        },
        menuItem: {
            backgroundColor: '#f8f9fa',
            padding: '12px',
            borderRadius: '8px',
            border: '1px solid #e9ecef',
            fontSize: '0.95rem',
            fontWeight: '500',
            color: '#333',
            textAlign: 'center',
        },
        screenPadding: {
            ...styles.screenPadding,
            fontFamily: 'Calibri, Arial, sans-serif',
        },
    };

    // Menu categories with their items
    const menuCategories = [
        { name: 'Coffee', icon: <FaCoffee />, items: COFFEE_TYPES, color: '#8B4513' },
        { name: 'Tea', icon: <FaMugHot />, items: TEA_TYPES, color: '#228B22' },
        { name: 'Milk', icon: <FaGlassWhiskey />, items: MILK_TYPES, color: '#F5F5DC' },
        { name: 'Water', icon: <FaTint />, items: WATER_TYPES, color: '#87CEEB' },
        { name: 'Shikanji', icon: <FaLemon />, items: ['Shikanji'], color: '#FFD700' },
        { name: 'Jaljeera', icon: <FaCube />, items: ['Jaljeera'], color: '#8B0000' },
        { name: 'Soup', icon: <FaUtensilSpoon />, items: ['Soup'], color: '#FFA500' },
        { name: 'Maggie', icon: <FaUtensilSpoon />, items: ['Maggie'], color: '#FF6347' },
        { name: 'Oats', icon: <FaUtensilSpoon />, items: ['Oats'], color: '#D2691E' },
    ];

    const addOns = ADD_ONS;
    const sugarLevels = SUGAR_LEVELS;

    useEffect(() => {
        // Could fetch dynamic menu data here if backend supports it
        setLoading(false);
    }, []);

    if (loading) return (
        <div style={enhancedStyles.loadingContainer}>
            <FaSpinner className="spinner" size={30} /> Loading Menu...
        </div>
    );

    return (
        <div style={enhancedStyles.screenPadding}>
            <h2 style={enhancedStyles.headerText}>
                <FaUtensilSpoon style={{ marginRight: '10px' }} />
                Menu Management
            </h2>

            <div style={{ marginBottom: '30px' }}>
                <button
                    style={enhancedStyles.secondaryButton}
                    onClick={() => setPage('admin-dashboard')}
                >
                    <FaChevronLeft /> Back to Admin Dashboard
                </button>
            </div>

            {/* Menu Categories */}
            {menuCategories.map(category => (
                <div key={category.name} style={enhancedStyles.menuCard}>
                    <h3 style={enhancedStyles.categoryHeader}>
                        {category.icon} {category.name}
                    </h3>

                    {category.items && category.items.length > 0 ? (
                        <div style={enhancedStyles.itemList}>
                            {category.items.map(item => (
                                <div key={item} style={enhancedStyles.menuItem}>
                                    {item}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p style={{ color: '#666', fontStyle: 'italic', textAlign: 'center', margin: '20px 0' }}>
                            No specific types - standard {category.name.toLowerCase()} available
                        </p>
                    )}
                </div>
            ))}

            {/* Add-ons Section */}
            <div style={enhancedStyles.menuCard}>
                <h3 style={enhancedStyles.categoryHeader}>
                    <FaUtensilSpoon style={{ marginRight: '8px' }} />
                    Spice Add-Ons
                </h3>
                <div style={enhancedStyles.itemList}>
                    {addOns.map(addOn => (
                        <div key={addOn} style={enhancedStyles.menuItem}>
                            {addOn}
                        </div>
                    ))}
                </div>
            </div>

            {/* Sugar Levels Section */}
            <div style={enhancedStyles.menuCard}>
                <h3 style={enhancedStyles.categoryHeader}>
                    <FaUtensilSpoon style={{ marginRight: '8px' }} />
                    Sugar Levels
                </h3>
                <div style={enhancedStyles.itemList}>
                    {sugarLevels.map(level => (
                        <div key={level} style={{
                            ...enhancedStyles.menuItem,
                            backgroundColor: level === 1 ? '#a1db40' : '#f8f9fa', // Highlight default sugar level
                            color: level === 1 ? '#103c7f' : '#333',
                        }}>
                            {level} {level === 1 ? 'Spoon (Default)' : 'Spoons'}
                        </div>
                    ))}
                </div>
            </div>

            {/* Note about backend integration */}
            <div style={{
                ...enhancedStyles.menuCard,
                backgroundColor: '#fff3cd',
                border: '1px solid #ffeaa7',
                textAlign: 'center'
            }}>
                <p style={{
                    color: '#856404',
                    margin: 0,
                    fontSize: '0.95rem',
                    fontFamily: 'Calibri, Arial, sans-serif'
                }}>
                    <strong>Note:</strong> Menu items are currently managed through the application constants.
                    Full CRUD operations require backend API development.
                </p>
            </div>
        </div>
    );
};

export default AdminMenuPage;