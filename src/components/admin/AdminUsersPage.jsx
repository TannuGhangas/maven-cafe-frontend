// src/components/admin/AdminUsersPage.jsx

import React, { useState, useEffect } from 'react';
import { FaSpinner, FaPlus, FaChevronLeft, FaTrash, FaEdit, FaUnlockAlt, FaBan } from 'react-icons/fa';
import AdminUserEditModal from './AdminUserEditModal';

const AdminUsersPage = ({ user, callApi, setPage, styles }) => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingUser, setEditingUser] = useState(null);

    const fetchUsers = async () => {
        setLoading(true);
        // The API call needs user credentials for authorization
        const data = await callApi(`/users?userId=${user.id}&userRole=${user.role}`);
        if (data) {
            setUsers(data);
        }
        setLoading(false);
    };
    
    const handleAction = async (userIdToModify, action, value) => {
        let url;
        let method = 'PUT';
        let body = { userId: user.id, userRole: user.role };
        let message;

        if (action === 'role') {
            url = `/users/${userIdToModify}/role`;
            body.role = value;
            message = `Role updated to ${value}.`;
        } else if (action === 'access') {
            url = `/users/${userIdToModify}/access`;
            body.enabled = value;
            message = `Access ${value ? 'enabled' : 'disabled'}.`;
        } else if (action === 'delete') {
            if (!window.confirm(`Are you sure you want to PERMANENTLY DELETE user ID ${userIdToModify}?`)) return;
            url = `/users/${userIdToModify}`;
            method = 'DELETE';
            body = { userId: user.id, userRole: user.role };
            message = `User deleted.`;
        } else if (action === 'add') {
            url = `/users`;
            method = 'POST';
            body = { ...value, userId: user.id, userRole: user.role };
            message = `User created.`;
        } else if (action === 'update') {
            url = `/users/${userIdToModify}`;
            method = 'PUT';
            body = { ...value, userId: user.id, userRole: user.role };
            message = `User updated.`;
        } else {
            return; // Should not happen
        }

        const data = await callApi(url, method, body);
        if (data && data.success) {
            alert(data.message || message);
            fetchUsers();
            setEditingUser(null);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []); // Only fetch when component mounts

    
    if (loading) return <div style={styles.loadingContainer}><FaSpinner className="spinner" size={30} /> Loading Users...</div>;

    return (
        <div style={styles.screenPadding}>
            <h2>Admin User Management</h2>
            
            <button 
                style={styles.primaryButton} 
                onClick={() => setEditingUser({ id: 'new', role: 'user', enabled: true, name: '', username: '', password: '' })}
            >
                <FaPlus /> Create New User
            </button>
            <button 
                style={styles.secondaryButton} 
                onClick={() => setPage('kitchen-dashboard')}
            >
                <FaChevronLeft /> Back to Dashboard
            </button>

            {editingUser && (
                <AdminUserEditModal 
                    user={editingUser} 
                    onClose={() => setEditingUser(null)} 
                    onSave={handleAction} 
                    styles={styles}
                />
            )}
            
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
                gap: '20px',
                marginTop: '20px'
            }}>
                {users.map(u => (
                    <div key={u._id} style={{
                        background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
                        borderRadius: '20px',
                        padding: '25px',
                        boxShadow: '0 8px 25px rgba(0,0,0,0.1), 0 4px 10px rgba(0,0,0,0.05)',
                        border: '1px solid rgba(255,255,255,0.8)',
                        position: 'relative',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        cursor: 'pointer',
                        transform: 'translateY(0)',
                        ':hover': {
                            transform: 'translateY(-5px)',
                            boxShadow: '0 12px 35px rgba(0,0,0,0.15), 0 6px 15px rgba(0,0,0,0.1)'
                        }
                    }}>
                        <div style={{ marginBottom: '15px' }}>
                            <h3 style={{
                                margin: '0 0 10px 0',
                                color: '#103c7f',
                                fontSize: '1.2rem',
                                fontWeight: '700'
                            }}>
                                {u.name}
                            </h3>
                            <div style={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '5px',
                                fontSize: '0.9rem',
                                color: '#666'
                            }}>
                                <div><strong>ID:</strong> {u._id.substring(20)}</div>
                                <div><strong>Username:</strong> {u.username}</div>
                                <div><strong>Role:</strong> <span style={{
                                    color: u.role === 'admin' ? '#ff3b30' : u.role === 'kitchen' ? '#ff9500' : '#4cd964',
                                    fontWeight: '600'
                                }}>{u.role.toUpperCase()}</span></div>
                                <div><strong>Access:</strong> <span style={{
                                    color: u.enabled ? '#4cd964' : '#ff3b30',
                                    fontWeight: '600'
                                }}>{u.enabled ? 'Enabled' : 'Disabled'}</span></div>
                            </div>
                        </div>

                        {/* Control Buttons */}
                        <div style={{
                            display: 'flex',
                            gap: '8px',
                            justifyContent: 'flex-end',
                            flexWrap: 'wrap'
                        }}>
                            {/* Toggle Access */}
                            <button
                                style={{
                                    background: u.enabled ? 'linear-gradient(135deg, #ffcc00 0%, #ff9500 100%)' : 'linear-gradient(135deg, #4cd964 0%, #34c759 100%)',
                                    color: '#ffffff',
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
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                                    transform: 'translateY(0)',
                                    ':hover': {
                                        transform: 'translateY(-2px)',
                                        boxShadow: '0 6px 20px rgba(0,0,0,0.2)'
                                    }
                                }}
                                onClick={() => handleAction(u._id, 'access', !u.enabled)}
                                title={u.enabled ? 'Disable Access' : 'Enable Access'}
                            >
                                {u.enabled ? <FaBan /> : <FaUnlockAlt />}
                                {u.enabled ? 'Disable' : 'Enable'}
                            </button>
                            {/* Edit User */}
                            <button
                                style={{
                                    background: 'linear-gradient(135deg, #007aff 0%, #0056cc 100%)',
                                    color: '#ffffff',
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
                                onClick={() => setEditingUser(u)}
                                title="Edit User"
                            >
                                <FaEdit />
                                Edit
                            </button>
                            {/* Delete */}
                            <button
                                style={{
                                    background: u._id === user.id ? 'linear-gradient(135deg, #cccccc 0%, #aaaaaa 100%)' : 'linear-gradient(135deg, #ff3b30 0%, #d63027 100%)',
                                    color: '#ffffff',
                                    border: 'none',
                                    borderRadius: '12px',
                                    padding: '10px 15px',
                                    cursor: u._id === user.id ? 'not-allowed' : 'pointer',
                                    fontSize: '0.9rem',
                                    fontWeight: '600',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                    boxShadow: u._id === user.id ? 'none' : '0 4px 12px rgba(255,59,48,0.3)',
                                    transform: 'translateY(0)',
                                    ':hover': u._id === user.id ? {} : {
                                        transform: 'translateY(-2px)',
                                        boxShadow: '0 6px 20px rgba(255,59,48,0.4)'
                                    }
                                }}
                                onClick={() => handleAction(u._id, 'delete')}
                                disabled={u._id === user.id} // Prevent admin from deleting self
                                title="Delete User"
                            >
                                <FaTrash />
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AdminUsersPage;