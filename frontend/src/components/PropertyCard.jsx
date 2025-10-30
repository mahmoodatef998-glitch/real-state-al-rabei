import React from 'react';
import { useAuth } from '../context/AuthContext';

export default function PropertyCard({ property, onOpenPropertyModal, onOpenGalleryModal }) {
  const { user, hasAnyRole } = useAuth();

  const handleImageClick = () => {
    onOpenGalleryModal(property.id);
  };

  const handleViewClick = (e) => {
    e.preventDefault();
    onOpenPropertyModal(property.id);
  };

  const handleEditClick = (e) => {
    e.preventDefault();
    window.location.href = `/add?edit=${property.id}`;
  };

  const formatPrice = (price) => {
    return Number(price || 0).toLocaleString();
  };

  return (
    <div className="bg-white/3 backdrop-blur-sm border border-white/8 rounded-xl p-4 card-interactive focus-enhanced shadow-lg hover:shadow-xl transition-all duration-300">
      <div 
        className="relative rounded-lg overflow-hidden cursor-pointer group" 
        style={{ height: '160px' }}
        onClick={handleImageClick}
      >
        <img 
          src={
            property.images && property.images.length > 0 && property.images[0] 
              ? property.images[0] 
              : `https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80`
          }
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
          alt={property.title}
          loading="lazy"
          onError={(e) => {
            // Fallback to default image based on property type
            const defaultImages = {
              villa: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80',
              apartment: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80',
              commercial: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80',
              office: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80',
              land: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80'
            };
            e.target.src = defaultImages[property.type] || defaultImages.villa;
          }}
        />
        {/* Image indicator if multiple images */}
        {property.images && property.images.length > 1 && (
          <div className="absolute top-2 right-2 bg-black/80 text-white px-2 py-1 rounded-md text-xs flex items-center gap-1 backdrop-blur-sm">
            <i className="fas fa-images text-xs"></i>
            <span className="text-xs">{property.images.length}</span>
          </div>
        )}
        <div className="absolute top-2 left-2 bg-blue-600/90 backdrop-blur-sm text-white px-2 py-1 rounded-md text-xs font-medium">
          {property.type}
        </div>
        <div className="absolute bottom-2 right-2 bg-green-600/90 backdrop-blur-sm text-white px-3 py-1 rounded-md font-semibold text-sm">
          {formatPrice(property.price)} AED
        </div>
      </div>
      <div className="mt-3">
        <h3 className="text-lg font-semibold text-white mb-2 line-clamp-2">{property.title}</h3>
        <p className="text-gray-300 text-xs line-clamp-2 mb-3">{property.description}</p>
        <div className="flex items-center gap-3 text-xs text-gray-400 mb-4">
          <div className="flex items-center gap-1">
            <i className="fas fa-bed text-blue-400 text-xs"></i>
            <span>{property.bedrooms} beds</span>
          </div>
          <div className="flex items-center gap-1">
            <i className="fas fa-bath text-blue-400 text-xs"></i>
            <span>{property.bathrooms} baths</span>
          </div>
          <div className="flex items-center gap-1">
            <i className="fas fa-ruler-combined text-blue-400 text-xs"></i>
            <span>{property.area} sqft</span>
          </div>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={handleViewClick}
            className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-3 py-2 rounded-md font-medium transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/25 text-sm"
          >
            View Details
          </button>
          {user && hasAnyRole(['admin', 'agent']) && (
            <button 
              onClick={handleEditClick}
              className="border border-white/20 hover:bg-white/10 text-white px-3 py-2 rounded-md transition-all duration-300 text-sm"
            >
              Edit
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
