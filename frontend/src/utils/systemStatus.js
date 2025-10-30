// System status checker utility
import { apiService } from '../config/api';

export const systemStatus = {
  // Check if backend is running
  async checkBackendStatus() {
    try {
      console.log('🔍 Testing backend connection...');
      const response = await apiService.test();
      console.log('✅ Backend connection successful:', response);
      return {
        status: 'online',
        message: response.message,
        timestamp: response.timestamp,
        origin: response.origin
      };
    } catch (error) {
      console.error('❌ Backend connection failed:', error);
      return {
        status: 'offline',
        message: 'Backend server is not responding',
        error: error.message
      };
    }
  },

  // Check if user is authenticated
  isAuthenticated() {
    return apiService.auth.isAuthenticated();
  },

  // Get current user
  getCurrentUser() {
    return apiService.auth.getCurrentUser();
  },

  // Check API connectivity
  async testConnectivity() {
    try {
      const startTime = Date.now();
      await apiService.health();
      const endTime = Date.now();
      
      return {
        connected: true,
        responseTime: endTime - startTime,
        message: 'API connection successful'
      };
    } catch (error) {
      return {
        connected: false,
        error: error.message,
        message: 'API connection failed'
      };
    }
  },

  // Get system information
  getSystemInfo() {
    return {
      frontendUrl: window.location.origin,
      backendUrl: apiService.utils.getBaseURL(),
      userAgent: navigator.userAgent,
      timestamp: new Date().toISOString(),
      isOnline: navigator.onLine
    };
  },

  // Log system status
  async logStatus() {
    const backendStatus = await this.checkBackendStatus();
    const connectivity = await this.testConnectivity();
    const systemInfo = this.getSystemInfo();
    
    console.group('🔍 System Status Check');
    console.log('Backend Status:', backendStatus);
    console.log('Connectivity:', connectivity);
    console.log('System Info:', systemInfo);
    console.log('Authentication:', this.isAuthenticated());
    console.groupEnd();
    
    return {
      backend: backendStatus,
      connectivity,
      system: systemInfo,
      authenticated: this.isAuthenticated()
    };
  }
};

export default systemStatus;
