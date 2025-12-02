import React, { useState, useEffect, useRef } from "react";
import KitchenHeader from './KitchenHeader';
import SlotSelector from './SlotSelector';
import StatusSelector from './StatusSelector';
import OrderCard from './OrderCard';
import Notification from './Notification';
import { FaCheckCircle, FaChevronDown, FaChevronUp, FaMapMarkerAlt, FaClock, FaStickyNote, FaUtensilSpoon } from "react-icons/fa";

// 🔥 UPDATED PATH: Use the public folder path for the audio file
const NOTIFICATION_SOUND_URL = "/sound/beeep.mp3";
const audio = typeof Audio !== 'undefined' ? new Audio(NOTIFICATION_SOUND_URL) : null;
if (audio) {
    audio.volume = 1.0; // Set volume a bit lower
}

const KitchenDashboard = ({ user, callApi, setPage, styles, kitchenView, setKitchenView }) => {
    const [orders, setOrders] = useState([]);
    const [showNotification, setShowNotification] = useState(false);
    const [notificationAcknowledged, setNotificationAcknowledged] = useState(true);
    const lastOrderCount = useRef(0);
    const notificationTimeoutRef = useRef(null);
    const hasLoaded = useRef(false);

    const view = kitchenView;
    const setView = setKitchenView;
    const [selectedSlot, setSelectedSlot] = useState("morning");
    const [selectedItemTypeKey, setSelectedItemTypeKey] = useState(null);
    const [selectedStatus, setSelectedStatus] = useState(null);

    // Tracks the ID of the order card that is EXPANDED inline for ALL ITEMS.
    const [expandedOrderId, setExpandedOrderId] = useState(null);


    // Mobile detection
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

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
    // FETCH ORDERS SAFELY
    // --------------------------------------------------
    const fetchOrders = async (silent = false) => {
        try {
            const data = await callApi(
                `/orders?userId=${user.id}&userRole=${user.role}`,
                'GET',
                null,
                silent
            );

            const newOrders = Array.isArray(data) ? data : [];
            setOrders(newOrders);
            
            const newActiveOrderCount = newOrders.filter(o => String(o?.status || "").toLowerCase() === "placed").length;

            const previousCount = lastOrderCount.current;
            lastOrderCount.current = newActiveOrderCount;

            if (hasLoaded.current && newActiveOrderCount > previousCount) {
                setNotificationAcknowledged(false); // Reset acknowledgment for new orders

                // Show notification
                setShowNotification(true);

                // Play the beep sound
                if (audio) {
                    audio.currentTime = 0;
                    audio.play().catch(e => console.log("Audio playback blocked by browser:", e));
                }
            }

            hasLoaded.current = true;
            
        } catch (err) {
            console.error("Kitchen fetch error:", err);
            setOrders([]);
        }
    };

    useEffect(() => {
        fetchOrders();
        const interval = setInterval(() => fetchOrders(true), 10000);
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
            const isNew = order?.tags?.includes('New') && (Date.now() - order.timestamp < 2 * 60 * 1000);
            (order?.items || []).forEach((it) => {
                const itemKey = String(it?.item || "").toLowerCase();
                const typeName = it?.type || "normal";
                const typeKey = String(typeName).toLowerCase();
                const combinedKey = `${itemKey}_${typeKey}`;

                if (!totals[combinedKey]) {
                    totals[combinedKey] = {
                        key: combinedKey,
                        itemCategory: itemKey,
                        // Replacement for Line 113 (Conditional Naming)
                        name: (typeName && typeName !== itemKey) ? `${typeName.toUpperCase()} ${itemKey.toUpperCase()}` : itemKey.toUpperCase(),
                        totalQty: 0,
                        hasNew: false,
                    };
                }

                totals[combinedKey].totalQty += Number(it?.quantity || 0);
                if (isNew) {
                    totals[combinedKey].hasNew = true;
                }
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
    // MAIN UI
    // --------------------------------------------------
    return (
        <div style={{
            ...styles.kitchenAppContainer,
            padding: isMobile ? '15px 15px' : '20px 10px'
        }}>
            <KitchenHeader styles={styles} />

            {/* HOME (Slot selection and Totals) */}
            {view === "home" && (
                <SlotSelector
                    selectedSlot={selectedSlot}
                    setSelectedSlot={setSelectedSlot}
                    slotOrders={slotOrders}
                    setSelectedItemTypeKey={setSelectedItemTypeKey}
                    setView={setView}
                    setSelectedStatus={setSelectedStatus}
                    setExpandedOrderId={setExpandedOrderId}
                    computeTotalsForSlot={computeTotalsForSlot}
                    styles={styles}
                />
            )}

            {/* ITEM STATUS & INLINE ORDERS */}
            {view === "itemStatus" && selectedItemTypeKey && (
                <>
                    <div style={{ fontSize: isMobile ? 24 : 30, fontWeight: 700, marginBottom: isMobile ? 10 : 15 }}>
                        {Object.values(computeTotalsForSlot(selectedSlot)).find(t => t.key === selectedItemTypeKey)?.name.toUpperCase() || 'Item Type'} Statuses
                    </div>

                    <StatusSelector
                        selectedItemTypeKey={selectedItemTypeKey}
                        selectedStatus={selectedStatus}
                        setSelectedStatus={setSelectedStatus}
                        computeStatusCountsForItemType={computeStatusCountsForItemType}
                        selectedSlot={selectedSlot}
                        styles={styles}
                    />

                    {selectedStatus && (
                        <>
                            <div style={{ fontSize: isMobile ? 24 : 30, fontWeight: 700, marginTop: isMobile ? 20 : 30, marginBottom: isMobile ? 10 : 15 }}>
                                {selectedStatus} Orders for {Object.values(computeTotalsForSlot(selectedSlot)).find(t => t.key === selectedItemTypeKey)?.name.toUpperCase()}
                            </div>
                            {(() => {
                                const { ordersPerStatus } = computeStatusCountsForItemType(selectedSlot, selectedItemTypeKey);
                                const list = selectedStatus ? ordersPerStatus[selectedStatus] || [] : [];
                                return (
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: isMobile ? 10 : 20 }}>
                                        {list.map((order) => (
                                            <OrderCard
                                                key={order._id}
                                                order={order}
                                                selectedStatus={selectedStatus}
                                                selectedItemTypeKey={selectedItemTypeKey}
                                                expandedOrderId={expandedOrderId}
                                                setExpandedOrderId={setExpandedOrderId}
                                                updateOrderStatus={updateOrderStatus}
                                                styles={styles}
                                                enhancedStyles={enhancedStyles}
                                                user={user}
                                            />
                                        ))}
                                    </div>
                                );
                            })()}
                        </>
                    )}

                </>
            )}

            <Notification
                showNotification={showNotification}
                handleNotificationOk={handleNotificationOk}
                styles={styles}
            />
            
            
            {renderFooterCard()}

        </div>
    );
};

export default KitchenDashboard;