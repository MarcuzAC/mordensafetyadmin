import React, { useState, useEffect } from 'react';
import api from '../services/api';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      // Note: You'll need to create this endpoint in your backend
      const response = await api.get('/api/admin/users');
      setUsers(response.data.users);
    } catch (error) {
      console.error('Error fetching users:', error);
      // Fallback mock data
      setUsers([
        {
          id: '1',
          email: 'admin@firesafety.mw',
          full_name: 'System Administrator',
          phone: '0999756168',
          role: 'admin',
          created_at: new Date().toISOString()
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const getRoleColor = (role) => {
    const colors = {
      admin: '#8b5cf6',
      client: '#3b82f6',
      user: '#64748b'
    };
    return colors[role] || '#64748b';
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '200px'
      }}>
        <div style={{ color: '#1e3c72' }}>Loading users...</div>
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
          }}>Users Management</h2>
          <p style={{
            margin: '0',
            color: '#64748b',
            fontSize: '16px'
          }}>Manage system users and their permissions</p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={fetchUsers}
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
          }}>System Users ({users.length})</h3>
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
                }}>User</th>
                <th style={{
                  padding: '15px',
                  textAlign: 'left',
                  color: '#64748b',
                  fontWeight: '600',
                  fontSize: '13px',
                  textTransform: 'uppercase'
                }}>Contact</th>
                <th style={{
                  padding: '15px',
                  textAlign: 'left',
                  color: '#64748b',
                  fontWeight: '600',
                  fontSize: '13px',
                  textTransform: 'uppercase'
                }}>Role</th>
                <th style={{
                  padding: '15px',
                  textAlign: 'left',
                  color: '#64748b',
                  fontWeight: '600',
                  fontSize: '13px',
                  textTransform: 'uppercase'
                }}>Joined</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr 
                  key={user.id}
                  style={{
                    borderBottom: '1px solid #e1e8ed',
                    transition: 'background 0.3s ease'
                  }}
                  onMouseOver={(e) => {
                    e.target.parentNode.style.background = '#f8fafc';
                  }}
                  onMouseOut={(e) => {
                    e.target.parentNode.style.background = 'white';
                  }}
                >
                  <td style={{ padding: '15px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{
                        width: '40px',
                        height: '40px',
                        background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontWeight: '600',
                        fontSize: '14px'
                      }}>
                        {user.full_name?.charAt(0) || 'U'}
                      </div>
                      <div>
                        <div style={{
                          fontWeight: '600',
                          color: '#1e3c72',
                          marginBottom: '2px'
                        }}>{user.full_name}</div>
                        <div style={{
                          fontSize: '13px',
                          color: '#64748b'
                        }}>{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '15px' }}>
                    <div style={{
                      color: '#374151',
                      fontSize: '14px'
                    }}>{user.phone || 'Not provided'}</div>
                  </td>
                  <td style={{ padding: '15px' }}>
                    <span style={{
                      background: `${getRoleColor(user.role)}20`,
                      color: getRoleColor(user.role),
                      padding: '6px 12px',
                      borderRadius: '20px',
                      fontSize: '12px',
                      fontWeight: '600',
                      textTransform: 'capitalize'
                    }}>
                      {user.role}
                    </span>
                  </td>
                  <td style={{ padding: '15px' }}>
                    <div style={{
                      color: '#64748b',
                      fontSize: '13px'
                    }}>
                      {new Date(user.created_at).toLocaleDateString()}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {users.length === 0 && (
          <div style={{
            padding: '40px',
            textAlign: 'center',
            color: '#64748b'
          }}>
            No users found
          </div>
        )}
      </div>

      {/* Role Statistics */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '20px',
        marginTop: '30px'
      }}>
        <div style={{
          background: 'white',
          padding: '20px',
          borderRadius: '12px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
          border: '1px solid #e1e8ed',
          textAlign: 'center'
        }}>
          <div style={{
            fontSize: '32px',
            color: '#8b5cf6',
            marginBottom: '8px'
          }}>{users.filter(u => u.role === 'admin').length}</div>
          <div style={{
            color: '#64748b',
            fontWeight: '600',
            fontSize: '14px'
          }}>Administrators</div>
        </div>
        <div style={{
          background: 'white',
          padding: '20px',
          borderRadius: '12px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
          border: '1px solid #e1e8ed',
          textAlign: 'center'
        }}>
          <div style={{
            fontSize: '32px',
            color: '#3b82f6',
            marginBottom: '8px'
          }}>{users.filter(u => u.role === 'client').length}</div>
          <div style={{
            color: '#64748b',
            fontWeight: '600',
            fontSize: '14px'
          }}>Clients</div>
        </div>
        <div style={{
          background: 'white',
          padding: '20px',
          borderRadius: '12px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
          border: '1px solid #e1e8ed',
          textAlign: 'center'
        }}>
          <div style={{
            fontSize: '32px',
            color: '#10b981',
            marginBottom: '8px'
          }}>{users.length}</div>
          <div style={{
            color: '#64748b',
            fontWeight: '600',
            fontSize: '14px'
          }}>Total Users</div>
        </div>
      </div>
    </div>
  );
};

export default Users;