import React, { useState, useEffect } from 'react';
import { FaSpinner, FaChevronLeft, FaMapMarkerAlt, FaBuilding, FaHome, FaIndustry } from 'react-icons/fa';
import { getAllowedLocations, USER_LOCATIONS_DATA } from '../../config/constants';

const AdminLocationsPage = ({ user, callApi, setPage, styles }) => {
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

    useEffect(() => {
        // Could fetch dynamic location data here if backend supports it
        setLoading(false);
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

            <div style={{ marginBottom: '30px' }}>
                <button
                    style={enhancedStyles.secondaryButton}
                    onClick={() => setPage('admin-dashboard')}
                >
                    <FaChevronLeft /> Back to Admin Dashboard
                </button>
            </div>

            {/* Location Cards */}
            {USER_LOCATIONS_DATA.map(location => (
                <div key={location.id} style={enhancedStyles.locationCard}>
                    <h3 style={enhancedStyles.locationHeader}>
                        {getLocationIcon(location.location)} {location.name}
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

            {/* Note about backend integration */}
            <div style={{
                ...enhancedStyles.locationCard,
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
                    <strong>Note:</strong> Location data is currently managed through the application constants.
                    Full CRUD operations require backend API development.
                </p>
            </div>
        </div>
    );
};

export default AdminLocationsPage;