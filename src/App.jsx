// src/App.jsx
import React, { useState, useEffect } from 'react';
import { callApi } from './api/apiService';
import { styles } from './styles/styles';
import { USER_LOCATIONS_DATA } from './config/constants';

// Components
import NavBar from './components/common/NavBar';
import ProfileModal from './components/common/ProfileModal';
import LoginPage from './components/common/AuthPage';
import CallChefButton from './components/common/CallChefButton';
import ErrorBoundary from './components/common/ErrorBoundary';
import ReactCompatibilityCheck from './components/common/ReactCompatibilityCheck';

// User Screens
import UserHomePage from './components/user/UserHomePage';
import ItemConfigPage from './components/user/ItemConfigPage';
import OrderConfirmationPage from './components/user/OrderConfirmationPage';
import UserOrdersListPage from './components/user/UserOrdersListPage';
import ComplaintPage from './components/user/ComplaintPage';

// Kitchen/Admin Screens
import KitchenDashboard from './components/kitchen/KitchenDashboard';
import AdminDashboard from './components/admin/AdminDashboard';
import AdminUsersPage from './components/admin/AdminUsersPage';
import AdminComplaintsPage from './components/admin/AdminComplaintsPage';
import AdminMembersPage from './components/admin/AdminMembersPage';
import AdminMenuPage from './components/admin/AdminMenuPage';
import AdminLocationsPage from './components/admin/AdminLocationsPage';

