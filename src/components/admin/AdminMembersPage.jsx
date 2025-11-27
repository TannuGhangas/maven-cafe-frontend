import React, { useState, useEffect } from 'react';
import { FaSpinner, FaPlus, FaChevronLeft, FaTrash, FaEdit, FaUnlockAlt, FaBan, FaUsers } from 'react-icons/fa';

const AdminMembersPage = ({ user, callApi, setPage, styles }) => {
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingMember, setEditingMember] = useState(null);

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
        primaryButton: {
            ...styles.primaryButton,
            backgroundColor: '#103c7f', // Dark Blue
            fontFamily: 'Calibri, Arial, sans-serif',
            fontSize: '1.1rem',
            fontWeight: '600',
        },
        secondaryButton: {
            ...styles.secondaryButton,
            fontFamily: 'Calibri, Arial, sans-serif',
            fontSize: '1rem',
            fontWeight: '600',
        },
        memberCard: {
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            padding: '20px',
            margin: '10px 0',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            border: '1px solid #ddd',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontFamily: 'Calibri, Arial, sans-serif',
        },
        controlButton: (color) => ({
            background: color,
            border: 'none',
            color: 'white',
            padding: '10px 12px',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '1rem',
            fontWeight: '600',
            margin: '0 2px',
            fontFamily: 'Calibri, Arial, sans-serif',
        }),
        screenPadding: {
            ...styles.screenPadding,
            fontFamily: 'Calibri, Arial, sans-serif',
        },
        loadingContainer: {
            ...styles.loadingContainer,
            fontFamily: 'Calibri, Arial, sans-serif',
        },
    };

    const fetchMembers = async () => {
        setLoading(true);
        const data = await callApi(`/users?userId=${user.id}&userRole=${user.role}`);
        if (data) {
            setMembers(data);
        }
        setLoading(false);
    };

    const handleAction = async (memberIdToModify, action, value) => {
        let url;
        let method = 'PUT';
        let body = { userId: user.id, userRole: user.role };
        let message;

        if (action === 'role') {
            url = `/users/${memberIdToModify}/role`;
            body.role = value;
            message = `Role updated to ${value}.`;
        } else if (action === 'access') {
            url = `/users/${memberIdToModify}/access`;
            body.enabled = value;
            message = `Access ${value ? 'enabled' : 'disabled'}.`;
        } else if (action === 'delete') {
            if (!window.confirm(`Are you sure you want to PERMANENTLY DELETE member ID ${memberIdToModify}?`)) return;
            url = `/users/${memberIdToModify}`;
            method = 'DELETE';
            body = { userId: user.id, userRole: user.role };
            message = `Member deleted.`;
        } else if (action === 'add') {
            url = `/users`;
            method = 'POST';
            body = { ...value, userId: user.id, userRole: user.role };
            message = `Member created.`;
        } else {
            return;
        }

        const data = await callApi(url, method, body);
        if (data && data.success) {
            alert(data.message || message);
            fetchMembers();
            setEditingMember(null);
        }
    };

    useEffect(() => {
        fetchMembers();
    }, []);

    if (loading) return (
        <div style={enhancedStyles.loadingContainer}>
            <FaSpinner className="spinner" size={30} /> Loading Members...
        </div>
    );

    return (
        <div style={enhancedStyles.screenPadding}>
            <h2 style={enhancedStyles.headerText}>
                <FaUsers style={{ marginRight: '10px' }} />
                Member Management
            </h2>

            <div style={{ display: 'flex', gap: '10px', marginBottom: '30px', flexWrap: 'wrap' }}>
                <button
                    style={enhancedStyles.primaryButton}
                    onClick={() => setEditingMember({ id: 'new', role: 'user', enabled: true, name: '', username: '', password: '' })}
                >
                    <FaPlus /> Add New Member
                </button>
                <button
                    style={enhancedStyles.secondaryButton}
                    onClick={() => setPage('admin-dashboard')}
                >
                    <FaChevronLeft /> Back to Admin Dashboard
                </button>
            </div>

            <div style={{ marginTop: '20px' }}>
                {members.map(member => (
                    <div key={member._id} style={enhancedStyles.memberCard}>
                        <div style={{ flexGrow: 1 }}>
                            <strong style={{ fontSize: '1.2rem', color: '#103c7f', fontFamily: 'Cambria, serif' }}>
                                {member.name}
                            </strong>
                            <div style={{ marginTop: '5px', color: '#666', fontSize: '0.9rem' }}>
                                ID: {member._id.substring(20)} | Username: {member.username}
                            </div>
                            <div style={{
                                marginTop: '3px',
                                color: member.enabled ? '#a1db40' : '#e74c3c',
                                fontWeight: '600',
                                fontSize: '0.9rem'
                            }}>
                                Status: {member.enabled ? 'Active' : 'Disabled'} | Role: {member.role.toUpperCase()}
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '5px' }}>
                            <button
                                style={enhancedStyles.controlButton(member.enabled ? '#ffcc00' : '#a1db40')}
                                onClick={() => handleAction(member._id, 'access', !member.enabled)}
                                title={member.enabled ? 'Disable Member' : 'Enable Member'}
                            >
                                {member.enabled ? <FaBan /> : <FaUnlockAlt />}
                            </button>
                            <button
                                style={enhancedStyles.controlButton('#103c7f')}
                                onClick={() => setEditingMember(member)}
                                title="Edit Member"
                            >
                                <FaEdit />
                            </button>
                            <button
                                style={enhancedStyles.controlButton('#e74c3c')}
                                onClick={() => handleAction(member._id, 'delete')}
                                disabled={member._id === user.id}
                                title="Delete Member"
                            >
                                <FaTrash />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AdminMembersPage;