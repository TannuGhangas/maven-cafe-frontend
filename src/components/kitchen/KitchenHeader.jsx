import React from 'react';
import '../../styles/KitchenHeader.css';

const KitchenHeader = () => {
    return (
        <div className="kitchen-header">
            <div className="kitchen-header-title">
                KITCHEN
            </div>
            <div className="kitchen-header-subtitle">
                Active Orders
            </div>
        </div>
    );
};

export default KitchenHeader;