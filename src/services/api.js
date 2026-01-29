import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL;
//const API_BASE_URL = "http://localhost:8000";

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
  getAllRequests: (status) => api.get('/api/requests', { params: { status } }),
  
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
  
  // Update quote for service request (admin only)
  updateQuote: (requestId, quoteAmount) =>
    api.put(`/api/requests/${requestId}/quote`, { quote_amount: quoteAmount }),
  
  // Complete service payment (admin only)
  completeServicePayment: (requestId, paymentData) =>
    api.put(`/api/requests/${requestId}/complete-payment`, paymentData),
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
  
  // Helper function to get full image URL
  getFullImageUrl: (imagePath) => {
    if (!imagePath) return null;
    if (imagePath.startsWith('http')) return imagePath;
    return `${API_BASE_URL}${imagePath}`;
  },
};

// Orders API
export const ordersAPI = {
  // Client: Checkout from cart
  checkout: (orderData) => api.post('/api/orders/checkout', orderData),
  
  // Client: Get my orders
  getMyOrders: () => api.get('/api/orders/my-orders'),
  
  // Client/Admin: Get single order details
  getOrder: (orderId) => api.get(`/api/orders/${orderId}`),
  
  // Admin: Get all orders
  getAllOrders: (params = {}) => {
    const { status, start_date, end_date, page = 1, limit = 20 } = params;
    return api.get('/api/orders', {
      params: { status, start_date, end_date, page, limit }
    });
  },
  
  // Admin: Update order status
  updateOrderStatus: (orderId, statusData) =>
    api.put(`/api/orders/${orderId}/status`, statusData),
  
  // Admin: Update payment status
  updatePaymentStatus: (orderId, paymentData) =>
    api.put(`/api/orders/${orderId}/payment`, paymentData),
  
  // Generate invoice for order
  generateInvoice: (orderId) => api.get(`/api/orders/${orderId}/invoice`),
};

// Transactions API
export const transactionsAPI = {
  // Admin: Get all transactions
  getAllTransactions: (params = {}) => {
    const { type, start_date, end_date, page = 1, limit = 20 } = params;
    return api.get('/api/transactions', {
      params: { type, start_date, end_date, page, limit }
    });
  },
  
  // Admin: Get revenue summary
  getRevenueSummary: (period = 'month') => 
    api.get('/api/transactions/revenue-summary', { params: { period } }),
};

// Expenses API
export const expensesAPI = {
  // Admin: Get all expenses
  getAllExpenses: (params = {}) => {
    const { category, status, start_date, end_date, page = 1, limit = 20 } = params;
    return api.get('/api/expenses', {
      params: { category, status, start_date, end_date, page, limit }
    });
  },
  
  // Admin: Create new expense
  createExpense: (formData) => api.post('/api/expenses', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  }),
  
  // Admin: Update expense
  updateExpense: (expenseId, formData) =>
    api.put(`/api/expenses/${expenseId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }),
  
  // Admin: Delete expense
  deleteExpense: (expenseId) => api.delete(`/api/expenses/${expenseId}`),
};

// Notifications API
export const notificationsAPI = {
  // Get user notifications
  getNotifications: () => api.get('/api/notifications'),
  
  // Mark notification as read
  markAsRead: (notificationId) => 
    api.put(`/api/notifications/${notificationId}/read`),
};

// Admin Dashboard API
export const adminAPI = {
  // Get comprehensive dashboard statistics
  getStats: (params = {}) => {
    const { start_date, end_date } = params;
    return api.get('/api/admin/stats', { params: { start_date, end_date } });
  },
  
  // Get all users
  getUsers: () => api.get('/api/admin/users'),
  
  // Quick stats endpoints for dashboard widgets
  getQuickStats: async () => {
    const [stats, revenue] = await Promise.all([
      api.get('/api/admin/stats'),
      api.get('/api/transactions/revenue-summary', { params: { period: 'month' } })
    ]);
    
    return {
      counts: stats.data.counts,
      financials: revenue.data,
      recentOrders: stats.data.recent_orders,
      recentRequests: stats.data.recent_requests,
      salesTrends: stats.data.sales_trends
    };
  },
};

// Cart Helper Functions (for localStorage)
export const cartAPI = {
  getCart: () => {
    const cart = localStorage.getItem('cart');
    return cart ? JSON.parse(cart) : [];
  },
  
  addToCart: (product, quantity = 1) => {
    const cart = cartAPI.getCart();
    const existingItemIndex = cart.findIndex(item => item.id === product.id);
    
    if (existingItemIndex > -1) {
      cart[existingItemIndex].quantity += quantity;
    } else {
      cart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: quantity,
        images: product.images || [],
        stock_quantity: product.stock_quantity
      });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    return cart;
  },
  
  updateQuantity: (productId, quantity) => {
    const cart = cartAPI.getCart();
    const itemIndex = cart.findIndex(item => item.id === productId);
    
    if (itemIndex > -1) {
      if (quantity <= 0) {
        cart.splice(itemIndex, 1);
      } else {
        cart[itemIndex].quantity = quantity;
      }
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    return cart;
  },
  
  removeFromCart: (productId) => {
    const cart = cartAPI.getCart();
    const filteredCart = cart.filter(item => item.id !== productId);
    localStorage.setItem('cart', JSON.stringify(filteredCart));
    return filteredCart;
  },
  
  clearCart: () => {
    localStorage.removeItem('cart');
    return [];
  },
  
  getCartTotal: () => {
    const cart = cartAPI.getCart();
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  },
  
  getCartCount: () => {
    const cart = cartAPI.getCart();
    return cart.reduce((total, item) => total + item.quantity, 0);
  }
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

// Utility function to handle API errors
export const handleApiError = (error) => {
  if (error.response) {
    // Server responded with error
    return {
      message: error.response.data.detail || 'An error occurred',
      status: error.response.status,
      data: error.response.data
    };
  } else if (error.request) {
    // No response received
    return {
      message: 'Network error. Please check your connection.',
      status: 0
    };
  } else {
    // Request setup error
    return {
      message: error.message || 'An error occurred',
      status: 500
    };
  }
};

// Export the main api instance as well
export default api;