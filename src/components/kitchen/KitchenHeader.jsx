import React from 'react';
import '../../styles/KitchenHeader.css';

const KitchenHeader = () => {
    return (
        <div className="kitchen-header">
            <div className="kitchen-header-title">
                KITCHEN DASHBOARD
            </div>
            <div className="kitchen-header-subtitle">
                Manage & track active orders
            </div>
        </div>
    );
};

export default KitchenHeader;