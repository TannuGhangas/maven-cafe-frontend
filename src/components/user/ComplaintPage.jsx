import React, { useState } from 'react';
import { 
    FaChevronLeft, 
    FaPaperPlane, 
    FaCommentAlt, 
    FaTags, 
    FaMapMarkerAlt, 
    FaClipboardList,
    FaCheckCircle, 
    FaSpinner 
} from 'react-icons/fa';

// --- CONFIGURATION ---
const HEADER_IMAGE_URL = 'https://www.shutterstock.com/image-illustration/complaints-concept-word-on-folder-260nw-269047922.jpg'; 
const SUCCESS_DELAY_MS = 2500; 

// =======================================================
// HELPER COMPONENT: Success Overlay (Updated button padding)
// =======================================================
const SuccessOverlay = ({ styles, onContinue }) => {
    // Determine colors based on the available style keys (PRIMARY_COLOR = Dark Blue, ACCENT_COLOR = Green)
    const successColor = styles.ACCENT_COLOR || '#a1db40';
    const primaryColor = styles.PRIMARY_COLOR || '#103c7f';
    const textColor = styles.TEXT_COLOR || '#103c7f';

    return (
        <div style={{
            ...styles.appContainer,
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(255, 255, 255, 0.98)', 
            zIndex: 1000,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center',
            padding: '20px',
            maxWidth: '450px', 
            margin: '0 auto',
        }}>
            <FaCheckCircle size={80} style={{ color: successColor, marginBottom: '20px' }} />
            <h2 style={{ color: primaryColor, marginBottom: '10px', fontSize: '1.8em' }}>
                Feedback Submitted!
            </h2>
            <p style={{ color: textColor, fontSize: '1.1em', marginBottom: '40px' }}>
                Thank you! Your feedback is securely delivered to the Admin team.
            </p>
            <button 
                onClick={onContinue}
                style={{ 
                    ...styles.primaryButton, 
                    backgroundColor: primaryColor, 
                    // ⬇️ MADE BUTTON PADDING SMALLER 
                    padding: '12px 25px', 
                    width: 'auto',
                    boxShadow: `0 4px 15px ${primaryColor}40`,
                }}
            >
                <FaChevronLeft style={{ marginRight: '8px' }}/> Back to Home
            </button>
        </div>
    );
};

