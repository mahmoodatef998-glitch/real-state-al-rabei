// Quick connection test
import { apiService } from '../config/api';

export const testConnection = async () => {
  console.log('🔍 Testing connection to backend...');
  
  try {
    // Test basic connection
    const testResult = await apiService.test();
    console.log('✅ Connection test successful:', testResult);
    
    // Test health endpoint
    const healthResult = await apiService.health();
    console.log('✅ Health check successful:', healthResult);
    
    // Test properties endpoint
    const propertiesResult = await apiService.properties.getAll();
    console.log('✅ Properties endpoint successful:', propertiesResult.properties?.length || 0, 'properties found');
    
    return {
      success: true,
      test: testResult,
      health: healthResult,
      properties: propertiesResult.properties?.length || 0
    };
    
  } catch (error) {
    console.error('❌ Connection test failed:', error);
    console.error('Error details:', {
      message: error.message,
      code: error.code,
      response: error.response?.data,
      status: error.response?.status,
      config: error.config?.url
    });
    return {
      success: false,
      error: error.message
    };
  }
};

// Auto-test on import
if (typeof window !== 'undefined') {
  testConnection();
}
