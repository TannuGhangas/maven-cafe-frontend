import React, { useState, useEffect } from 'react';
import { FaSpinner, FaChevronLeft, FaUtensilSpoon } from 'react-icons/fa';

const KitchenMenuPage = ({ user, callApi, setPage, styles }) => {
    const [loading, setLoading] = useState(false);
    const [menuCategories, setMenuCategories] = useState([]);
    const [addOns, setAddOns] = useState([]);
    const [sugarLevels, setSugarLevels] = useState([]);
    const [itemImages, setItemImages] = useState({});

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
            background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
            borderRadius: '15px',
            padding: '25px',
            margin: '20px 0',
            boxShadow: '0 6px 20px rgba(0,0,0,0.1), 0 3px 10px rgba(0,0,0,0.05)',
            border: '1px solid rgba(255,255,255,0.8)',
            fontFamily: 'Calibri, Arial, sans-serif',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            ':hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 8px 25px rgba(0,0,0,0.15), 0 4px 15px rgba(0,0,0,0.1)'
            }
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
            background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
            padding: '15px',
            borderRadius: '12px',
            border: '1px solid rgba(255,255,255,0.8)',
            fontSize: '0.95rem',
            fontWeight: '500',
            color: '#333',
            textAlign: 'center',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
            ':hover': {
                transform: 'translateY(-1px)',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
            }
        },
        screenPadding: {
            ...styles.screenPadding,
            fontFamily: 'Calibri, Arial, sans-serif',
        },
    };

    // Functions for toggling availability
    const toggleItemAvailability = async (catIndex, itemIndex) => {
        const updated = [...menuCategories];
        updated[catIndex].items[itemIndex].available = !updated[catIndex].items[itemIndex].available;
        setMenuCategories(updated);
        await instantSave();
    };

    const toggleAddOnAvailability = async (index) => {
        const updated = [...addOns];
        updated[index].enabled = !updated[index].enabled;
        setAddOns(updated);
        await instantSave();
    };

    const instantSave = async () => {
        try {
            const categoriesToSave = menuCategories.filter(cat => cat.enabled).map(cat => ({
                ...cat,
                items: cat.items // Save all items with availability flags
            }));
            const addOnsToSave = addOns; // Save all add-ons with enabled flags
            const sugarLevelsToSave = sugarLevels; // Save all sugar levels with enabled flags
            await callApi('/menu', 'PUT', {
                userId: user.id,
                userRole: user.role,
                categories: categoriesToSave,
                addOns: addOnsToSave,
                sugarLevels: sugarLevelsToSave,
                itemImages
            });
        } catch (error) {
            console.error('Failed to save menu instantly:', error);
        }
    };

    // Icon mapping
    const getIcon = (iconName) => {
        const icons = {
            FaCoffee: <FaUtensilSpoon />, // Placeholder
            FaMugHot: <FaUtensilSpoon />,
            FaGlassWhiskey: <FaUtensilSpoon />,
            FaTint: <FaUtensilSpoon />,
            FaLemon: <FaUtensilSpoon />,
            FaCube: <FaUtensilSpoon />,
            FaUtensilSpoon: <FaUtensilSpoon />
        };
        return icons[iconName] || <FaUtensilSpoon />;
    };

    useEffect(() => {
        // Load from localStorage or fetch
        const savedCategories = localStorage.getItem('adminMenuCategories');
        const savedAddOns = localStorage.getItem('adminAddOns');
        const savedSugarLevels = localStorage.getItem('adminSugarLevels');
        const savedItemImages = localStorage.getItem('adminItemImages');

        if (savedCategories) {
            const parsed = JSON.parse(savedCategories);
            const updated = parsed.map(cat => ({
                ...cat,
                items: (cat.items || []).map(item => typeof item === 'string' ? { name: item, available: true } : item)
            }));
            setMenuCategories(updated);
        }

        if (savedAddOns) {
            const parsed = JSON.parse(savedAddOns);
            const normalized = parsed.map(addOn => typeof addOn === 'string' ? { name: addOn, enabled: true } : addOn);
            setAddOns(normalized);
        }

        if (savedSugarLevels) {
            setSugarLevels(JSON.parse(savedSugarLevels));
        }

        if (savedItemImages) {
            setItemImages(JSON.parse(savedItemImages));
        }

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
                Menu Availability Management
            </h2>

            <div style={{ marginBottom: '30px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <button
                    style={enhancedStyles.secondaryButton}
                    onClick={() => setPage('kitchen-dashboard')}
                >
                    <FaChevronLeft /> Back to Orders
                </button>
            </div>

            {/* Menu Categories */}
            {menuCategories.filter(cat => cat.enabled).map((category, catIndex) => (
                <div key={category.name} style={enhancedStyles.menuCard}>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        gap: '10px'
                    }}>
                        <h3 style={{
                            ...enhancedStyles.categoryHeader,
                            margin: 0,
                            flex: '1 1 auto',
                            minWidth: '200px'
                        }}>
                            {getIcon(category.icon)} {category.name}
                        </h3>
                    </div>

                    {category.items && category.items.length > 0 ? (
                        <div style={enhancedStyles.itemList}>
                            {category.items.map((item, itemIndex) => (
                                <div key={item.name} style={{
                                    ...enhancedStyles.menuItem,
                                    position: 'relative',
                                    opacity: item.available ? 1 : 0.5,
                                    background: item.available ? enhancedStyles.menuItem.background : 'linear-gradient(135deg, #f5f5f5 0%, #e9ecef 100%)'
                                }}>
                                    {item.name}
                                    <div style={{ position: 'absolute', top: '5px', right: '5px', display: 'flex', gap: '2px', alignItems: 'center' }}>
                                        <button
                                            style={{
                                                backgroundColor: item.available ? '#4CAF50' : '#f44336',
                                                color: 'white',
                                                border: 'none',
                                                borderRadius: '15px',
                                                padding: '2px 8px',
                                                cursor: 'pointer',
                                                fontSize: '0.7rem',
                                                fontWeight: 'bold'
                                            }}
                                            onClick={() => toggleItemAvailability(catIndex, itemIndex)}
                                            title={item.available ? 'Mark Unavailable' : 'Mark Available'}
                                        >
                                            {item.available ? 'ON' : 'OFF'}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p style={{ color: '#666', fontStyle: 'italic', textAlign: 'center', margin: '20px 0' }}>
                            No items available
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
                    {addOns.map((addOn, index) => (
                        <div key={addOn.name || addOn} style={{
                            ...enhancedStyles.menuItem,
                            position: 'relative',
                            opacity: addOn.enabled !== false ? 1 : 0.5
                        }}>
                            {addOn.name || addOn}
                            <div style={{ position: 'absolute', top: '5px', right: '5px', display: 'flex', gap: '2px', alignItems: 'center' }}>
                                <button
                                    style={{
                                        backgroundColor: addOn.enabled !== false ? '#4CAF50' : '#f44336',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '15px',
                                        padding: '2px 8px',
                                        cursor: 'pointer',
                                        fontSize: '0.7rem',
                                        fontWeight: 'bold'
                                    }}
                                    onClick={() => toggleAddOnAvailability(index)}
                                    title={addOn.enabled !== false ? 'Disable' : 'Enable'}
                                >
                                    {addOn.enabled !== false ? 'ON' : 'OFF'}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Note */}
            <div style={{
                ...enhancedStyles.menuCard,
                backgroundColor: '#d4edda',
                border: '1px solid #c3e6cb',
                textAlign: 'center'
            }}>
                <p style={{
                    color: '#155724',
                    margin: 0,
                    fontSize: '0.95rem',
                    fontFamily: 'Calibri, Arial, sans-serif'
                }}>
                    <strong>Real-time Updates:</strong> Changes are instantly applied and users cannot order unavailable items.
                </p>
            </div>
        </div>
    );
};

export default KitchenMenuPage;