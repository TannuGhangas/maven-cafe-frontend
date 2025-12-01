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
import '../../styles/AdminComplaintsPage.css';

// --- HELPER COMPONENT: Single Complaint Card ---
const ComplaintCard = ({ complaint, styles, statusMap, handleUpdateStatus, user }) => {
    const [showDetails, setShowDetails] = useState(false);
    const { color, icon } = statusMap[complaint.status];

    const Tag = ({ children, icon, bgColor, color, type }) => (
        <span className={`complaint-card-tag ${type || ''}`}>
            {icon && <span className="complaint-card-tag-icon">{icon}</span>}
            {children}
        </span>
    );
    
    return (
        <div className={`complaint-card ${complaint.status.toLowerCase().replace(' ', '-')} ${showDetails ? 'expanded' : ''}`}>
            {/* Header: Clickable Summary */}
            <div className={`complaint-card-header ${showDetails ? 'expanded' : ''}`} onClick={() => setShowDetails(!showDetails)}>

                {/* Left: Status & Type */}
                <div className="complaint-card-left">
                    <h4 className="complaint-card-title">
                        <span className="complaint-card-title-icon">{icon}</span>
                        {complaint.type}
                    </h4>
                    <small className="complaint-card-timestamp">
                        <FaRegClock className="complaint-card-timestamp-icon" />
                        {new Date(complaint.timestamp).toLocaleString()}
                    </small>
                </div>

                {/* Right: Status Tag and Arrow */}
                <div className="complaint-card-right">
                    <span className="complaint-card-status">
                        {complaint.status}
                    </span>
                    <span className="complaint-card-toggle">
                        {showDetails ? <FaAngleUp /> : <FaAngleDown />}
                    </span>
                </div>
            </div>

            {/* Body: Full Details and Actions (Accordion Content) */}
            {showDetails && (
                <div className="complaint-card-body">

                    {/* Key Tags Row */}
                    <div className="complaint-card-tags">
                        <Tag icon={<FaUser />} type="user">
                            {complaint.userName}
                        </Tag>
                        <Tag icon={<FaMapMarkerAlt />} type="location">
                            {complaint.location}
                        </Tag>
                        <Tag icon={<FaClipboardList />} type="reference">
                            Ref: {complaint.orderReference || 'N/A'}
                        </Tag>
                    </div>

                    {/* Detailed Description */}
                    <div className="complaint-card-description">
                        <p className="complaint-card-description-label">
                            Description:
                        </p>
                        <p className="complaint-card-description-text">
                            {complaint.details}
                        </p>
                    </div>

                    {/* Action Buttons - Only show for admin users, not kitchen */}
                    {user.role === 'admin' && (
                        <div className="complaint-card-actions">

                             {/* Resolve Button */}
                             {complaint.status !== 'Resolved' && (
                                  <button
                                      className="complaint-card-resolve-btn success-button"
                                      onClick={(e) => { e.stopPropagation(); handleUpdateStatus(complaint._id, 'Resolved'); }}
                                  >
                                      <FaCheckCircle /> Resolve
                                  </button>
                              )}

                             {/* Start Review Button */}
                             {complaint.status === 'New' && (
                                  <button
                                      className="complaint-card-review-btn primary-button"
                                      onClick={(e) => { e.stopPropagation(); handleUpdateStatus(complaint._id, 'In Progress'); }}
                                  >
                                      Start Review
                                  </button>
                              )}

                             {/* Mark New (If In Progress) */}
                             {complaint.status === 'In Progress' && (
                                  <button
                                      className="complaint-card-revert-btn secondary-button"
                                      onClick={(e) => { e.stopPropagation(); handleUpdateStatus(complaint._id, 'New'); }}
                                  >
                                      Revert to New
                                  </button>
                              )}
                          </div>
                     )}

                     {/* Read-only message for kitchen users */}
                     {user.role === 'kitchen' && (
                         <div className="complaint-card-kitchen-msg">
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
    
    if (loading) return <div className="loading-container"><FaSpinner className="spinner" size={30} /> Loading Complaints...</div>;

    return (
        <div className="admin-complaints-container">
            <h2 className="admin-complaints-header">Feedback Triage Center 🚨</h2>
            <p className="admin-complaints-subtitle">Total feedback items: {complaints.length}</p>

            {/* 1. Tabbed Filter Controls */}
            <div className="admin-complaints-filter-tabs">
                {Object.keys(statusMap).map(status => (
                    <button
                        key={status}
                        onClick={() => setFilterStatus(status)}
                        className={`admin-complaints-filter-tab ${status.toLowerCase().replace(' ', '-')} ${filterStatus === status ? 'active' : ''}`}
                    >
                        {statusMap[status].icon} {status} ({statusCounts[status] || 0})
                    </button>
                ))}
            </div>

            {/* 2. Complaints List */}
            <div className="admin-complaints-list">
                {filteredComplaints.length === 0 ? (
                    <p className="admin-complaints-empty">
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
                className="admin-complaints-back-btn secondary-button"
                onClick={() => setPage(user.role === 'admin' ? 'admin-dashboard' : 'kitchen-dashboard')}
            >
                <FaChevronLeft /> Back to Dashboard
            </button>
        </div>
    );
};

export default AdminComplaintsPage;