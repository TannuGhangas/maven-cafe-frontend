import React, { useState, useEffect } from 'react';
import { FaSpinner, FaChevronLeft, FaMapMarkerAlt, FaBuilding, FaHome, FaIndustry, FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import { getAllowedLocations, USER_LOCATIONS_DATA } from '../../config/constants';
import '../../styles/AdminLocationsPage.css';
import AdminLayout from './AdminLayout';

const AdminLocationsPage = ({ user, callApi, setPage, styles, activeSection, setActiveSection }) => {
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
            // Ensure enabled field exists
            const updatedData = data.map(loc => ({ ...loc, enabled: loc.enabled !== false }));
            setLocations(updatedData);
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
        <AdminLayout
            user={user}
            setPage={setPage}
            activeSection={activeSection}
            setActiveSection={setActiveSection}
            callApi={callApi}
        >
            <div className="admin-locations-loading">
                <FaSpinner className="admin-locations-loading-spinner" size={30} />
                Loading Locations...
            </div>
        </AdminLayout>
    );

    return (
        <AdminLayout
            user={user}
            setPage={setPage}
            activeSection={activeSection}
            setActiveSection={setActiveSection}
            callApi={callApi}
        >
            <div className="admin-locations-container">
                <h2 className="admin-locations-header">
                    <FaMapMarkerAlt className="admin-locations-header-icon" />
                    Location Management
                </h2>

                <div className="admin-locations-actions">
                    <button
                        className="primary-button"
                        onClick={() => openModal('add')}
                    >
                        <FaPlus /> Add Location
                    </button>
                </div>

                {/* Location Cards */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
                    gap: '20px',
                    marginTop: '20px'
                }}>
                    {locations.map((location, index) => (
                        <div key={location.id} style={{
                            background: location.enabled ? 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)' : 'linear-gradient(135deg, #f5f5f5 0%, #e9ecef 100%)',
                            borderRadius: '20px',
                            padding: '30px',
                            boxShadow: location.enabled ? '0 8px 25px rgba(0,0,0,0.1), 0 4px 10px rgba(0,0,0,0.05)' : '0 4px 15px rgba(0,0,0,0.05)',
                            border: location.enabled ? '1px solid rgba(255,255,255,0.8)' : '1px solid #ddd',
                            opacity: location.enabled ? 1 : 0.6,
                            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                            transform: location.enabled ? 'translateY(0)' : 'translateY(2px)',
                            position: 'relative',
                            overflow: 'hidden'
                        }}>
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                marginBottom: '15px'
                            }}>
                                <h3 style={{
                                    margin: '0',
                                    color: '#103c7f',
                                    fontSize: '1.3rem',
                                    fontWeight: '700',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '10px'
                                }}>
                                    {getLocationIcon(location.location)} {location.name}
                                </h3>
                                <div style={{
                                    display: 'flex',
                                    gap: '10px',
                                    alignItems: 'center'
                                }}>
                                    <button
                                        style={{
                                            background: location.enabled ? 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)' : 'linear-gradient(135deg, #f44336 0%, #d32f2f 100%)',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '25px',
                                            padding: '10px 18px',
                                            cursor: 'pointer',
                                            fontSize: '0.85rem',
                                            fontWeight: 'bold',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '6px',
                                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                                            transform: 'translateY(0)',
                                            ':hover': {
                                                transform: 'translateY(-2px)',
                                                boxShadow: '0 6px 20px rgba(0,0,0,0.2)'
                                            }
                                        }}
                                        onClick={() => {
                                            const updated = [...locations];
                                            updated[index].enabled = !updated[index].enabled;
                                            setLocations(updated);
                                            saveToStorage();
                                        }}
                                        title={location.enabled ? 'Disable Location' : 'Enable Location'}
                                    >
                                        {location.enabled ? 'ON' : 'OFF'}
                                    </button>
                                    <button
                                        style={{
                                            background: 'linear-gradient(135deg, #007aff 0%, #0056cc 100%)',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '12px',
                                            padding: '10px 15px',
                                            cursor: 'pointer',
                                            fontSize: '0.9rem',
                                            fontWeight: '600',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '6px',
                                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                            boxShadow: '0 4px 12px rgba(0,122,255,0.3)',
                                            transform: 'translateY(0)',
                                            ':hover': {
                                                transform: 'translateY(-2px)',
                                                boxShadow: '0 6px 20px rgba(0,122,255,0.4)'
                                            }
                                        }}
                                        onClick={() => openModal('edit', index, location.name, location.location, location.access)}
                                        title="Edit Location"
                                    >
                                        <FaEdit />
                                        Edit
                                    </button>
                                    <button
                                        style={{
                                            background: 'linear-gradient(135deg, #ff3b30 0%, #d63027 100%)',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '12px',
                                            padding: '10px 15px',
                                            cursor: 'pointer',
                                            fontSize: '0.9rem',
                                            fontWeight: '600',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '6px',
                                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                            boxShadow: '0 4px 12px rgba(255,59,48,0.3)',
                                            transform: 'translateY(0)',
                                            ':hover': {
                                                transform: 'translateY(-2px)',
                                                boxShadow: '0 6px 20px rgba(255,59,48,0.4)'
                                            }
                                        }}
                                        onClick={() => removeLocation(index)}
                                        title="Remove Location"
                                    >
                                        <FaTrash />
                                        Delete
                                    </button>
                                </div>
                            </div>

                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: '1fr 1fr',
                                gap: '15px',
                                marginBottom: '15px'
                            }}>
                                <div style={{
                                    backgroundColor: '#f8f9fa',
                                    padding: '10px',
                                    borderRadius: '8px',
                                    border: '1px solid #e9ecef'
                                }}>
                                    <strong style={{ color: '#103c7f' }}>Location:</strong><br />
                                    <span style={{ color: '#333' }}>{location.location}</span>
                                </div>
                                <div style={{
                                    backgroundColor: '#f8f9fa',
                                    padding: '10px',
                                    borderRadius: '8px',
                                    border: '1px solid #e9ecef'
                                }}>
                                    <strong style={{ color: '#103c7f' }}>Access Level:</strong><br />
                                    <span style={{ color: '#333' }}>{location.access}</span>
                                </div>
                            </div>

                            <div>
                                <strong style={{
                                    color: '#103c7f',
                                    fontSize: '1rem',
                                    marginBottom: '10px',
                                    display: 'block'
                                }}>
                                    Allowed Delivery Locations:
                                </strong>
                                <div style={{
                                    display: 'flex',
                                    flexWrap: 'wrap',
                                    gap: '8px'
                                }}>
                                    {getAllowedLocations(location.location, location.access).map(loc => (
                                        <span key={loc.key} style={{
                                            backgroundColor: '#e3f2fd',
                                            color: '#103c7f',
                                            padding: '4px 8px',
                                            borderRadius: '12px',
                                            fontSize: '0.85rem',
                                            fontWeight: '500'
                                        }}>
                                            {loc.name}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

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
                                    const selected = Array.from(e.selectedOptions, option => option.value);
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
        </AdminLayout>
    );
};

export default AdminLocationsPage;