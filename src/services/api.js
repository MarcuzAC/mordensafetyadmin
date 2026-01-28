import axios from 'axios';

//const API_BASE_URL = process.env.REACT_APP_API_URL;
const API_BASE_URL = "http://localhost:8000";

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/api/auth/login', credentials),
  register: (userData) => api.post('/api/auth/register', userData),
  getMe: () => api.get('/api/auth/me'),
};

// Service Requests API
export const requestsAPI = {
  // Get all requests (admin only)
  getAllRequests: () => api.get('/api/requests'),
  
  // Get my requests (client specific)
  getMyRequests: () => api.get('/api/requests/my-requests'),
  
  // Create new service request
  createRequest: (requestData) => api.post('/api/requests', requestData),
  
  // Update service request (admin only)
  updateRequest: (requestId, updateData) => 
    api.put(`/api/requests/${requestId}`, updateData),
  
  // Generate receipt for request
  generateReceipt: (requestId) => 
    api.get(`/api/requests/${requestId}/receipt`),
};

// Products API
export const productsAPI = {
  // Get all products (public)
  getProducts: (params = {}) => {
    const { category, available_only = true, page = 1, limit = 20 } = params;
    return api.get('/api/products', {
      params: { category, available_only, page, limit }
    });
  },
  
  // Get all products with admin privileges
  getAllProductsAdmin: (params = {}) => {
    const { category, page = 1, limit = 20 } = params;
    return api.get('/api/admin/products', {
      params: { category, page, limit }
    });
  },
  
  // Get single product details
  getProduct: (productId) => api.get(`/api/products/${productId}`),
  
  // Create new product (admin only)
  createProduct: (formData) => api.post('/api/admin/products', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  }),
  
  // Update product (admin only)
  updateProduct: (productId, formData) => 
    api.put(`/api/admin/products/${productId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }),
  
  // Delete product (admin only)
  deleteProduct: (productId) => api.delete(`/api/admin/products/${productId}`),
};

// Notifications API
export const notificationsAPI = {
  // Get user notifications
  getNotifications: () => api.get('/api/notifications'),
  
  // Mark notification as read
  markAsRead: (notificationId) => 
    api.put(`/api/notifications/${notificationId}/read`),
};

// Admin API
export const adminAPI = {
  // Get dashboard statistics
  getStats: () => api.get('/api/admin/stats'),
  
  // Get all users (you'll need to add this endpoint to your backend)
  getUsers: () => api.get('/api/admin/users'),
};

// File Upload Helper
export const uploadFile = async (file, onProgress = null) => {
  const formData = new FormData();
  formData.append('file', file);

  return api.post('/api/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    onUploadProgress: (progressEvent) => {
      if (onProgress && progressEvent.total) {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        onProgress(percentCompleted);
      }
    },
  });
};

// Export the main api instance as well
export default api;