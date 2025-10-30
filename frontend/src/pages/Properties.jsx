import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSearch } from '../context/SearchContext';
import PropertyCard from '../components/PropertyCard';
import { apiService } from '../config/api';

export default function Properties({ onOpenPropertyModal, onOpenGalleryModal }) {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { searchQuery, filters, getFilterParams, updateFilters } = useSearch();

  useEffect(() => {
    fetchProperties();
  }, [searchQuery, filters, fetchProperties]);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const params = getFilterParams();
      const response = await apiService.properties.getAll(params);
      setProperties(response.properties || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching properties:', err);
      setError('Failed to load properties. Please make sure the backend server is running.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen transparent-bg pb-12 pt-20">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
              <div className="text-gray-300">Loading properties...</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen transparent-bg pb-12 pt-20">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="text-red-400 text-xl mb-4">⚠️</div>
              <div className="text-gray-300 mb-4">{error}</div>
              <button 
                onClick={fetchProperties}
                className="btn-primary px-4 py-2 rounded-lg text-white text-sm"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen transparent-bg pb-12 pt-20">
      <div className="container mx-auto px-4">
        <div className="mb-6">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">Property Listings</h2>
          <div className="flex flex-col gap-3">
            {/* Advanced Filters */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              <select 
                value={filters.type} 
                onChange={(e) => updateFilters({ type: e.target.value })}
                className="p-3 rounded-lg bg-white/5 border border-white/10 text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300"
              >
                <option value="all">Property Type</option>
                <option value="villa">Villa</option>
                <option value="apartment">Apartment</option>
                <option value="commercial">Commercial</option>
                <option value="office">Office</option>
                <option value="land">Land</option>
              </select>
              
              <select 
                value={filters.purpose} 
                onChange={(e) => updateFilters({ purpose: e.target.value })}
                className="p-3 rounded-lg bg-white/5 border border-white/10 text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300"
              >
                <option value="all">Purpose</option>
                <option value="sale">For Sale</option>
                <option value="rent">For Rent</option>
              </select>
              
              <select 
                value={filters.emirate} 
                onChange={(e) => updateFilters({ emirate: e.target.value })}
                className="p-3 rounded-lg bg-white/5 border border-white/10 text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300"
              >
                <option value="all">Location</option>
                <option value="ajman">Ajman</option>
                <option value="dubai">Dubai</option>
                <option value="sharjah">Sharjah</option>
                <option value="abu-dhabi">Abu Dhabi</option>
                <option value="ras-al-khaimah">Ras Al Khaimah</option>
              </select>
              
              <select 
                value={filters.sort} 
                onChange={(e) => updateFilters({ sort: e.target.value })}
                className="p-3 rounded-lg bg-white/5 border border-white/10 text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="price_low">Price: Low to High</option>
                <option value="price_high">Price: High to Low</option>
                <option value="area_large">Area: Large to Small</option>
                <option value="area_small">Area: Small to Large</option>
              </select>
            </div>
            
            {/* Price Range */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <input
                type="number"
                placeholder="Min Price (AED)"
                value={filters.price_min}
                onChange={(e) => updateFilters({ price_min: e.target.value })}
                className="p-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300"
              />
              <input
                type="number"
                placeholder="Max Price (AED)"
                value={filters.price_max}
                onChange={(e) => updateFilters({ price_max: e.target.value })}
                className="p-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300"
              />
              <Link 
                to="/add" 
                className="btn-primary px-4 py-3 rounded-lg text-white font-semibold focus-enhanced text-center"
              >
                Add Property
              </Link>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map(property => (
            <PropertyCard 
              key={property.id} 
              property={property} 
              onOpenPropertyModal={onOpenPropertyModal}
              onOpenGalleryModal={onOpenGalleryModal}
            />
          ))}
        </div>
        
        {properties.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-lg mb-4">No properties found</div>
            <div className="text-gray-500 text-sm">Try adjusting your filters or search terms</div>
          </div>
        )}
      </div>
    </div>
  );
}
