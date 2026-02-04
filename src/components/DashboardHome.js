import React from 'react';
import { Link } from 'react-router-dom';

const StatCard = ({ title, value, color, subtitle, onClick }) => (
  <div
    style={{
      background: 'white',
      padding: '25px',
      borderRadius: '16px',
      boxShadow: '0 4px 10px rgba(0, 0, 0, 0.06)',
      border: '1px solid #e2e8f0',
      transition: 'all 0.3s ease',
      position: 'relative',
      overflow: 'hidden',
      fontFamily: "'Poppins', sans-serif",
      cursor: onClick ? 'pointer' : 'default',
    }}
    onClick={onClick}
    onMouseOver={(e) => {
      e.currentTarget.style.transform = 'translateY(-6px)';
      e.currentTarget.style.boxShadow = '0 12px 25px rgba(30, 60, 114, 0.15)';
      if (onClick) {
        e.currentTarget.style.borderColor = color;
      }
    }}
    onMouseOut={(e) => {
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.boxShadow = '0 4px 10px rgba(0, 0, 0, 0.06)';
      if (onClick) {
        e.currentTarget.style.borderColor = '#e2e8f0';
      }
    }}
  >
    <div
      style={{
        position: 'absolute',
        top: 0,
        right: 0,
        width: '90px',
        height: '90px',
        background: `${color}15`,
        borderBottomLeftRadius: '60%',
      }}
    ></div>

    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
      <div
        style={{
          width: '55px',
          height: '55px',
          background: `linear-gradient(135deg, ${color}, ${color}cc)`,
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '22px',
          color: 'white',
          flexShrink: 0,
          boxShadow: `0 4px 10px ${color}40`,
          fontFamily: "'Poppins', sans-serif",
        }}
      >
        {/* Icon removed */}
      </div>
      <div>
        <h3
          style={{
            margin: '0 0 6px 0',
            color: '#64748b',
            fontSize: '14px',
            fontWeight: '600',
            textTransform: 'uppercase',
            letterSpacing: '0.6px',
            fontFamily: "'Poppins', sans-serif",
          }}
        >
          {title}
        </h3>
        <p
          style={{
            margin: '0 0 4px 0',
            fontSize: '30px',
            fontWeight: '700',
            color: '#1e3c72',
            fontFamily: "'Poppins', sans-serif",
          }}
        >
          {value}
        </p>
        {subtitle && (
          <p
            style={{
              margin: 0,
              fontSize: '13px',
              color: '#94a3b8',
              fontWeight: '500',
              fontFamily: "'Poppins', sans-serif",
            }}
          >
            {subtitle}
          </p>
        )}
      </div>
    </div>
    {onClick && (
      <div
        style={{
          position: 'absolute',
          bottom: '10px',
          right: '15px',
          color: color,
          fontSize: '12px',
          fontWeight: '600',
          opacity: 0.8,
          fontFamily: "'Poppins', sans-serif",
        }}
      >
        Click to view →
      </div>
    )}
  </div>
);

