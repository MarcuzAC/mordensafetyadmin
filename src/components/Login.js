import React, { useState } from 'react';
import axios from 'axios';
import { Shield, LogIn } from 'lucide-react';

const Login = ({ onLogin }) => {
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post(
        `${API_URL}/api/auth/login`,
        formData,
        {
          headers: {
            'accept': 'application/json',
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.access_token) {
        localStorage.setItem('token', response.data.access_token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        
        if (onLogin && typeof onLogin === 'function') {
          onLogin(response.data.user);
        }
      } else {
        setError('Invalid response from server');
      }
      
    } catch (err) {
      if (err.response) {
        if (err.response.status === 401 || err.response.status === 400) {
          setError('Invalid email or password');
        } else {
          setError(`Server error: ${err.response.status}`);
        }
      } else if (err.request) {
        setError('Cannot connect to server. Check your internet connection.');
      } else {
        setError('An error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      fontFamily: "'Poppins', sans-serif",
      backgroundColor: '#fafafa'
    }}>
      {/* Left Blue Section */}
      <div style={{
        flex: 1,
        background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px',
        color: 'white'
      }}>
        <div style={{
          maxWidth: '400px',
          textAlign: 'center'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '24px'
          }}>
            <Shield size={48} style={{ marginRight: '12px' }} />
            <h1 style={{
              fontSize: '32px',
              fontWeight: '700',
              letterSpacing: '-0.5px',
              fontFamily: "'Poppins', sans-serif"
            }}>Modern Safety</h1>
          </div>
          <p style={{
            fontSize: '18px',
            opacity: 0.9,
            lineHeight: 1.6,
            marginBottom: '32px',
            fontFamily: "'Poppins', sans-serif"
          }}>
            Secure Admin Dashboard
          </p>
          <div style={{
            fontSize: '14px',
            opacity: 0.7,
            borderTop: '1px solid rgba(255,255,255,0.1)',
            paddingTop: '20px',
            marginTop: '20px',
            fontFamily: "'Poppins', sans-serif"
          }}>
            &copy; {new Date().getFullYear()} Modern Safety. All rights reserved.
          </div>
        </div>
      </div>

      {/* Right Login Form Section */}
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px',
        backgroundColor: '#fafafa'
      }}>
        <div style={{
          width: '100%',
          maxWidth: '380px'
        }}>
          <div style={{
            marginBottom: '40px'
          }}>
            <h2 style={{
              fontSize: '28px',
              fontWeight: '600',
              color: '#1a1a1a',
              marginBottom: '8px',
              fontFamily: "'Poppins', sans-serif"
            }}>Welcome Back</h2>
            <p style={{
              fontSize: '15px',
              color: '#666',
              fontFamily: "'Poppins', sans-serif"
            }}>Sign in to your account</p>
          </div>

          {error && (
            <div style={{
              background: '#fee',
              color: '#c33',
              padding: '12px 16px',
              borderRadius: '8px',
              marginBottom: '24px',
              fontSize: '14px',
              border: '1px solid #fcc',
              fontFamily: "'Poppins', sans-serif"
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Email Input - Just a line */}
            <div style={{ marginBottom: '28px' }}>
              <label htmlFor="email" style={{
                display: 'block',
                fontWeight: '500',
                fontSize: '14px',
                marginBottom: '8px',
                color: '#333',
                fontFamily: "'Poppins', sans-serif"
              }}></label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="Enter Admin Email Address"
                style={{
                  width: '100%',
                  background: 'transparent',
                  border: 'none',
                  borderBottom: '2px solid #e1e5e9',
                  padding: '12px 0',
                  color: '#1a1a1a',
                  fontSize: '16px',
                  outline: 'none',
                  transition: 'all 0.2s ease',
                  boxSizing: 'border-box',
                  fontFamily: "'Poppins', sans-serif"
                }}
                onFocus={(e) => e.target.style.borderBottomColor = '#1e3c72'}
                onBlur={(e) => e.target.style.borderBottomColor = '#e1e5e9'}
              />
            </div>

            {/* Password Input - Just a line */}
            <div style={{ marginBottom: '32px' }}>
              <label htmlFor="password" style={{
                display: 'block',
                fontWeight: '500',
                fontSize: '14px',
                marginBottom: '8px',
                color: '#333',
                fontFamily: "'Poppins', sans-serif"
              }}></label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="Enter Admin Password"
                style={{
                  width: '100%',
                  background: 'transparent',
                  border: 'none',
                  borderBottom: '2px solid #e1e5e9',
                  padding: '12px 0',
                  color: '#1a1a1a',
                  fontSize: '16px',
                  outline: 'none',
                  transition: 'all 0.2s ease',
                  boxSizing: 'border-box',
                  fontFamily: "'Poppins', sans-serif"
                }}
                onFocus={(e) => e.target.style.borderBottomColor = '#1e3c72'}
                onBlur={(e) => e.target.style.borderBottomColor = '#e1e5e9'}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
                color: 'white',
                border: 'none',
                padding: '16px',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s ease',
                opacity: loading ? 0.7 : 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '12px',
                marginTop: '8px',
                fontFamily: "'Poppins', sans-serif"
              }}
              onMouseOver={(e) => !loading && (e.target.style.transform = 'translateY(-2px)')}
              onMouseOut={(e) => !loading && (e.target.style.transform = 'translateY(0)')}
            >
              {loading ? (
                <>
                  <div style={{
                    width: '20px',
                    height: '20px',
                    border: '2px solid rgba(255,255,255,0.3)',
                    borderTop: '2px solid white',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                  }} />
                  <span style={{ fontFamily: "'Poppins', sans-serif" }}>Signing in...</span>
                </>
              ) : (
                <>
                  <LogIn size={20} />
                  <span style={{ fontFamily: "'Poppins', sans-serif" }}>Sign In</span>
                </>
              )}
            </button>
          </form>

          
        </div>
      </div>

      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
          
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          
          input::placeholder {
            color: #999;
            font-size: 14px;
            font-family: 'Poppins', sans-serif;
          }
          
          button:disabled {
            cursor: not-allowed;
          }
        `}
      </style>
    </div>
  );
};

export default Login;