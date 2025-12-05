import React, { useState, useEffect } from 'react';
import { FaSpinner, FaChevronLeft, FaUtensilSpoon, FaCoffee, FaMugHot, FaGlassWhiskey, FaTint, FaLemon, FaCube, FaPlus, FaEdit, FaTrash, FaToggleOn, FaToggleOff } from 'react-icons/fa';
import {
    COFFEE_TYPES, TEA_TYPES, WATER_TYPES,
    TABLE_NUMBERS, ADD_ONS, SUGAR_LEVELS,
    getAllowedLocations, USER_LOCATIONS_DATA
} from '../../config/constants';

const AdminMenuPage = ({ user, callApi, setPage, styles }) => {
    const [loading, setLoading] = useState(false);
    const [menuCategories, setMenuCategories] = useState([]);
    const [addOns, setAddOns] = useState([]);
    const [sugarLevels, setSugarLevels] = useState([]);
    const [menuItems, setMenuItems] = useState({}); // category -> items array
    const [itemImages, setItemImages] = useState({});
    const [showModal, setShowModal] = useState(false);
    const [modalData, setModalData] = useState({ type: '', category: '', index: -1, value: '', name: '', icon: '', color: '' });

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

    // Functions for CRUD operations
    const saveToStorage = () => {
        localStorage.setItem('adminMenuCategories', JSON.stringify(menuCategories));
        localStorage.setItem('adminAddOns', JSON.stringify(addOns));
        localStorage.setItem('adminSugarLevels', JSON.stringify(sugarLevels));
    };

    const openModal = (type, category = '', index = -1, value = '') => {
        if (type === 'editCategory') {
            const cat = menuCategories[index];
            setModalData({ type, index, name: cat.name, icon: cat.icon, color: cat.color });
        } else if (type === 'editImage') {
            setModalData({ type, category, index, value, image: itemImages[value.toLowerCase()] || '' });
        } else {
            setModalData({ type, category, index, value, name: '', icon: '', color: '' });
        }
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setModalData({ type: '', category: '', index: -1, value: '', name: '', icon: '', color: '' });
    };

    const saveModal = () => {
        const { type, category, index, value, name, icon, color, image } = modalData;

        if (type === 'editCategory') {
            if (!name.trim()) return;
            editCategory(index, { name: name.trim(), icon, color });
        } else if (type === 'addItem') {
            if (!value.trim()) return;
            const catIndex = menuCategories.findIndex(c => c.name === category);
            if (catIndex >= 0) {
                const updated = [...menuCategories];
                updated[catIndex].items.push({ name: value.trim(), available: true });
                setMenuCategories(updated);
            }
        } else if (type === 'editItem') {
            if (!value.trim()) return;
            const catIndex = menuCategories.findIndex(c => c.name === category);
            if (catIndex >= 0) {
                const updated = [...menuCategories];
                updated[catIndex].items[index].name = value.trim();
                setMenuCategories(updated);
            }
        } else if (type === 'addAddOn') {
            if (!value.trim()) return;
            setAddOns([...addOns, { name: value.trim(), available: true }]);
        } else if (type === 'editAddOn') {
            if (!value.trim()) return;
            const updated = [...addOns];
            updated[index] = { ...updated[index], name: value.trim() };
            setAddOns(updated);
        } else if (type === 'addSugar') {
            const level = parseInt(value);
            if (!isNaN(level) && !sugarLevels.some(s => s.level === level)) {
                setSugarLevels([...sugarLevels, { level, available: true }].sort((a, b) => a.level - b.level));
            }
        }

        saveToStorage();
        closeModal();
    };

    const removeItem = (categoryIndex, itemIndex) => {
        if (window.confirm('Are you sure you want to remove this item?')) {
            const updated = [...menuCategories];
            updated[categoryIndex].items.splice(itemIndex, 1);
            setMenuCategories(updated);
            saveToStorage();
        }
    };

    const removeAddOn = (index) => {
        if (window.confirm('Are you sure you want to remove this add-on?')) {
            const updated = [...addOns];
            updated.splice(index, 1);
            setAddOns(updated);
            saveToStorage();
        }
    };

    const removeSugarLevel = (level) => {
        if (window.confirm('Are you sure you want to remove this sugar level?')) {
            setSugarLevels(sugarLevels.filter(l => l.level !== level));
            saveToStorage();
        }
    };

    // Category CRUD
    const addCategory = () => {
        const newCat = { name: 'New Category', icon: 'FaUtensilSpoon', items: [], color: '#000000' };
        setMenuCategories([...menuCategories, newCat]);
        saveToStorage();
    };

    const editCategory = (index, updated) => {
        const newCats = [...menuCategories];
        newCats[index] = { ...newCats[index], ...updated };
        setMenuCategories(newCats);
        saveToStorage();
    };

    const deleteCategory = (index) => {
        if (window.confirm('Delete this category and all its items?')) {
            setMenuCategories(menuCategories.filter((_, i) => i !== index));
            saveToStorage();
        }
    };

    // Image management
    const updateItemImage = (itemName, imageUrl) => {
        setItemImages({ ...itemImages, [itemName.toLowerCase()]: imageUrl });
        saveToStorage();
    };

    // Icon mapping
    const getIcon = (iconName) => {
        const icons = { FaCoffee, FaMugHot, FaGlassWhiskey, FaTint, FaLemon, FaCube, FaUtensilSpoon };
        const IconComponent = icons[iconName];
        return IconComponent ? <IconComponent /> : <FaUtensilSpoon />;
    };

    useEffect(() => {
        const fetchMenu = async () => {
            try {
                const menu = await callApi('/menu', 'GET', {}, false, { userId: user.id, userRole: user.role });
                if (menu) {
                    setMenuCategories(menu.categories || []);
                    setAddOns(menu.addOns || []);
                    setSugarLevels(menu.sugarLevels || []);
                    setItemImages(menu.itemImages || {});
                }
            } catch (error) {
                console.error('Failed to fetch menu:', error);
                // Fallback to defaults
                setMenuCategories([
                    { name: 'Coffee', icon: 'FaCoffee', items: [{ name: "Black", available: true }, { name: "Milk", available: true }, { name: "Simple", available: true }, { name: "Cold", available: true }], color: '#8B4513', enabled: true },
                    { name: 'Tea', icon: 'FaMugHot', items: [{ name: "Black", available: true }, { name: "Milk", available: true }, { name: "Green", available: true }], color: '#228B22', enabled: true },
                    { name: 'Water', icon: 'FaTint', items: [{ name: "Warm", available: true }, { name: "Cold", available: true }, { name: "Hot", available: true }, { name: "Lemon", available: true }], color: '#87CEEB', enabled: true },
                ]);
                setAddOns([{ name: "Ginger", available: true }]);
                setSugarLevels([{ level: 0, available: true }, { level: 1, available: true }, { level: 2, available: true }, { level: 3, available: true }]);
                setItemImages({
                    tea: 'https://tmdone-cdn.s3.me-south-1.amazonaws.com/store-covers/133003776906429295.jpg',
                    coffee: 'https://i.pinimg.com/474x/7a/29/df/7a29dfc903d98c6ba13b687ef1fa1d1a.jpg',
                    water: 'https://images.stockcake.com/public/d/f/f/dffca756-1b7f-4366-8b89-4ad6f9bbf88a_large/chilled-water-glass-stockcake.jpg',
                });
            }
            setLoading(false);
        };
        fetchMenu();
    }, [user, callApi]);

    const saveMenu = async (showAlert = true) => {
        try {
            const filteredCategories = menuCategories.filter(cat => cat.enabled).map(cat => ({
                ...cat,
                items: cat.items.filter(item => item.available)
            }));
            const filteredAddOns = addOns.map(addOn => addOn.name);
            const filteredSugarLevels = sugarLevels.map(s => s.level);
            await callApi('/menu', 'PUT', {
                userId: user.id,
                userRole: user.role,
                categories: filteredCategories,
                addOns: filteredAddOns,
                sugarLevels: filteredSugarLevels,
                itemImages
            });
            saveToStorage();
            if (showAlert) alert('Menu updated successfully!');
        } catch (error) {
            alert('Failed to update menu on server: ' + error.message);
        }
    };

    const instantSave = async () => {
        try {
            const filteredCategories = menuCategories.filter(cat => cat.enabled).map(cat => ({
                ...cat,
                items: cat.items.filter(item => item.available)
            }));
            const filteredAddOns = addOns.map(addOn => addOn.name);
            const filteredSugarLevels = sugarLevels.map(s => s.level);
            await callApi('/menu', 'PUT', {
                userId: user.id,
                userRole: user.role,
                categories: filteredCategories,
                addOns: filteredAddOns,
                sugarLevels: filteredSugarLevels,
                itemImages
            });
            saveToStorage();
        } catch (error) {
            console.error('Failed to save menu instantly:', error);
        }
    };

    const toggleCategory = async (index) => {
        const updated = [...menuCategories];
        updated[index].enabled = !updated[index].enabled;
        setMenuCategories(updated);
        saveToStorage();
        await instantSave();
    };


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

            <div style={{ marginBottom: '30px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <button
                    style={enhancedStyles.secondaryButton}
                    onClick={() => setPage('admin-dashboard')}
                >
                    <FaChevronLeft /> Back to Admin Dashboard
                </button>
                <button
                    style={enhancedStyles.primaryButton}
                    onClick={addCategory}
                >
                    <FaPlus /> Add Category
                </button>
                <button
                    style={enhancedStyles.primaryButton}
                    onClick={saveMenu}
                >
                    Save Changes
                </button>
            </div>

            {/* Menu Categories */}
            {menuCategories.map((category, catIndex) => (
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
                        <div style={{
                            display: 'flex',
                            gap: '8px',
                            flexWrap: 'wrap',
                            alignItems: 'center'
                        }}>
                            <button
                                style={{
                                    background: 'linear-gradient(135deg, #007aff 0%, #0056cc 100%)',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '10px',
                                    padding: '8px 12px',
                                    cursor: 'pointer',
                                    fontSize: '0.8rem',
                                    fontWeight: '600',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '5px',
                                    whiteSpace: 'nowrap',
                                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                    boxShadow: '0 3px 8px rgba(0,122,255,0.3)',
                                    transform: 'translateY(0)',
                                    ':hover': {
                                        transform: 'translateY(-1px)',
                                        boxShadow: '0 5px 15px rgba(0,122,255,0.4)'
                                    }
                                }}
                                onClick={() => openModal('editCategory', '', catIndex)}
                                title="Edit Category"
                            >
                                <FaEdit />
                                Edit
                            </button>
                            <button
                                style={{
                                    background: 'linear-gradient(135deg, #ff3b30 0%, #d63027 100%)',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '10px',
                                    padding: '8px 12px',
                                    cursor: 'pointer',
                                    fontSize: '0.8rem',
                                    fontWeight: '600',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '5px',
                                    whiteSpace: 'nowrap',
                                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                    boxShadow: '0 3px 8px rgba(255,59,48,0.3)',
                                    transform: 'translateY(0)',
                                    ':hover': {
                                        transform: 'translateY(-1px)',
                                        boxShadow: '0 5px 15px rgba(255,59,48,0.4)'
                                    }
                                }}
                                onClick={() => deleteCategory(catIndex)}
                                title="Delete Category"
                            >
                                <FaTrash />
                                Delete
                            </button>
                            <button
                                style={{
                                    ...enhancedStyles.primaryButton,
                                    fontSize: '0.8rem',
                                    padding: '8px 12px',
                                    whiteSpace: 'nowrap',
                                    background: 'linear-gradient(135deg, #a1db40 0%, #8bc34a 100%)',
                                    boxShadow: '0 3px 8px rgba(161,219,64,0.3)',
                                    transform: 'translateY(0)',
                                    ':hover': {
                                        transform: 'translateY(-1px)',
                                        boxShadow: '0 5px 15px rgba(161,219,64,0.4)'
                                    }
                                }}
                                onClick={() => openModal('addItem', category.name)}
                            >
                                <FaPlus /> Add Item
                            </button>
                        </div>
                    </div>

                    {category.items && category.items.length > 0 ? (
                        <div style={enhancedStyles.itemList}>
                            {category.items.map((item, itemIndex) => (
                                <div key={item.name} style={{
                                    ...enhancedStyles.menuItem,
                                    position: 'relative'
                                }}>
                                    {item.name}
                                    <div style={{ position: 'absolute', top: '5px', right: '5px', display: 'flex', gap: '2px', alignItems: 'center' }}>
                                        <button
                                            style={{ background: 'none', border: 'none', color: '#007aff', cursor: 'pointer', fontSize: '0.8rem' }}
                                            onClick={() => openModal('editItem', category.name, itemIndex, item.name)}
                                            title="Edit Name"
                                        >
                                            <FaEdit />
                                        </button>
                                        <button
                                            style={{ background: 'none', border: 'none', color: '#ff3b30', cursor: 'pointer', fontSize: '0.8rem' }}
                                            onClick={() => {
                                                if (window.confirm(`Remove ${item.name}?`)) removeItem(catIndex, itemIndex);
                                            }}
                                            title="Remove"
                                        >
                                            <FaTrash />
                                        </button>
                                    </div>
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
                    <button
                        style={{ ...enhancedStyles.primaryButton, marginLeft: 'auto', fontSize: '0.8rem', padding: '5px 10px' }}
                        onClick={() => openModal('addAddOn')}
                    >
                        <FaPlus /> Add
                    </button>
                </h3>
                <div style={enhancedStyles.itemList}>
                    {addOns.length > 0 ? addOns.map((addOn, index) => (
                        <div key={addOn.name} style={{
                            ...enhancedStyles.menuItem,
                            minHeight: '80px' // Ensure minimum height for button space
                        }}>
                            <div style={{ marginBottom: '10px', fontSize: '1rem', fontWeight: '600' }}>
                                {addOn.name}
                            </div>
                            <div style={{ position: 'absolute', bottom: '5px', right: '5px', display: 'flex', gap: '5px', alignItems: 'center' }}>
                                <button
                                    style={{ 
                                        background: 'linear-gradient(135deg, #007aff 0%, #0056cc 100%)', 
                                        color: 'white', 
                                        border: 'none', 
                                        borderRadius: '10px', 
                                        padding: '8px 12px', 
                                        cursor: 'pointer', 
                                        fontSize: '0.8rem', 
                                        fontWeight: '600',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '6px',
                                        boxShadow: '0 3px 6px rgba(0,122,255,0.4)',
                                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                        ':hover': {
                                            transform: 'translateY(-2px)',
                                            boxShadow: '0 6px 12px rgba(0,122,255,0.6)'
                                        }
                                    }}
                                    onClick={() => openModal('editAddOn', '', index, addOn.name)}
                                    title={`Edit add-on ${addOn.name}`}
                                >
                                    <FaEdit style={{ fontSize: '0.8rem' }} />
                                    <span>Edit</span>
                                </button>
                                <button
                                    style={{ 
                                        background: 'linear-gradient(135deg, #ff3b30 0%, #d63027 100%)', 
                                        color: 'white', 
                                        border: 'none', 
                                        borderRadius: '10px', 
                                        padding: '8px 12px', 
                                        cursor: 'pointer', 
                                        fontSize: '0.8rem', 
                                        fontWeight: '600',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '6px',
                                        boxShadow: '0 3px 6px rgba(255,59,48,0.4)',
                                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                        ':hover': {
                                            transform: 'translateY(-2px)',
                                            boxShadow: '0 6px 12px rgba(255,59,48,0.6)'
                                        }
                                    }}
                                    onClick={() => {
                                        if (window.confirm(`🗑️ Remove add-on "${addOn.name}"?`)) {
                                            removeAddOn(index);
                                            // Auto-save after removing add-on
                                            setTimeout(() => saveMenu(false), 100);
                                        }
                                    }}
                                    title={`Remove add-on ${addOn.name}`}
                                >
                                    <FaTrash style={{ fontSize: '0.8rem' }} />
                                    <span>Remove</span>
                                </button>
                            </div>
                        </div>
                    )) : (
                        <div style={{
                            ...enhancedStyles.menuItem,
                            backgroundColor: '#fff3cd',
                            borderColor: '#ffeaa7',
                            color: '#856404',
                            textAlign: 'center',
                            padding: '20px'
                        }}>
                            <p style={{ margin: 0, fontStyle: 'italic' }}>
                                No add-ons configured. Click "Add" to create spice add-ons.
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Sugar Levels Section */}
            <div style={enhancedStyles.menuCard}>
                <h3 style={enhancedStyles.categoryHeader}>
                    <FaUtensilSpoon style={{ marginRight: '8px' }} />
                    Sugar Levels
                    <button
                        style={{ ...enhancedStyles.primaryButton, marginLeft: 'auto', fontSize: '0.8rem', padding: '5px 10px' }}
                        onClick={() => openModal('addSugar')}
                    >
                        <FaPlus /> Add
                    </button>
                </h3>
                <div style={enhancedStyles.itemList}>
                    {sugarLevels.length > 0 ? sugarLevels.map((level, index) => (
                        <div key={level.level} style={{
                            ...enhancedStyles.menuItem,
                            backgroundColor: level.level === 1 ? '#a1db40' : '#f8f9fa', // Highlight default sugar level
                            color: level.level === 1 ? '#103c7f' : '#333',
                            minHeight: '80px' // Ensure minimum height for button space
                        }}>
                            <div style={{ marginBottom: '10px' }}>
                                {level.level} {level.level === 1 ? 'Spoon (Default)' : 'Spoons'}
                            </div>
                            <div style={{ position: 'absolute', bottom: '5px', right: '5px', display: 'flex', gap: '5px', alignItems: 'center' }}>
                                <button
                                    style={{ 
                                        background: 'linear-gradient(135deg, #ff3b30 0%, #d63027 100%)', 
                                        color: 'white', 
                                        border: 'none', 
                                        borderRadius: '10px', 
                                        padding: '8px 12px', 
                                        cursor: 'pointer', 
                                        fontSize: '0.8rem', 
                                        fontWeight: '600',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '6px',
                                        boxShadow: '0 3px 6px rgba(255,59,48,0.4)',
                                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                        ':hover': {
                                            transform: 'translateY(-2px)',
                                            boxShadow: '0 6px 12px rgba(255,59,48,0.6)'
                                        }
                                    }}
                                    onClick={() => {
                                        if (level.level === 1) {
                                            if (window.confirm(`⚠️ WARNING: This is the default sugar level. Remove it anyway?`)) {
                                                removeSugarLevel(level.level);
                                                // Auto-save after removing default level
                                                setTimeout(() => saveMenu(false), 100);
                                            }
                                        } else {
                                            if (window.confirm(`🗑️ Remove sugar level ${level.level}?`)) {
                                                removeSugarLevel(level.level);
                                                // Auto-save after removing level
                                                setTimeout(() => saveMenu(false), 100);
                                            }
                                        }
                                    }}
                                    title={`Remove sugar level ${level.level}`}
                                >
                                    <FaTrash style={{ fontSize: '0.8rem' }} />
                                    <span>Remove</span>
                                </button>
                            </div>
                        </div>
                    )) : (
                        <div style={{
                            ...enhancedStyles.menuItem,
                            backgroundColor: '#fff3cd',
                            borderColor: '#ffeaa7',
                            color: '#856404',
                            textAlign: 'center',
                            padding: '20px'
                        }}>
                            <p style={{ margin: 0, fontStyle: 'italic' }}>
                                No sugar levels configured. Click "Add" to create sugar level options.
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Note about persistence */}
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
                    <strong>Success:</strong> Menu items are now dynamically managed and saved to the database.
                    Changes are instantly reflected across all users and kitchen staff.
                </p>
            </div>

            {/* Modal for Add/Edit */}
            {showModal && (
                <div style={styles.modalOverlay}>
                    <div style={styles.modalContent}>
                        <h3 style={{ marginTop: 0, color: '#103c7f' }}>
                            {modalData.type === 'editCategory' ? 'Edit Category' :
                              modalData.type === 'addItem' ? `Add ${modalData.category} Item` :
                              modalData.type === 'editItem' ? `Edit ${modalData.category} Item` :
                              modalData.type === 'addAddOn' ? 'Add Spice Add-On' :
                              modalData.type === 'editAddOn' ? 'Edit Spice Add-On' :
                              'Add Sugar Level'}
                        </h3>
                        {modalData.type === 'editCategory' ? (
                            <div>
                                <label>Name:</label>
                                <input
                                    type="text"
                                    value={modalData.name}
                                    onChange={(e) => setModalData({ ...modalData, name: e.target.value })}
                                    style={styles.inputField}
                                    placeholder="Category name"
                                />
                                <label>Icon:</label>
                                <select
                                    value={modalData.icon}
                                    onChange={(e) => setModalData({ ...modalData, icon: e.target.value })}
                                    style={styles.selectField}
                                >
                                    <option value="FaCoffee">Coffee</option>
                                    <option value="FaMugHot">Tea</option>
                                    <option value="FaGlassWhiskey">Milk</option>
                                    <option value="FaTint">Water</option>
                                    <option value="FaLemon">Lemon</option>
                                    <option value="FaCube">Cube</option>
                                    <option value="FaUtensilSpoon">Utensil</option>
                                </select>
                                <label>Color:</label>
                                <input
                                    type="color"
                                    value={modalData.color}
                                    onChange={(e) => setModalData({ ...modalData, color: e.target.value })}
                                    style={styles.inputField}
                                />
                            </div>
                        ) : (
                            <input
                                type={modalData.type === 'addSugar' ? 'number' : 'text'}
                                value={modalData.value}
                                onChange={(e) => setModalData({ ...modalData, value: e.target.value })}
                                placeholder={modalData.type === 'addSugar' ? 'Enter sugar level (number)' : 'Enter name'}
                                style={styles.inputField}
                                autoFocus
                            />
                        )}
                        <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                            <button style={styles.primaryButton} onClick={saveModal}>
                                Save
                            </button>
                            <button style={styles.secondaryButton} onClick={closeModal}>
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminMenuPage;