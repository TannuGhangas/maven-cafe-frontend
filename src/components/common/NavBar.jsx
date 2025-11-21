// src/components/common/NavBar.jsx

import React from 'react';
import { FaUserCircle, FaCoffee, FaListAlt } from 'react-icons/fa';

// CORRECTED IMPORT PATH based on the provided tree structure:
// From src/components/common/ -> ../../assets/maven_logo.png
import MavenLogo from '../../assets/maven_logo.png'; 

const NavBar = ({ user, setPage, setModal, styles }) => {
    const isKitchenOrAdmin = user.role === 'kitchen' || user.role === 'admin';
    
    // --- LOCAL STYLE FOR THE LOGO ---
    const logoStyle = {
        height: '50px',       // Increased from 35px → 45px
        maxHeight: '100%',    // Prevents stretching navbar
        width: 'auto',
        objectFit: 'contain',
        margin: 0,
        padding: '2px 0',     // Reduced padding to keep navbar same size
    };
    
    // -------------------------------
    
    return (
        <div style={styles.navBar}>
            
            {/* LOGO PLACEMENT: Uses the imported MavenLogo variable */}
            <img 
                src={MavenLogo} 
                alt="Maven Cafe Logo" 
                style={logoStyle} 
            />
            
            <div style={styles.navIcons}>
                
                {user.role === 'user' && (
                    <button style={styles.navButton} onClick={() => setPage('home')}>
                        <FaCoffee size={24} />
                    </button>
                )}

                {isKitchenOrAdmin && (
                    <button style={styles.navButton} onClick={() => setPage('kitchen-dashboard')}>
                        <FaListAlt size={24} />
                    </button>
                )}

                <button style={styles.navButton} onClick={() => setModal('profile')}>
                    <FaUserCircle size={24} />
                </button>
            </div>
        </div>
    );
};

export default NavBar;