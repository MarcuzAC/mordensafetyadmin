import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { ordersAPI } from '../services/api';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    status: '',
    start_date: '',
    end_date: '',
    page: 1,
    limit: 20
  });
  const [totalPages, setTotalPages] = useState(1);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    completed: 0,
    cancelled: 0,
    revenue: 0
  });

  useEffect(() => {
    fetchOrders();
    fetchStats();
  }, [filters.page]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await ordersAPI.getAllOrders(filters);
      setOrders(response.data.orders);
      setTotalPages(response.data.pages || 1);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await api.get('/api/admin/stats');
      setStats({
        total: response.data.counts?.total_orders || 0,
        pending: response.data.counts?.pending_orders || 0,
        completed: 0, // You might need to calculate this
        cancelled: 0, // You might need to calculate this
        revenue: response.data.financials?.total_revenue || 0
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const updateOrderStatus = async (orderId, newStatus, notes = '') => {
    try {
      await ordersAPI.updateOrderStatus(orderId, {
        status: newStatus,
        completion_notes: notes
      });
      fetchOrders();
      alert(`Order status updated to ${newStatus}`);
    } catch (error) {
      console.error('Error updating order:', error);
      alert('Error updating order status');
    }
  };

  const updatePaymentStatus = async (orderId, newStatus) => {
    try {
      await ordersAPI.updatePaymentStatus(orderId, {
        payment_status: newStatus
      });
      fetchOrders();
      alert(`Payment status updated to ${newStatus}`);
    } catch (error) {
      console.error('Error updating payment:', error);
      alert('Error updating payment status');
    }
  };

  const generateInvoice = async (orderId) => {
    try {
      const response = await ordersAPI.generateInvoice(orderId);
      window.open(`http://localhost:8000${response.data.invoice_url}`, '_blank');
    } catch (error) {
      console.error('Error generating invoice:', error);
      alert('Error generating invoice');
    }
  };

  const applyFilters = () => {
    setFilters(prev => ({ ...prev, page: 1 }));
    fetchOrders();
  };

  const clearFilters = () => {
    setFilters({
      status: '',
      start_date: '',
      end_date: '',
      page: 1,
      limit: 20
    });
    fetchOrders();
  };

  if (loading && orders.length === 0) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '200px'
      }}>
        <div style={{ color: '#1e3c72' }}>Loading orders...</div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
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
          }}>Orders Management</h2>
          <p style={{
            margin: '0',
            color: '#64748b',
            fontSize: '16px'
          }}>Manage customer orders and track order status</p>
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          style={{
            background: 'white',
            color: '#1e3c72',
            border: '1px solid #e1e8ed',
            padding: '10px 20px',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '600',
            transition: 'all 0.3s ease',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          {showFilters ? '▲ Hide Filters' : '▼ Show Filters'}
        </button>
      </div>

      {/* Stats Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '20px',
        marginBottom: '30px'
      }}>
        <StatCard
          title="Total Orders"
          value={stats.total}
          icon="📦"
          color="#3b82f6"
        />
        <StatCard
          title="Pending"
          value={stats.pending}
          icon="⏳"
          color="#f59e0b"
        />
        <StatCard
          title="Completed"
          value={stats.completed}
          icon="✅"
          color="#10b981"
        />
        <StatCard
          title="Revenue (MK)"
          value={stats.revenue.toLocaleString()}
          icon="💰"
          color="#8b5cf6"
        />
      </div>

      {/* Filters */}
      {showFilters && (
        <div style={{
          background: 'white',
          padding: '25px',
          borderRadius: '12px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
          marginBottom: '25px',
          border: '1px solid #e1e8ed'
        }}>
          <h4 style={{
            margin: '0 0 20px 0',
            color: '#1e3c72',
            fontSize: '16px',
            fontWeight: '600'
          }}>Filter Orders</h4>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '20px',
            marginBottom: '20px'
          }}>
            <div>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                color: '#64748b',
                fontSize: '14px',
                fontWeight: '500'
              }}>Status</label>
              <select
                value={filters.status}
                onChange={(e) => setFilters({...filters, status: e.target.value})}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '1px solid #e1e8ed',
                  borderRadius: '6px',
                  fontSize: '14px'
                }}
              >
                <option value="">All Status</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            <div>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                color: '#64748b',
                fontSize: '14px',
                fontWeight: '500'
              }}>Start Date</label>
              <input
                type="date"
                value={filters.start_date}
                onChange={(e) => setFilters({...filters, start_date: e.target.value})}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '1px solid #e1e8ed',
                  borderRadius: '6px',
                  fontSize: '14px'
                }}
              />
            </div>
            <div>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                color: '#64748b',
                fontSize: '14px',
                fontWeight: '500'
              }}>End Date</label>
              <input
                type="date"
                value={filters.end_date}
                onChange={(e) => setFilters({...filters, end_date: e.target.value})}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '1px solid #e1e8ed',
                  borderRadius: '6px',
                  fontSize: '14px'
                }}
              />
            </div>
          </div>
          <div style={{
            display: 'flex',
            gap: '10px',
            justifyContent: 'flex-end'
          }}>
            <button
              onClick={clearFilters}
              style={{
                padding: '10px 20px',
                border: '1px solid #e1e8ed',
                borderRadius: '6px',
                background: 'white',
                color: '#64748b',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500'
              }}
            >
              Clear Filters
            </button>
            <button
              onClick={applyFilters}
              style={{
                padding: '10px 20px',
                background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '600'
              }}
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}

      {/* Orders Table */}
      <div style={{
        background: 'white',
        borderRadius: '12px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
        border: '1px solid #e1e8ed',
        overflow: 'hidden'
      }}>
        {orders.length === 0 ? (
          <div style={{
            padding: '40px',
            textAlign: 'center'
          }}>
            <div style={{
              fontSize: '48px',
              marginBottom: '16px',
              opacity: '0.5'
            }}>📦</div>
            <h3 style={{
              margin: '0 0 8px 0',
              color: '#1e3c72'
            }}>No Orders Found</h3>
            <p style={{
              margin: '0',
              color: '#64748b'
            }}>No orders match your current filters</p>
            <button
              onClick={clearFilters}
              style={{
                background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
                color: 'white',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '600',
                marginTop: '20px'
              }}
            >
              View All Orders
            </button>
          </div>
        ) : (
          <>
            <table style={{
              width: '100%',
              borderCollapse: 'collapse'
            }}>
              <thead>
                <tr style={{
                  background: '#f8fafc',
                  borderBottom: '1px solid #e1e8ed'
                }}>
                  <th style={{
                    padding: '16px 20px',
                    textAlign: 'left',
                    color: '#64748b',
                    fontSize: '14px',
                    fontWeight: '600',
                    whiteSpace: 'nowrap'
                  }}>Order #</th>
                  <th style={{
                    padding: '16px 20px',
                    textAlign: 'left',
                    color: '#64748b',
                    fontSize: '14px',
                    fontWeight: '600'
                  }}>Customer</th>
                  <th style={{
                    padding: '16px 20px',
                    textAlign: 'left',
                    color: '#64748b',
                    fontSize: '14px',
                    fontWeight: '600',
                    whiteSpace: 'nowrap'
                  }}>Date</th>
                  <th style={{
                    padding: '16px 20px',
                    textAlign: 'left',
                    color: '#64748b',
                    fontSize: '14px',
                    fontWeight: '600'
                  }}>Items</th>
                  <th style={{
                    padding: '16px 20px',
                    textAlign: 'left',
                    color: '#64748b',
                    fontSize: '14px',
                    fontWeight: '600'
                  }}>Total (MK)</th>
                  <th style={{
                    padding: '16px 20px',
                    textAlign: 'left',
                    color: '#64748b',
                    fontSize: '14px',
                    fontWeight: '600'
                  }}>Status</th>
                  <th style={{
                    padding: '16px 20px',
                    textAlign: 'left',
                    color: '#64748b',
                    fontSize: '14px',
                    fontWeight: '600'
                  }}>Payment</th>
                  <th style={{
                    padding: '16px 20px',
                    textAlign: 'left',
                    color: '#64748b',
                    fontSize: '14px',
                    fontWeight: '600'
                  }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <OrderRow
                    key={order.id}
                    order={order}
                    onSelect={setSelectedOrder}
                    onUpdateStatus={updateOrderStatus}
                    onUpdatePayment={updatePaymentStatus}
                    onGenerateInvoice={generateInvoice}
                  />
                ))}
              </tbody>
            </table>
            
            {/* Pagination */}
            {totalPages > 1 && (
              <div style={{
                padding: '20px',
                borderTop: '1px solid #e1e8ed',
                display: 'flex',
                justifyContent: 'center',
                gap: '10px'
              }}>
                <button
                  onClick={() => setFilters({...filters, page: Math.max(1, filters.page - 1)})}
                  disabled={filters.page === 1}
                  style={{
                    padding: '8px 16px',
                    border: '1px solid #e1e8ed',
                    borderRadius: '6px',
                    background: 'white',
                    color: filters.page === 1 ? '#cbd5e1' : '#64748b',
                    cursor: filters.page === 1 ? 'not-allowed' : 'pointer',
                    fontSize: '14px'
                  }}
                >
                  Previous
                </button>
                <span style={{
                  padding: '8px 16px',
                  color: '#64748b',
                  fontSize: '14px'
                }}>
                  Page {filters.page} of {totalPages}
                </span>
                <button
                  onClick={() => setFilters({...filters, page: Math.min(totalPages, filters.page + 1)})}
                  disabled={filters.page === totalPages}
                  style={{
                    padding: '8px 16px',
                    border: '1px solid #e1e8ed',
                    borderRadius: '6px',
                    background: 'white',
                    color: filters.page === totalPages ? '#cbd5e1' : '#64748b',
                    cursor: filters.page === totalPages ? 'not-allowed' : 'pointer',
                    fontSize: '14px'
                  }}
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <OrderDetailsModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onUpdateStatus={updateOrderStatus}
          onUpdatePayment={updatePaymentStatus}
          onGenerateInvoice={generateInvoice}
        />
      )}
    </div>
  );
};

// Stat Card Component
const StatCard = ({ title, value, icon, color }) => (
  <div style={{
    background: 'white',
    padding: '25px',
    borderRadius: '12px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
    border: '1px solid #e1e8ed',
    transition: 'all 0.3s ease'
  }}>
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: '15px'
    }}>
      <div style={{
        fontSize: '14px',
        color: '#64748b',
        fontWeight: '500'
      }}>
        {title}
      </div>
      <div style={{
        fontSize: '24px',
        color: color
      }}>
        {icon}
      </div>
    </div>
    <div style={{
      fontSize: '28px',
      color: '#1e3c72',
      fontWeight: '700',
      marginBottom: '5px'
    }}>
      {value}
    </div>
  </div>
);

// Order Row Component
const OrderRow = ({ order, onSelect, onUpdateStatus, onUpdatePayment, onGenerateInvoice }) => {
  const getStatusColor = (status) => {
    switch(status) {
      case 'pending': return '#f59e0b';
      case 'confirmed': return '#3b82f6';
      case 'processing': return '#8b5cf6';
      case 'shipped': return '#6366f1';
      case 'delivered': return '#10b981';
      case 'completed': return '#10b981';
      case 'cancelled': return '#ef4444';
      default: return '#64748b';
    }
  };

  const getPaymentColor = (status) => {
    switch(status) {
      case 'paid': return '#10b981';
      case 'pending': return '#f59e0b';
      case 'failed': return '#ef4444';
      case 'refunded': return '#8b5cf6';
      default: return '#64748b';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <tr style={{
      borderBottom: '1px solid #e1e8ed',
      cursor: 'pointer',
      transition: 'all 0.2s ease'
    }}
    onMouseOver={(e) => {
      e.target.parentElement.style.background = '#f8fafc';
    }}
    onMouseOut={(e) => {
      e.target.parentElement.style.background = 'white';
    }}
    onClick={() => onSelect(order)}
    >
      <td style={{
        padding: '16px 20px',
        color: '#1e3c72',
        fontWeight: '600',
        fontSize: '14px'
      }}>
        {order.order_number}
      </td>
      <td style={{
        padding: '16px 20px',
        fontSize: '14px'
      }}>
        <div style={{ fontWeight: '500', color: '#1e3c72' }}>
          {order.client_name}
        </div>
        <div style={{ color: '#64748b', fontSize: '13px', marginTop: '2px' }}>
          {order.client_phone}
        </div>
      </td>
      <td style={{
        padding: '16px 20px',
        color: '#64748b',
        fontSize: '14px',
        whiteSpace: 'nowrap'
      }}>
        {formatDate(order.created_at)}
      </td>
      <td style={{
        padding: '16px 20px',
        color: '#64748b',
        fontSize: '14px'
      }}>
        {order.items_count} item{order.items_count !== 1 ? 's' : ''}
      </td>
      <td style={{
        padding: '16px 20px',
        color: '#1e3c72',
        fontWeight: '600',
        fontSize: '14px'
      }}>
        MK {order.total_amount?.toLocaleString()}
      </td>
      <td style={{
        padding: '16px 20px',
        fontSize: '14px'
      }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          background: `${getStatusColor(order.status)}20`,
          color: getStatusColor(order.status),
          padding: '4px 12px',
          borderRadius: '20px',
          fontSize: '12px',
          fontWeight: '600'
        }}>
          <div style={{
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            background: getStatusColor(order.status),
            marginRight: '6px'
          }} />
          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
        </div>
      </td>
      <td style={{
        padding: '16px 20px',
        fontSize: '14px'
      }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          background: `${getPaymentColor(order.payment_status)}20`,
          color: getPaymentColor(order.payment_status),
          padding: '4px 12px',
          borderRadius: '20px',
          fontSize: '12px',
          fontWeight: '600'
        }}>
          <div style={{
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            background: getPaymentColor(order.payment_status),
            marginRight: '6px'
          }} />
          {order.payment_status.charAt(0).toUpperCase() + order.payment_status.slice(1)}
        </div>
      </td>
      <td style={{
        padding: '16px 20px',
        fontSize: '14px'
      }}>
        <div style={{
          display: 'flex',
          gap: '8px'
        }}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onGenerateInvoice(order.id);
            }}
            style={{
              background: '#3b82f6',
              color: 'white',
              border: 'none',
              padding: '6px 12px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '12px',
              fontWeight: '500'
            }}
          >
            Invoice
          </button>
        </div>
      </td>
    </tr>
  );
};

