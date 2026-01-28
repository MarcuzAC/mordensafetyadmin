import React from 'react';

const StatCard = ({ title, value, icon, color, subtitle }) => (
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
    }}
    onMouseOver={(e) => {
      e.currentTarget.style.transform = 'translateY(-6px)';
      e.currentTarget.style.boxShadow = '0 12px 25px rgba(30, 60, 114, 0.15)';
    }}
    onMouseOut={(e) => {
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.boxShadow = '0 4px 10px rgba(0, 0, 0, 0.06)';
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
        }}
      >
        {icon}
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
            }}
          >
            {subtitle}
          </p>
        )}
      </div>
    </div>
  </div>
);

const DashboardHome = ({ stats, onRefresh }) => {
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
            }}
          >
            Welcome to Morden Safety Admin Panel
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
          }}
          onMouseOver={(e) => (e.currentTarget.style.transform = 'translateY(-2px)')}
          onMouseOut={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
        >
          🔄 Refresh Data
        </button>
      </div>

      {/* Stats Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '24px',
          marginBottom: '35px',
        }}
      >
        <StatCard
          title="Total Requests"
          value={stats?.total_requests || 0}
          icon="📋"
          color="#3b82f6"
          subtitle="All service requests"
        />
        <StatCard
          title="Pending Requests"
          value={stats?.pending_requests || 0}
          icon="⏳"
          color="#f59e0b"
          subtitle="Awaiting action"
        />
        <StatCard
          title="Total Clients"
          value={stats?.total_clients || 0}
          icon="👥"
          color="#10b981"
          subtitle="Registered users"
        />
        <StatCard
          title="Products"
          value={stats?.total_products || 0}
          icon="📦"
          color="#8b5cf6"
          subtitle="In inventory"
        />
        <StatCard
          title="Low Stock"
          value={stats?.low_stock_products || 0}
          icon="⚠️"
          color="#ef4444"
          subtitle="Need restocking"
        />
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
            { label: 'View Requests', icon: '🔧', path: '/dashboard/requests' },
            { label: 'Manage Products', icon: '📦', path: '/dashboard/products' },
            { label: 'User Management', icon: '👥', path: '/dashboard/users' },
            { label: 'Check Notifications', icon: '🔔', path: '/dashboard/notifications' },
          ].map((action, index) => (
            <a
              key={index}
              href={action.path}
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
              <span style={{ fontSize: '18px' }}>{action.icon}</span>
              <span>{action.label}</span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
