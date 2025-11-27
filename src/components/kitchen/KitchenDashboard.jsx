import React, { useState, useEffect, useRef } from "react";
import { FaSpinner, FaUsers, FaBell, FaCheckCircle, FaChevronDown, FaChevronUp, FaMapMarkerAlt, FaClock, FaStickyNote, FaUtensilSpoon } from "react-icons/fa";

// --------------------------------------------------
// 🔥 PASTE YOUR IMAGE URL HERE
// --------------------------------------------------
const defaultItemBg = "https://img.freepik.com/premium-photo/minimalist-kitchen-background-with-clean-simple-surface-perfect-food-preparation_1352261-950.jpg";

// 🔥 UPDATED PATH: Use the public folder path for the audio file
const NOTIFICATION_SOUND_URL = "/sound/beeep.mp3"; 
const audio = typeof Audio !== 'undefined' ? new Audio(NOTIFICATION_SOUND_URL) : null;
if (audio) {
    audio.volume = 1.0; // Set volume a bit lower
}

const KitchenDashboard = ({ user, callApi, setPage, styles }) => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showNotification, setShowNotification] = useState(false);
    const [notificationAcknowledged, setNotificationAcknowledged] = useState(true);
    const lastOrderCount = useRef(0);
    const notificationTimeoutRef = useRef(null);

    const [view, setView] = useState("home");
    const [selectedSlot, setSelectedSlot] = useState("morning");
    const [selectedItemTypeKey, setSelectedItemTypeKey] = useState(null);
    const [selectedStatus, setSelectedStatus] = useState(null);

    // Tracks the ID of the order card that is EXPANDED inline for ALL ITEMS.
    const [expandedOrderId, setExpandedOrderId] = useState(null);

    // Use same styles as user side with Calibri/Cambria fonts
    const enhancedStyles = {
        ...styles,
        appContainer: {
            ...styles.appContainer,
            fontFamily: 'Calibri, Arial, sans-serif',
        },
        headerText: {
            ...styles.headerText,
            fontFamily: 'Cambria, serif',
        },
        bannerTitle: {
            fontSize: '2rem',
            fontWeight: '900',
            color: '#ffffff',
            textShadow: '0 3px 8px rgba(0, 0, 0, 0.9)',
            lineHeight: '1.1',
            margin: '0',
            fontFamily: 'Cambria, serif',
        },
        // Order card styles matching OrderConfirmationPage
        simpleCard: {
            backgroundColor: '#ffffff',
            borderRadius: '15px',
            boxShadow: '0 4px 10px rgba(0, 0, 0, 0.15)',
            padding: '20px',
            margin: '0 0 0 0',
        },
        summaryRow: {
            display: 'flex',
            justifyContent: 'space-between',
            padding: '3px 0',
            alignItems: 'center',
        },
        summaryLabel: {
            fontSize: '1em',
            fontWeight: '500',
            color: '#333333',
            minWidth: '100px',
        },
        summaryValue: {
            fontSize: '1em',
            fontWeight: '700',
            color: '#333333',
            textAlign: 'right',
        },
        notesSection: {
            borderTop: '1px solid #dddddd',
            marginTop: '15px',
            paddingTop: '10px',
        },
    };

    const headerImageUrl = "https://cdn.decoist.com/wp-content/uploads/2021/06/Adding-greenery-to-the-small-farmhouse-kitchen-33093.jpg";

    // --------------------------------------------------
    // 🔥 DEFINE THIS SAFELY — SO NO ERRORS
    // --------------------------------------------------
    const itemImages = {
        coffee: defaultItemBg,
        tea: defaultItemBg,
        milk: defaultItemBg,
        water: defaultItemBg,
        shikanji: defaultItemBg,
        jaljeera: defaultItemBg,
        soup: defaultItemBg,
        maggie: defaultItemBg,
        oats: defaultItemBg,
    };

    // --------------------------------------------------
    // FETCH ORDERS SAFELY
    // --------------------------------------------------
    const fetchOrders = async () => {
        try {
            const data = await callApi(
                `/orders?userId=${user.id}&userRole=${user.role}`
            );

            const newOrders = Array.isArray(data) ? data : [];
            setOrders(newOrders);
            
            const newActiveOrderCount = newOrders.filter(o => String(o?.status || "").toLowerCase() === "placed").length;

            if (newActiveOrderCount > lastOrderCount.current) {
                setNotificationAcknowledged(false); // Reset acknowledgment for new orders

                // Show notification
                setShowNotification(true);

                // Play the beep sound
                if (audio) {
                    audio.currentTime = 0;
                    audio.play().catch(e => console.log("Audio playback blocked by browser:", e));
                }
            }
            
            lastOrderCount.current = newActiveOrderCount;
            
        } catch (err) {
            console.error("Kitchen fetch error:", err);
            setOrders([]);
        }
        if (loading) setLoading(false);
    };

    useEffect(() => {
        fetchOrders();
        const interval = setInterval(fetchOrders, 10000);
        return () => {
            clearInterval(interval);
            if (notificationTimeoutRef.current) {
                clearTimeout(notificationTimeoutRef.current);
            }
        };
    }, []);

    // --------------------------------------------------
    // HELPERS (Unchanged logic)
    // --------------------------------------------------
    const orderSlotIs = (order, slotName) => {
        if (!order?.slot || !slotName) return false;
        return String(order.slot).toLowerCase().includes(slotName);
    };

    const activeOrders = (orders || []).filter(
        (o) => String(o?.status || "").toLowerCase() !== "delivered"
    );

    const slotOrders = (slot) => activeOrders.filter((o) => orderSlotIs(o, slot));

    const computeTotalsForSlot = (slot) => {
        const totals = {};
        const arr = slotOrders(slot);

        arr.forEach((order) => {
            (order?.items || []).forEach((it) => {
                const itemKey = String(it?.item || "").toLowerCase();
                const typeName = it?.type || "Standard"; 
                const typeKey = String(typeName).toLowerCase();
                const combinedKey = `${itemKey}_${typeKey}`;

                if (!totals[combinedKey]) {
                    totals[combinedKey] = {
                        key: combinedKey,
                        itemCategory: itemKey, 
                        // Replacement for Line 113 (Conditional Naming)
                        name: `${typeName.toUpperCase()} ${itemKey.toUpperCase()}`,
                        totalQty: 0,
                    };
                }

                totals[combinedKey].totalQty += Number(it?.quantity || 0);
            });
        });
        return totals;
    };

    const computeStatusCountsForItemType = (slot, combinedKey) => {
        const arr = slotOrders(slot);
        const counts = { Placed: 0, Making: 0, Ready: 0 };
        const ordersPerStatus = { Placed: [], Making: [], Ready: [] };
        
        const [itemKey, typeKey] = combinedKey.split('_');


        arr.forEach((order) => {
            const hasItemType = (order?.items || []).some(
                (it) => {
                    const itemMatch = String(it?.item || "").toLowerCase() === itemKey;
                    const typeMatch = String(it?.type || "Standard").toLowerCase() === typeKey;
                    return itemMatch && typeMatch;
                }
            );
            
            if (!hasItemType) return;

            const st = order?.status;
            if (counts[st] !== undefined) {
                counts[st]++;
                if (!ordersPerStatus[st].includes(order)) {
                    ordersPerStatus[st].push(order);
                }
            }
        });

        return { counts, ordersPerStatus };
    };

    const updateOrderStatus = async (id, newStatus) => {
        await callApi(`/orders/${id}/status`, "PUT", {
            status: newStatus,
            userId: user.id,
            userRole: user.role,
        });
        fetchOrders();
        setExpandedOrderId(null);
    };
    
    const handleNotificationOk = () => {
        setShowNotification(false);
        setNotificationAcknowledged(true); // Mark as acknowledged
        if (notificationTimeoutRef.current) {
            clearTimeout(notificationTimeoutRef.current);
            notificationTimeoutRef.current = null;
        }
        if (audio) {
            audio.pause();
            audio.currentTime = 0;
        }
    };
    
    // Group items inside a single order by type+item 
    const groupOrderItems = (order) => {
        const groups = {};
        (order.items || []).forEach((item) => {
            const key = `${item.type || ''}-${item.item || ''}`;
            if (!groups[key]) {
                groups[key] = { type: item.type, item: item.item, totalQty: 0, allItems: [] };
            }
            groups[key].totalQty += (item.quantity || 0);
            groups[key].allItems.push(item);
        });
        return Object.values(groups);
    };

    // --------------------------------------------------
    // RENDER BLOCKS (Only renderOrdersForStatus changed significantly)
    // --------------------------------------------------
    const renderNotification = () => {
        if (!showNotification) return null;
        return (
            <>
                <div style={styles.kitchenOverlay} /> 
                <div style={styles.kitchenNotification}>
                    <FaBell size={48} style={{ marginBottom: 15 }} />
                    <div style={{ fontSize: 40, fontWeight: 900, marginBottom: 25 }}>
                        ORDER RECEIVED
                    </div>
                    <button 
                        onClick={handleNotificationOk}
                        style={{ 
                            ...styles.primaryButton,
                            width: '250px', 
                            padding: '15px', 
                            fontSize: '1.5em',
                            backgroundColor: 'white',
                            color: styles.SUCCESS_COLOR,
                            border: `2px solid ${styles.SUCCESS_COLOR}`
                        }}
                    >
                        OK, GOT IT
                    </button>
                </div>
            </>
        );
    };
    
    const renderSlotButtons = () => (
        <div style={{ display: "flex", gap: 12, marginBottom: 18 }}>
            {["morning", "afternoon"].map((slot) => {
                const total = slotOrders(slot).reduce(
                    (sum, o) =>
                        sum +
                        (o?.items?.reduce(
                            (q, it) => q + Number(it?.quantity || 0),
                            0
                        ) || 0),
                    0
                );

                return (
                    <button
                        key={slot}
                        onClick={() => {
                            setSelectedSlot(slot);
                        }}
                        style={{
                            flex: 1,
                            padding: 24,
                            borderRadius: 12,
                            border: "none",
                            backgroundColor:
                                selectedSlot === slot ? "#103c7f" : "#f0f0f0",
                            color: selectedSlot === slot ? "#fff" : "#333",
                            fontSize: 24,
                            fontWeight: 700,
                            cursor: "pointer",
                            minWidth: '150px'
                        }}
                    >
                        {slot.toUpperCase()}
                        <div style={{ fontSize: 18, marginTop: 5 }}>{total} items</div>
                    </button>
                );
            })}
        </div>
    );

    const renderSlotTotals = () => {
        if (!selectedSlot) return null; 
        
        const totals = Object.values(computeTotalsForSlot(selectedSlot));

        if (!totals.length)
            return <div style={{ padding: 24, color: "#666", fontSize: 24 }}>No items for this slot.</div>;

        return (
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                    gap: 20, 
                }}
            >
                {totals.map((t) => (
                    <div
                        key={t.key}
                        onClick={() => {
                            setSelectedItemTypeKey(t.key);
                            setView("itemStatus"); 
                            setSelectedStatus("Placed"); 
                            setExpandedOrderId(null); 
                        }}
                        style={{
                            padding: 30, 
                            minHeight: 180, 
                            borderRadius: 14,
                            backgroundImage: `linear-gradient(
                                rgba(0,0,0,0.55), 
                                rgba(0,0,0,0.55)
                            ), url('${itemImages[t.itemCategory]}')`, 
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                            color: "#fff",
                            boxShadow: "0 6px 15px rgba(0,0,0,0.3)",
                            cursor: "pointer",
                        }}
                    >
                        <div style={{ fontSize: 48, fontWeight: 800 }}>
                            {t.totalQty}
                        </div>
                        <div style={{ fontSize: 24, fontWeight: 700, marginTop: 10 }}>
                            {t.name.toUpperCase()}
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    const renderItemStatus = () => {
        if (!selectedItemTypeKey) return null;
        
        const { counts } = computeStatusCountsForItemType(selectedSlot, selectedItemTypeKey);

        return (
            <div style={{ display: "flex", gap: 20, flexWrap: 'wrap' }}>
                {["Placed", "Making", "Ready"].map((st) => (
                    <div
                        key={st}
                        onClick={() => {
                            setSelectedStatus(st);
                            setExpandedOrderId(null);
                        }}
                        style={{
                            flex: 1,
                            minWidth: '100px', 
                            padding: 20, 
                            background: "#fff",
                            borderRadius: 15,
                            textAlign: "center",
                            boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
                            cursor: "pointer",
                            border: selectedStatus === st ? `4px solid ${styles.PRIMARY_COLOR}` : 'none'
                        }}
                    >
                        <div style={{ fontSize: 48, fontWeight: 800, color: st === 'Ready' ? styles.SUCCESS_COLOR : (st === 'Making' ? styles.PRIMARY_COLOR : styles.SECONDARY_COLOR) }}>
                            {counts[st]}
                        </div>
                        <div style={{ fontSize: 20, fontWeight: 700 }}>{st}</div>
                    </div>
                ))}
            </div>
        );
    };

    /**
     * 🔥 REFACTORED: Compact, structured, and focused card rendering.
     */
    const renderOrdersForStatus = () => {
        if (!selectedItemTypeKey) return null;
        
        const { ordersPerStatus } = computeStatusCountsForItemType(
            selectedSlot,
            selectedItemTypeKey
        );
        
        const [itemKey, typeKey] = selectedItemTypeKey.split('_');

        const list = selectedStatus ? ordersPerStatus[selectedStatus] || [] : [];
        const combinedName = `${typeKey} ${itemKey}`.toUpperCase();

        if (!list.length)
            return <div style={{ padding: 24, fontSize: 24, color: '#666' }}>No orders currently in the **{selectedStatus}** status for {combinedName}.</div>;

        return (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: 20 }}>
                {list.map((order) => {
                    const orderId = order?._id;
                    const isCardExpanded = expandedOrderId === orderId;

                    // Items relevant to the current selected item/type combo
                    const relevantItems = (order?.items || []).filter(
                        (it) => {
                            const itemMatch = String(it?.item || "").toLowerCase() === itemKey;
                            const typeMatch = String(it?.type || "Standard").toLowerCase() === typeKey;
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
                    
                    const groupedItems = groupOrderItems(order);

                    // --- Custom Styles for Readability ---
                    const infoRowStyle = {
                        display: 'flex',
                        alignItems: 'center',
                        fontSize: 14,
                        color: '#666',
                        marginBottom: 6,
                    };
                    const detailLabelStyle = {
                        fontWeight: 600,
                        color: '#333',
                        marginLeft: 8,
                    };
                    const itemDetailRowStyle = {
                        display: 'flex',
                        alignItems: 'flex-start',
                        padding: '8px 10px',
                        marginBottom: 5,
                        borderRadius: 4,
                        backgroundColor: '#fff',
                        border: '1px solid #eee'
                    };
                    const prepDetailStyle = {
                        fontSize: 14,
                        marginTop: 4,
                        color: '#444',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                    };
                    // ------------------------------------

                    return (
                        <div
                            key={orderId}
                            style={{
                                background: '#fff',
                                padding: 15, // Reduced Padding
                                borderRadius: 10, // Smaller border radius
                                boxShadow: "0 5px 15px rgba(0,0,0,0.1)", // Softer shadow
                                borderLeft: `6px solid ${selectedStatus === 'Placed' ? styles.SECONDARY_COLOR : (selectedStatus === 'Making' ? styles.PRIMARY_COLOR : styles.SUCCESS_COLOR)}`,
                                transition: 'all 0.3s ease'
                            }}
                        >
                            {/* Card Header (Customer & Qty) */}
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: 'baseline',
                                    marginBottom: 15,
                                    paddingBottom: 10,
                                    borderBottom: '1px solid #eee'
                                }}
                            >
                                <div style={{ fontWeight: 800, fontSize: 18 }}>
                                    {order?.userName || "Customer"}
                                </div>
                                <div style={{ fontWeight: 700, fontSize: 24, color: styles.PRIMARY_COLOR }}>
                                    {qty} Pcs
                                </div>
                            </div>

                            {/* Key Details (Time & Location) - Summary Format */}
                            <div style={{ marginBottom: 15 }}>
                                <div style={enhancedStyles.summaryRow}>
                                    <span style={enhancedStyles.summaryLabel}>Time:</span>
                                    <span style={enhancedStyles.summaryValue}>
                                        {order.timestamp ? new Date(order.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'N/A'}
                                    </span>
                                </div>
                                <div style={enhancedStyles.summaryRow}>
                                    <span style={enhancedStyles.summaryLabel}>Location:</span>
                                    <span style={enhancedStyles.summaryValue}>
                                        {relevantItems[0]?.location || "N/A"} {relevantItems[0]?.tableNo ? `(Table ${relevantItems[0]?.tableNo})` : ""}
                                    </span>
                                </div>
                            </div>

                            {/* Relevant Item Details (Always Visible) - Simplified structure */}
                            <div style={{ background: '#f7f7f7', padding: 10, borderRadius: 6, marginBottom: 15 }}>
                                <div style={{ fontWeight: 700, fontSize: 16, color: styles.SECONDARY_COLOR, marginBottom: 5 }}>
                                    Preparation: {relevantItems[0]?.type === relevantItems[0]?.item ? relevantItems[0]?.item : `${relevantItems[0]?.type} ${relevantItems[0]?.item}`}
                                </div>
                                
                                {relevantItems.map((it, i) => (
                                    <div key={i} style={itemDetailRowStyle}>
                                        <div style={{ flex: 1 }}>
                                            <div style={{ fontWeight: 800, fontSize: 15, color: styles.PRIMARY_COLOR, marginBottom: 4 }}>
                                                {it.quantity} {it.type}
                                            </div>
                                            
                                            {/* Sugar Level */}
                                            {(it.item === 'coffee' || it.item === 'tea') && (
                                                <div style={prepDetailStyle}>
                                                    <FaUtensilSpoon size={14} color="#888" />
                                                    Sugar: <span style={{ fontWeight: 700 }}>{it.sugarLevel ?? 'N/A'} Spoons</span>
                                                </div>
                                            )}
                                            
                                            {/* Notes */}
                                            {it.notes && (
                                                <div style={prepDetailStyle}>
                                                    <FaStickyNote size={14} color="darkred" />
                                                    <span style={{ fontStyle: 'italic', fontWeight: 600, color: 'darkred' }}>{it.notes}</span>
                                                </div>
                                            )}
                                            
                                            {/* Custom Location (if any) - Kept it separate as it's a specific instruction */}
                                            {it.customLocation && (
                                                <div style={{ fontSize: 13, color: 'darkblue', marginTop: 5 }}>
                                                    **Custom Location:** {it.customLocation}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                            {/* END: Relevant Item Details */}

                            {/* Status Buttons - Equal Width */}
                            <div style={{ marginBottom: 10, display: 'flex', gap: 10 }}>
                                {nextStatus && nextStatus !== 'Delivered' && (
                                    <button
                                        style={{
                                            flex: 1,
                                            backgroundColor: '#103c7f', // Dark Blue
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '8px',
                                            fontSize: '1rem',
                                            fontWeight: '600',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: '8px',
                                            height: '48px',
                                            fontFamily: 'Calibri, Arial, sans-serif',
                                            padding: '12px 15px'
                                        }}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            updateOrderStatus(orderId, nextStatus);
                                        }}
                                    >
                                        <FaCheckCircle size={14} /> Mark as {nextStatus}
                                    </button>
                                )}

                                <button
                                    style={{
                                        flex: 1,
                                        backgroundColor: '#a1db40', // Green
                                        color: '#333333',
                                        border: 'none',
                                        borderRadius: '8px',
                                        fontSize: '1rem',
                                        fontWeight: '600',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        height: '48px',
                                        fontFamily: 'Calibri, Arial, sans-serif',
                                        padding: '12px 15px'
                                    }}
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
                                style={{ 
                                    borderTop: '1px dashed #eee', // Dashed border for visual separation
                                    paddingTop: 10, 
                                    cursor: 'pointer',
                                    fontWeight: 600,
                                    fontSize: 14, // Smaller font size
                                    color: '#666',
                                    textAlign: 'center'
                                }}
                            >
                                {isCardExpanded ? (
                                    <span><FaChevronUp size={12} /> Hide All Order Items ({order?.items?.length} Total)</span>
                                ) : (
                                    <span><FaChevronDown size={12} /> View All Other Items ({order?.items?.length} Total)</span>
                                )}
                            </div>


                            {isCardExpanded && (
                                <div style={{ marginTop: 10, padding: 10, border: '1px solid #f0f0f0', borderRadius: 4, background: '#fafafa' }}>
                                    <h5 style={{ margin: '0 0 10px 0', borderBottom: '1px dotted #ccc', paddingBottom: 5 }}>
                                        Other Items in Order
                                    </h5>

                                    {/* Render Grouped Items */}
                                    {groupedItems.map((group, idx) => {
                                        // Skip the item group that is currently displayed in the main section for clarity
                                        const isRelevantGroup = group.item === itemKey && group.type.toLowerCase() === typeKey;
                                        if (isRelevantGroup) return null; 

                                        return (
                                            <div
                                                key={`${orderId}-${idx}`}
                                                style={{
                                                    padding: 8,
                                                    borderRadius: 4,
                                                    marginBottom: 8,
                                                    backgroundColor: '#fff',
                                                    borderLeft: `4px solid #aaa`,
                                                }}
                                            >
                                                <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 5 }}>
                                                    {group.totalQty}x {group.type || 'Standard'} {group.item}
                                                </div>
                                                {group.allItems.map((it, i) => (
                                                    <div key={i} style={{ fontSize: 13, padding: '2px 0', borderTop: i > 0 ? '1px dotted #eee' : 'none', color: '#555' }}>
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
                })}
            </div>
        );
    };

    const renderFooterCard = () => (
        <div
            style={{
                marginTop: 40,
                marginBottom: 20,
                padding: "40px 20px",
                background: "#f8f8f8",
                borderRadius: 15,
                textAlign: "center",
                boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
                border: "1px solid #eee",
            }}
        >
            <div style={{ fontSize: 32, fontWeight: 700, fontFamily: 'serif' }}>
                Make Today Great
            </div>
            <div style={{ fontSize: 16, marginTop: 5, color: "#666" }}>
                -Crafted with ❤️ in Maven Jobs, Panipat
            </div>
        </div>
    );

    // --------------------------------------------------
    // MAIN UI (Unchanged)
    // --------------------------------------------------
    if (loading)
        return (
            <div style={styles.loadingContainer}>
                <FaSpinner className="spinner" size={48} /> Loading Kitchen…
            </div>
        );

    return (
        <div style={{ 
            ...styles.kitchenAppContainer, 
            padding: '20px 10px' 
        }}>
            {/* HEADER */}
            <div
                style={{
                    width: "100%", 
                    height: 200, 
                    borderRadius: 15,
                    backgroundImage: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url('${headerImageUrl}')`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    marginBottom: 20,
                    padding: '30px 20px', 
                    color: "#fff",
                    display: 'flex', 
                    flexDirection: 'column', 
                    justifyContent: 'flex-end',
                    boxShadow: '0 5px 15px rgba(0,0,0,0.2)'
                }}
            >
               <div style={{ fontSize: 48, fontWeight: 900, width: '100%', textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}>
                    KITCHEN DASHBOARD
                </div>
                <div style={{ fontSize: 24, fontWeight: 500, marginTop: 5, width: '100%', textShadow: '1px 1px 2px rgba(0,0,0,0.5)' }}>
                    Manage & track active orders
                </div>
            </div>

            {/* HOME (Slot selection and Totals) */}
            {view === "home" && (
                <>
                    <div style={{ fontSize: 30, fontWeight: 700, marginBottom: 15 }}>
                        Select Slot
                    </div>
                    {renderSlotButtons()}
                    
                    {selectedSlot && (
                        <>
                            <div style={{ fontSize: 30, fontWeight: 700, marginTop: 30, marginBottom: 15 }}>
                                {selectedSlot.toUpperCase()} 
                                
                            </div>
                            {renderSlotTotals()}
                        </>
                    )}
                </>
            )}

            {/* ITEM STATUS & INLINE ORDERS */}
            {view === "itemStatus" && selectedItemTypeKey && (
                <>
                    <button
                        style={{ ...styles.secondaryButton, width: '150px', padding: '10px 0', fontSize: '1.2em' }}
                        onClick={() => {
                            setView("home");
                            setSelectedItemTypeKey(null);
                            setSelectedStatus(null);
                            setExpandedOrderId(null);
                        }} 
                    >
                        ← Back to Totals
                    </button>
                    <div style={{ fontSize: 30, fontWeight: 700, marginBottom: 15 }}>
                        {Object.values(computeTotalsForSlot(selectedSlot)).find(t => t.key === selectedItemTypeKey)?.name.toUpperCase() || 'Item Type'} Statuses
                    </div>

                    {renderItemStatus()}
                    
                    {selectedStatus && (
                        <>
                            <div style={{ fontSize: 30, fontWeight: 700, marginTop: 30, marginBottom: 15 }}>
                                {selectedStatus} Orders for {Object.values(computeTotalsForSlot(selectedSlot)).find(t => t.key === selectedItemTypeKey)?.name.toUpperCase()}
                            </div>
                            {renderOrdersForStatus()}
                        </>
                    )}

                </>
            )}

            {renderNotification()}
            
            
            {renderFooterCard()}

        </div>
    );
};

export default KitchenDashboard;