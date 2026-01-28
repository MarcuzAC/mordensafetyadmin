import React, { useState } from 'react';
import api from '../services/api';

const Notifications = ({ notifications, onRefresh }) => {
  const [markingRead, setMarkingRead] = useState(null);

  const markAsRead = async (notificationId) => {
    setMarkingRead(notificationId);
    try {
      await api.put(`/api/notifications/${notificationId}/read`);
      onRefresh();
    } catch (error) {
      console.error('Error marking notification as read:', error);
    } finally {
      setMarkingRead(null);
    }
  };

  const markAllAsRead = async () => {
    const unreadNotifications = notifications.filter(n => !n.is_read);
    for (const notification of unreadNotifications) {
      await markAsRead(notification.id);
    }
  };

  const getTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  };

  const unreadCount = notifications.filter(n => !n.is_read).length;

  return (
    <div>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '30px'
      }}>
        <div>
          <h2 style={{ 
            margin: '0 0 8px 0', 
            color: '#1e3c72',
            fontSize: '28px',
            fontWeight: '700'
          }}>Notifications</h2>
          <p style={{
            margin: '0',
            color: '#64748b',
            fontSize: '16px'
          }}>
            {unreadCount > 0 
              ? `${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}`
              : 'All caught up!'
            }
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              style={{
                background: '#10b981',
                color: 'white',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '600',
                transition: 'all 0.3s ease'
              }}
            >
              📪 Mark All Read
            </button>
          )}
          <button
            onClick={onRefresh}
            style={{
              background: 'white',
              color: '#1e3c72',
              border: '1px solid #e1e8ed',
              padding: '10px 20px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '600',
              transition: 'all 0.3s ease'
            }}
          >
            🔄 Refresh
          </button>
        </div>
      </div>

      <div style={{
        background: 'white',
        borderRadius: '12px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
        border: '1px solid #e1e8ed',
        overflow: 'hidden'
      }}>
        {notifications.length === 0 ? (
          <div style={{
            padding: '60px 40px',
            textAlign: 'center',
            color: '#64748b'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '16px', opacity: '0.5' }}>🔔</div>
            <h3 style={{ margin: '0 0 8px 0', color: '#1e3c72' }}>No Notifications</h3>
            <p style={{ margin: 0 }}>You're all caught up! New notifications will appear here.</p>
          </div>
        ) : (
          <div>
            {notifications.map((notification) => (
              <div
                key={notification.id}
                style={{
                  padding: '20px',
                  borderBottom: '1px solid #e1e8ed',
                  background: notification.is_read ? 'white' : '#f0f9ff',
                  transition: 'all 0.3s ease',
                  position: 'relative'
                }}
                onMouseOver={(e) => {
                  e.target.style.background = notification.is_read ? '#f8fafc' : '#e0f2fe';
                }}
                onMouseOut={(e) => {
                  e.target.style.background = notification.is_read ? 'white' : '#f0f9ff';
                }}
              >
                {!notification.is_read && (
                  <div style={{
                    position: 'absolute',
                    left: '10px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: '8px',
                    height: '8px',
                    background: '#3b82f6',
                    borderRadius: '50%'
                  }}></div>
                )}
                
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  marginLeft: notification.is_read ? '0' : '15px'
                }}>
                  <div style={{ flex: 1 }}>
                    <h4 style={{
                      margin: '0 0 8px 0',
                      color: '#1e3c72',
                      fontSize: '16px',
                      fontWeight: '600'
                    }}>{notification.title}</h4>
                    <p style={{
                      margin: '0 0 12px 0',
                      color: '#64748b',
                      fontSize: '14px',
                      lineHeight: '1.5'
                    }}>{notification.message}</p>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '15px'
                    }}>
                      <span style={{
                        color: '#94a3b8',
                        fontSize: '12px',
                        fontWeight: '500'
                      }}>
                        {getTimeAgo(notification.created_at)}
                      </span>
                      {!notification.is_read && (
                        <button
                          onClick={() => markAsRead(notification.id)}
                          disabled={markingRead === notification.id}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: '#3b82f6',
                            cursor: 'pointer',
                            fontSize: '12px',
                            fontWeight: '500',
                            opacity: markingRead === notification.id ? 0.5 : 1
                          }}
                        >
                          {markingRead === notification.id ? 'Marking...' : 'Mark as read'}
                        </button>
                      )}
                    </div>
                  </div>
                  
                  {!notification.is_read && (
                    <div style={{
                      background: '#3b82f6',
                      color: 'white',
                      padding: '4px 8px',
                      borderRadius: '12px',
                      fontSize: '11px',
                      fontWeight: '600'
                    }}>
                      New
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;