const DashboardHome = ({ stats, onRefresh }) => {
  const financials = stats?.financials || {};
  const counts = stats?.counts || {};

  return (
    <div style={{ fontFamily: "'Poppins', sans-serif" }}>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '35px',
        }}
      >
        <div>
          <h2
            style={{
              margin: '0 0 8px 0',
              color: '#1e3c72',
              fontSize: '30px',
              fontWeight: '700',
              fontFamily: "'Poppins', sans-serif",
            }}
          >
            Dashboard Overview
          </h2>
          <p
            style={{
              margin: 0,
              color: '#64748b',
              fontSize: '15px',
              fontWeight: '500',
              fontFamily: "'Poppins', sans-serif",
            }}
          >
            Welcome to Modern Safety Admin Panel
          </p>
        </div>
        <button
          onClick={onRefresh}
          style={{
            background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
            color: 'white',
            border: 'none',
            padding: '10px 22px',
            borderRadius: '10px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '600',
            transition: 'all 0.3s ease',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 4px 10px rgba(30, 60, 114, 0.25)',
            fontFamily: "'Poppins', sans-serif",
          }}
          onMouseOver={(e) => (e.currentTarget.style.transform = 'translateY(-2px)')}
          onMouseOut={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
        >
          Refresh Data
        </button>
      </div>

      {/* Business Overview Section */}
      <div style={{ marginBottom: '35px' }}>
        <h3
          style={{
            margin: '0 0 20px 0',
            color: '#1e3c72',
            fontSize: '20px',
            fontWeight: '600',
            fontFamily: "'Poppins', sans-serif",
          }}
        >
          Business Overview
        </h3>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '24px',
            marginBottom: '35px',
          }}
        >
          {/* Service Requests */}
          <StatCard
            title="Service Requests"
            value={counts?.total_requests || 0}
            color="#3b82f6"
            subtitle={`${counts?.pending_requests || 0} pending`}
            onClick={() => window.location.href = '/dashboard/requests'}
          />
          
          {/* Orders */}
          <StatCard
            title="Orders"
            value={counts?.total_orders || 0}
            color="#10b981"
            subtitle={`${counts?.pending_orders || 0} pending`}
            onClick={() => window.location.href = '/dashboard/orders'}
          />
          
          {/* Clients */}
          <StatCard
            title="Total Clients"
            value={counts?.total_clients || 0}
            color="#8b5cf6"
            subtitle="Registered users"
          />
          
          {/* Products */}
          <StatCard
            title="Products"
            value={counts?.total_products || 0}
            color="#f59e0b"
            subtitle={`${counts?.low_stock_products || 0} low stock`}
            onClick={() => window.location.href = '/dashboard/products'}
          />
        </div>
      </div>

      {/* Financial Performance Section */}
      <div style={{ marginBottom: '35px' }}>
        <h3
          style={{
            margin: '0 0 20px 0',
            color: '#1e3c72',
            fontSize: '20px',
            fontWeight: '600',
            fontFamily: "'Poppins', sans-serif",
          }}
        >
          Financial Performance
        </h3>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '24px',
            marginBottom: '35px',
          }}
        >
          {/* Total Revenue */}
          <StatCard
            title="Total Revenue"
            value={`MK ${(financials?.total_revenue || 0).toLocaleString()}`}
            color="#10b981"
            subtitle="All time revenue"
            onClick={() => window.location.href = '/dashboard/revenue'}
          />
          
          {/* Order Revenue */}
          <StatCard
            title="Order Revenue"
            value={`MK ${(financials?.order_revenue || 0).toLocaleString()}`}
            color="#3b82f6"
            subtitle={`${counts?.order_count || 0} orders`}
          />
          
          {/* Service Revenue */}
          <StatCard
            title="Service Revenue"
            value={`MK ${(financials?.service_revenue || 0).toLocaleString()}`}
            color="#8b5cf6"
            subtitle={`${counts?.service_count || 0} services`}
          />
          
          {/* Net Profit */}
          <StatCard
            title="Net Profit"
            value={`MK ${(financials?.net_profit || 0).toLocaleString()}`}
            color={financials?.net_profit > 0 ? '#10b981' : '#ef4444'}
            subtitle={
              financials?.total_revenue ? 
                `${((financials.net_profit / financials.total_revenue) * 100).toFixed(1)}% margin` : 
                'Profit margin'
            }
          />
        </div>
      </div>

      {/* Quick Stats Cards */}
      <div style={{ marginBottom: '35px' }}>
        <h3
          style={{
            margin: '0 0 20px 0',
            color: '#1e3c72',
            fontSize: '20px',
            fontWeight: '600',
            fontFamily: "'Poppins', sans-serif",
          }}
        >
          Quick Stats
        </h3>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '20px',
          }}
        >
          {/* Expenses */}
          <StatCard
            title="Expenses"
            value={`MK ${(financials?.total_expenses || 0).toLocaleString()}`}
            color="#ef4444"
            subtitle={`${financials?.expense_count || 0} records`}
          />
          
          {/* Average Order */}
          <StatCard
            title="Avg Order"
            value={`MK ${counts?.order_count ? 
              Math.round(financials?.order_revenue / counts.order_count) : 
              '0'
            }`}
            color="#f59e0b"
            subtitle="Average order value"
          />
          
          {/* Recent Orders */}
          <StatCard
            title="Recent Orders"
            value={stats?.recent_orders?.length || 0}
            color="#8b5cf6"
            subtitle="Latest orders"
            onClick={() => window.location.href = '/dashboard/orders'}
          />
          
          {/* Recent Requests */}
          <StatCard
            title="Recent Requests"
            value={stats?.recent_requests?.length || 0}
            color="#3b82f6"
            subtitle="Latest requests"
            onClick={() => window.location.href = '/dashboard/requests'}
          />
        </div>
      </div>

      {/* Quick Actions */}
      <div
        style={{
          background: 'white',
          padding: '28px',
          borderRadius: '16px',
          boxShadow: '0 4px 10px rgba(0, 0, 0, 0.05)',
          border: '1px solid #e2e8f0',
        }}
      >
        <h3
          style={{
            margin: '0 0 20px 0',
            color: '#1e3c72',
            fontSize: '20px',
            fontWeight: '600',
            fontFamily: "'Poppins', sans-serif",
          }}
        >
          Quick Actions
        </h3>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '18px',
          }}
        >
          {[
            { label: 'View Orders', path: '/dashboard/orders' },
            { label: 'Manage Requests', path: '/dashboard/requests' },
            { label: 'Revenue Dashboard', path: '/dashboard/revenue' },
            { label: 'Manage Products', path: '/dashboard/products' },
            { label: 'User Management', path: '/dashboard/users' },
            { label: 'Check Notifications', path: '/dashboard/notifications' },
          ].map((action, index) => (
            <Link
              key={index}
              to={action.path}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '16px',
                background: '#f8fafc',
                borderRadius: '10px',
                textDecoration: 'none',
                color: '#1e3c72',
                fontWeight: '600',
                fontSize: '14px',
                border: '1px solid #e2e8f0',
                transition: 'all 0.3s ease',
                fontFamily: "'Poppins', sans-serif",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = 'linear-gradient(135deg, #1e3c72, #2a5298)';
                e.currentTarget.style.color = 'white';
                e.currentTarget.style.transform = 'translateY(-3px)';
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(30, 60, 114, 0.3)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = '#f8fafc';
                e.currentTarget.style.color = '#1e3c72';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <span>{action.label}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Activity Section */}
      {stats?.recent_orders?.length > 0 && (
        <div
          style={{
            background: 'white',
            padding: '28px',
            borderRadius: '16px',
            boxShadow: '0 4px 10px rgba(0, 0, 0, 0.05)',
            border: '1px solid #e2e8f0',
            marginTop: '35px',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '20px',
            }}
          >
            <h3
              style={{
                margin: 0,
                color: '#1e3c72',
                fontSize: '20px',
                fontWeight: '600',
                fontFamily: "'Poppins', sans-serif",
              }}
            >
              Recent Activity
            </h3>
            <Link
              to="/dashboard/orders"
              style={{
                color: '#3b82f6',
                textDecoration: 'none',
                fontSize: '14px',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                fontFamily: "'Poppins', sans-serif",
              }}
            >
              View All →
            </Link>
          </div>
          
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '20px',
            }}
          >
            {/* Recent Orders */}
            {stats.recent_orders.slice(0, 3).map((order, index) => (
              <div
                key={index}
                style={{
                  background: '#f8fafc',
                  padding: '20px',
                  borderRadius: '12px',
                  border: '1px solid #e2e8f0',
                  fontFamily: "'Poppins', sans-serif",
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '12px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div
                      style={{
                        width: '40px',
                        height: '40px',
                        background: '#10b98120',
                        borderRadius: '10px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#10b981',
                        fontSize: '18px',
                        fontFamily: "'Poppins', sans-serif",
                      }}
                    >
                      {/* Emoji removed */}
                    </div>
                    <div>
                      <div
                        style={{
                          fontWeight: '600',
                          color: '#1e3c72',
                          fontSize: '15px',
                          fontFamily: "'Poppins', sans-serif",
                        }}
                      >
                        Order #{order.order_number}
                      </div>
                      <div
                        style={{
                          color: '#64748b',
                          fontSize: '13px',
                          fontFamily: "'Poppins', sans-serif",
                        }}
                      >
                        {new Date(order.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <div
                    style={{
                      background: order.status === 'pending' ? '#f59e0b20' : 
                                 order.status === 'completed' ? '#10b98120' : '#3b82f620',
                      color: order.status === 'pending' ? '#f59e0b' : 
                             order.status === 'completed' ? '#10b981' : '#3b82f6',
                      padding: '6px 12px',
                      borderRadius: '20px',
                      fontSize: '12px',
                      fontWeight: '600',
                      textTransform: 'capitalize',
                      fontFamily: "'Poppins', sans-serif",
                    }}
                  >
                    {order.status}
                  </div>
                </div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <div>
                    <div style={{ color: '#64748b', fontSize: '13px', fontFamily: "'Poppins', sans-serif" }}>Customer</div>
                    <div style={{ fontWeight: '500', color: '#1e3c72', fontSize: '14px', fontFamily: "'Poppins', sans-serif" }}>
                      {order.client_name}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ color: '#64748b', fontSize: '13px', fontFamily: "'Poppins', sans-serif" }}>Amount</div>
                    <div style={{ fontWeight: '700', color: '#1e3c72', fontSize: '16px', fontFamily: "'Poppins', sans-serif" }}>
                      MK {order.total_amount?.toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardHome;