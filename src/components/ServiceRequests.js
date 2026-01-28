import React, { useState, useEffect } from 'react';
import api from '../services/api';

const ServiceRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState(null);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const response = await api.get('/api/requests');
      setRequests(response.data.requests);
    } catch (error) {
      console.error('Error fetching requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateRequestStatus = async (requestId, status) => {
    try {
      await api.put(`/api/requests/${requestId}`, { status });
      fetchRequests();
    } catch (error) {
      console.error('Error updating request:', error);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: '#f59e0b',
      in_progress: '#3b82f6',
      completed: '#10b981',
      cancelled: '#ef4444'
    };
    return colors[status] || '#64748b';
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '200px'
      }}>
        <div style={{ color: '#1e3c72' }}>Loading requests...</div>
      </div>
    );
  }

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
          }}>Service Requests</h2>
          <p style={{
            margin: '0',
            color: '#64748b',
            fontSize: '16px'
          }}>Manage and track all service requests</p>
        </div>
        <button
          onClick={fetchRequests}
          style={{
            background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
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
          🔄 Refresh
        </button>
      </div>

      <div style={{
        background: 'white',
        borderRadius: '12px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
        border: '1px solid #e1e8ed',
        overflow: 'hidden'
      }}>
        <div style={{
          padding: '20px',
          borderBottom: '1px solid #e1e8ed',
          background: '#f8fafc'
        }}>
          <h3 style={{
            margin: '0',
            color: '#1e3c72',
            fontSize: '18px',
            fontWeight: '600'
          }}>All Requests ({requests.length})</h3>
        </div>

        <div style={{ overflowX: 'auto' }}>
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
                  padding: '15px',
                  textAlign: 'left',
                  color: '#64748b',
                  fontWeight: '600',
                  fontSize: '13px',
                  textTransform: 'uppercase'
                }}>Request #</th>
                <th style={{
                  padding: '15px',
                  textAlign: 'left',
                  color: '#64748b',
                  fontWeight: '600',
                  fontSize: '13px',
                  textTransform: 'uppercase'
                }}>Service Type</th>
                <th style={{
                  padding: '15px',
                  textAlign: 'left',
                  color: '#64748b',
                  fontWeight: '600',
                  fontSize: '13px',
                  textTransform: 'uppercase'
                }}>Status</th>
                <th style={{
                  padding: '15px',
                  textAlign: 'left',
                  color: '#64748b',
                  fontWeight: '600',
                  fontSize: '13px',
                  textTransform: 'uppercase'
                }}>Date</th>
                <th style={{
                  padding: '15px',
                  textAlign: 'left',
                  color: '#64748b',
                  fontWeight: '600',
                  fontSize: '13px',
                  textTransform: 'uppercase'
                }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((request) => (
                <tr 
                  key={request.id}
                  style={{
                    borderBottom: '1px solid #e1e8ed',
                    transition: 'background 0.3s ease',
                    cursor: 'pointer'
                  }}
                  onMouseOver={(e) => {
                    e.target.parentNode.style.background = '#f8fafc';
                  }}
                  onMouseOut={(e) => {
                    e.target.parentNode.style.background = 'white';
                  }}
                  onClick={() => setSelectedRequest(request)}
                >
                  <td style={{ padding: '15px' }}>
                    <div style={{
                      fontWeight: '600',
                      color: '#1e3c72'
                    }}>{request.request_number}</div>
                  </td>
                  <td style={{ padding: '15px' }}>
                    <div style={{
                      fontWeight: '500',
                      color: '#374151'
                    }}>{request.service_type}</div>
                    <div style={{
                      fontSize: '12px',
                      color: '#64748b'
                    }}>{request.extinguisher_type}</div>
                  </td>
                  <td style={{ padding: '15px' }}>
                    <span style={{
                      background: `${getStatusColor(request.status)}20`,
                      color: getStatusColor(request.status),
                      padding: '6px 12px',
                      borderRadius: '20px',
                      fontSize: '12px',
                      fontWeight: '600',
                      textTransform: 'capitalize'
                    }}>
                      {request.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td style={{ padding: '15px' }}>
                    <div style={{
                      color: '#64748b',
                      fontSize: '13px'
                    }}>
                      {new Date(request.created_at).toLocaleDateString()}
                    </div>
                  </td>
                  <td style={{ padding: '15px' }}>
                    <select
                      value={request.status}
                      onChange={(e) => updateRequestStatus(request.id, e.target.value)}
                      style={{
                        padding: '6px 12px',
                        border: '1px solid #e1e8ed',
                        borderRadius: '6px',
                        fontSize: '12px',
                        background: 'white',
                        color: '#374151'
                      }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <option value="pending">Pending</option>
                      <option value="in_progress">In Progress</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {requests.length === 0 && (
          <div style={{
            padding: '40px',
            textAlign: 'center',
            color: '#64748b'
          }}>
            No service requests found
          </div>
        )}
      </div>

      {/* Request Detail Modal */}
      {selectedRequest && (
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
            maxWidth: '600px',
            width: '100%',
            maxHeight: '80vh',
            overflowY: 'auto'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '20px'
            }}>
              <h3 style={{
                margin: 0,
                color: '#1e3c72',
                fontSize: '20px'
              }}>Request Details</h3>
              <button
                onClick={() => setSelectedRequest(null)}
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

            <div style={{
              display: 'grid',
              gap: '15px'
            }}>
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '15px'
              }}>
                <div>
                  <label style={{
                    display: 'block',
                    color: '#64748b',
                    fontSize: '12px',
                    fontWeight: '600',
                    marginBottom: '5px'
                  }}>Request Number</label>
                  <div style={{
                    color: '#1e3c72',
                    fontWeight: '600'
                  }}>{selectedRequest.request_number}</div>
                </div>
                <div>
                  <label style={{
                    display: 'block',
                    color: '#64748b',
                    fontSize: '12px',
                    fontWeight: '600',
                    marginBottom: '5px'
                  }}>Status</label>
                  <span style={{
                    background: `${getStatusColor(selectedRequest.status)}20`,
                    color: getStatusColor(selectedRequest.status),
                    padding: '4px 8px',
                    borderRadius: '12px',
                    fontSize: '11px',
                    fontWeight: '600',
                    textTransform: 'capitalize'
                  }}>
                    {selectedRequest.status.replace('_', ' ')}
                  </span>
                </div>
              </div>

              <div>
                <label style={{
                  display: 'block',
                  color: '#64748b',
                  fontSize: '12px',
                  fontWeight: '600',
                  marginBottom: '5px'
                }}>Service Type</label>
                <div style={{ color: '#374151' }}>{selectedRequest.service_type}</div>
              </div>

              {selectedRequest.extinguisher_type && (
                <div>
                  <label style={{
                    display: 'block',
                    color: '#64748b',
                    fontSize: '12px',
                    fontWeight: '600',
                    marginBottom: '5px'
                  }}>Extinguisher Type</label>
                  <div style={{ color: '#374151' }}>{selectedRequest.extinguisher_type}</div>
                </div>
              )}

              {selectedRequest.description && (
                <div>
                  <label style={{
                    display: 'block',
                    color: '#64748b',
                    fontSize: '12px',
                    fontWeight: '600',
                    marginBottom: '5px'
                  }}>Description</label>
                  <div style={{ 
                    color: '#374151',
                    background: '#f8fafc',
                    padding: '10px',
                    borderRadius: '6px',
                    fontSize: '14px'
                  }}>{selectedRequest.description}</div>
                </div>
              )}

              <div>
                <label style={{
                  display: 'block',
                  color: '#64748b',
                  fontSize: '12px',
                  fontWeight: '600',
                  marginBottom: '5px'
                }}>Address</label>
                <div style={{ color: '#374151' }}>{selectedRequest.address}</div>
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '15px'
              }}>
                <div>
                  <label style={{
                    display: 'block',
                    color: '#64748b',
                    fontSize: '12px',
                    fontWeight: '600',
                    marginBottom: '5px'
                  }}>Quantity</label>
                  <div style={{ color: '#374151' }}>{selectedRequest.quantity || 1}</div>
                </div>
                {selectedRequest.quote_amount && (
                  <div>
                    <label style={{
                      display: 'block',
                      color: '#64748b',
                      fontSize: '12px',
                      fontWeight: '600',
                      marginBottom: '5px'
                    }}>Quote Amount</label>
                    <div style={{ 
                      color: '#10b981',
                      fontWeight: '600'
                    }}>MK {selectedRequest.quote_amount.toLocaleString()}</div>
                  </div>
                )}
              </div>

              <div>
                <label style={{
                  display: 'block',
                  color: '#64748b',
                  fontSize: '12px',
                  fontWeight: '600',
                  marginBottom: '5px'
                }}>Created Date</label>
                <div style={{ color: '#374151' }}>
                  {new Date(selectedRequest.created_at).toLocaleString()}
                </div>
              </div>
            </div>

            <div style={{
              display: 'flex',
              gap: '10px',
              marginTop: '25px',
              justifyContent: 'flex-end'
            }}>
              <select
                value={selectedRequest.status}
                onChange={(e) => {
                  updateRequestStatus(selectedRequest.id, e.target.value);
                  setSelectedRequest({
                    ...selectedRequest,
                    status: e.target.value
                  });
                }}
                style={{
                  padding: '8px 16px',
                  border: '1px solid #e1e8ed',
                  borderRadius: '6px',
                  fontSize: '14px',
                  background: 'white',
                  color: '#374151'
                }}
              >
                <option value="pending">Pending</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <button
                onClick={() => setSelectedRequest(null)}
                style={{
                  padding: '8px 16px',
                  border: '1px solid #e1e8ed',
                  borderRadius: '6px',
                  background: 'white',
                  color: '#64748b',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServiceRequests;