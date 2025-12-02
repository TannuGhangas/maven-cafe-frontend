import React from 'react';
import { FaCheckCircle, FaChevronDown, FaChevronUp, FaUtensilSpoon, FaStickyNote } from 'react-icons/fa';
import { ALL_LOCATIONS_MAP, getAllowedLocations, USER_LOCATIONS_DATA } from '../../config/constants';
import '../../styles/OrderCard.css';

const OrderCard = ({
    order,
    selectedStatus,
    selectedItemTypeKey,
    expandedOrderId,
    setExpandedOrderId,
    updateOrderStatus,
    styles,
    enhancedStyles,
    user
}) => {
    const isMobile = window.innerWidth < 768;
    const orderId = order?._id;
    const isCardExpanded = expandedOrderId === orderId;

    // Calculate user's default location
    const userLocations = USER_LOCATIONS_DATA;
    const currentUser = userLocations.find(u => u.name === order.userName) || userLocations[0];
    const allowedLocations = currentUser ? getAllowedLocations(currentUser.location, currentUser.access) : [];
    const defaultLocationKey = allowedLocations[0]?.key || (currentUser ? currentUser.location : null) || 'Others';
    const defaultLocationName = allowedLocations.find(loc => loc.key === defaultLocationKey)?.name || ALL_LOCATIONS_MAP[defaultLocationKey] || defaultLocationKey;

    // Items relevant to the current selected item/type combo
    const relevantItems = (order?.items || []).filter(
        (it) => {
            const itemMatch = String(it?.item || "").toLowerCase() === selectedItemTypeKey.split('_')[0];
            const typeMatch = String(it?.type || "Standard").toLowerCase() === selectedItemTypeKey.split('_')[1];
            return itemMatch && typeMatch;
        }
    );

    const qty = relevantItems.reduce(
        (s, it) => s + Number(it?.quantity || 0),
        0
    );

    const nextStatus =
        order.status === 'Placed' ? 'Making' :
        order.status === 'Making' ? 'Ready' :
        order.status === 'Ready' ? 'Delivered' : null;

    const groupedItems = (order.items || []).reduce((groups, item) => {
        const key = `${item.type || ''}-${item.item || ''}`;
        if (!groups[key]) {
            groups[key] = { type: item.type, item: item.item, totalQty: 0, allItems: [] };
        }
        groups[key].totalQty += (item.quantity || 0);
        groups[key].allItems.push(item);
        return groups;
    }, {});


    return (
        <div
            key={orderId}
            className={`order-card ${selectedStatus.toLowerCase()}`}
        >
            {/* Card Header (Customer & Qty) */}
            <div className="order-card-header">
                <div className="order-customer-name">
                    {order?.userName || "Customer"}
                    {order?.tags?.includes('New') && (Date.now() - order.timestamp < 2 * 60 * 1000) && (
                        <span style={{
                            backgroundColor: '#ff6b6b',
                            color: 'white',
                            padding: '2px 6px',
                            borderRadius: '10px',
                            fontSize: '0.7rem',
                            fontWeight: 'bold',
                            marginLeft: '8px',
                            verticalAlign: 'middle'
                        }}>
                            NEW
                        </span>
                    )}
                </div>
                <div className="order-quantity">
                    {qty} Pcs
                </div>
            </div>

            {/* Key Details (Time & Location) - Summary Format */}
            <div className="order-details">
                <div className="order-summary-row">
                    <span className="order-summary-label">Time:</span>
                    <span className="order-summary-value">
                        {order.timestamp ? new Date(order.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'N/A'}
                    </span>
                </div>
                <div className="order-summary-row">
                    <span className="order-summary-label">Location:</span>
                    <span className="order-summary-value">
                        {(() => {
                            const loc = relevantItems[0]?.location;
                            const displayLoc = loc === 'Others' ? defaultLocationName : (ALL_LOCATIONS_MAP[loc] || loc || "N/A");
                            const table = relevantItems[0]?.tableNo ? `(Table ${relevantItems[0]?.tableNo})` : "";
                            if (loc && loc.startsWith('Seat_')) {
                                const seatNum = loc.substring(5);
                                return (
                                    <>
                                        <span style={{
                                            display: 'inline-block',
                                            backgroundColor: '#4CAF50',
                                            color: 'white',
                                            borderRadius: '50%',
                                            width: '24px',
                                            height: '24px',
                                            textAlign: 'center',
                                            lineHeight: '24px',
                                            fontSize: '0.8rem',
                                            fontWeight: 'bold',
                                            marginRight: '8px'
                                        }}>
                                            {seatNum}
                                        </span>
                                        {displayLoc} {table}
                                    </>
                                );
                            }
                            return <>{displayLoc} {table}</>;
                        })()}
                    </span>
                </div>
            </div>

            {/* Relevant Item Details (Always Visible) - Simplified structure */}
            <div className="order-preparation-section">
                <div className="order-preparation-title">
                    Preparation: {relevantItems[0]?.type === relevantItems[0]?.item ? relevantItems[0]?.item : `${relevantItems[0]?.type} ${relevantItems[0]?.item}`}
                </div>

                {relevantItems.map((it, i) => (
                    <div key={i} className="order-item-row">
                        <div className="order-item-details">
                            <div className="order-item-quantity">
                                {it.quantity} {it.type}
                            </div>

                            {/* Sugar Level */}
                            {(it.item === 'coffee' || it.item === 'tea') && (
                                <div className="order-prep-detail">
                                    <FaUtensilSpoon size={14} color="#888" />
                                    Sugar: <span style={{ fontWeight: 700 }}>{it.sugarLevel ?? 'N/A'} Spoons</span>
                                </div>
                            )}

                            {/* Notes */}
                            {it.notes && (
                                <div className="order-prep-detail">
                                    <FaStickyNote size={14} color="darkred" />
                                    <span style={{ fontStyle: 'italic', fontWeight: 600, color: 'darkred' }}>{it.notes}</span>
                                </div>
                            )}

                            {/* Custom Location (if any) - Kept it separate as it's a specific instruction */}
                            {it.customLocation && (
                                <div className="order-custom-location">
                                    **Custom Location:** {it.customLocation}
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Status Buttons - Equal Width */}
            <div className="order-action-buttons">
                {nextStatus && nextStatus !== 'Delivered' && (
                    <button
                        className="order-action-button"
                        onClick={(e) => {
                            e.stopPropagation();
                            updateOrderStatus(orderId, nextStatus);
                        }}
                    >
                        <FaCheckCircle size={isMobile ? 12 : 14} /> {isMobile ? nextStatus : `Mark as ${nextStatus}`}
                    </button>
                )}

                <button
                    className="order-action-button delivered"
                    onClick={(e) => {
                        e.stopPropagation();
                        updateOrderStatus(orderId, 'Delivered');
                    }}
                >
                    Delivered
                </button>
            </div>

            {/* Collapsible Detail Content for ALL Items in the order */}
            <div
                onClick={() => setExpandedOrderId(isCardExpanded ? null : orderId)}
                className="order-expand-toggle"
            >
                {isCardExpanded ? (
                    <span><FaChevronUp size={12} /> Hide All Order Items ({order?.items?.length} Total)</span>
                ) : (
                    <span><FaChevronDown size={12} /> View All Other Items ({order?.items?.length} Total)</span>
                )}
            </div>

            {isCardExpanded && (
                <div className="order-expanded-content">
                    <h5 className="order-expanded-title">
                        Other Items in Order
                    </h5>

                    {/* Render Grouped Items */}
                    {Object.values(groupedItems).map((group, idx) => {
                        // Skip the item group that is currently displayed in the main section for clarity
                        const isRelevantGroup = group.item === selectedItemTypeKey.split('_')[0] && group.type.toLowerCase() === selectedItemTypeKey.split('_')[1];
                        if (isRelevantGroup) return null;

                        return (
                            <div
                                key={`${orderId}-${idx}`}
                                className="order-group-item"
                            >
                                <div className="order-group-title">
                                    {group.totalQty}x {group.type || 'Standard'} {group.item}
                                </div>
                                {group.allItems.map((it, i) => (
                                    <div key={i} className="order-group-detail">
                                        Sugar: {it.sugarLevel ?? 'N/A'} | Notes: *{it.notes || 'None'}*
                                    </div>
                                ))}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default OrderCard;