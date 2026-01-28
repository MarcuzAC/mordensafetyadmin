import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Use the exact URL from the working API test
const API_URL = 'https://mordensafe.onrender.com';

const Login = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    email: 'admin@firesafety.mw',
    password: 'admin123'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [debugInfo, setDebugInfo] = useState('');

  useEffect(() => {
    console.log('Login component mounted');
    console.log('API_URL:', API_URL);
    console.log('onLogin callback:', typeof onLogin);
  }, []);

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
    setDebugInfo('Starting login...');

    console.log('=== LOGIN START ===');
    console.log('Email:', formData.email);
    console.log('Password length:', formData.password.length);

    try {
      setDebugInfo('Making request to: ' + `${API_URL}/api/auth/login`);
      
      // Use the EXACT configuration from the working curl command
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

      console.log('=== RESPONSE RECEIVED ===');
      console.log('Status:', response.status);
      console.log('Response data:', response.data);
      
      setDebugInfo(`Response received: ${response.status}`);

      if (response.data.access_token) {
        console.log('✅ Token received:', response.data.access_token.substring(0, 20) + '...');
        console.log('✅ User data:', response.data.user);
        
        // Store in localStorage
        localStorage.setItem('token', response.data.access_token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        
        console.log('✅ localStorage token set:', localStorage.getItem('token') ? 'YES' : 'NO');
        console.log('✅ localStorage user set:', localStorage.getItem('user') ? 'YES' : 'NO');
        
        setDebugInfo('Login successful! Token stored.');
        
        // Call the onLogin callback
        if (onLogin && typeof onLogin === 'function') {
          console.log('✅ Calling onLogin callback with user:', response.data.user);
          onLogin(response.data.user);
        } else {
          console.error('❌ onLogin is not a function:', onLogin);
          setDebugInfo(prev => prev + '\nWarning: onLogin callback issue');
        }
        
      } else {
        console.error('❌ No access_token in response');
        setError('Invalid response from server');
        setDebugInfo('No access_token in response');
      }
      
    } catch (err) {
      console.error('=== ERROR ===');
      console.error('Error object:', err);
      
      if (err.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error('Response data:', err.response.data);
        console.error('Response status:', err.response.status);
        console.error('Response headers:', err.response.headers);
        
        setDebugInfo(`Error ${err.response.status}: ${JSON.stringify(err.response.data)}`);
        
        if (err.response.status === 401 || err.response.status === 400) {
          setError('Invalid email or password');
        } else {
          setError(`Server error: ${err.response.status}`);
        }
      } else if (err.request) {
        // The request was made but no response was received
        console.error('No response received:', err.request);
        setDebugInfo('No response from server');
        setError('Cannot connect to server. Check your internet connection.');
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error('Request setup error:', err.message);
        setDebugInfo('Request error: ' + err.message);
        setError('Error: ' + err.message);
      }
      
      // Also log the full error for debugging
      console.error('Full error:', err.toJSON ? err.toJSON() : err);
      
    } finally {
      setLoading(false);
      console.log('=== LOGIN END ===');
      console.log('Loading:', loading);
      console.log('Error:', error);
      console.log('---');
    }
  };

  // Test function to verify API is working
  const testApiDirectly = async () => {
    console.log('=== TESTING API DIRECTLY ===');
    try {
      // Test with exact curl command format
      const response = await axios.post(
        `${API_URL}/api/auth/login`,
        {
          email: 'admin@firesafety.mw',
          password: 'admin123'
        },
        {
          headers: {
            'accept': 'application/json',
            'Content-Type': 'application/json'
          }
        }
      );
      console.log('✅ Direct test successful!');
      console.log('Response:', response.data);
      alert(`✅ API Test Successful!\nToken: ${response.data.access_token.substring(0, 20)}...`);
    } catch (err) {
      console.error('❌ Direct test failed:', err);
      alert('❌ API Test Failed: ' + err.message);
    }
  };

  // Clear localStorage for testing
  const clearStorage = () => {
    localStorage.clear();
    console.log('LocalStorage cleared');
    setDebugInfo('LocalStorage cleared');
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
      fontFamily: "'Poppins', sans-serif",
      color: '#fff',
      padding: '20px'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '500px',
        textAlign: 'center'
      }}>
        {/* Logo & Title */}
        <div style={{ marginBottom: '30px' }}>
          <div style={{
            width: '70px',
            height: '70px',
            margin: '0 auto 15px',
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: '700',
            fontSize: '26px',
            color: 'white',
            boxShadow: '0 0 15px rgba(255,255,255,0.1)',
          }}>MS</div>
          <h1 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '6px' }}>Modern Safety</h1>
          <p style={{ fontSize: '15px', opacity: '0.9' }}>Admin Dashboard</p>
        </div>

        

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ textAlign: 'left' }}>
          {error && (
            <div style={{
              background: 'rgba(255, 0, 0, 0.15)',
              color: '#ffbaba',
              padding: '12px',
              borderRadius: '6px',
              marginBottom: '20px',
              textAlign: 'center',
              fontSize: '14px'
            }}>{error}</div>
          )}

          <div style={{ marginBottom: '25px' }}>
            <label htmlFor="email" style={{
              display: 'block',
              fontWeight: '500',
              fontSize: '14px',
              marginBottom: '6px',
              color: 'rgba(255,255,255,0.85)'
            }}></label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Enter your email"
              style={{
                width: '100%',
                background: 'transparent',
                border: 'none',
                borderBottom: '2px solid rgba(255,255,255,0.3)',
                padding: '10px 4px',
                color: '#fff',
                fontSize: '15px',
                outline: 'none',
                transition: 'border-color 0.3s ease'
              }}
              onFocus={(e) => e.target.style.borderBottom = '2px solid #fff'}
              onBlur={(e) => e.target.style.borderBottom = '2px solid rgba(255,255,255,0.3)'}
            />
          </div>

          <div style={{ marginBottom: '25px' }}>
            <label htmlFor="password" style={{
              display: 'block',
              fontWeight: '500',
              fontSize: '14px',
              marginBottom: '6px',
              color: 'rgba(255,255,255,0.85)'
            }}>Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Enter your password"
              style={{
                width: '100%',
                background: 'transparent',
                border: 'none',
                borderBottom: '2px solid rgba(255,255,255,0.3)',
                padding: '10px 4px',
                color: '#fff',
                fontSize: '15px',
                outline: 'none',
                transition: 'border-color 0.3s ease'
              }}
              onFocus={(e) => e.target.style.borderBottom = '2px solid #fff'}
              onBlur={(e) => e.target.style.borderBottom = '2px solid rgba(255,255,255,0.3)'}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              background: '#fff',
              color: '#1e3c72',
              border: 'none',
              padding: '14px',
              borderRadius: '50px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s ease',
              opacity: loading ? 0.7 : 1,
              boxShadow: '0 4px 15px rgba(255,255,255,0.3)',
              marginBottom: '10px'
            }}
            onMouseOver={(e) => !loading && (e.target.style.transform = 'translateY(-2px)')}
            onMouseOut={(e) => !loading && (e.target.style.transform = 'translateY(0)')}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div style={{
          fontSize: '13px',
          color: 'rgba(255,255,255,0.85)',
          background: 'rgba(255,255,255,0.1)',
          padding: '15px',
          borderRadius: '8px'
        }}>
          
        </div>
      </div>
    </div>
  );
};

export default Login;