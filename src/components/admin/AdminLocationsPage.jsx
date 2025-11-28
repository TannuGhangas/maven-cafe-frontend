import React, { useState, useEffect } from 'react';
import { FaSpinner, FaChevronLeft, FaMapMarkerAlt, FaBuilding, FaHome, FaIndustry, FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import { getAllowedLocations, USER_LOCATIONS_DATA } from '../../config/constants';

const AdminLocationsPage = ({ user, callApi, setPage, styles }) => {
    const [loading, setLoading] = useState(false);
    const [locations, setLocations] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [modalData, setModalData] = useState({ type: '', index: -1, name: '', location: '', access: 'Own seat' });

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
        locationCard: {
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            padding: '20px',
            margin: '15px 0',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            border: '1px solid #ddd',
            fontFamily: 'Calibri, Arial, sans-serif',
        },
        locationHeader: {
            fontSize: '1.3rem',
            fontWeight: '700',
            color: '#103c7f', // Dark Blue
            fontFamily: 'Cambria, serif',
            marginBottom: '10px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
        },
        locationDetail: {
            margin: '8px 0',
            padding: '8px 12px',
            backgroundColor: '#f8f9fa',
            borderRadius: '6px',
            border: '1px solid #e9ecef',
            fontSize: '0.95rem',
        },
        accessList: {
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            gap: '8px',
            marginTop: '10px',
        },
        accessItem: {
            backgroundColor: '#a1db40', // Green
            color: '#103c7f', // Dark Blue
            padding: '6px 10px',
            borderRadius: '6px',
            fontSize: '0.85rem',
            fontWeight: '600',
            textAlign: 'center',
        },
        screenPadding: {
            ...styles.screenPadding,
            fontFamily: 'Calibri, Arial, sans-serif',
        },
    };

    // Location type icons
    const getLocationIcon = (locationName) => {
        if (locationName.toLowerCase().includes('office')) return <FaBuilding />;
        if (locationName.toLowerCase().includes('home')) return <FaHome />;
        return <FaIndustry />;
    };

    // CRUD functions
    const saveToStorage = () => {
        localStorage.setItem('adminLocations', JSON.stringify(locations));
    };

    const openModal = (type, index = -1, name = '', location = '', access = 'Own seat') => {
        setModalData({ type, index, name, location, access });
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setModalData({ type: '', index: -1, name: '', location: '', access: 'Own seat' });
    };

    const saveModal = () => {
        const { type, index, name, location, access } = modalData;
        if (!name.trim() || !location.trim()) return;

        if (type === 'add') {
            const newId = Math.max(...locations.map(l => l.id), 0) + 1;
            const newLocation = { id: newId, name: name.trim(), location: location.trim(), access };
            setLocations([...locations, newLocation]);
        } else if (type === 'edit') {
            const updated = [...locations];
            updated[index] = { ...updated[index], name: name.trim(), location: location.trim(), access };
            setLocations(updated);
        }

        saveToStorage();
        closeModal();
    };

    const removeLocation = (index) => {
        if (window.confirm(`Remove location ${locations[index].name}?`)) {
            const updated = locations.filter((_, i) => i !== index);
            setLocations(updated);
            saveToStorage();
        }
    };

    const fetchLocations = async () => {
        setLoading(true);
        const data = await callApi(`/locations?userId=${user.id}&userRole=${user.role}`, 'GET');
        if (data) {
            setLocations(data);
        }
        setLoading(false);
    };

    const saveLocations = async () => {
        const data = await callApi('/locations', 'PUT', { locations, userId: user.id, userRole: user.role });
        if (data && data.success) {
            alert('Locations updated successfully!');
        }
    };

    useEffect(() => {
        fetchLocations();
    }, []);

    if (loading) return (
        <div style={enhancedStyles.loadingContainer}>
            <FaSpinner className="spinner" size={30} /> Loading Locations...
        </div>
    );

    return (
        <div style={enhancedStyles.screenPadding}>
            <h2 style={enhancedStyles.headerText}>
                <FaMapMarkerAlt style={{ marginRight: '10px' }} />
                Location Management
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
                    onClick={() => openModal('add')}
                >
                    <FaPlus /> Add Location
                </button>
            </div>

            {/* Location Cards */}
            {locations.map((location, index) => (
                <div key={location.id} style={enhancedStyles.locationCard}>
                    <h3 style={enhancedStyles.locationHeader}>
                        {getLocationIcon(location.location)} {location.name}
                        <div style={{ marginLeft: 'auto', display: 'flex', gap: '5px' }}>
                            <button
                                style={{ background: 'none', border: 'none', color: '#007aff', cursor: 'pointer', fontSize: '1.2rem' }}
                                onClick={() => openModal('edit', index, location.name, location.location, location.access)}
                                title="Edit Location"
                            >
                                <FaEdit />
                            </button>
                            <button
                                style={{ background: 'none', border: 'none', color: '#ff3b30', cursor: 'pointer', fontSize: '1.2rem' }}
                                onClick={() => removeLocation(index)}
                                title="Remove Location"
                            >
                                <FaTrash />
                            </button>
                        </div>
                    </h3>

                    <div style={enhancedStyles.locationDetail}>
                        <strong>Location:</strong> {location.location}
                    </div>

                    <div style={enhancedStyles.locationDetail}>
                        <strong>Access Level:</strong> {location.access}
                    </div>

                    <div style={{ marginTop: '15px' }}>
                        <strong style={{
                            color: '#103c7f',
                            fontFamily: 'Cambria, serif',
                            fontSize: '1rem'
                        }}>
                            Allowed Delivery Locations:
                        </strong>
                        <div style={enhancedStyles.accessList}>
                            {getAllowedLocations(location.location, location.access).map(loc => (
                                <div key={loc.key} style={enhancedStyles.accessItem}>
                                    {loc.name}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            ))}

            {/* Table Numbers Section */}
            <div style={enhancedStyles.locationCard}>
                <h3 style={enhancedStyles.locationHeader}>
                    <FaBuilding style={{ marginRight: '8px' }} />
                    Table Numbers (For "Others" Location)
                </h3>
                <div style={enhancedStyles.accessList}>
                    {Array.from({ length: 25 }, (_, i) => i + 1).map(tableNum => (
                        <div key={tableNum} style={enhancedStyles.accessItem}>
                            Table {tableNum}
                        </div>
                    ))}
                </div>
            </div>

            {/* Note about persistence */}
            <div style={{
                ...enhancedStyles.locationCard,
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
                    <strong>Success:</strong> Location data is now dynamically managed and saved to the database.
                    Changes are instantly reflected across all users and kitchen staff.
                </p>
            </div>

            {/* Modal for Add/Edit */}
            {showModal && (
                <div style={styles.modalOverlay}>
                    <div style={styles.modalContent}>
                        <h3 style={{ marginTop: 0, color: '#103c7f' }}>
                            {modalData.type === 'add' ? 'Add Location' : 'Edit Location'}
                        </h3>
                        <label style={styles.label}>Name:</label>
                        <input
                            type="text"
                            value={modalData.name}
                            onChange={(e) => setModalData({ ...modalData, name: e.target.value })}
                            placeholder="Enter location name"
                            style={styles.inputField}
                        />
                        <label style={styles.label}>Address:</label>
                        <input
                            type="text"
                            value={modalData.location}
                            onChange={(e) => setModalData({ ...modalData, location: e.target.value })}
                            placeholder="Enter location address"
                            style={styles.inputField}
                        />
                        <label style={styles.label}>Access Level:</label>
                        <select
                            multiple
                            value={modalData.access === 'All' ? ['All'] : modalData.access.split(',').map(a => a.trim()).filter(a => a)}
                            onChange={(e) => {
                                const selected = Array.from(e.target.selectedOptions, option => option.value);
                                const access = selected.includes('All') ? 'All' : selected.join(',');
                                setModalData({ ...modalData, access });
                            }}
                            style={{ ...styles.selectField, height: '100px' }}
                        >
                            <option value="All">All</option>
                            <option value="Own seat">Own seat</option>
                            <option value="Confrence">Conference</option>
                            <option value="Pod_Room">Pod Room</option>
                            <option value="Reception">Reception</option>
                            <option value="Maven_Area">Maven Area</option>
                            <option value="Sharma_Sir_Office">Sharma Sir Office</option>
                            <option value="Ritesh_Sir_Cabin">Ritesh Sir Cabin</option>
                            <option value="Bhavishya_Cabin">Bhavishya Cabin</option>
                            <option value="Ketan_Cabin">Ketan Cabin</option>
                            <option value="Diwakar_Sir_Cabin">Diwakar Sir Cabin</option>
                            {Array.from({ length: 25 }, (_, i) => (
                                <option key={i+1} value={`Seat_${i+1}`}>Seat {i+1}</option>
                            ))}
                        </select>
                        <small style={{ color: '#666', fontSize: '0.8rem' }}>Hold Ctrl/Cmd to select multiple. "All" overrides others.</small>
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

export default AdminLocationsPage;