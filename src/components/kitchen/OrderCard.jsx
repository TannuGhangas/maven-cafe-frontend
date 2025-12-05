import React, { useEffect, useState } from 'react';
import { FaCheck, FaChevronDown, FaChevronUp, FaUtensilSpoon, FaStickyNote, FaMapMarkerAlt, FaCoffee, FaClock, FaUser, FaCheckCircle, FaListUl, FaUtensils } from 'react-icons/fa';
import { ALL_LOCATIONS_MAP, getAllowedLocations, USER_LOCATIONS_DATA } from '../../config/constants';
import ProfileImage from '../common/ProfileImage';
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
            style={{
                backgroundColor: '#ffffff',
                borderRadius: '12px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                border: '1px solid #e9ecef',
                overflow: 'hidden',
                transition: 'all 0.3s ease',
                fontFamily: 'Calibri, Arial, sans-serif'
            }}
        >
            {/* Card Header (Customer & Time & Qty) */}
            <div style={{
                padding: '12px 16px',
                borderBottom: '1px solid #e9ecef',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
            }}>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px',
                    flex: 1
                }}>
                    <div className="order-customer-profile">
                        <ProfileImage
                            userId={order?.userId}
                            userName={order?.userName}
                            userProfile={order?.userProfile}
                            size="large"
                            className="order-customer-avatar"
                            showPlaceholder={true}
                            alt={`${order.userProfile?.name || order?.userName || "Customer"}'s profile`}
                        />
                    </div>
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '4px'
                    }}>
                        <div style={{
                            fontSize: '1.2rem',
                            fontWeight: '700',
                            color: '#103c7f',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            fontFamily: 'Cambria, serif'
                        }}>
                            <FaUser style={{ color: '#103c7f' }} />
                            {order?.userProfile?.name || order?.userName || "Customer"}
                            {order?.tags?.includes('New') && (Date.now() - order.timestamp < 2 * 60 * 1000) && (
                                <span style={{
                                    backgroundColor: '#a1db40',
                                    color: '#103c7f',
                                    padding: '3px 8px',
                                    borderRadius: '12px',
                                    fontSize: '0.75rem',
                                    fontWeight: 'bold',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.5px'
                                }}>
                                    NEW
                                </span>
                            )}
                        </div>

                    </div>
                </div>
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-end',
                    gap: '8px'
                }}>
                    <div style={{
                        fontSize: '0.85rem',
                        fontWeight: '600',
                        color: '#666666',
                        fontFamily: 'Calibri, Arial, sans-serif',
                        textAlign: 'right',
                        lineHeight: '1.2'
                    }}>
                        {order.timestamp ? (
                            <>
                                <div>{new Date(order.timestamp).toLocaleDateString()}</div>
                                <div style={{ fontSize: '0.9rem', color: '#103c7f', fontWeight: '700' }}>
                                    {new Date(order.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </div>
                            </>
                        ) : (
                            'N/A'
                        )}
                    </div>
                    <div style={{
                        fontSize: '1.2rem',
                        fontWeight: '800',
                        color: '#103c7f',
                        fontFamily: 'Cambria, serif'
                    }}>
                        {qty} Pcs
                    </div>
                </div>
            </div>

            {/* Location Details */}
            <div style={{
                padding: '12px 16px',
                backgroundColor: '#fff',
                borderBottom: '1px solid #e9ecef'
            }}>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                }}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                    }}>
                        <FaMapMarkerAlt style={{ color: '#103c7f' }} size={16} />
                        <span style={{
                            fontSize: '0.9rem',
                            fontWeight: '600',
                            color: '#103c7f',
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px',
                            fontFamily: 'Cambria, serif'
                        }}>
                            Location:
                        </span>
                    </div>
                    <div style={{
                        fontSize: '1rem',
                        fontWeight: '600',
                        color: '#103c7f',
                        fontFamily: 'Calibri, Arial, sans-serif'
                    }}>
                        {(() => {
                            const loc = relevantItems[0]?.location;
                            const displayLoc = loc === 'Others' ? defaultLocationName : (ALL_LOCATIONS_MAP[loc] || loc || "N/A");
                            const table = relevantItems[0]?.tableNo ? `(Table ${relevantItems[0]?.tableNo})` : "";
                            if (loc && loc.startsWith('Seat_')) {
                                const seatNum = loc.substring(5);
                                return (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <span style={{
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            backgroundColor: '#a1db40',
                                            color: '#103c7f',
                                            borderRadius: '50%',
                                            width: '28px',
                                            height: '28px',
                                            fontSize: '0.85rem',
                                            fontWeight: 'bold'
                                        }}>
                                            {seatNum}
                                        </span>
                                        <span>{displayLoc} {table}</span>
                                    </div>
                                );
                            }
                            return <span>{displayLoc} {table}</span>;
                        })()}
                    </div>
                </div>
            </div>

            {/* Order Items Preparation */}
            <div style={{
                padding: '16px',
                backgroundColor: '#fafafa'
            }}>
                <div style={{
                    fontSize: '1.1rem',
                    fontWeight: '700',
                    color: '#666666',
                    marginBottom: '12px',
                    paddingBottom: '6px',
                    borderBottom: '1px solid #e9ecef',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontFamily: 'Cambria, serif'
                }}>
                    <FaCoffee style={{ color: '#666666' }} />
                    Preparation Details
                </div>

                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px'
                }}>
                    {relevantItems.map((it, i) => (
                        <div key={i} style={{
                            backgroundColor: '#ffffff',
                            border: '1px solid #e9ecef',
                            borderRadius: '8px',
                            padding: '16px'
                        }}>
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                marginBottom: '8px'
                            }}>
                                <div style={{
                                    fontSize: '1.1rem',
                                    fontWeight: '700',
                                    color: '#103c7f',
                                    fontFamily: 'Cambria, serif'
                                }}>
                                    {it.quantity}x {it.type === it.item ? it.item : `${it.type} ${it.item}`}
                                </div>
                            </div>

                            <div style={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '6px'
                            }}>
                                {/* Sugar Level */}
                                {(it.item === 'coffee' || it.item === 'tea') && (
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                        fontSize: '0.95rem',
                                        color: '#103c7f',
                                        backgroundColor: '#f0f8e8',
                                        padding: '6px 10px',
                                        borderRadius: '6px',
                                        border: '1px solid #a1db40',
                                        fontFamily: 'Calibri, Arial, sans-serif'
                                    }}>
                                        <FaUtensilSpoon size={16} color="#a1db40" />
                                        <span style={{ fontWeight: '600', color: '#103c7f' }}>Sugar Level:</span>
                                        <span style={{ fontWeight: '700', color: '#103c7f' }}>{it.sugarLevel ?? 'N/A'} spoons</span>
                                    </div>
                                )}

                                {/* Notes */}
                                {it.notes && (
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'flex-start',
                                        gap: '8px',
                                        fontSize: '0.95rem',
                                        backgroundColor: '#f0f8e8',
                                        padding: '6px 10px',
                                        borderRadius: '6px',
                                        border: '1px solid #a1db40',
                                        fontFamily: 'Calibri, Arial, sans-serif'
                                    }}>
                                        <FaStickyNote size={16} color="#103c7f" />
                                        <div>
                                            <span style={{ fontWeight: '600', color: '#103c7f' }}>Special Notes:</span>
                                            <div style={{ 
                                                fontStyle: 'italic', 
                                                fontWeight: '500', 
                                                color: '#103c7f',
                                                marginTop: '2px'
                                            }}>
                                                "{it.notes}"
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Custom Location */}
                                {it.customLocation && (
                                    <div style={{
                                        backgroundColor: '#f0f8e8',
                                        padding: '6px 10px',
                                        borderRadius: '6px',
                                        border: '1px solid #a1db40',
                                        fontSize: '0.9rem',
                                        fontFamily: 'Calibri, Arial, sans-serif'
                                    }}>
                                        <span style={{ fontWeight: '600', color: '#103c7f' }}>Custom Location:</span>
                                        <span style={{ 
                                            fontWeight: '500', 
                                            color: '#103c7f',
                                            marginLeft: '8px'
                                        }}>
                                            {it.customLocation}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Status Action Buttons */}
            <div style={{
                padding: '16px',
                backgroundColor: '#ffffff',
                borderTop: '1px solid #e9ecef',
                display: 'flex',
                gap: '10px'
            }}>
                {nextStatus && nextStatus !== 'Delivered' && (
                    <button
                        style={{
                            flex: 1,
                            backgroundColor: '#103c7f',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            fontSize: '1rem',
                            fontWeight: '600',
                            cursor: 'pointer',
                            padding: '10px 16px',
                            height: '40px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px',
                            transition: 'all 0.3s ease',
                            boxShadow: '0 2px 4px rgba(16, 60, 127, 0.25)',
                            fontFamily: 'Calibri, Arial, sans-serif'
                        }}
                        onMouseOver={(e) => {
                            e.target.style.backgroundColor = '#0c3170';
                            e.target.style.transform = 'translateY(-2px)';
                            e.target.style.boxShadow = '0 4px 8px rgba(16, 60, 127, 0.35)';
                        }}
                        onMouseOut={(e) => {
                            e.target.style.backgroundColor = '#103c7f';
                            e.target.style.transform = 'translateY(0)';
                            e.target.style.boxShadow = '0 2px 4px rgba(16, 60, 127, 0.25)';
                        }}
                        onClick={(e) => {
                            e.stopPropagation();
                            updateOrderStatus(orderId, nextStatus);
                        }}
                    >
                        <FaUtensils size={18} />
                        {isMobile ? nextStatus : `Mark as ${nextStatus}`}
                    </button>
                )}

                <button
                    style={{
                        flex: 1,
                        backgroundColor: '#a1db40',
                        color: '#103c7f',
                        border: 'none',
                        borderRadius: '8px',
                        fontSize: '1rem',
                        fontWeight: '600',
                        cursor: 'pointer',
                        padding: '10px 16px',
                        height: '40px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        transition: 'all 0.3s ease',
                        boxShadow: '0 2px 4px rgba(161, 219, 64, 0.25)',
                        fontFamily: 'Calibri, Arial, sans-serif'
                    }}
                    onMouseOver={(e) => {
                        e.target.style.backgroundColor = '#8bc234';
                        e.target.style.transform = 'translateY(-2px)';
                        e.target.style.boxShadow = '0 4px 8px rgba(161, 219, 64, 0.35)';
                    }}
                    onMouseOut={(e) => {
                        e.target.style.backgroundColor = '#a1db40';
                        e.target.style.transform = 'translateY(0)';
                        e.target.style.boxShadow = '0 2px 4px rgba(161, 219, 64, 0.25)';
                    }}
                    onClick={(e) => {
                        e.stopPropagation();
                        updateOrderStatus(orderId, 'Delivered');
                    }}
                >
                    Mark as Delivered
                </button>
            </div>

            {/* Expand/Collapse Toggle */}
            <div
                onClick={() => setExpandedOrderId(isCardExpanded ? null : orderId)}
                style={{
                    padding: '12px 16px',
                    backgroundColor: '#f8f9fa',
                    borderTop: '1px solid #e9ecef',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    fontSize: '0.9rem',
                    fontWeight: '600',
                    color: '#666666'
                }}
                onMouseOver={(e) => {
                    e.target.style.backgroundColor = '#e9ecef';
                }}
                onMouseOut={(e) => {
                    e.target.style.backgroundColor = '#f8f9fa';
                }}
            >
                {isCardExpanded ? (
                    <>
                        <FaChevronUp size={14} />
                        Hide All Order Items ({order?.items?.length} Total)
                    </>
                ) : (
                    <>
                        <FaChevronDown size={14} />
                        View All Other Items ({order?.items?.length} Total)
                    </>
                )}
            </div>

            {/* Expanded Content */}
            {isCardExpanded && (
                <div style={{
                    backgroundColor: '#ffffff',
                    borderTop: '2px solid #dee2e6'
                }}>
                    <div style={{
                        padding: '16px',
                        backgroundColor: '#f8f9fa',
                        borderBottom: '1px solid #e9ecef'
                    }}>
                        <h5 style={{
                            margin: '0 0 0 0',
                            fontSize: '1.1rem',
                            fontWeight: '700',
                            color: '#666666',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            fontFamily: 'Cambria, serif'
                        }}>
                            <FaListUl style={{ color: '#666666' }} />
                            Other Items in Order
                        </h5>
                    </div>

                    <div style={{ padding: '16px' }}>
                        {/* Render Grouped Items */}
                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '12px'
                        }}>
                            {Object.values(groupedItems).map((group, idx) => {
                                // Skip the item group that is currently displayed in the main section for clarity
                                const isRelevantGroup = group.item === selectedItemTypeKey.split('_')[0] && group.type.toLowerCase() === selectedItemTypeKey.split('_')[1];
                                if (isRelevantGroup) return null;

                                return (
                                    <div
                                        key={`${orderId}-${idx}`}
                                        style={{
                                            backgroundColor: '#f8f9fa',
                                            border: '1px solid #dee2e6',
                                            borderRadius: '8px',
                                            padding: '16px'
                                        }}
                                    >
                                        <div style={{
                                            fontSize: '1rem',
                                            fontWeight: '700',
                                            color: '#495057',
                                            marginBottom: '12px',
                                            paddingBottom: '8px',
                                            borderBottom: '1px solid #dee2e6'
                                        }}>
                                            {group.totalQty}x {group.type || 'Standard'} {group.item}
                                        </div>
                                        <div style={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            gap: '4px'
                                        }}>
                                            {group.allItems.map((it, i) => (
                                                <div 
                                                    key={i} 
                                                    style={{
                                                        backgroundColor: '#f0f8e8',
                                                        padding: '6px 10px',
                                                        borderRadius: '6px',
                                                        border: '1px solid #a1db40',
                                                        fontSize: '0.9rem',
                                                        color: '#103c7f',
                                                        fontFamily: 'Calibri, Arial, sans-serif'
                                                    }}
                                                >
                                                    Sugar: {it.sugarLevel ?? 'N/A'} | Notes: {it.notes || 'None'}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OrderCard;