// =======================================================
// MAIN COMPONENT: ComplaintPage
// =======================================================
const ComplaintPage = ({ setPage, user, callApi, styles: _propStyles }) => {
    // Fallback/Merge for mobile size and clean input styling
    const styles = { 
        ..._propStyles, 
        formGroup: { 
            marginBottom: '20px',
        },
        formLabel: {
            display: 'flex',
            alignItems: 'center',
            fontWeight: '600',
            marginBottom: '8px',
            fontSize: '1em',
            color: _propStyles.TEXT_COLOR || '#103c7f',
            gap: '8px',
        },
        textInput: _propStyles.inputField,
        selectInput: _propStyles.selectField,
        textArea: {
            ..._propStyles.inputField,
            resize: 'vertical',
            // ⬇️ MADE TEXTAREA SMALLER
            minHeight: '100px', 
        },
        appContainer: {
            ..._propStyles.appContainer,
            maxWidth: '450px',
            margin: '0 auto',
            boxShadow: '0 0 10px rgba(0,0,0,0.1)',
            minHeight: '100vh',
        },
    };
    
    const [complaintType, setComplaintType] = useState('Order Issue');
    const [orderIssueType, setOrderIssueType] = useState('');
    const [customDescription, setCustomDescription] = useState('');
    const [generalDescription, setGeneralDescription] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [submissionSuccessful, setSubmissionSuccessful] = useState(false);

    const complaintTypes = [
        'Order Issue',
        'Food/Drink Quality',
        'Service/Staff Feedback',
        'Website/App Issue',
        'Other Feedback'
    ];

    const orderIssueOptions = [
        'Order not delivered',
        'Order is delayed',
        'Wrong order delivered',
        'Description does not match',
        'Other'
    ];
    
    // --- UI/STYLE Enhancements ---
    const headerStyle = {
        backgroundImage: `linear-gradient(to bottom, ${_propStyles.PRIMARY_COLOR}e0 10%, ${styles.BACKGROUND_COLOR} 100%), url(${HEADER_IMAGE_URL})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        // ⬇️ MADE HEADER PADDING SMALLER
        padding: '30px 0 15px 0', 
        borderRadius: `0 0 ${styles.CARD_RADIUS} ${styles.CARD_RADIUS}`,
        textAlign: 'center',
        marginBottom: '20px',
        boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
        // ⬇️ MADE HEADER HEIGHT SMALLER
        height: '90px', 
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
    };
    
    // --- Submission Handler ---
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!user || !user.id || !user.role) {
            alert('❌ Authentication Error: User data is missing. Please log in again.');
            return;
        }

        if (complaintType === 'Order Issue' && !orderIssueType) {
            alert('❌ Please select the type of order issue.');
            return;
        }

        if (orderIssueType === 'Other' && !customDescription.trim()) {
            alert('❌ Please provide a description for the other issue.');
            return;
        }

        if (complaintType !== 'Order Issue' && !generalDescription.trim()) {
            alert('❌ Please provide a description for your feedback.');
            return;
        }

        setSubmitting(true);
        setSubmissionSuccessful(false);

        const details = complaintType === 'Order Issue'
            ? (orderIssueType === 'Other' ? customDescription : orderIssueType)
            : generalDescription;

        const payload = {
            userId: user.id,
            userName: user.name,
            userRole: user.role,
            type: complaintType,
            details: details,
            location: 'N/A', // Not needed anymore
            orderReference: 'N/A', // Not needed anymore
            status: 'New',
        };

        const data = await callApi('/feedback', 'POST', payload);

        setSubmitting(false);

        if (data && (data.success || data._id)) {
            setSubmissionSuccessful(true);

            setTimeout(() => {
                setPage('home');
            }, SUCCESS_DELAY_MS);

            setComplaintType('Order Issue');
            setOrderIssueType('');
            setCustomDescription('');
            setGeneralDescription('');
        } else {
            alert(`❌ Submission failed: ${data?.message || 'Check network connection and server response.'}`);
        }
    };
    
    if (submissionSuccessful) {
        return <SuccessOverlay styles={styles} onContinue={() => setPage('home')} />;
    }

    return (
        <div style={{ ...styles.appContainer, padding: 0 }}>
            
            {/* 1. Enhanced Header Banner (Smaller) */}
            <div style={headerStyle}>
                <button 
                    onClick={() => setPage('home')} 
                    style={{ 
                        position: 'absolute',
                        // ⬇️ MOVED UP FOR SMALLER HEADER
                        top: '10px', 
                        // ⬇️ MOVED IN SLIGHTLY
                        left: '10px', 
                        background: 'rgba(255, 255, 255, 0.3)',
                        border: 'none',
                        borderRadius: '50%',
                        // ⬇️ MADE BUTTON SMALLER
                        width: '30px', 
                        height: '30px',
                        color: 'white',
                        // ⬇️ MADE FONT SMALLER
                        fontSize: '1em', 
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        zIndex: 10,
                    }}
                >
                    <FaChevronLeft />
                </button>
                <h2 style={{ 
                    color: 'white', 
                    // ⬇️ MADE FONT SMALLER
                    fontSize: '1.2em', 
                    fontWeight: '800', 
                    textShadow: '0 1px 3px rgba(0,0,0,0.5)', 
                    paddingBottom: '10px' 
                }}>
                    Customer Feedback Center
                </h2>
            </div>
            
            <div style={_propStyles.screenPadding}>
                <p style={{ color: styles.TEXT_COLOR, marginBottom: '25px', textAlign: 'center', fontWeight: '500' }}>
                    Tell us how we can improve. We aim for quick resolution.
                </p>

                <form onSubmit={handleSubmit} style={styles.formContainer}>

                    {/* 1. Issue Type */}
                    <div style={styles.formGroup}>
                        <label style={styles.formLabel}><FaTags /> Category:</label>
                        <select
                            value={complaintType}
                            onChange={(e) => {
                                setComplaintType(e.target.value);
                                setOrderIssueType(''); // Reset when category changes
                                setCustomDescription('');
                                setGeneralDescription('');
                            }}
                            style={styles.selectInput}
                            required
                        >
                            {complaintTypes.map(type => (
                                <option key={type} value={type}>{type}</option>
                            ))}
                        </select>
                    </div>

                    {/* 2. Order Issue Type (Only for Order Issue category) */}
                    {complaintType === 'Order Issue' && (
                        <div style={styles.formGroup}>
                            <label style={styles.formLabel}><FaClipboardList /> Issue Type:</label>
                            <select
                                value={orderIssueType}
                                onChange={(e) => {
                                    setOrderIssueType(e.target.value);
                                    if (e.target.value !== 'Other') {
                                        setCustomDescription('');
                                    }
                                }}
                                style={styles.selectInput}
                                required
                            >
                                <option value="">Select Issue Type</option>
                                {orderIssueOptions.map(option => (
                                    <option key={option} value={option}>{option}</option>
                                ))}
                            </select>
                        </div>
                    )}

                    {/* 3. Custom Description (Only when "Other" is selected for Order Issue) */}
                    {orderIssueType === 'Other' && (
                        <div style={styles.formGroup}>
                            <label style={styles.formLabel}><FaCommentAlt /> Please describe the issue:</label>
                            <textarea
                                value={customDescription}
                                onChange={(e) => setCustomDescription(e.target.value)}
                                rows="3"
                                style={styles.textArea}
                                placeholder="Please provide details about your issue..."
                                required
                            />
                        </div>
                    )}

                    {/* 4. General Description (For all categories except Order Issue) */}
                    {complaintType !== 'Order Issue' && (
                        <div style={styles.formGroup}>
                            <label style={styles.formLabel}><FaCommentAlt /> Please describe your feedback:</label>
                            <textarea
                                value={generalDescription}
                                onChange={(e) => setGeneralDescription(e.target.value)}
                                rows="3"
                                style={styles.textArea}
                                placeholder="Please provide details about your feedback..."
                                required
                            />
                        </div>
                    )}

                </form>

                {/* Footer with buttons */}
                <div style={{
                    position: 'fixed',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    backgroundColor: '#ffffff',
                    borderTop: `1px solid ${styles.BORDER_COLOR || '#e0e0e0'}`,
                    padding: '15px 20px',
                    boxShadow: '0 -2px 10px rgba(0, 0, 0, 0.1)',
                    zIndex: 100
                }}>
                    <div style={{
                        display: 'flex',
                        gap: '15px',
                        maxWidth: '480px',
                        margin: '0 auto',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>
                        <button
                            type="submit"
                            onClick={handleSubmit}
                            style={{
                                ..._propStyles.primaryButton,
                                flex: '0 0 180px',
                                height: '50px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '8px',
                                margin: 0,
                                padding: '0 20px'
                            }}
                            disabled={
                                submitting ||
                                !complaintType ||
                                (complaintType === 'Order Issue' && !orderIssueType) ||
                                (orderIssueType === 'Other' && !customDescription.trim()) ||
                                (complaintType !== 'Order Issue' && !generalDescription.trim()) ||
                                !user?.id ||
                                !user?.role
                            }
                        >
                            {submitting ? (
                                <>
                                    <FaSpinner className="spinner" style={{ animation: 'spin 1s linear infinite' }} /> Submitting...
                                    <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
                                </>
                            ) : (
                                <>
                                    <FaPaperPlane /> Send Feedback
                                </>
                            )}
                        </button>

                        <button
                            style={{
                                ..._propStyles.secondaryButton,
                                flex: '0 0 180px',
                                height: '50px',
                                border: `2px solid ${styles.PRIMARY_COLOR}`,
                                color: styles.TEXT_COLOR,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '8px',
                                margin: 0,
                                padding: '0 20px'
                            }}
                            onClick={() => setPage('home')}
                        >
                            <FaChevronLeft /> Cancel
                        </button>
                    </div>
                </div>

                {/* Add bottom padding to prevent content from being hidden behind footer */}
                <div style={{ height: '80px' }}></div>
            </div>
        </div>
    );
};

export default ComplaintPage;