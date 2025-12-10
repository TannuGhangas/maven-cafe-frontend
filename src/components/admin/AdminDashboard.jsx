import React, { useState, useEffect } from 'react';
import { FaUsers, FaClipboardList, FaSearch, FaFilter, FaCalendarAlt, FaUser, FaCheckCircle, FaClock, FaExclamationTriangle, FaBars, FaChartBar, FaHome } from 'react-icons/fa';
import AdminLayout from './AdminLayout';
import { ModernLineChart, ModernBarChart, ModernDoughnutChart, OrderStatusChart, WeeklyOrdersChart, MonthlyOrdersChart } from './ModernCharts';
import '../../styles/AdminDashboard.css';

const AdminDashboard = ({ user, setPage, styles, callApi }) => {
    const [orders, setOrders] = useState([]);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [dateFilter, setDateFilter] = useState('');
    const [userFilter, setUserFilter] = useState('');
    const [itemTypeFilter, setItemTypeFilter] = useState('');
    const [activeSection, setActiveSection] = useState('dashboard');
    const [lastUpdated, setLastUpdated] = useState(new Date());

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                // For admin users, fetch all orders including completed ones for historical data
                const apiEndpoint = user.role === 'admin'
                    ? `/orders?includeCompleted=true&userId=${user.id}&userRole=${user.role}`
                    : `/orders?userId=${user.id}&userRole=${user.role}`;
                
                const data = await callApi(apiEndpoint);
                console.log('📊 Real orders data fetched:', data);
                
                if (Array.isArray(data)) {
                    const validOrders = data.filter(order =>
                        order &&
                        order._id &&
                        order.userName &&
                        Array.isArray(order.items) &&
                        order.items.length > 0
                    );
                    
                    console.log(`✅ Loaded ${validOrders.length} valid orders from database`);
                    setOrders(validOrders);
                    setFilteredOrders(validOrders);
                    setLastUpdated(new Date());
                    
                    // If no date filter is set and we have orders, show orders from the last 7 days by default
                    if (!dateFilter && validOrders.length > 0) {
                        const sevenDaysAgo = new Date();
                        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
                        
                        const recentOrders = validOrders.filter(order =>
                            new Date(order.timestamp) >= sevenDaysAgo
                        );
                        
                        if (recentOrders.length > 0) {
                            console.log(`📅 Showing ${recentOrders.length} orders from last 7 days by default`);
                        }
                    }
                } else {
                    console.warn('⚠️ Invalid data format received:', data);
                    setOrders([]);
                    setFilteredOrders([]);
                    setLastUpdated(new Date());
                }
            } catch (error) {
                console.error('❌ Error fetching real orders data:', error);
                setOrders([]);
                setFilteredOrders([]);
            }
        };
        fetchOrders();
        
        const interval = setInterval(fetchOrders, 30000);
        return () => clearInterval(interval);
    }, [callApi, user, dateFilter]);

    useEffect(() => {
        let filtered = orders;

        if (searchTerm) {
            filtered = filtered.filter(order =>
                order.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                order.items.some(item => item.item.toLowerCase().includes(searchTerm.toLowerCase()))
            );
        }

        if (statusFilter) {
            filtered = filtered.filter(order => order.status === statusFilter);
        }

        if (dateFilter) {
            filtered = filtered.filter(order =>
                new Date(order.timestamp).toDateString() === new Date(dateFilter).toDateString()
            );
        }

        if (userFilter) {
            filtered = filtered.filter(order => order.userName.toLowerCase().includes(userFilter.toLowerCase()));
        }

        if (itemTypeFilter) {
            filtered = filtered.filter(order =>
                order.items.some(item => item.item === itemTypeFilter)
            );
        }

        setFilteredOrders(filtered);
    }, [orders, searchTerm, statusFilter, dateFilter, userFilter, itemTypeFilter]);

    // Calculate stats (using filtered orders for dashboard stats)
    const totalOrders = filteredOrders.length;
    const completedOrders = filteredOrders.filter(order => order.status === 'Delivered').length;
    const pendingOrders = filteredOrders.filter(order => order.status !== 'Delivered').length;

    // Today's activity (based on filtered orders)
    const today = new Date().toDateString();
    const todayOrders = filteredOrders.filter(order => new Date(order.timestamp).toDateString() === today);
    const todayCompleted = todayOrders.filter(order => order.status === 'Delivered').length;
    const todayPending = todayOrders.filter(order => order.status !== 'Delivered').length;

    // Calculate chart data with proper format for ModernCharts (using filtered orders)
    const getWeeklyData = () => {
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const weeklyOrders = days.map((day, index) => {
            const dayOrders = filteredOrders.filter(order => {
                const orderDate = new Date(order.timestamp);
                return orderDate.getDay() === index;
            });
            return { label: day, value: dayOrders.length };
        });
        return weeklyOrders;
    };

    const getMonthlyData = () => {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const currentYear = new Date().getFullYear();
        
        const monthlyOrders = months.map((month, index) => {
            const monthOrders = filteredOrders.filter(order => {
                const orderDate = new Date(order.timestamp);
                return orderDate.getFullYear() === currentYear && orderDate.getMonth() === index;
            });
            return { label: month, value: monthOrders.length };
        });
        return monthlyOrders;
    };

    const getPopularItemsData = () => {
        const itemCounts = {};
        filteredOrders.forEach(order => {
            order.items.forEach(item => {
                const itemName = item.item;
                itemCounts[itemName] = (itemCounts[itemName] || 0) + item.quantity;
            });
        });
        
        return Object.entries(itemCounts)
            .map(([label, value]) => ({ label, value }))
            .sort((a, b) => b.value - a.value)
            .slice(0, 6);
    };

    const weeklyData = getWeeklyData();
    const monthlyData = getMonthlyData();
    const popularItemsData = getPopularItemsData();

    const sidebarItems = [
        {
            id: 'dashboard',
            title: 'Dashboard',
            icon: <FaHome />,
            action: 'section'
        },
        {
            id: 'orders',
            title: 'Order Management',
            icon: <FaClipboardList />,
            action: 'section'
        },
        {
            id: 'users',
            title: 'User Management',
            icon: <FaUsers />,
            action: 'navigate',
            page: 'admin-users'
        },
        {
            id: 'members',
            title: 'Member Management',
            icon: <FaUser />,
            action: 'navigate',
            page: 'admin-members'
        },
        {
            id: 'complaints',
            title: 'Complaint Management',
            icon: <FaExclamationTriangle />,
            action: 'navigate',
            page: 'admin-complaints'
        },
    ];

    const renderMainContent = () => {
        switch (activeSection) {
            case 'dashboard':
                return (
                    <div className="main-content compact-layout">
                        {/* Quick Stats Bar */}
                        <div className="quick-stats-bar">
                            <div className="stat-item">
                                <FaClipboardList />
                                <div className="stat-content">
                                    <span className="stat-number">{totalOrders}</span>
                                    <span className="stat-label">Total Orders</span>
                                </div>
                            </div>
                            <div className="stat-item">
                                <FaCheckCircle />
                                <div className="stat-content">
                                    <span className="stat-number">{completedOrders}</span>
                                    <span className="stat-label">Completed</span>
                                </div>
                            </div>
                            <div className="stat-item">
                                <FaClock />
                                <div className="stat-content">
                                    <span className="stat-number">{pendingOrders}</span>
                                    <span className="stat-label">Pending</span>
                                </div>
                            </div>
                            <div className="stat-item">
                                <FaClipboardList />
                                <div className="stat-content">
                                    <span className="stat-number">{todayOrders.length}</span>
                                    <span className="stat-label">Today</span>
                                </div>
                            </div>
                        </div>

                        <div className="compact-charts-section">
                            <div className="charts-grid-compact-3">
                                <WeeklyOrdersChart orders={filteredOrders} height={180} />
                                <MonthlyOrdersChart orders={filteredOrders} height={180} />
                                <ModernBarChart
                                    data={popularItemsData}
                                    title="Popular Items"
                                    color="#4ecdc4"
                                    height={180}
                                />
                            </div>
                        </div>

                        {/* Today's Activity Summary */}
                        <div className="compact-activity-section">
                            <h4><FaCalendarAlt /> Today's Summary</h4>
                            <div className="activity-compact-grid">
                                <div className="activity-compact-item">
                                    <FaClipboardList />
                                    <span>Orders: {todayOrders.length}</span>
                                </div>
                                <div className="activity-compact-item">
                                    <FaCheckCircle />
                                    <span>Completed: {todayCompleted}</span>
                                </div>
                                <div className="activity-compact-item">
                                    <FaClock />
                                    <span>Pending: {todayPending}</span>
                                </div>
                            </div>
                        </div>

                        {/* Full Detailed Recent Orders */}
                        <div className="compact-orders-section">
                            <h4><FaClipboardList /> Recent Orders</h4>
                            {filteredOrders.length === 0 ? (
                                <div className="no-orders">
                                    <FaClipboardList size={48} color="#ccc" />
                                    <p>No orders found matching the current filters.</p>
                                </div>
                            ) : (
                                <div className="orders-table-container-compact">
                                    <table className="orders-table-compact">
                                        <thead>
                                            <tr>
                                                <th>User</th>
                                                <th>Items</th>
                                                <th>Status</th>
                                                <th>Slot</th>
                                                <th>Time</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredOrders.slice(0, 8).map((order) => (
                                                <tr key={order._id}>
                                                    <td className="order-user">{order.userName}</td>
                                                    <td className="order-items">
                                                        {order.items.map((item, idx) => (
                                                            <div key={idx} className="order-item-compact">
                                                                {item.quantity}x {item.item} {item.type && item.type !== item.item ? `(${item.type})` : ''}
                                                            </div>
                                                        ))}
                                                    </td>
                                                    <td>
                                                        <span className={`status-badge status-${order.status.toLowerCase()}`}>
                                                            {order.status}
                                                        </span>
                                                    </td>
                                                    <td className="order-slot">{order.slot}</td>
                                                    <td className="order-time-compact">
                                                        {new Date(order.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                    {filteredOrders.length > 8 && (
                                        <div className="show-more-compact">
                                            <button onClick={() => setActiveSection('orders')} className="show-more-btn">
                                                Show All Orders ({filteredOrders.length})
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                );
            case 'orders':
                return (
                    <div className="main-content">
                        <div className="dashboard-header2">
                            <h2>Order Management</h2>
                            <p>Manage and monitor all orders in the system.</p>
                        </div>

                        <div className="orders-list-section">
                            <h3><FaClipboardList /> Orders List</h3>
                            {filteredOrders.length === 0 ? (
                                <div className="no-orders">
                                    <FaClipboardList size={48} color="#ccc" />
                                    <p>No orders found matching the filters.</p>
                                </div>
                            ) : (
                                <div className="orders-table-container">
                                    <table className="orders-table">
                                        <thead>
                                            <tr>
                                                <th>User</th>
                                                <th>Items</th>
                                                <th>Status</th>
                                                <th>Slot</th>
                                                <th>Date</th>
                                                <th>Time</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredOrders.map((order) => (
                                                <tr key={order._id}>
                                                    <td>{order.userName}</td>
                                                    <td>
                                                        {order.items.map((item, idx) => (
                                                            <div key={idx} className="order-item-summary">
                                                                {item.quantity}x {item.item} {item.type && item.type !== item.item ? `(${item.type})` : ''}
                                                            </div>
                                                        ))}
                                                    </td>
                                                    <td>
                                                        <span className={`status-badge status-${order.status.toLowerCase()}`}>
                                                            {order.status}
                                                        </span>
                                                    </td>
                                                    <td>{order.slot}</td>
                                                    <td>{new Date(order.timestamp).toLocaleDateString()}</td>
                                                    <td>{new Date(order.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
                );
            default:
                return (
                    <div className="main-content">
                        <div className="dashboard-header">
                            <h2>Dashboard Overview</h2>
                            <p>Welcome to the admin dashboard. Use the sidebar to navigate to different management sections.</p>
                        </div>
                    </div>
                );
        }
    };

    return (
        <AdminLayout 
            user={user}
            setPage={setPage}
            activeSection={activeSection}
            setActiveSection={setActiveSection}
            callApi={callApi}
        >
            {/* Top Navbar with Filters */}
            <div className="top-navbar compact-navbar">
                <div className="navbar-filters compact-filters">
                    <div className="filter-group">
                        <FaSearch />
                        <input
                            type="text"
                            placeholder="Search..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="filter-group">
                        <FaFilter />
                        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                            <option value="">All Status</option>
                            <option value="Placed">Placed</option>
                            <option value="Making">Making</option>
                            <option value="Ready">Ready</option>
                            <option value="Delivered">Delivered</option>
                        </select>
                    </div>
                    <div className="filter-group">
                        <FaCalendarAlt />
                        <input
                            type="date"
                            value={dateFilter}
                            onChange={(e) => setDateFilter(e.target.value)}
                        />
                    </div>
                    <div className="filter-group">
                        <FaUser />
                        <input
                            type="text"
                            placeholder="User..."
                            value={userFilter}
                            onChange={(e) => setUserFilter(e.target.value)}
                        />
                    </div>
                    <div className="filter-group">
                        <FaClipboardList />
                        <select value={itemTypeFilter} onChange={(e) => setItemTypeFilter(e.target.value)}>
                            <option value="">All Items</option>
                            <option value="coffee">Coffee</option>
                            <option value="tea">Tea</option>
                            <option value="water">Water</option>
                        </select>
                    </div>
                </div>
                <div className="navbar-info compact-info">
                    <span className="filtered-count">{filteredOrders.length}/{totalOrders}</span>
                    <span className="last-updated">
                        📊 {lastUpdated.toLocaleTimeString()}
                    </span>
                    <button
                        onClick={() => {
                            const fetchOrders = async () => {
                                try {
                                    // For admin users, fetch all orders including completed ones for historical data
                                    const apiEndpoint = user.role === 'admin'
                                        ? `/orders?includeCompleted=true&userId=${user.id}&userRole=${user.role}`
                                        : `/orders?userId=${user.id}&userRole=${user.role}`;
                                    
                                    const data = await callApi(apiEndpoint);
                                    if (Array.isArray(data)) {
                                        const validOrders = data.filter(order =>
                                            order &&
                                            order._id &&
                                            order.userName &&
                                            Array.isArray(order.items) &&
                                            order.items.length > 0
                                        );
                                        setOrders(validOrders);
                                        setFilteredOrders(validOrders);
                                        setLastUpdated(new Date());
                                    }
                                } catch (error) {
                                    console.error('❌ Error refreshing data:', error);
                                }
                            };
                            fetchOrders();
                        }}
                        className="refresh-btn"
                    >
                        🔄 Refresh
                    </button>
                </div>
            </div>

            {/* Main Content */}
            {renderMainContent()}
        </AdminLayout>
    );
};

export default AdminDashboard;