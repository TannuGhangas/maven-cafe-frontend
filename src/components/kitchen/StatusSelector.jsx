import React from 'react';
import '../../styles/StatusSelector.css';

const StatusSelector = ({ selectedItemTypeKey, selectedStatus, setSelectedStatus, computeStatusCountsForItemType, selectedSlot, styles }) => {
    if (!selectedItemTypeKey) return null;

    const { counts } = computeStatusCountsForItemType(selectedSlot, selectedItemTypeKey);

    return (
        <div className="status-grid">
            {["Placed", "Making", "Ready"].map((st) => (
                <div
                    key={st}
                    onClick={() => {
                        setSelectedStatus(st);
                    }}
                    className={`status-card ${selectedStatus === st ? 'selected' : ''}`}
                >
                    <div className={`status-count ${st.toLowerCase()}`}>
                        {counts[st]}
                    </div>
                    <div className="status-label">{st}</div>
                </div>
            ))}
        </div>
    );
};

export default StatusSelector;