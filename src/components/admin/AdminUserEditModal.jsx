// src/components/admin/AdminUserEditModal.jsx

import React, { useState } from 'react';

const AdminUserEditModal = ({ user: initialUser, onClose, onSave, styles }) => {
    const isNew = initialUser.id === 'new';
    const [user, setUser] = useState(initialUser);

    const handleSave = () => {
        if (!user.name || !user.username || !user.role) {
            alert("Name, Username, and Role are required.");
            return;
        }
        if (isNew && !user.password) {
             alert("Password is required for new users.");
             return;
        }
        if (isNew) {
            onSave(null, 'add', user);
        } else {
            // Only role can be updated via this modal for existing users
            onSave(user.id, 'role', user.role); 
        }
    };

    return (
        <div style={styles.modalOverlay}>
            <div style={styles.modalContent}>
                <h2>{isNew ? 'Create New User' : `Edit User: ${user.name}`}</h2>

                {isNew && (
                    <>
                        <label style={styles.label}>Name:</label>
                        <input style={styles.inputField} type="text" value={user.name} onChange={e => setUser({...user, name: e.target.value})} placeholder="Full Name" />
                        <label style={styles.label}>Username:</label>
                        <input style={styles.inputField} type="text" value={user.username} onChange={e => setUser({...user, username: e.target.value})} placeholder="Username" />
                        <label style={styles.label}>Password:</label>
                        <input style={styles.inputField} type="password" value={user.password || ''} onChange={e => setUser({...user, password: e.target.value})} placeholder="Password" />
                    </>
                )}

                <label style={styles.label}>Role:</label>
                <select style={styles.selectField} value={user.role} onChange={e => setUser({...user, role: e.target.value})}>
                    {['user', 'kitchen', 'admin'].map(r => <option key={r} value={r}>{r.toUpperCase()}</option>)}
                </select>
                
                <button style={styles.primaryButton} onClick={handleSave}>
                    {isNew ? 'Create User' : 'Save Role'}
                </button>
                <button style={styles.closeButton} onClick={onClose}>Cancel</button>
            </div>
        </div>
    );
};

export default AdminUserEditModal;