// Property service using localStorage
import { initializeMockData } from '../data/mockData';

// Initialize mock data
initializeMockData();

// Get all properties
export const getAllProperties = (filters = {}) => {
  try {
    const properties = JSON.parse(localStorage.getItem('properties') || '[]');
    
    let filteredProperties = [...properties];
    
    // Apply filters
    if (filters.type) {
      filteredProperties = filteredProperties.filter(p => p.type === filters.type);
    }
    
    if (filters.location) {
      filteredProperties = filteredProperties.filter(p => 
        p.location.toLowerCase().includes(filters.location.toLowerCase())
      );
    }
    
    if (filters.minPrice) {
      filteredProperties = filteredProperties.filter(p => p.price >= filters.minPrice);
    }
    
    if (filters.maxPrice) {
      filteredProperties = filteredProperties.filter(p => p.price <= filters.maxPrice);
    }
    
    if (filters.bedrooms) {
      filteredProperties = filteredProperties.filter(p => p.bedrooms >= filters.bedrooms);
    }
    
    // Sort by newest first
    if (filters.sort === 'newest') {
      filteredProperties.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
    
    return {
      success: true,
      properties: filteredProperties
    };
  } catch (error) {
    console.error('Error getting properties:', error);
    return {
      success: false,
      error: 'Failed to get properties'
    };
  }
};

// Get property by ID
export const getPropertyById = (id) => {
  try {
    const properties = JSON.parse(localStorage.getItem('properties') || '[]');
    const property = properties.find(p => p.id === parseInt(id));
    
    if (property) {
      return {
        success: true,
        property
      };
    } else {
      return {
        success: false,
        error: 'Property not found'
      };
    }
  } catch (error) {
    console.error('Error getting property:', error);
    return {
      success: false,
      error: 'Failed to get property'
    };
  }
};

// Get new arrivals
export const getNewArrivals = (limit = 6) => {
  try {
    const properties = JSON.parse(localStorage.getItem('properties') || '[]');
    const newArrivals = properties
      .filter(p => p.isNew)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, limit);
    
    return {
      success: true,
      properties: newArrivals
    };
  } catch (error) {
    console.error('Error getting new arrivals:', error);
    return {
      success: false,
      error: 'Failed to get new arrivals'
    };
  }
};

// Get featured properties
export const getFeaturedProperties = (limit = 6) => {
  try {
    const properties = JSON.parse(localStorage.getItem('properties') || '[]');
    const featured = properties
      .filter(p => p.isFeatured)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, limit);
    
    return {
      success: true,
      properties: featured
    };
  } catch (error) {
    console.error('Error getting featured properties:', error);
    return {
      success: false,
      error: 'Failed to get featured properties'
    };
  }
};

// Search properties
export const searchProperties = (query) => {
  try {
    const properties = JSON.parse(localStorage.getItem('properties') || '[]');
    const searchResults = properties.filter(p => 
      p.title.toLowerCase().includes(query.toLowerCase()) ||
      p.description.toLowerCase().includes(query.toLowerCase()) ||
      p.location.toLowerCase().includes(query.toLowerCase())
    );
    
    return {
      success: true,
      properties: searchResults
    };
  } catch (error) {
    console.error('Error searching properties:', error);
    return {
      success: false,
      error: 'Failed to search properties'
    };
  }
};
