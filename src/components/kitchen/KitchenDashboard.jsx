import React, { useState, useEffect, useRef } from "react";
import SlotSelector from './SlotSelector';
import StatusSelector from './StatusSelector';
import OrderCard from './OrderCard';
import Notification from './Notification';
import ChefCallNotification from './ChefCallNotification';
import { initSocket, getSocket } from '../../api/socketService';
import { FaCheckCircle, FaChevronDown, FaChevronUp, FaMapMarkerAlt, FaClock, FaStickyNote, FaUtensilSpoon } from "react-icons/fa";

const KitchenDashboard = ({ user, callApi, setPage, styles, kitchenView, setKitchenView }) => {
    const [orders, setOrders] = useState([]);
    const [showNotification, setShowNotification] = useState(false);
    const [notificationAcknowledged, setNotificationAcknowledged] = useState(true);
    const [chefCall, setChefCall] = useState(null);
    const [notificationOrderData, setNotificationOrderData] = useState(null);
    const lastOrderCount = useRef(0);
    const notificationTimeoutRef = useRef(null);
    const hasLoaded = useRef(false);
    const socketRef = useRef(null);

    const view = kitchenView;
    const setView = setKitchenView;
    const [selectedSlot, setSelectedSlot] = useState("morning");
    const [selectedItemTypeKey, setSelectedItemTypeKey] = useState(null);
    const [selectedStatus, setSelectedStatus] = useState(null);

    // Tracks the ID of the order card that is EXPANDED inline for ALL ITEMS.
    const [expandedOrderId, setExpandedOrderId] = useState(null);

    // Profile image refresh trigger for instant updates
    const [profileImageRefreshKey, setProfileImageRefreshKey] = useState(0);
    
    // Function to trigger profile image refresh across all OrderCard components
    const triggerProfileImageRefresh = () => {
        console.log('KitchenDashboard: Triggering profile image refresh across all components');
        setProfileImageRefreshKey(prev => prev + 1);
        
        // Also broadcast to other kitchen tabs/windows
        try {
            localStorage.setItem('kitchenProfileRefresh', Date.now().toString());
            // Remove the key immediately to avoid cluttering localStorage
            setTimeout(() => {
                localStorage.removeItem('kitchenProfileRefresh');
            }, 100);
        } catch (error) {
            console.warn('KitchenDashboard: Could not broadcast profile refresh:', error);
        }
    };

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

    // Dynamic header image based on selected item type
    const getHeaderImageUrl = () => {
        if (view === "itemStatus" && selectedItemTypeKey) {
            const itemImages = {
                'coffee': "https://i.pinimg.com/474x/7a/29/df/7a29dfc903d98c6ba13b687ef1fa1d1a.jpg",
                'coldcoffee': "https://images.unsplash.com/photo-1517705008128-361805f42e86?w=400&h=300&fit=crop",
                'tea': "https://tmdone-cdn.s3.me-south-1.amazonaws.com/store-covers/133003776906429295.jpg",
                'water': "https://images.stockcake.com/public/d/f/f/dffca756-1b7f-4366-8b89-4ad6f9bbf88a_large/chilled-water-glass-stockcake.jpg",
                'saltwater': "https://images.unsplash.com/photo-1548839140-29a3df4b0d0a?w=400&h=300&fit=crop",
                'milk': "https://www.shutterstock.com/image-photo/almond-milk-cup-glass-on-600nw-2571172141.jpg",
                'shikanji': "https://i.pinimg.com/736x/1f/fd/08/1ffd086ffef72a98f234162a312cfe39.jpg",
                'jaljeera': "https://i.ndtvimg.com/i/2018-02/jaljeera_620x330_81517570928.jpg",
                'soup': "https://www.inspiredtaste.net/wp-content/uploads/2018/10/Homemade-Vegetable-Soup-Recipe-2-1200.jpg",
                'maggie': "https://i.pinimg.com/736x/5c/6d/9f/5c6d9fe78de73a7698948e011d6745f1.jpg",
                'oats': "https://images.moneycontrol.com/static-mcnews/2024/08/20240827041559_oats.jpg?impolicy=website&width=1600&height=900",
            };
            
            const itemKey = selectedItemTypeKey.split('_')[0];
            return itemImages[itemKey] || itemImages['coffee'];
        }
        
        // Default kitchen image
        return "https://cdn.decoist.com/wp-content/uploads/2021/06/Adding-greenery-to-the-small-farmhouse-kitchen-33093.jpg";
    };


    // --------------------------------------------------
    // ENSURE KITCHEN FCM TOKEN IS REGISTERED
    // --------------------------------------------------
    const registerKitchenFCMToken = async () => {
        try {
            // Request notification permission and get token
            if ('Notification' in window && 'serviceWorker' in navigator) {
                const permission = await window.Notification.requestPermission();
                if (permission === 'granted') {
                    // Import Firebase functions dynamically
                    const { requestNotificationPermissionAndGetToken } = await import('../../firebase');
                    const token = await requestNotificationPermissionAndGetToken();
                    
                    if (token) {
                        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
                        // Remove trailing /api if present to avoid double /api/api/ issue
                        const cleanApiUrl = apiUrl.replace(/\/api\/?$/, '');
                        const response = await fetch(`${cleanApiUrl}/api/save-fcm-token`, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ 
                                token, 
                                userId: user.id, 
                                userRole: user.role 
                            })
                        });
                        
                        if (response.ok) {
                            console.log('✅ Kitchen FCM token registered successfully');
                        } else {
                            console.error('❌ Failed to register kitchen FCM token:', response.status);
                        }
                    }
                }
            }
        } catch (error) {
            console.error('❌ Kitchen FCM registration error:', error);
        }
    };

    // Register FCM token when component mounts
    useEffect(() => {
        if (user?.role === 'kitchen') {
            registerKitchenFCMToken();
        }
    }, [user]);

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
            // Cache orders for offline
            localStorage.setItem('cachedOrders', JSON.stringify(newOrders));

            const newActiveOrderCount = newOrders.filter(o => String(o?.status || "").toLowerCase() === "placed").length;

            const previousCount = lastOrderCount.current;
            lastOrderCount.current = newActiveOrderCount;

            console.log('🔍 Order count check:', {
                newActiveOrderCount,
                previousCount,
                hasLoaded: hasLoaded.current,
                shouldTriggerNotification: hasLoaded.current && newActiveOrderCount > previousCount,
                chefCallActive: !!chefCall,
                socketConnected: socketRef.current?.connected
            });

            if (hasLoaded.current && newActiveOrderCount > previousCount) {
                console.log(`🔔 New orders arrived: ${newActiveOrderCount - previousCount} (Total: ${newActiveOrderCount}) - Chef call active: ${!!chefCall}`);
                setNotificationAcknowledged(false); // Reset acknowledgment for new orders

                // COMPLETELY suppress order notifications when chef call is active
                // Chef calls have exclusive priority - no order notifications allowed
                if (!chefCall) {
                    console.log('✅ New order notification - TRIGGERING NOW!');
                    
                    // Find the MOST RECENT placed order (highest timestamp)
                    const placedOrders = newOrders.filter(o => String(o?.status || "").toLowerCase() === "placed");
                    const latestOrder = placedOrders.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))[0];
                    
                    if (latestOrder) {
                        console.log('📋 Using latest order for notification:', latestOrder);
                        setNotificationOrderData({
                            userName: latestOrder.userName || 'Customer',
                            items: latestOrder.items || [],
                            orderId: latestOrder._id,
                            timestamp: latestOrder.timestamp
                        });
                        setShowNotification(true);
                    }
                } else {
                    console.log('🚫 Suppressing order notification - chef call is active');
                }
                // When chef call is active: completely ignore order notifications
                // Chef call takes full priority
            }

            hasLoaded.current = true;

        } catch (err) {
            console.error("Kitchen fetch error:", err);
            // Load from cache if available
            const cachedOrders = localStorage.getItem('cachedOrders');
            if (cachedOrders) {
                const parsedOrders = JSON.parse(cachedOrders);
                setOrders(parsedOrders);
                // Check for notifications from cached data
                const newActiveOrderCount = parsedOrders.filter(o => String(o?.status || "").toLowerCase() === "placed").length;
                const previousCount = lastOrderCount.current;
                lastOrderCount.current = newActiveOrderCount;

                if (hasLoaded.current && newActiveOrderCount > previousCount) {
                    setNotificationAcknowledged(false);
                    
                    // COMPLETELY suppress order notifications when chef call is active
                    // Chef calls have exclusive priority - no order notifications allowed
                    if (!chefCall) {
                        console.log('✅ New order notification from cached data - TRIGGERING NOW!');
                        
                        // Find the MOST RECENT placed order from cached data (highest timestamp)
                        const placedOrders = parsedOrders.filter(o => String(o?.status || "").toLowerCase() === "placed");
                        const latestOrder = placedOrders.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))[0];
                        
                        if (latestOrder) {
                            console.log('📋 Using latest cached order for notification:', latestOrder);
                            setNotificationOrderData({
                                userName: latestOrder.userName || 'Customer',
                                items: latestOrder.items || [],
                                orderId: latestOrder._id,
                                timestamp: latestOrder.timestamp
                            });
                            setShowNotification(true);
                        }
                    } else {
                        console.log('🚫 Suppressing order notification - chef call is active');
                    }
                    // When chef call is active: completely ignore order notifications
                    // Chef call takes full priority
                }
            } else {
                setOrders([]);
            }
        }
    };

    useEffect(() => {
        fetchOrders();
        
        // Setup Socket.IO for real-time order updates
        const setupOrderSocket = async () => {
            try {
                const socket = await initSocket(user);
                socketRef.current = socket;
                if (socket) {
                    console.log('🔌 Kitchen socket initialized, setting up event listeners...');
                    
                    // Listen for new orders via socket - INSTANT
                    socket.on('new-order', (order) => {
                        console.log('📦 📦 📦 NEW ORDER RECEIVED VIA SOCKET:', order);
                        console.log('👨‍🍳 Kitchen should show notification now!');
                        console.log('🔍 Socket notification state:', {
                            chefCallActive: !!chefCall,
                            shouldShowNotification: !chefCall
                        });
                        
                        // Show notification immediately when new order arrives via socket
                        if (!chefCall) {
                            console.log('🚀 Showing notification immediately via socket!');
                            setNotificationAcknowledged(false);
                            
                            // Use the actual new order data for the notification
                            setNotificationOrderData({
                                userName: order.userName || 'Customer',
                                items: order.items || [],
                                orderId: order._id,
                                timestamp: order.timestamp
                            });
                            setShowNotification(true);
                        } else {
                            console.log('🚫 Suppressing order notification - chef call is active');
                        }
                        
                        fetchOrders(); // Refresh orders list
                    });
                    
                    // Listen for order status updates
                    socket.on('order-updated', (order) => {
                        console.log('📝 Order updated via socket:', order);
                        fetchOrders(); // Refresh orders list
                    });
                    
                    // Listen for order deletions
                    socket.on('order-deleted', (orderData) => {
                        console.log('🗑️ Order deleted via socket:', orderData.orderId);
                        // Remove the deleted order from local state immediately for instant feedback
                        setOrders(prevOrders => prevOrders.filter(order => order._id !== orderData.orderId));
                        console.log('✅ Order removed from kitchen dashboard:', orderData.orderId);
                        // Also refresh from server to ensure consistency
                        fetchOrders(); 
                    });

                    // Listen for chef calls via socket - INSTANT notification
                    socket.on('chef-call', (call) => {
                        console.log('📞 Chef call received via socket:', call);
                        console.log('🔍 Socket connection status:', socket.connected);
                        console.log('👨‍🍳 Kitchen user info:', { id: user.id, role: user.role });
                        setChefCall(call);
                    });

                    // Listen for profile image updates via socket - INSTANT updates
                    socket.on('profile-image-updated', (updateData) => {
                        console.log('🖼️ Profile image updated via socket:', updateData);
                        console.log('🔍 Update details:', {
                            userId: updateData.userId,
                            userName: updateData.userName,
                            action: updateData.action,
                            hasImage: !!updateData.profileImage
                        });
                        
                        // Trigger immediate profile image refresh
                        triggerProfileImageRefresh();
                    });

                    // Log successful connection
                    socket.on('connect', () => {
                        console.log('✅ Kitchen socket connected successfully');
                        console.log('🔌 Socket ID:', socket.id);
                        console.log('🏠 Joined rooms:', socket.rooms ? Array.from(socket.rooms) : 'No rooms joined');
                    });

                    // Log disconnection
                    socket.on('disconnect', (reason) => {
                        console.log('⚠️ Kitchen socket disconnected:', reason);
                    });

                    // Handle connection errors
                    socket.on('connect_error', (error) => {
                        console.error('❌ Kitchen socket connection error:', error.message);
                    });
                } else {
                    console.error('❌ Kitchen socket initialization failed');
                }
            } catch (error) {
                console.error('❌ Failed to setup kitchen socket:', error);
            }
        };
        setupOrderSocket();
        
        // Emergency backup polling - 60 seconds (only if socket fails)
        const interval = setInterval(() => {
            if (!socketRef.current?.connected) {
                console.log('⚠️ Socket not connected, using backup polling');
                fetchOrders(true);
            }
        }, 60000);
        
        // Fetch when window becomes visible
        const handleVisibilityChange = () => {
            if (!document.hidden) {
                fetchOrders();
            }
        };
        
        document.addEventListener('visibilitychange', handleVisibilityChange);
        
        // Enhanced profile image sync listeners - more aggressive updates
        const handleStorageChange = (e) => {
            if (e.key && e.key.startsWith('profilePic_')) {
                console.log('KitchenDashboard: Profile image storage updated, triggering immediate profile refresh...');
                // Force immediate profile image re-render by updating a state that affects OrderCard
                triggerProfileImageRefresh();
            }
        };
        
        const handleProfileUpdate = (event) => {
            const { userId, userName, action } = event.detail;
            console.log(`KitchenDashboard: Profile image ${action || 'updated'} for user ${userName || userId}, triggering immediate refresh...`);
            // Force immediate profile image re-render
            triggerProfileImageRefresh();
        };
        
        window.addEventListener('storage', handleStorageChange);
        window.addEventListener('profileImageUpdated', handleProfileUpdate);
        
        // Add global profile image refresh trigger
        const handleGlobalProfileRefresh = () => {
            console.log('KitchenDashboard: Global profile image refresh triggered');
            triggerProfileImageRefresh();
        };
        
        window.addEventListener('refreshAllProfileImages', handleGlobalProfileRefresh);
        
        // Additional listener for global profile image updates via storage
        const handleGlobalStorageProfileUpdate = (e) => {
            if (e.key === 'globalProfileImageUpdate' && e.newValue) {
                try {
                    const updateData = JSON.parse(e.newValue);
                    console.log('KitchenDashboard: Global profile image update detected via storage:', updateData);
                    triggerProfileImageRefresh();
                } catch (error) {
                    console.warn('KitchenDashboard: Error parsing global profile update:', error);
                }
            }
        };
        
        window.addEventListener('storage', handleGlobalStorageProfileUpdate);
        
        return () => {
            clearInterval(interval);
            if (notificationTimeoutRef.current) {
                clearTimeout(notificationTimeoutRef.current);
            }
            if (socketRef.current) {
                socketRef.current.off('new-order');
                socketRef.current.off('order-updated');
                socketRef.current.off('order-deleted');
                socketRef.current.off('chef-call');
                socketRef.current.off('profile-image-updated');
            }
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            window.removeEventListener('storage', handleStorageChange);
            window.removeEventListener('storage', handleGlobalStorageProfileUpdate);
            window.removeEventListener('profileImageUpdated', handleProfileUpdate);
            window.removeEventListener('refreshAllProfileImages', handleGlobalProfileRefresh);
            
            // Reset global audio flag on unmount
            if (typeof window !== 'undefined') {
                window.kitchenDashboardAudioMuted = false;
            }
        };
    }, []);

    // --------------------------------------------------
    // CHEF CALL PRIORITY HANDLING
    // --------------------------------------------------
    useEffect(() => {
        // When chef call becomes active, suppress order notifications
        if (chefCall) {
            console.log('🔇 KitchenDashboard: Chef call active - order notifications suppressed');
        } else {
            console.log('🔊 KitchenDashboard: Chef call ended - order notifications resumed');
        }
    }, [chefCall]);

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
        try {
            await callApi(`/orders/${id}/status`, "PUT", {
                status: newStatus,
                userId: user.id,
                userRole: user.role,
            });
            // Refresh after status update
            fetchOrders();
            setExpandedOrderId(null);
        } catch (error) {
            console.error('Failed to update order status:', error);
        }
    };
    
    const handleNotificationOk = () => {
        setShowNotification(false);
        setNotificationAcknowledged(true); // Mark as acknowledged
        setNotificationOrderData(null); // Clear order data
        if (notificationTimeoutRef.current) {
            clearTimeout(notificationTimeoutRef.current);
            notificationTimeoutRef.current = null;
        }
    };

    // Add manual notification test for debugging
    const testNotification = () => {
        console.log('🧪 Manual test notification triggered');
        console.log('📊 Current state:', {
            showNotification,
            notificationAcknowledged,
            chefCall,
            hasLoaded: hasLoaded.current,
            lastOrderCount: lastOrderCount.current
        });
        setNotificationAcknowledged(false);
        setShowNotification(true);
        setNotificationOrderData({
            userName: 'Test User',
            items: [
                { quantity: 2, item: 'coffee', type: 'Regular' },
                { quantity: 1, item: 'sandwich', type: 'Cheese' }
            ]
        });
    };

    // Add test functions to window for debugging
    useEffect(() => {
        window.testKitchenNotification = testNotification;
        
        // Manual chef call test
        window.testChefCall = () => {
            console.log('🧪 Manual test chef call triggered');
            setChefCall({
                id: 'test-call-' + Date.now(),
                userName: 'Test Customer',
                seatNumber: 'Table 5',
                timestamp: Date.now(),
                message: 'Customer needs assistance'
            });
        };
        
        return () => {
            delete window.testKitchenNotification;
            delete window.testChefCall;
        };
    }, []);

    // --------------------------------------------------
    // CHEF CALL - ENHANCED POLLING (Primary detection method)
    // --------------------------------------------------
    useEffect(() => {
        // Initial fetch when component mounts
        const fetchChefCalls = async () => {
            try {
                const data = await callApi(
                    `/chef-calls?userId=${user.id}&userRole=${user.role}`,
                    'GET',
                    null,
                    true // silent mode
                );
                
                if (Array.isArray(data) && data.length > 0) {
                    console.log('📞 Initial chef call fetch found:', data[0]);
                    setChefCall(data[0]);
                }
            } catch (err) {
                console.error("Initial chef calls fetch error:", err);
            }
        };
        
        fetchChefCalls();
        
        // Aggressive polling for chef calls - check every 5 seconds for immediate detection
        const pollChefCalls = async () => {
            try {
                const data = await callApi(
                    `/chef-calls?userId=${user.id}&userRole=${user.role}`,
                    'GET',
                    null,
                    true // silent mode
                );
                
                if (Array.isArray(data) && data.length > 0) {
                    // Only set if we don't already have this chef call
                    if (!chefCall || chefCall.id !== data[0].id) {
                        console.log('📞 New chef call detected via polling:', data[0]);
                        setChefCall(data[0]);
                    }
                } else {
                    // Clear chef call if none found
                    if (chefCall) {
                        console.log('📞 No active chef calls found, clearing');
                        setChefCall(null);
                    }
                }
            } catch (err) {
                console.error("Chef calls polling error:", err);
            }
        };
        
        // Poll every 5 seconds for immediate chef call detection
        const pollInterval = setInterval(pollChefCalls, 5000);
        
        return () => {
            clearInterval(pollInterval);
        };
    }, [user, chefCall]); // Include chefCall in dependencies to avoid stale closures

    const handleChefCallRespond = async (callId, response) => {
        console.log('📞 Chef responding to call:', { callId, response });
        
        try {
            // Try socket first for instant delivery
            if (socketRef.current?.connected) {
                console.log('📡 Sending chef response via Socket.IO');
                socketRef.current.emit('chef-response', {
                    callId: callId,
                    response: response,
                    chefId: user.id,
                    chefName: user.name,
                    timestamp: Date.now()
                });
            } else {
                console.log('📡 Socket not connected, using HTTP fallback');
            }
            
            // Always use HTTP as backup to ensure delivery
            console.log('📡 Sending chef response via HTTP API');
            const responseData = await callApi(`/chef-calls/${callId}`, 'PUT', {
                action: response,
                userId: user.id,
                userRole: user.role
            });
            
            console.log('✅ Chef response sent successfully:', responseData);
            
        } catch (err) {
            console.error("❌ Error responding to chef call:", err);
        } finally {
            // Always clear the chef call after attempting to respond
            console.log('🧹 Clearing chef call from kitchen dashboard');
            setChefCall(null);
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
            {/* Dynamic Header Banner - Shows for all views */}
            <div style={{
                height: '120px',
                width: '100%',
                marginBottom: '20px',
                borderRadius: '0 0 18px 18px',
                overflow: 'hidden',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
                position: 'relative',
                backgroundImage: `linear-gradient(to top, rgba(0, 0, 0, 0.4) 0%, rgba(0, 0, 0, 0.1) 100%), url(${getHeaderImageUrl()})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '0 24px',
                textAlign: 'center',
            }}>
                <h1 style={{
                    fontSize: '1.5rem',
                    fontWeight: '900',
                    color: '#ffffff',
                    textShadow: '0 2px 4px rgba(0, 0, 0, 0.9)',
                    lineHeight: '1.1',
                    margin: '0',
                    fontFamily: 'Cambria, serif',
                }}>
                    {view === "itemStatus" && selectedItemTypeKey 
                        ? `${Object.values(computeTotalsForSlot(selectedSlot)).find(t => t.key === selectedItemTypeKey)?.name.toUpperCase() || 'ITEM'} Preparation Station`
                        : 'Kitchen Dashboard'
                    }
                </h1>
                <p style={{
                    fontSize: '0.9rem',
                    color: 'rgba(255, 255, 255, 0.95)',
                    fontWeight: '500',
                    marginTop: '4px',
                    textShadow: '0 1px 2px rgba(0, 0, 0, 0.8)',
                    margin: '0',
                }}>
                    {view === "itemStatus" && selectedItemTypeKey 
                        ? 'Ready to prepare delicious orders!'
                        : 'Manage your kitchen orders efficiently'
                    }
                </p>
            </div>


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
                                                key={`${order._id}-${profileImageRefreshKey}`}
                                                order={order}
                                                selectedStatus={selectedStatus}
                                                selectedItemTypeKey={selectedItemTypeKey}
                                                expandedOrderId={expandedOrderId}
                                                setExpandedOrderId={setExpandedOrderId}
                                                updateOrderStatus={updateOrderStatus}
                                                styles={styles}
                                                enhancedStyles={enhancedStyles}
                                                user={user}
                                                profileImageRefreshKey={profileImageRefreshKey}
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
                orderData={notificationOrderData}
                styles={styles}
            />

            {/* Chef Call Full-Page Notification */}
            {chefCall && (
                <ChefCallNotification
                    call={chefCall}
                    onRespond={handleChefCallRespond}
                />
            )}
            
            
            {renderFooterCard()}

        </div>
    );
};

export default KitchenDashboard;