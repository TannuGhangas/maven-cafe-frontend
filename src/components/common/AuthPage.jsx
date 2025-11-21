// src/components/common/AuthPage.jsx (LoginPage from original code)

import React, { useState } from 'react';

const AuthPage = ({ onLogin, styles }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        onLogin(username, password);
    };

    return (
        <div style={styles.appContainer}>
            <div style={styles.screenPadding}>
                <h2>Maven Cafe Login</h2>
                <p>Welcome! Please log in to place an order or manage the kitchen.</p>
                <form onSubmit={handleSubmit}>
                    <label style={styles.label}>Username:</label>
                    <input
                        style={styles.inputField}
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />

                    <label style={styles.label}>Password:</label>
                    <input
                        style={styles.inputField}
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />

                    <button style={styles.primaryButton} type="submit">
                        Log In
                    </button>
                </form>
                <p style={{ marginTop: '20px', fontSize: '0.9em', color: '#666' }}>
                    **Note:** If you don't have an account, please contact the admin.
                </p>
            </div>
        </div>
    );
};

export default AuthPage;