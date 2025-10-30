import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: 'http://localhost:3005/api',
  timeout: 15000, // Increased timeout
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Enable credentials for CORS
});

// Request interceptor to add auth token and handle requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Add request timestamp for debugging
    config.metadata = { startTime: new Date() };
    
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors and responses
api.interceptors.response.use(
  (response) => {
    // Calculate request duration
    const duration = new Date() - response.config.metadata.startTime;
    console.log(`API Request completed in ${duration}ms:`, response.config.url);
    
    return response;
  },
  (error) => {
    const duration = new Date() - error.config?.metadata?.startTime;
    console.error(`API Request failed after ${duration}ms:`, error.config?.url, error.message);
    
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      // Redirect to login page
      if (window.location.pathname !== '/') {
        window.location.href = '/';
      }
    }
    
    // Handle network errors
    if (!error.response) {
      console.error('Network error - Backend server might be down');
    }
    
    return Promise.reject(error);
  }
);

// Enhanced API service with better error handling and features
export const apiService = {
  // Auth endpoints
  auth: {
    login: async (credentials) => {
      try {
        const response = await api.post('/auth/login', credentials);
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.error || 'Login failed');
      }
    },
    
    register: async (userData) => {
      try {
        const response = await api.post('/auth/register', userData);
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.error || 'Registration failed');
      }
    },
    
    logout: () => {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
    },
    
    // Check if user is authenticated
    isAuthenticated: () => {
      const token = localStorage.getItem('authToken');
      return !!token;
    },
    
    // Get current user from localStorage
    getCurrentUser: () => {
      const user = localStorage.getItem('user');
      return user ? JSON.parse(user) : null;
    }
  },

  // Properties endpoints with enhanced features
  properties: {
    getAll: async (filters = {}) => {
      try {
        const params = new URLSearchParams();
        Object.keys(filters).forEach(key => {
          if (filters[key] !== undefined && filters[key] !== null && filters[key] !== '') {
            params.append(key, filters[key]);
          }
        });
        
        const response = await api.get(`/properties?${params.toString()}`);
        return response.data;
      } catch (error) {
        console.error('Error fetching properties:', error);
        throw new Error('Failed to fetch properties');
      }
    },
    
    getById: async (id) => {
      try {
        const response = await api.get(`/properties/${id}`);
        return response.data;
      } catch (error) {
        console.error('Error fetching property:', error);
        throw new Error('Property not found');
      }
    },
    
    getNewArrivals: async (limit = 6) => {
      try {
        const response = await api.get(`/properties/new-arrivals/${limit}`);
        return response.data;
      } catch (error) {
        console.error('Error fetching new arrivals:', error);
        throw new Error('Failed to fetch new arrivals');
      }
    },
    
    create: async (propertyData) => {
      try {
        const response = await api.post('/properties', propertyData);
        return response.data;
      } catch (error) {
        console.error('Error creating property:', error);
        throw new Error(error.response?.data?.error || 'Failed to create property');
      }
    },
    
    update: async (id, propertyData) => {
      try {
        const response = await api.put(`/properties/${id}`, propertyData);
        return response.data;
      } catch (error) {
        console.error('Error updating property:', error);
        throw new Error(error.response?.data?.error || 'Failed to update property');
      }
    },
    
    delete: async (id) => {
      try {
        const response = await api.delete(`/properties/${id}`);
        return response.data;
      } catch (error) {
        console.error('Error deleting property:', error);
        throw new Error(error.response?.data?.error || 'Failed to delete property');
      }
    },
    
    getByOwner: async (ownerId) => {
      try {
        const response = await api.get(`/properties/owner/${ownerId}`);
        return response.data;
      } catch (error) {
        console.error('Error fetching owner properties:', error);
        throw new Error('Failed to fetch owner properties');
      }
    },
    
    search: async (query) => {
      try {
        const response = await api.get(`/properties?search=${encodeURIComponent(query)}`);
        return response.data;
      } catch (error) {
        console.error('Error searching properties:', error);
        throw new Error('Search failed');
      }
    },
    
    // Get featured properties
    getFeatured: async (limit = 6) => {
      try {
        const response = await api.get(`/properties?featured=true&limit=${limit}`);
        return response.data;
      } catch (error) {
        console.error('Error fetching featured properties:', error);
        throw new Error('Failed to fetch featured properties');
      }
    },
    
    // Get properties by type
    getByType: async (type, limit = 10) => {
      try {
        const response = await api.get(`/properties?type=${type}&limit=${limit}`);
        return response.data;
      } catch (error) {
        console.error('Error fetching properties by type:', error);
        throw new Error('Failed to fetch properties by type');
      }
    },
    
    // Get properties by emirate
    getByEmirate: async (emirate, limit = 10) => {
      try {
        const response = await api.get(`/properties?emirate=${emirate}&limit=${limit}`);
        return response.data;
      } catch (error) {
        console.error('Error fetching properties by emirate:', error);
        throw new Error('Failed to fetch properties by emirate');
      }
    }
  },

  // Leads endpoints with enhanced features
  leads: {
    getAll: async (filters = {}) => {
      try {
        const params = new URLSearchParams();
        Object.keys(filters).forEach(key => {
          if (filters[key] !== undefined && filters[key] !== null && filters[key] !== '') {
            params.append(key, filters[key]);
          }
        });
        
        const response = await api.get(`/leads?${params.toString()}`);
        return response.data;
      } catch (error) {
        console.error('Error fetching leads:', error);
        throw new Error('Failed to fetch leads');
      }
    },
    
    getById: async (id) => {
      try {
        const response = await api.get(`/leads/${id}`);
        return response.data;
      } catch (error) {
        console.error('Error fetching lead:', error);
        throw new Error('Lead not found');
      }
    },
    
    create: async (leadData) => {
      try {
        const response = await api.post('/leads', leadData);
        return response.data;
      } catch (error) {
        console.error('Error creating lead:', error);
        throw new Error(error.response?.data?.error || 'Failed to create lead');
      }
    },
    
    update: async (id, leadData) => {
      try {
        const response = await api.put(`/leads/${id}`, leadData);
        return response.data;
      } catch (error) {
        console.error('Error updating lead:', error);
        throw new Error(error.response?.data?.error || 'Failed to update lead');
      }
    },
    
    delete: async (id) => {
      try {
        const response = await api.delete(`/leads/${id}`);
        return response.data;
      } catch (error) {
        console.error('Error deleting lead:', error);
        throw new Error(error.response?.data?.error || 'Failed to delete lead');
      }
    },
    
    getByProperty: async (propertyId) => {
      try {
        const response = await api.get(`/leads/property/${propertyId}`);
        return response.data;
      } catch (error) {
        console.error('Error fetching property leads:', error);
        throw new Error('Failed to fetch property leads');
      }
    },
    
    // Update lead status
    updateStatus: async (id, status) => {
      try {
        const response = await api.put(`/leads/${id}`, { status });
        return response.data;
      } catch (error) {
        console.error('Error updating lead status:', error);
        throw new Error('Failed to update lead status');
      }
    }
  },

  // Users endpoints
  users: {
    getAll: async () => {
      try {
        const response = await api.get('/users');
        return response.data;
      } catch (error) {
        console.error('Error fetching users:', error);
        throw new Error('Failed to fetch users');
      }
    },
    
    getById: async (id) => {
      try {
        const response = await api.get(`/users/${id}`);
        return response.data;
      } catch (error) {
        console.error('Error fetching user:', error);
        throw new Error('User not found');
      }
    },
    
    update: async (id, userData) => {
      try {
        const response = await api.put(`/users/${id}`, userData);
        return response.data;
      } catch (error) {
        console.error('Error updating user:', error);
        throw new Error(error.response?.data?.error || 'Failed to update user');
      }
    },
    
    delete: async (id) => {
      try {
        const response = await api.delete(`/users/${id}`);
        return response.data;
      } catch (error) {
        console.error('Error deleting user:', error);
        throw new Error(error.response?.data?.error || 'Failed to delete user');
      }
    }
  },

  // Health check with detailed status
  health: async () => {
    try {
      const response = await api.get('/health');
      return response.data;
    } catch (error) {
      console.error('Health check failed:', error);
      throw new Error('Backend server is not responding');
    }
  },

  // Test connection endpoint
  test: async () => {
    try {
      const response = await api.get('/test');
      return response.data;
    } catch (error) {
      console.error('Connection test failed:', error);
      throw new Error('Cannot connect to backend server');
    }
  },

  // Utility functions
  utils: {
    // Check if backend is available
    isBackendAvailable: async () => {
      try {
        await api.get('/health');
        return true;
      } catch (error) {
        return false;
      }
    },
    
    // Get API base URL
    getBaseURL: () => api.defaults.baseURL,
    
    // Set auth token
    setAuthToken: (token) => {
      if (token) {
        localStorage.setItem('authToken', token);
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      } else {
        localStorage.removeItem('authToken');
        delete api.defaults.headers.common['Authorization'];
      }
    },
    
    // Clear all auth data
    clearAuth: () => {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      delete api.defaults.headers.common['Authorization'];
    }
  }
};

export default apiService;