import React, { useState, useEffect } from 'react';
import { FaSpinner, FaChevronLeft, FaMapMarkerAlt, FaBuilding, FaHome, FaIndustry, FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import { getAllowedLocations, USER_LOCATIONS_DATA } from '../../config/constants';
import '../../styles/AdminLocationsPage.css';

const AdminLocationsPage = ({ user, callApi, setPage, styles }) => {
    const [loading, setLoading] = useState(false);
    const [locations, setLocations] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [modalData, setModalData] = useState({ type: '', index: -1, name: '', location: '', access: 'Own seat' });


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
        <div className="admin-locations-loading">
            <FaSpinner className="admin-locations-loading-spinner" size={30} />
            Loading Locations...
        </div>
    );

    return (
        <div className="admin-locations-container">
            <h2 className="admin-locations-header">
                <FaMapMarkerAlt className="admin-locations-header-icon" />
                Location Management
            </h2>

            <div className="admin-locations-actions">
                <button
                    className="secondary-button"
                    onClick={() => setPage('admin-dashboard')}
                >
                    <FaChevronLeft /> Back to Admin Dashboard
                </button>
                <button
                    className="primary-button"
                    onClick={() => openModal('add')}
                >
                    <FaPlus /> Add Location
                </button>
            </div>

            {/* Location Cards */}
            {locations.map((location, index) => (
                <div key={location.id} className="admin-locations-card">
                    <h3 className="admin-locations-card-header">
                        {getLocationIcon(location.location)} {location.name}
                        <div className="admin-locations-card-actions">
                            <button
                                className="admin-locations-edit-btn"
                                onClick={() => openModal('edit', index, location.name, location.location, location.access)}
                                title="Edit Location"
                            >
                                <FaEdit />
                            </button>
                            <button
                                className="admin-locations-delete-btn"
                                onClick={() => removeLocation(index)}
                                title="Remove Location"
                            >
                                <FaTrash />
                            </button>
                        </div>
                    </h3>

                    <div className="admin-locations-detail">
                        <strong>Location:</strong> {location.location}
                    </div>

                    <div className="admin-locations-detail">
                        <strong>Access Level:</strong> {location.access}
                    </div>

                    <div>
                        <strong className="admin-locations-access-title">
                            Allowed Delivery Locations:
                        </strong>
                        <div className="admin-locations-access-list">
                            {getAllowedLocations(location.location, location.access).map(loc => (
                                <div key={loc.key} className="admin-locations-access-item">
                                    {loc.name}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            ))}

            {/* Table Numbers Section */}
            <div className="admin-locations-card">
                <h3 className="admin-locations-card-header">
                    <FaBuilding style={{ marginRight: '8px' }} />
                    Table Numbers (For "Others" Location)
                </h3>
                <div className="admin-locations-access-list">
                    {Array.from({ length: 25 }, (_, i) => i + 1).map(tableNum => (
                        <div key={tableNum} className="admin-locations-access-item">
                            Table {tableNum}
                        </div>
                    ))}
                </div>
            </div>

            {/* Note about persistence */}
            <div className="admin-locations-card admin-locations-success-card">
                <p className="admin-locations-success-text">
                    <strong>Success:</strong> Location data is now dynamically managed and saved to the database.
                    Changes are instantly reflected across all users and kitchen staff.
                </p>
            </div>

            {/* Modal for Add/Edit */}
            {showModal && (
                <div className="admin-locations-modal-overlay">
                    <div className="admin-locations-modal-content">
                        <h3 className="admin-locations-modal-title">
                            {modalData.type === 'add' ? 'Add Location' : 'Edit Location'}
                        </h3>
                        <label className="admin-locations-modal-label">Name:</label>
                        <input
                            type="text"
                            value={modalData.name}
                            onChange={(e) => setModalData({ ...modalData, name: e.target.value })}
                            placeholder="Enter location name"
                            className="admin-locations-modal-input"
                        />
                        <label className="admin-locations-modal-label">Address:</label>
                        <input
                            type="text"
                            value={modalData.location}
                            onChange={(e) => setModalData({ ...modalData, location: e.target.value })}
                            placeholder="Enter location address"
                            className="admin-locations-modal-input"
                        />
                        <label className="admin-locations-modal-label">Access Level:</label>
                        <select
                            multiple
                            value={modalData.access === 'All' ? ['All'] : modalData.access.split(',').map(a => a.trim()).filter(a => a)}
                            onChange={(e) => {
                                const selected = Array.from(e.target.selectedOptions, option => option.value);
                                const access = selected.includes('All') ? 'All' : selected.join(',');
                                setModalData({ ...modalData, access });
                            }}
                            className="admin-locations-modal-select"
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
                        <small className="admin-locations-modal-help">Hold Ctrl/Cmd to select multiple. "All" overrides others.</small>
                        <div className="admin-locations-modal-actions">
                            <button className="primary-button" onClick={saveModal}>
                                Save
                            </button>
                            <button className="secondary-button" onClick={closeModal}>
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