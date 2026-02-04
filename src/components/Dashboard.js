import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import api from '../services/api';
import DashboardHome from './DashboardHome';
import ServiceRequests from './ServiceRequests';
import Products from './Products';
import Users from './Users';
import Notifications from './Notifications';
import Orders from './Orders';
import Revenue from './Revenue';

const Dashboard = ({ user, onLogout }) => {
  const location = useLocation();
  const [stats, setStats] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // Menu items without emojis
  const menuItems = [
    { path: '/dashboard', label: 'Dashboard' },
    { path: '/dashboard/requests', label: 'Service Requests' },
    { path: '/dashboard/orders', label: 'Orders' },
    { path: '/dashboard/products', label: 'Products' },
    { path: '/dashboard/revenue', label: 'Revenue & Expenses' },
    { path: '/dashboard/users', label: 'Users' },
    { path: '/dashboard/notifications', label: 'Notifications' },
  ];

  useEffect(() => {
    fetchStats();
    fetchNotifications();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await api.get('/api/admin/stats');
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const fetchNotifications = async () => {
    try {
      const response = await api.get('/api/notifications');
      setNotifications(response.data.notifications);
      const unread = response.data.notifications.filter(n => !n.is_read).length;
      setUnreadCount(unread);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const getActiveStyle = (path) => {
    return location.pathname === path
      ? {
          backgroundColor: 'rgba(255, 255, 255, 0.2)',
          borderRight: '4px solid #fff',
          transform: 'translateX(6px)',
        }
      : {};
  };

  return (
    <div
      style={{
        display: 'flex',
        minHeight: '100vh',
        fontFamily: "'Poppins', sans-serif",
        backgroundColor: '#f1f5f9',
        color: '#1e293b',
      }}
    >
      {/* ===== Sidebar ===== */}
      <aside
        style={{
          width: '270px',
          background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
          color: '#fff',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
          boxShadow: '4px 0 20px rgba(0,0,0,0.1)',
        }}
      >
        {/* Logo Section */}
        <div
          style={{
            padding: '32px 25px 24px',
            borderBottom: '1px solid rgba(255,255,255,0.15)',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
            }}
          >
            <div
              style={{
                width: '44px',
                height: '44px',
                background: 'rgba(255,255,255,0.2)',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: '700',
                fontSize: '18px',
                fontFamily: "'Poppins', sans-serif",
              }}
            >
              MS
            </div>
            <div>
              <h2
                style={{
                  margin: 0,
                  fontSize: '20px',
                  fontWeight: '700',
                  letterSpacing: '0.3px',
                  fontFamily: "'Poppins', sans-serif",
                }}
              >
                Modern Safety
              </h2>
              <p
                style={{
                  margin: 0,
                  opacity: 0.85,
                  fontSize: '13px',
                  fontWeight: '500',
                  fontFamily: "'Poppins', sans-serif",
                }}
              >
                Admin Panel
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            paddingTop: '25px',
          }}
        >
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '14px 25px',
                color: '#fff',
                textDecoration: 'none',
                fontSize: '15px',
                fontWeight: '500',
                transition: 'all 0.3s ease',
                fontFamily: "'Poppins', sans-serif",
                ...getActiveStyle(item.path),
              }}
              onMouseOver={(e) => {
                if (location.pathname !== item.path) {
                  e.currentTarget.style.backgroundColor =
                    'rgba(255,255,255,0.15)';
                  e.currentTarget.style.transform = 'translateX(6px)';
                }
              }}
              onMouseOut={(e) => {
                if (location.pathname !== item.path) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.transform = 'translateX(0)';
                }
              }}
            >
              {/* Removed icon/emoji span */}
              <span style={{ marginRight: '12px', width: '24px' }}></span>
              {item.label}
              {item.label === 'Notifications' && unreadCount > 0 && (
                <span
                  style={{
                    background: '#ff4757',
                    borderRadius: '10px',
                    padding: '2px 7px',
                    fontSize: '11px',
                    fontWeight: '600',
                    marginLeft: 'auto',
                    fontFamily: "'Poppins', sans-serif",
                  }}
                >
                  {unreadCount}
                </span>
              )}
              {item.label === 'Orders' && stats?.counts?.pending_orders > 0 && (
                <span
                  style={{
                    background: '#f59e0b',
                    borderRadius: '10px',
                    padding: '2px 7px',
                    fontSize: '11px',
                    fontWeight: '600',
                    marginLeft: 'auto',
                    fontFamily: "'Poppins', sans-serif",
                  }}
                >
                  {stats.counts.pending_orders}
                </span>
              )}
            </Link>
          ))}
        </nav>

        {/* User Section */}
        <div
          style={{
            padding: '20px 25px',
            borderTop: '1px solid rgba(255,255,255,0.1)',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '14px',
            }}
          >
            <div
              style={{
                width: '40px',
                height: '40px',
                background: 'rgba(255,255,255,0.2)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: '600',
                fontSize: '16px',
                fontFamily: "'Poppins', sans-serif",
              }}
            >
              {user?.full_name?.charAt(0) || 'A'}
            </div>
            <div>
              <p
                style={{
                  margin: 0,
                  fontWeight: '600',
                  fontSize: '14px',
                  fontFamily: "'Poppins', sans-serif",
                }}
              >
                {user?.full_name}
              </p>
              <p
                style={{
                  margin: 0,
                  opacity: 0.8,
                  fontSize: '12px',
                  fontWeight: '500',
                  fontFamily: "'Poppins', sans-serif",
                }}
              >
                {user?.role}
              </p>
            </div>
          </div>

          <button
            onClick={onLogout}
            style={{
              width: '100%',
              background: 'rgba(255,255,255,0.15)',
              color: '#fff',
              border: '1px solid rgba(255,255,255,0.25)',
              padding: '10px',
              borderRadius: '8px',
              fontSize: '13px',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              fontFamily: "'Poppins', sans-serif",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.25)';
              e.currentTarget.style.transform = 'translateY(-1px)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.15)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            Sign Out
          </button>
        </div>
      </aside>

      {/* ===== Main Content ===== */}
      <main
        style={{
          flex: 1,
          marginLeft: '270px',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Header */}
        <header
          style={{
            background: '#fff',
            padding: '18px 30px',
            borderBottom: '1px solid #e2e8f0',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
            position: 'sticky',
            top: 0,
            zIndex: 10,
          }}
        >
          <div>
            <h1
              style={{
                margin: 0,
                color: '#1e3c72',
                fontWeight: '700',
                fontSize: '22px',
                fontFamily: "'Poppins', sans-serif",
              }}
            >
              {menuItems.find((i) => i.path === location.pathname)?.label ||
                'Dashboard'}
            </h1>
            <p
              style={{
                margin: '4px 0 0',
                color: '#64748b',
                fontSize: '14px',
                fontFamily: "'Poppins', sans-serif",
              }}
            >
              Welcome back, {user?.full_name}
            </p>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
            }}
          >
            {/* Quick Stats Badges */}
            {stats && location.pathname === '/dashboard' && (
              <>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    background: '#f0f9ff',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: '1px solid #bae6fd',
                    color: '#0369a1',
                    fontWeight: '500',
                    fontSize: '14px',
                    gap: '6px',
                    fontFamily: "'Poppins', sans-serif",
                  }}
                >
                  <span>{stats.counts?.pending_orders || 0} Pending Orders</span>
                </div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    background: '#fef2f2',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: '1px solid #fecaca',
                    color: '#dc2626',
                    fontWeight: '500',
                    fontSize: '14px',
                    gap: '6px',
                    fontFamily: "'Poppins', sans-serif",
                  }}
                >
                  <span>{stats.counts?.pending_requests || 0} Pending Requests</span>
                </div>
              </>
            )}

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                background: '#f8fafc',
                padding: '8px 14px',
                borderRadius: '8px',
                border: '1px solid #e2e8f0',
                color: '#64748b',
                fontWeight: '500',
                fontSize: '14px',
                gap: '8px',
                fontFamily: "'Poppins', sans-serif",
              }}
            >
              <div
                style={{
                  width: '8px',
                  height: '8px',
                  background: '#10b981',
                  borderRadius: '50%',
                }}
              ></div>
              Admin
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div
          style={{
            flex: 1,
            padding: '30px',
            background: '#f1f5f9',
            overflowY: 'auto',
          }}
        >
          <Routes>
            <Route path="/" element={<DashboardHome stats={stats} onRefresh={fetchStats} />} />
            <Route path="/requests" element={<ServiceRequests />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/products" element={<Products />} />
            <Route path="/revenue" element={<Revenue />} />
            <Route path="/users" element={<Users />} />
            <Route path="/notifications" element={<Notifications notifications={notifications} onRefresh={fetchNotifications} />} />
          </Routes>
        </div>
      </main>

      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
        `}
      </style>
    </div>
  );
};

export default Dashboard;