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
            
            <div style={styles.listContainer}>
                {users.map(u => (
                    // Styles.userCard is a getter function defined in styles.js
                    <div key={u._id} style={styles.userCard}> 
                        <div style={{ flexGrow: 1 }}>
                            <strong>{u.name} (ID: {u._id.substring(20)})</strong>
                            <small style={{ display: 'block', color: '#666' }}>
                                Role: {u.role.toUpperCase()} | Username: {u.username}
                            </small>
                            <small style={{ display: 'block', color: u.enabled ? 'green' : 'red' }}>
                                Access: {u.enabled ? 'Enabled' : 'Disabled'}
                            </small>
                        </div>

                        {/* Control Buttons */}
                        <div style={styles.adminControlGroup}>
                            {/* Toggle Access */}
                            <button 
                                style={styles.controlButton(u.enabled ? '#ffcc00' : '#4cd964')} 
                                onClick={() => handleAction(u._id, 'access', !u.enabled)}
                            >
                                {u.enabled ? <FaBan /> : <FaUnlockAlt />}
                            </button>
                            {/* Change Role */}
                            <button 
                                style={styles.controlButton('#007aff')} 
                                onClick={() => setEditingUser(u)}
                            >
                                <FaEdit />
                            </button>
                            {/* Delete */}
                            <button 
                                style={styles.controlButton('#ff3b30')} 
                                onClick={() => handleAction(u._id, 'delete')}
                                disabled={u._id === user.id} // Prevent admin from deleting self
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

export default AdminUsersPage;