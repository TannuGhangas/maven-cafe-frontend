import React, { useState, useEffect } from 'react';
import { 
    FaSpinner, 
    FaFilter, 
    FaCheckCircle, 
    FaExclamationTriangle, 
    FaMapMarkerAlt,
    FaRegClock, 
    FaUser, 
    FaClipboardList, 
    FaAngleDown, 
    FaAngleUp,
    FaChevronLeft 
} from 'react-icons/fa';

// --- HELPER COMPONENT: Single Complaint Card ---
const ComplaintCard = ({ complaint, styles, statusMap, handleUpdateStatus, user }) => {
    const [showDetails, setShowDetails] = useState(false);
    const { color, icon } = statusMap[complaint.status];

    const cardStyle = {
        ...styles.orderItemCard, // Reusing card styling
        flexDirection: 'column',
        padding: '0', 
        marginBottom: '15px',
        borderLeft: `5px solid ${color}`,
        cursor: 'pointer',
        boxShadow: showDetails ? styles.SHADOW_ELEVATION_2 : styles.SHADOW_ELEVATION_1,
        transition: 'box-shadow 0.2s',
    };

    const headerStyle = {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '15px',
        borderBottom: showDetails ? `1px solid ${styles.COLOR_BACKGROUND_LIGHT}` : 'none',
        backgroundColor: showDetails ? styles.COLOR_BACKGROUND_LIGHT : '#ffffff',
        borderRadius: showDetails ? `${styles.BORDER_RADIUS_SM} ${styles.BORDER_RADIUS_SM} 0 0` : styles.BORDER_RADIUS_SM,
    };

    const Tag = ({ children, icon, bgColor, color }) => (
        <span style={{ 
            fontSize: '0.75em', 
            padding: '4px 8px', 
            borderRadius: styles.BORDER_RADIUS_SM, 
            backgroundColor: bgColor || '#eee', 
            color: color || '#333',
            display: 'inline-flex',
            alignItems: 'center',
            marginRight: '8px'
        }}>
            {icon && <span style={{ marginRight: '5px' }}>{icon}</span>}
            {children}
        </span>
    );
    
    return (
        <div style={cardStyle}>
            {/* Header: Clickable Summary */}
            <div style={headerStyle} onClick={() => setShowDetails(!showDetails)}>
                
                {/* Left: Status & Type */}
                <div style={{ flexGrow: 1 }}>
                    <h4 style={{ margin: '0 0 5px 0', color: styles.COLOR_TEXT_DARK, display: 'flex', alignItems: 'center', fontSize: '1.1em' }}>
                        <span style={{ color: color, marginRight: '8px' }}>{icon}</span>
                        {complaint.type}
                    </h4>
                    <small style={{ color: '#888' }}>
                        <FaRegClock style={{ marginRight: '5px' }} /> 
                        {new Date(complaint.timestamp).toLocaleString()}
                    </small>
                </div>

                {/* Right: Status Tag and Arrow */}
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <span style={{ 
                        color: color, 
                        fontWeight: 'bold', 
                        padding: '5px 10px', 
                        backgroundColor: `${color}22`, // Light background color
                        borderRadius: styles.BORDER_RADIUS_SM 
                    }}>
                        {complaint.status}
                    </span>
                    <span style={{ marginLeft: '10px', color: styles.COLOR_TEXT_DARK }}>
                        {showDetails ? <FaAngleUp /> : <FaAngleDown />}
                    </span>
                </div>
            </div>

            {/* Body: Full Details and Actions (Accordion Content) */}
            {showDetails && (
                <div style={{ padding: '15px', borderTop: '1px dashed #eee' }}>
                    
                    {/* Key Tags Row */}
                    <div style={{ marginBottom: '15px' }}>
                        <Tag icon={<FaUser />} bgColor="#e3f2fd" color={styles.PRIMARY_COLOR}>
                            {complaint.userName}
                        </Tag>
                        <Tag icon={<FaMapMarkerAlt />} bgColor="#fff3e0" color={styles.SECONDARY_COLOR}>
                            {complaint.location}
                        </Tag>
                        <Tag icon={<FaClipboardList />} bgColor="#f3e5f5">
                            Ref: {complaint.orderReference || 'N/A'}
                        </Tag>
                    </div>

                    {/* Detailed Description */}
                    <div style={{ padding: '10px', backgroundColor: '#f9f9f9', borderRadius: styles.BORDER_RADIUS_SM, borderLeft: `3px solid ${color}66` }}>
                        <p style={{ margin: 0, fontWeight: '600', color: '#555' }}>
                            Description:
                        </p>
                        <p style={{ margin: '5px 0 0 0', whiteSpace: 'pre-wrap' }}>
                            {complaint.details}
                        </p>
                    </div>

                    {/* Action Buttons - Only show for admin users, not kitchen */}
                    {user.role === 'admin' && (
                        <div style={{ marginTop: '15px', display: 'flex', gap: '10px' }}>

                             {/* Resolve Button */}
                             {complaint.status !== 'Resolved' && (
                                 <button
                                     style={{ ...styles.successButton, padding: '8px 15px' }}
                                     onClick={(e) => { e.stopPropagation(); handleUpdateStatus(complaint._id, 'Resolved'); }}
                                 >
                                     <FaCheckCircle /> Resolve
                                 </button>
                             )}

                             {/* Start Review Button */}
                             {complaint.status === 'New' && (
                                 <button
                                     style={{ ...styles.primaryButton, padding: '8px 15px', backgroundColor: styles.PRIMARY_COLOR }}
                                     onClick={(e) => { e.stopPropagation(); handleUpdateStatus(complaint._id, 'In Progress'); }}
                                 >
                                     Start Review
                                 </button>
                             )}

                             {/* Mark New (If In Progress) */}
                             {complaint.status === 'In Progress' && (
                                 <button
                                     style={{ ...styles.secondaryButton, padding: '8px 15px' }}
                                     onClick={(e) => { e.stopPropagation(); handleUpdateStatus(complaint._id, 'New'); }}
                                 >
                                     Revert to New
                                 </button>
                             )}
                         </div>
                    )}

                    {/* Read-only message for kitchen users */}
                    {user.role === 'kitchen' && (
                        <div style={{
                            marginTop: '15px',
                            padding: '10px',
                            backgroundColor: '#f8f9fa',
                            borderRadius: '8px',
                            textAlign: 'center',
                            color: '#666',
                            fontSize: '0.9rem'
                        }}>
                            Kitchen staff can view complaints but cannot update status.
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};


// =======================================================
// MAIN COMPONENT: AdminComplaintsPage
// =======================================================
const AdminComplaintsPage = ({ setPage, user, callApi, styles }) => {
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState('New'); 

    const fetchComplaints = async () => {
        setLoading(true);
        
        // --- FIX FOR GET METHOD CANNOT HAVE BODY ---
        // 1. Construct query string for authorization data
        const queryString = `?userId=${user.id}&userRole=${user.role}`;
        
        // 2. Call API with the authorization data in the URL (query string)
        const data = await callApi(`/feedback${queryString}`, 'GET'); 
        // ---------------------------------------------
        
        if (data && Array.isArray(data)) {
            // Sort by latest complaint first
            const sortedData = data.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
            setComplaints(sortedData);
        }
        setLoading(false);
    };

    const handleUpdateStatus = async (complaintId, newStatus) => {
        if (!window.confirm(`Set complaint status to '${newStatus}'?`)) return;

        // PUT request correctly uses payload/body for status and authorization
        const payload = { 
            status: newStatus, 
            userId: user.id, // REQUIRED for backend authorization check
            userRole: user.role // REQUIRED for backend authorization check
        }; 

        const data = await callApi(`/feedback/${complaintId}`, 'PUT', payload);
        
        if (data && data.success) {
            // Update state locally (Performance Optimization)
            setComplaints(prevComplaints =>
                prevComplaints.map(c =>
                    c._id === complaintId 
                        ? { ...c, status: newStatus } 
                        : c
                )
            );
        } else {
            alert(`Failed to update status: ${data?.message || 'Check network connection and server response.'}`);
        }
    };

    useEffect(() => {
        fetchComplaints();
    }, []);

    const filteredComplaints = complaints.filter(c => c.status === filterStatus);

    // --- Status Visualization Map ---
    const statusMap = {
        'New': { color: styles.SECONDARY_COLOR || '#FF5722', icon: <FaExclamationTriangle /> },
        'In Progress': { color: styles.PRIMARY_COLOR || '#2196F3', icon: <FaSpinner className="spinner" /> },
        'Resolved': { color: styles.SUCCESS_COLOR || '#4CAF50', icon: <FaCheckCircle /> }
    };

    const statusCounts = complaints.reduce((acc, c) => {
        acc[c.status] = (acc[c.status] || 0) + 1;
        return acc;
    }, {});
    
    if (loading) return <div style={styles.loadingContainer}><FaSpinner className="spinner" size={30} /> Loading Complaints...</div>;

    return (
        <div style={styles.screenPadding}>
            <h2 style={{ ...styles.headerText, marginBottom: '5px' }}>Feedback Triage Center 🚨</h2>
            <p style={{ color: '#888', marginBottom: '20px' }}>Total feedback items: {complaints.length}</p>
            
            {/* 1. Tabbed Filter Controls */}
            <div style={{ display: 'flex', gap: '1px', marginBottom: '20px', borderBottom: `2px solid #ddd` }}>
                {Object.keys(statusMap).map(status => (
                    <button 
                        key={status}
                        onClick={() => setFilterStatus(status)}
                        style={{
                            padding: '10px 15px',
                            cursor: 'pointer',
                            backgroundColor: filterStatus === status ? '#fff' : '#f8f8f8',
                            border: 'none',
                            borderTop: filterStatus === status ? `2px solid ${statusMap[status].color}` : 'none',
                            borderLeft: '1px solid #eee',
                            borderRight: '1px solid #eee',
                            color: filterStatus === status ? statusMap[status].color : '#666',
                            fontWeight: filterStatus === status ? '700' : '500',
                            flexGrow: 1,
                            borderRadius: '5px 5px 0 0',
                            transform: filterStatus === status ? 'translateY(1px)' : 'translateY(0)',
                            transition: 'all 0.2s'
                        }}
                    >
                        {statusMap[status].icon} {status} ({statusCounts[status] || 0})
                    </button>
                ))}
            </div>

            {/* 2. Complaints List */}
            <div style={styles.listContainer}>
                {filteredComplaints.length === 0 ? (
                    <p style={{ textAlign: 'center', padding: '30px', backgroundColor: '#fff', borderRadius: styles.BORDER_RADIUS_SM, boxShadow: styles.SHADOW_ELEVATION_1, marginTop: '20px' }}>
                        No **{filterStatus}** complaints. Great job!
                    </p>
                ) : (
                    filteredComplaints.map(c => (
                        <ComplaintCard
                            key={c._id}
                            complaint={c}
                            styles={styles}
                            statusMap={statusMap}
                            handleUpdateStatus={handleUpdateStatus}
                            user={user}
                        />
                    ))
                )}
            </div>
            
            <button
                style={{ ...styles.secondaryButton, marginTop: '30px', marginBottom: '20px' }}
                onClick={() => setPage(user.role === 'admin' ? 'admin-dashboard' : 'kitchen-dashboard')}
            >
                <FaChevronLeft /> Back to Dashboard
            </button>
        </div>
    );
};

export default AdminComplaintsPage;