import React, { createContext, useContext, useState } from 'react';

const SearchContext = createContext();

export const useSearch = () => {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
};

export const SearchProvider = ({ children }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    type: 'all',
    location: 'all',
    minPrice: '',
    maxPrice: '',
    bedrooms: '',
    sort: 'newest'
  });

  const updateFilters = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const resetFilters = () => {
    setFilters({
      type: 'all',
      location: 'all',
      minPrice: '',
      maxPrice: '',
      bedrooms: '',
      sort: 'newest'
    });
    setSearchQuery('');
  };

  const getFilterParams = () => {
    const params = {};
    
    if (searchQuery) params.search = searchQuery;
    if (filters.type !== 'all') params.type = filters.type;
    if (filters.location !== 'all') params.location = filters.location;
    if (filters.minPrice) params.minPrice = parseInt(filters.minPrice);
    if (filters.maxPrice) params.maxPrice = parseInt(filters.maxPrice);
    if (filters.bedrooms) params.bedrooms = parseInt(filters.bedrooms);
    if (filters.sort !== 'newest') params.sort = filters.sort;

    return params;
  };

  const value = {
    searchQuery,
    setSearchQuery,
    filters,
    updateFilters,
    resetFilters,
    getFilterParams,
  };

  return (
    <SearchContext.Provider value={value}>
      {children}
    </SearchContext.Provider>
  );
};