function App() {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || null);
  const [page, setPage] = useState(user ? 'home' : 'login');
  const [modal, setModal] = useState(null);
  const [currentOrder, setCurrentOrder] = useState({ slot: 'morning (9:00-12:00)', items: [] });
  const [kitchenView, setKitchenView] = useState("home");
  const [activeSection, setActiveSection] = useState('dashboard'); // For admin sidebar navigation

  const isLoggedIn = !!user;

  // --- SERVICE WORKER MESSAGE LISTENER ---
  useEffect(() => {
    // Listen for messages from service worker (for notification clicks)
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('message', (event) => {
        console.log('📱 Received message from service worker:', event.data);
        
        if (event.data?.type === 'notification_click') {
          const { data } = event.data;
          console.log('🔔 Notification clicked with data:', data);
          
          // Handle different notification types
          if (data?.type === 'new-order') {
            // If kitchen user, navigate to kitchen dashboard
            if (user?.role === 'kitchen') {
              setPage('kitchen-dashboard');
            }
          } else if (data?.type === 'chef-call') {
            // If kitchen user, navigate to kitchen dashboard to see the call
            if (user?.role === 'kitchen') {
              setPage('kitchen-dashboard');
            }
          }
          
          // You can add more notification type handlers here
        }
      });
    }
  }, [user]);

  // --- ROLE-BASED LOGIN REDIRECTION ---
  useEffect(() => {
    if (!user) return setPage('login');
    if (user.role === 'admin') setPage('admin-dashboard');
    else if (user.role === 'kitchen') setPage('kitchen-dashboard');
    else setPage('home');
  }, [user]);

  // 🔄 Auto-refresh on Service Worker update (DISABLED - causes auto-updates)
  // useEffect(() => {
  //   if (process.env.NODE_ENV === 'production' && "serviceWorker" in navigator) {
  //     navigator.serviceWorker.addEventListener("controllerchange", () => {
  //       console.log('Service Worker updated - refreshing page...');
  //       window.location.reload();
  //     });
  //   }
  // }, []);

  // 🧭 Handle browser back/forward navigation
  useEffect(() => {
    const handlePopState = () => {
      if (!user) return setPage('login');
      if (user.role === 'admin') setPage('admin-dashboard');
      else if (user.role === 'kitchen') { setPage('kitchen-dashboard'); setKitchenView("home"); }
      else setPage('home');
    };
    window.addEventListener('popstate', handlePopState);
    window.history.replaceState({ page }, '', window.location.href);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [user, page]);

  // Update browser history when page changes
  useEffect(() => {
    if (user && page) window.history.pushState({ page }, '', window.location.href);
  }, [page, user]);

  // --- LOGIN HANDLER ---
  const handleLogin = async (username, password) => {
    const data = await callApi('/login', 'POST', { username, password });
    if (data?.success) {
      const loggedInUser = data.user;
      const locationData = USER_LOCATIONS_DATA.find(u => u.name === loggedInUser.name);
      if (locationData) {
        loggedInUser.location = locationData.location;
        loggedInUser.access = locationData.access;
      }
      localStorage.setItem('user', JSON.stringify(loggedInUser));
      setUser(loggedInUser);
    } else {
      alert('❌ Invalid username or password. Please try again.');
    }
  };

  // --- LOGOUT HANDLER ---
  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    setPage('login');
    setModal(null);
    setCurrentOrder({ slot: 'morning (9:00-12:00)', items: [] });
  };

  // SHOW LOGIN PAGE
  if (!isLoggedIn) return <LoginPage onLogin={handleLogin} styles={styles} />;

  // ------------------------------
  // PAGE RENDERING LOGIC
  // ------------------------------
  const renderPage = () => {
    // USER PAGES
    if (page === 'home') return <UserHomePage setPage={setPage} currentOrder={currentOrder} setCurrentOrder={setCurrentOrder} user={user} styles={styles} />;
    if (page === 'complaint') return <ComplaintPage setPage={setPage} user={user} callApi={callApi} styles={styles} />;

    if (page.startsWith('item-config-')) {
      const parts = page.split('-');
      const isEditMode = parts.includes('edit');
      const itemIndex = isEditMode ? parseInt(parts[3]) : -1;
      const itemType = isEditMode ? parts[4] : parts[2];

      return <ItemConfigPage itemType={itemType} setPage={setPage} currentOrder={currentOrder} setCurrentOrder={setCurrentOrder} isEditMode={isEditMode} itemIndex={itemIndex} user={user} callApi={callApi} styles={styles} />;
    }

    if (page === 'order-confirmation') return <OrderConfirmationPage setPage={setPage} currentOrder={currentOrder} setCurrentOrder={setCurrentOrder} user={user} callApi={callApi} styles={styles} />;
    if (page === 'orders-list') return <UserOrdersListPage setPage={setPage} user={user} callApi={callApi} styles={styles} />;

    // KITCHEN
    if (page === 'kitchen-dashboard') return (
      <ErrorBoundary kitchenMode={true}>
        <KitchenDashboard user={user} callApi={callApi} setPage={setPage} styles={styles} kitchenView={kitchenView} setKitchenView={setKitchenView} />
      </ErrorBoundary>
    );

    // ADMIN DASHBOARD
    if (page === 'admin-dashboard') return user.role === 'admin' ? <AdminDashboard user={user} setPage={setPage} styles={styles} callApi={callApi} activeSection={activeSection} setActiveSection={setActiveSection} /> : <div style={styles.loadingContainer}>Access Denied. Only Admins can view this page.</div>;
    if (page === 'admin-users') return user.role === 'admin' ? <AdminUsersPage user={user} callApi={callApi} setPage={setPage} styles={styles} activeSection={activeSection} setActiveSection={setActiveSection} /> : <div style={styles.loadingContainer}>Access Denied. Only Admins can view this page.</div>;
    if (page === 'admin-complaints') return (user.role === 'admin' || user.role === 'kitchen') ? <AdminComplaintsPage user={user} callApi={callApi} setPage={setPage} styles={styles} activeSection={activeSection} setActiveSection={setActiveSection} /> : <div style={styles.loadingContainer}>Access Denied.</div>;
    if (page === 'admin-members') return user.role === 'admin' ? <AdminMembersPage user={user} callApi={callApi} setPage={setPage} styles={styles} activeSection={activeSection} setActiveSection={setActiveSection} /> : <div style={styles.loadingContainer}>Access Denied. Only Admins can view this page.</div>;
    if (page === 'admin-menu') return user.role === 'admin' ? <AdminMenuPage user={user} callApi={callApi} setPage={setPage} styles={styles} activeSection={activeSection} setActiveSection={setActiveSection} /> : <div style={styles.loadingContainer}>Access Denied. Only Admins can view this page.</div>;
    if (page === 'admin-locations') return user.role === 'admin' ? <AdminLocationsPage user={user} callApi={callApi} setPage={setPage} styles={styles} activeSection={activeSection} setActiveSection={setActiveSection} /> : <div style={styles.loadingContainer}>Access Denied. Only Admins can view this page.</div>;

    return <div style={styles.screenPadding}>Page Not Found!</div>;
  };

  // ------------------------------
  // FINAL RETURN
  // ------------------------------
  return (
    <div style={styles.appContainer}>
      {/* React compatibility check for debugging hook issues */}
      <ReactCompatibilityCheck />
      
      {isLoggedIn && (
        <NavBar
          user={user}
          setPage={setPage}
          setModal={setModal}
          setKitchenView={setKitchenView}
          styles={styles}
          onLogoClick={() => {
            if (user.role === 'user') setPage('home');
            else if (user.role === 'admin') setPage('admin-dashboard');
            else if (user.role === 'kitchen') { setPage('kitchen-dashboard'); setKitchenView("home"); }
          }}
        />
      )}

      <div style={isLoggedIn ? styles.contentArea : {}}>
        {renderPage()}
      </div>

      {modal === 'profile' && (
        <ProfileModal
          user={user}
          onClose={() => setModal(null)}
          handleLogout={handleLogout}
          setUser={setUser}
          setPage={setPage}
          callApi={callApi}
          styles={styles}
        />
      )}

      {/* Call Chef Button - Only for Sharma Sir */}
      {user.role === 'user' && user.name === 'Sharma Sir' && (
        <CallChefButton user={user} />
      )}
    </div>
  );
}

export default App;
