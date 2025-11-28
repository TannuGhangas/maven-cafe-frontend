import React, { useState, useEffect } from 'react';
import { FaSpinner, FaChevronLeft, FaUtensilSpoon, FaCoffee, FaMugHot, FaGlassWhiskey, FaTint, FaLemon, FaCube, FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import {
    COFFEE_TYPES, TEA_TYPES, MILK_TYPES, WATER_TYPES,
    TABLE_NUMBERS, ADD_ONS, SUGAR_LEVELS,
    getAllowedLocations, USER_LOCATIONS_DATA
} from '../../config/constants';

const AdminMenuPage = ({ user, callApi, setPage, styles }) => {
    const [loading, setLoading] = useState(false);
    const [menuCategories, setMenuCategories] = useState([]);
    const [addOns, setAddOns] = useState([]);
    const [sugarLevels, setSugarLevels] = useState([]);
    const [itemImages, setItemImages] = useState({});
    const [showModal, setShowModal] = useState(false);
    const [modalData, setModalData] = useState({ type: '', category: '', index: -1, value: '', name: '', icon: '', color: '', image: '' });

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

    // Functions for CRUD operations
    const saveToStorage = () => {
        localStorage.setItem('adminMenuCategories', JSON.stringify(menuCategories));
        localStorage.setItem('adminAddOns', JSON.stringify(addOns));
        localStorage.setItem('adminSugarLevels', JSON.stringify(sugarLevels));
    };

    const openModal = (type, category = '', index = -1, value = '') => {
        if (type === 'editCategory') {
            const cat = menuCategories[index];
            setModalData({ type, index, name: cat.name, icon: cat.icon, color: cat.color, image: cat.image });
        } else if (type === 'editImage') {
            setModalData({ type, category, index, value, image: itemImages[value.toLowerCase()] || '' });
        } else {
            setModalData({ type, category, index, value, name: '', icon: '', color: '', image: '' });
        }
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setModalData({ type: '', category: '', index: -1, value: '' });
    };

    const saveModal = () => {
        const { type, category, index, value, name, icon, color, image } = modalData;

        if (type === 'editCategory') {
            if (!name.trim()) return;
            editCategory(index, { name: name.trim(), icon, color, image });
        } else if (type === 'editImage') {
            updateItemImage(value, image);
        } else if (type === 'addItem') {
            if (!value.trim()) return;
            const catIndex = menuCategories.findIndex(c => c.name === category);
            if (catIndex >= 0) {
                const updated = [...menuCategories];
                updated[catIndex].items.push(value.trim());
                setMenuCategories(updated);
            }
        } else if (type === 'editItem') {
            if (!value.trim()) return;
            const catIndex = menuCategories.findIndex(c => c.name === category);
            if (catIndex >= 0) {
                const updated = [...menuCategories];
                updated[catIndex].items[index] = value.trim();
                setMenuCategories(updated);
            }
        } else if (type === 'addAddOn') {
            if (!value.trim()) return;
            setAddOns([...addOns, value.trim()]);
        } else if (type === 'editAddOn') {
            if (!value.trim()) return;
            const updated = [...addOns];
            updated[index] = value.trim();
            setAddOns(updated);
        } else if (type === 'addSugar') {
            const level = parseInt(value);
            if (!isNaN(level) && !sugarLevels.includes(level)) {
                setSugarLevels([...sugarLevels, level].sort((a, b) => a - b));
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
            setSugarLevels(sugarLevels.filter(l => l !== level));
            saveToStorage();
        }
    };

    // Category CRUD
    const addCategory = () => {
        const newCat = { name: 'New Category', icon: 'FaUtensilSpoon', items: [], color: '#000000', image: '' };
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

    const fetchMenu = async () => {
        setLoading(true);
        const data = await callApi(`/menu?userId=${user.id}&userRole=${user.role}`, 'GET');
        if (data) {
            setMenuCategories(data.categories || []);
            setAddOns(data.addOns || []);
            setSugarLevels(data.sugarLevels || []);
            setItemImages(data.itemImages || {});
        }
        setLoading(false);
    };

    const saveMenu = async () => {
        const data = await callApi('/menu', 'PUT', { categories: menuCategories, addOns, sugarLevels, itemImages, userId: user.id, userRole: user.role });
        if (data && data.success) {
            alert('Menu updated successfully!');
        }
    };

    useEffect(() => {
        fetchMenu();
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
                    <h3 style={enhancedStyles.categoryHeader}>
                        {getIcon(category.icon)} {category.name}
                        <div style={{ float: 'right', display: 'flex', gap: '5px' }}>
                            <button
                                style={{ background: 'none', border: 'none', color: '#007aff', cursor: 'pointer', fontSize: '0.9rem' }}
                                onClick={() => openModal('editCategory', '', catIndex)}
                                title="Edit Category"
                            >
                                <FaEdit />
                            </button>
                            <button
                                style={{ background: 'none', border: 'none', color: '#ff3b30', cursor: 'pointer', fontSize: '0.9rem' }}
                                onClick={() => deleteCategory(catIndex)}
                                title="Delete Category"
                            >
                                <FaTrash />
                            </button>
                            <button
                                style={{ ...enhancedStyles.primaryButton, fontSize: '0.8rem', padding: '5px 10px' }}
                                onClick={() => openModal('addItem', category.name)}
                            >
                                <FaPlus /> Add Item
                            </button>
                        </div>
                    </h3>

                    {category.items && category.items.length > 0 ? (
                        <div style={enhancedStyles.itemList}>
                            {category.items.map((item, itemIndex) => (
                                <div key={item} style={{ ...enhancedStyles.menuItem, position: 'relative' }}>
                                    {item}
                                    <div style={{ position: 'absolute', top: '5px', right: '5px', display: 'flex', gap: '2px' }}>
                                        <button
                                            style={{ background: 'none', border: 'none', color: '#007aff', cursor: 'pointer', fontSize: '0.8rem' }}
                                            onClick={() => openModal('editItem', category.name, itemIndex, item)}
                                            title="Edit Name"
                                        >
                                            <FaEdit />
                                        </button>
                                        <button
                                            style={{ background: 'none', border: 'none', color: '#28a745', cursor: 'pointer', fontSize: '0.8rem' }}
                                            onClick={() => openModal('editImage', category.name, itemIndex, item)}
                                            title="Edit Image"
                                        >
                                            🖼️
                                        </button>
                                        <button
                                            style={{ background: 'none', border: 'none', color: '#ff3b30', cursor: 'pointer', fontSize: '0.8rem' }}
                                            onClick={() => {
                                                if (window.confirm(`Remove ${item}?`)) removeItem(catIndex, itemIndex);
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
                    {addOns.map((addOn, index) => (
                        <div key={addOn} style={{ ...enhancedStyles.menuItem, position: 'relative' }}>
                            {addOn}
                            <div style={{ position: 'absolute', top: '5px', right: '5px', display: 'flex', gap: '2px' }}>
                                <button
                                    style={{ background: 'none', border: 'none', color: '#007aff', cursor: 'pointer', fontSize: '0.8rem' }}
                                    onClick={() => openModal('editAddOn', '', index, addOn)}
                                    title="Edit"
                                >
                                    <FaEdit />
                                </button>
                                <button
                                    style={{ background: 'none', border: 'none', color: '#ff3b30', cursor: 'pointer', fontSize: '0.8rem' }}
                                    onClick={() => {
                                        if (window.confirm(`Remove ${addOn}?`)) removeAddOn(index);
                                    }}
                                    title="Remove"
                                >
                                    <FaTrash />
                                </button>
                            </div>
                        </div>
                    ))}
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
                    {sugarLevels.map(level => (
                        <div key={level} style={{
                            ...enhancedStyles.menuItem,
                            backgroundColor: level === 1 ? '#a1db40' : '#f8f9fa', // Highlight default sugar level
                            color: level === 1 ? '#103c7f' : '#333',
                            position: 'relative'
                        }}>
                            {level} {level === 1 ? 'Spoon (Default)' : 'Spoons'}
                            {level !== 1 && (
                                <button
                                    style={{ position: 'absolute', top: '5px', right: '5px', background: 'none', border: 'none', color: '#ff3b30', cursor: 'pointer', fontSize: '0.8rem' }}
                                    onClick={() => {
                                        if (window.confirm(`Remove sugar level ${level}?`)) removeSugarLevel(level);
                                    }}
                                    title="Remove"
                                >
                                    <FaTrash />
                                </button>
                            )}
                        </div>
                    ))}
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
                             modalData.type === 'editImage' ? `Edit Image for ${modalData.value}` :
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
                                <label>Image URL:</label>
                                <input
                                    type="text"
                                    value={modalData.image}
                                    onChange={(e) => setModalData({ ...modalData, image: e.target.value })}
                                    style={styles.inputField}
                                    placeholder="Image URL"
                                />
                            </div>
                        ) : modalData.type === 'editImage' ? (
                            <input
                                type="text"
                                value={modalData.image}
                                onChange={(e) => setModalData({ ...modalData, image: e.target.value })}
                                placeholder="Enter image URL"
                                style={styles.inputField}
                                autoFocus
                            />
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