// Order Details Modal
const OrderDetailsModal = ({ order, onClose, onUpdateStatus, onUpdatePayment, onGenerateInvoice }) => {
  const [status, setStatus] = useState(order.status);
  const [paymentStatus, setPaymentStatus] = useState(order.payment_status);
  const [completionNotes, setCompletionNotes] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  const handleStatusUpdate = async () => {
    setIsUpdating(true);
    try {
      await onUpdateStatus(order.id, status, completionNotes);
      onClose();
    } catch (error) {
      console.error('Error updating status:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handlePaymentUpdate = async () => {
    setIsUpdating(true);
    try {
      await onUpdatePayment(order.id, paymentStatus);
      onClose();
    } catch (error) {
      console.error('Error updating payment:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '20px'
    }}>
      <div style={{
        background: 'white',
        borderRadius: '12px',
        padding: '30px',
        maxWidth: '800px',
        width: '100%',
        maxHeight: '90vh',
        overflowY: 'auto'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '25px'
        }}>
          <div>
            <h3 style={{
              margin: '0 0 5px 0',
              color: '#1e3c72',
              fontSize: '20px'
            }}>
              Order #{order.order_number}
            </h3>
            <p style={{
              margin: 0,
              color: '#64748b',
              fontSize: '14px'
            }}>
              Created: {formatDate(order.created_at)}
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '20px',
              cursor: 'pointer',
              color: '#64748b'
            }}
          >
            ✕
          </button>
        </div>

        {/* Order Info */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '30px',
          marginBottom: '30px'
        }}>
          <div>
            <h4 style={{
              margin: '0 0 15px 0',
              color: '#1e3c72',
              fontSize: '16px',
              fontWeight: '600'
            }}>Customer Information</h4>
            <div style={{
              background: '#f8fafc',
              padding: '20px',
              borderRadius: '8px',
              border: '1px solid #e1e8ed'
            }}>
              <div style={{ marginBottom: '10px' }}>
                <div style={{ color: '#64748b', fontSize: '13px' }}>Name</div>
                <div style={{ color: '#1e3c72', fontWeight: '500' }}>{order.client_name}</div>
              </div>
              <div style={{ marginBottom: '10px' }}>
                <div style={{ color: '#64748b', fontSize: '13px' }}>Email</div>
                <div style={{ color: '#1e3c72', fontWeight: '500' }}>{order.client_email}</div>
              </div>
              <div style={{ marginBottom: '10px' }}>
                <div style={{ color: '#64748b', fontSize: '13px' }}>Phone</div>
                <div style={{ color: '#1e3c72', fontWeight: '500' }}>{order.client_phone}</div>
              </div>
              <div>
                <div style={{ color: '#64748b', fontSize: '13px' }}>Shipping Address</div>
                <div style={{ color: '#1e3c72', fontWeight: '500' }}>{order.shipping_address}</div>
              </div>
            </div>
          </div>

          <div>
            <h4 style={{
              margin: '0 0 15px 0',
              color: '#1e3c72',
              fontSize: '16px',
              fontWeight: '600'
            }}>Order Summary</h4>
            <div style={{
              background: '#f8fafc',
              padding: '20px',
              borderRadius: '8px',
              border: '1px solid #e1e8ed'
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '8px'
              }}>
                <span style={{ color: '#64748b' }}>Subtotal</span>
                <span style={{ color: '#1e3c72', fontWeight: '500' }}>MK {order.subtotal?.toLocaleString()}</span>
              </div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '8px'
              }}>
                <span style={{ color: '#64748b' }}>Tax (16%)</span>
                <span style={{ color: '#1e3c72', fontWeight: '500' }}>MK {order.tax?.toLocaleString()}</span>
              </div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '8px'
              }}>
                <span style={{ color: '#64748b' }}>Shipping Fee</span>
                <span style={{ color: '#1e3c72', fontWeight: '500' }}>MK {order.shipping_fee?.toLocaleString()}</span>
              </div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                paddingTop: '10px',
                borderTop: '1px solid #e1e8ed',
                marginTop: '10px'
              }}>
                <span style={{ color: '#1e3c72', fontWeight: '600' }}>Total Amount</span>
                <span style={{ color: '#1e3c72', fontWeight: '700', fontSize: '18px' }}>
                  MK {order.total_amount?.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div style={{ marginBottom: '30px' }}>
          <h4 style={{
            margin: '0 0 15px 0',
            color: '#1e3c72',
            fontSize: '16px',
            fontWeight: '600'
          }}>Order Items</h4>
          <div style={{
            background: '#f8fafc',
            padding: '20px',
            borderRadius: '8px',
            border: '1px solid #e1e8ed'
          }}>
            {order.items?.map((item, index) => (
              <div
                key={index}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '15px 0',
                  borderBottom: index < order.items.length - 1 ? '1px solid #e1e8ed' : 'none'
                }}
              >
                <div>
                  <div style={{ color: '#1e3c72', fontWeight: '500', marginBottom: '5px' }}>
                    {item.product_name}
                  </div>
                  <div style={{ color: '#64748b', fontSize: '14px' }}>
                    {item.quantity} × MK {item.unit_price?.toLocaleString()}
                  </div>
                </div>
                <div style={{ color: '#1e3c72', fontWeight: '600' }}>
                  MK {item.total_price?.toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Status Management */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '30px',
          marginBottom: '30px'
        }}>
          <div>
            <h4 style={{
              margin: '0 0 15px 0',
              color: '#1e3c72',
              fontSize: '16px',
              fontWeight: '600'
            }}>Update Order Status</h4>
            <div style={{
              background: '#f8fafc',
              padding: '20px',
              borderRadius: '8px',
              border: '1px solid #e1e8ed'
            }}>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '1px solid #e1e8ed',
                  borderRadius: '6px',
                  fontSize: '14px',
                  marginBottom: '15px'
                }}
              >
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <textarea
                placeholder="Completion notes (optional)"
                value={completionNotes}
                onChange={(e) => setCompletionNotes(e.target.value)}
                rows="3"
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '1px solid #e1e8ed',
                  borderRadius: '6px',
                  fontSize: '14px',
                  marginBottom: '15px',
                  resize: 'vertical'
                }}
              />
              <button
                onClick={handleStatusUpdate}
                disabled={isUpdating}
                style={{
                  width: '100%',
                  padding: '12px',
                  background: isUpdating ? '#cbd5e1' : '#10b981',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: isUpdating ? 'not-allowed' : 'pointer',
                  fontSize: '14px',
                  fontWeight: '600'
                }}
              >
                {isUpdating ? 'Updating...' : 'Update Order Status'}
              </button>
            </div>
          </div>

          <div>
            <h4 style={{
              margin: '0 0 15px 0',
              color: '#1e3c72',
              fontSize: '16px',
              fontWeight: '600'
            }}>Update Payment Status</h4>
            <div style={{
              background: '#f8fafc',
              padding: '20px',
              borderRadius: '8px',
              border: '1px solid #e1e8ed'
            }}>
              <select
                value={paymentStatus}
                onChange={(e) => setPaymentStatus(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '1px solid #e1e8ed',
                  borderRadius: '6px',
                  fontSize: '14px',
                  marginBottom: '15px'
                }}
              >
                <option value="pending">Pending</option>
                <option value="paid">Paid</option>
                <option value="failed">Failed</option>
                <option value="refunded">Refunded</option>
                <option value="partially_paid">Partially Paid</option>
              </select>
              <button
                onClick={handlePaymentUpdate}
                disabled={isUpdating}
                style={{
                  width: '100%',
                  padding: '12px',
                  background: isUpdating ? '#cbd5e1' : '#3b82f6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: isUpdating ? 'not-allowed' : 'pointer',
                  fontSize: '14px',
                  fontWeight: '600'
                }}
              >
                {isUpdating ? 'Updating...' : 'Update Payment Status'}
              </button>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{
          display: 'flex',
          gap: '10px',
          justifyContent: 'flex-end'
        }}>
          <button
            onClick={() => onGenerateInvoice(order.id)}
            style={{
              padding: '10px 20px',
              background: '#8b5cf6',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '600'
            }}
          >
            Download Invoice
          </button>
          <button
            onClick={onClose}
            style={{
              padding: '10px 20px',
              border: '1px solid #e1e8ed',
              borderRadius: '6px',
              background: 'white',
              color: '#64748b',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500'
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default Orders;