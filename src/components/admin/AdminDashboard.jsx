import React, { useState, useEffect } from 'react';
import { FaUsers, FaUtensilSpoon, FaMapMarkerAlt, FaClipboardList, FaSearch, FaFilter, FaCalendarAlt, FaUser, FaCheckCircle, FaClock, FaExclamationTriangle, FaBars, FaChartBar, FaHome } from 'react-icons/fa';
import '../../styles/AdminDashboard.css';

const AdminDashboard = ({ user, setPage, styles, callApi }) => {
    const [orders, setOrders] = useState([]);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [dateFilter, setDateFilter] = useState('');
    const [userFilter, setUserFilter] = useState('');
    const [itemTypeFilter, setItemTypeFilter] = useState('');
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [activeSection, setActiveSection] = useState('dashboard');

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const data = await callApi(`/orders?userId=${user.id}&userRole=${user.role}`);
                setOrders(data || []);
                setFilteredOrders(data || []);
            } catch (error) {
                console.error('Error fetching orders:', error);
                setOrders([]);
                setFilteredOrders([]);
            }
        };
        fetchOrders();
    }, [callApi, user]);

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

    // Calculate stats
    const totalOrders = orders.length;
    const completedOrders = orders.filter(order => order.status === 'Delivered').length;
    const pendingOrders = orders.filter(order => order.status !== 'Delivered').length;

    // Today's activity
    const today = new Date().toDateString();
    const todayOrders = orders.filter(order => new Date(order.timestamp).toDateString() === today);
    const todayCompleted = todayOrders.filter(order => order.status === 'Delivered').length;
    const todayPending = todayOrders.filter(order => order.status !== 'Delivered').length;
    const activeUsers = [...new Set(todayOrders.map(order => order.userName))].length;

    // Chart data - sample data for demonstration
    const weeklyData = [
        { day: 'Mon', orders: 12 },
        { day: 'Tue', orders: 19 },
        { day: 'Wed', orders: 15 },
        { day: 'Thu', orders: 22 },
        { day: 'Fri', orders: 28 },
        { day: 'Sat', orders: 18 },
        { day: 'Sun', orders: 14 }
    ];

    const monthlyData = [
        { month: 'Jan', orders: 120 },
        { month: 'Feb', orders: 150 },
        { month: 'Mar', orders: 180 },
        { month: 'Apr', orders: 200 },
        { month: 'May', orders: 220 },
        { month: 'Jun', orders: 190 }
    ];

    const maxWeeklyOrders = Math.max(...weeklyData.map(d => d.orders));
    const maxMonthlyOrders = Math.max(...monthlyData.map(d => d.orders));
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
            id: 'members',
            title: 'User Management',
            icon: <FaUsers />,
            action: 'navigate',
            page: 'admin-members'
        },
        {
            id: 'menu',
            title: 'Menu Management',
            icon: <FaUtensilSpoon />,
            action: 'navigate',
            page: 'admin-menu'
        },
        {
            id: 'locations',
            title: 'Location Management',
            icon: <FaMapMarkerAlt />,
            action: 'navigate',
            page: 'admin-locations'
        },
    ];

    const renderMainContent = () => {
        switch (activeSection) {
            case 'dashboard':
                return (
                    <div className="main-content">
                        <div className="dashboard-header">
                            <h2>Dashboard Overview</h2>
                            <p>Welcome back, {user.name}! Here's your cafe system overview.</p>
                        </div>

                        {/* Orders List - Show filtered orders table */}
                        <div className="orders-list-section dashboard-orders">
                            <h3><FaClipboardList /> Recent Orders</h3>
                            {filteredOrders.length === 0 ? (
                                <div className="no-orders">
                                    <FaClipboardList size={48} color="#ccc" />
                                    <p>No orders found matching the current filters.</p>
                                </div>
                            ) : (
                                <div className="orders-table-container">
                                    <table className="orders-table">
                                        <thead>
                                            <tr>
                                                <th>Order ID</th>
                                                <th>User</th>
                                                <th>Items</th>
                                                <th>Status</th>
                                                <th>Slot</th>
                                                <th>Date</th>
                                                <th>Time</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredOrders.slice(0, 10).map((order) => (
                                                <tr key={order._id}>
                                                    <td>{order._id.substring(-8)}</td>
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
                                    {filteredOrders.length > 10 && (
                                        <div className="show-more">
                                            <button onClick={() => setActiveSection('orders')} className="show-more-btn">
                                                Show All Orders ({filteredOrders.length})
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Charts Section */}
                        <div className="charts-section">
                            <h3><FaChartBar /> Order Analytics</h3>
                            <div className="charts-container">
                                <div className="chart-card">
                                    <h4>Weekly Orders</h4>
                                    <div className="bar-chart">
                                        {weeklyData.map((data, index) => (
                                            <div key={index} className="bar-container">
                                                <div
                                                    className="bar"
                                                    style={{ height: `${(data.orders / maxWeeklyOrders) * 100}%` }}
                                                >
                                                    <span className="bar-value">{data.orders}</span>
                                                </div>
                                                <span className="bar-label">{data.day}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="chart-card">
                                    <h4>Monthly Orders</h4>
                                    <div className="bar-chart">
                                        {monthlyData.map((data, index) => (
                                            <div key={index} className="bar-container">
                                                <div
                                                    className="bar"
                                                    style={{ height: `${(data.orders / maxMonthlyOrders) * 100}%` }}
                                                >
                                                    <span className="bar-value">{data.orders}</span>
                                                </div>
                                                <span className="bar-label">{data.month}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Orders Summary */}
                        <div className="orders-summary-section">
                            <h3><FaClipboardList /> Orders Summary</h3>
                            <div className="summary-stats">
                                <div className="stat-card">
                                    <FaClipboardList />
                                    <span className="stat-number">{totalOrders}</span>
                                    <span className="stat-label">Total Orders</span>
                                </div>
                                <div className="stat-card">
                                    <FaCheckCircle />
                                    <span className="stat-number">{completedOrders}</span>
                                    <span className="stat-label">Completed</span>
                                </div>
                                <div className="stat-card">
                                    <FaClock />
                                    <span className="stat-number">{pendingOrders}</span>
                                    <span className="stat-label">Pending</span>
                                </div>
                            </div>
                        </div>

                        {/* Today's Activity */}
                        <div className="todays-activity-section">
                            <h3><FaCalendarAlt /> Today's Activity</h3>
                            <div className="activity-stats">
                                <div className="activity-item">
                                    <FaClipboardList />
                                    <span>Orders Today: {todayOrders.length}</span>
                                </div>
                                <div className="activity-item">
                                    <FaCheckCircle />
                                    <span>Completed: {todayCompleted}</span>
                                </div>
                                <div className="activity-item">
                                    <FaClock />
                                    <span>Pending: {todayPending}</span>
                                </div>
                                <div className="activity-item">
                                    <FaUser />
                                    <span>Active Users: {activeUsers}</span>
                                </div>
                                {pendingOrders > 0 && (
                                    <div className="activity-item alert">
                                        <FaExclamationTriangle />
                                        <span>{pendingOrders} orders pending attention</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                );
            case 'orders':
                return (
                    <div className="main-content">
                        <div className="dashboard-header">
                            <h2>Order Management</h2>
                            <p>Manage and monitor all orders in the system.</p>
                        </div>

                        {/* Orders List */}
                        <div className="orders-list-section">
                            <h3><FaClipboardList /> Orders List</h3>
                            {filteredOrders.length === 0 ? (
                                <div className="no-orders">
                                    <FaClipboardList size={48} color="#ccc" />
                                    <p>No orders found matching the current filters.</p>
                                </div>
                            ) : (
                                <div className="orders-table-container">
                                    <table className="orders-table">
                                        <thead>
                                            <tr>
                                                <th>Order ID</th>
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
                                                    <td>{order._id.substring(-8)}</td>
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
        <div className="admin-layout">
            {/* Sidebar */}
            <div className={`sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
                <div className="sidebar-header">
                    <h3>Admin Panel</h3>
                    <button className="sidebar-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
                        <FaBars />
                    </button>
                </div>
                <nav className="sidebar-nav">
                    {sidebarItems.map(item => (
                        <div
                            key={item.id}
                            className={`sidebar-item ${activeSection === item.id ? 'active' : ''}`}
                            onClick={() => {
                                if (item.action === 'navigate') {
                                    setPage(item.page);
                                } else {
                                    setActiveSection(item.id);
                                }
                            }}
                        >
                            {item.icon}
                            <span className="sidebar-text">{item.title}</span>
                        </div>
                    ))}
                </nav>
            </div>

            {/* Main Content Area */}
            <div className="main-area">
                {/* Top Navbar with Filters */}
                <div className="top-navbar">
                    <div className="navbar-filters">
                        <div className="filter-group">
                            <FaSearch />
                            <input
                                type="text"
                                placeholder="Search by user or item..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="filter-group">
                            <FaFilter />
                            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                                <option value="">All Statuses</option>
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
                                placeholder="Filter by user..."
                                value={userFilter}
                                onChange={(e) => setUserFilter(e.target.value)}
                            />
                        </div>
                        <div className="filter-group">
                            <FaUtensilSpoon />
                            <select value={itemTypeFilter} onChange={(e) => setItemTypeFilter(e.target.value)}>
                                <option value="">All Items</option>
                                <option value="coffee">Coffee</option>
                                <option value="tea">Tea</option>
                                <option value="water">Water</option>
                            </select>
                        </div>
                    </div>
                    <div className="navbar-info">
                        <span className="filtered-count">Showing {filteredOrders.length} of {totalOrders} orders</span>
                    </div>
                </div>

                {/* Main Content */}
                {renderMainContent()}
            </div>
        </div>
    );
};

export default AdminDashboard;