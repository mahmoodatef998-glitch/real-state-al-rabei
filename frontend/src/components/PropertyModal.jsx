import React, { useState, useEffect } from 'react';
import api from '../config/api';

export default function PropertyModal({ propertyId, onClose }) {
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    if (propertyId) {
      setCurrentImageIndex(0);
      fetchProperty();
    }
  }, [propertyId, fetchProperty]);

  const fetchProperty = async () => {
    try {
      setLoading(true);
      const response = await api.properties.getById(propertyId);
      setProperty(response.data.property);
      setError(null);
    } catch (err) {
      console.error('Error fetching property:', err);
      setError('Failed to load property details');
    } finally {
      setLoading(false);
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const nextImage = () => {
    if (property?.images && property.images.length > 0) {
      setCurrentImageIndex((prev) => 
        prev === property.images.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevImage = () => {
    if (property?.images && property.images.length > 0) {
      setCurrentImageIndex((prev) => 
        prev === 0 ? property.images.length - 1 : prev - 1
      );
    }
  };

  const goToImage = (index) => {
    setCurrentImageIndex(index);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (property?.images && property.images.length > 1) {
        if (e.key === 'ArrowLeft') {
          prevImage();
        } else if (e.key === 'ArrowRight') {
          nextImage();
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [property?.images, nextImage, prevImage]);

  if (loading) {
    return (
      <div 
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur"
        onClick={handleBackdropClick}
      >
        <div className="rounded-2xl w-full max-w-5xl overflow-hidden flex flex-col transparent-bg border border-white/5">
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
            <div className="text-gray-300">Loading property details...</div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div 
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur"
        onClick={handleBackdropClick}
      >
        <div className="rounded-2xl w-full max-w-5xl overflow-hidden flex flex-col transparent-bg border border-white/5">
          <div className="p-8 text-center">
            <div className="text-red-400 text-xl mb-4">⚠️</div>
            <div className="text-gray-300 mb-4">{error}</div>
            <button 
              onClick={fetchProperty}
              className="btn-primary px-4 py-2 rounded-lg text-white text-sm"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!property) return null;

  const formatPrice = (price) => {
    return Number(price || 0).toLocaleString();
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur"
      onClick={handleBackdropClick}
    >
      <div className="rounded-2xl w-full max-w-5xl overflow-hidden flex flex-col transparent-bg border border-white/5">
        <div className="p-4 flex items-start justify-between border-b border-white/10">
          <div>
            <h3 className="text-lg font-bold text-white">{property.title}</h3>
            <div className="flex gap-2 mt-1">
              <span className="text-green-300 font-bold">AED {formatPrice(property.price)}</span>
              <span className="text-gray-300">{property.area_sqft || 0} sqft</span>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-black/50 flex items-center justify-center text-white hover:bg-black/70 transition-colors"
          >
            ✕
          </button>
        </div>
        <div className="flex gap-4 p-4">
          <div className="w-1/2">
            {/* Main Image Container */}
            <div className="image-frame p-2 rounded-lg relative mb-4">
              <img 
                src={
                  property.images && property.images.length > 0 && property.images[currentImageIndex]
                    ? property.images[currentImageIndex]
                    : `https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80`
                }
                alt={property.title}
                className="w-full h-80 object-cover rounded-lg" 
                onError={(e) => {
                  e.target.src = 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80'
                }}
              />
              
              {/* Navigation Arrows */}
              {property.images && property.images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-2 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-all duration-300"
                  >
                    <i className="fas fa-chevron-left"></i>
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-all duration-300"
                  >
                    <i className="fas fa-chevron-right"></i>
                  </button>
                </>
              )}
              
              {/* Image Counter */}
              {property.images && property.images.length > 1 && (
                <div className="absolute bottom-2 right-2 bg-black/50 text-white px-2 py-1 rounded text-sm">
                  {currentImageIndex + 1} / {property.images.length}
                </div>
              )}
            </div>
            
            {/* Thumbnail Gallery */}
            {property.images && property.images.length > 1 && (
              <div>
                <div className="text-sm text-gray-400 mb-2">All Images:</div>
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {property.images.map((img, index) => (
                    <img
                      key={index}
                      src={img}
                      alt={`${property.title} - Image ${index + 1}`}
                      className={`w-16 h-16 object-cover rounded cursor-pointer border-2 transition-all duration-300 ${
                        index === currentImageIndex 
                          ? 'border-blue-400 opacity-100' 
                          : 'border-gray-600 opacity-70 hover:opacity-100'
                      }`}
                      onClick={() => goToImage(index)}
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=200&q=80'
                      }}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
          
          <div className="w-1/2">
            <div className="text-gray-300 leading-relaxed">{property.description || 'No description available'}</div>
            <div className="mt-4 p-3.5 rounded-2xl transparent-card">
              <h4 className="text-white font-bold">{property.owner_name || 'Agent'}</h4>
              <div className="mt-2 flex gap-2 flex-wrap">
                <a 
                  href={property.owner_whatsapp ? `https://wa.me/${property.owner_whatsapp?.replace(/\+/g, '')}` : '#'} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="px-3.5 py-2.5 rounded-xl text-white font-semibold text-xs flex items-center gap-2 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 transition-all duration-300"
                >
                  <i className="fab fa-whatsapp"></i> WhatsApp
                </a>
                <a 
                  href={property.owner_phone ? `tel:${property.owner_phone}` : '#'} 
                  className="bg-gradient-to-r from-blue-600 to-blue-700 px-3.5 py-2.5 rounded-xl text-white font-semibold text-xs flex items-center gap-2 hover:from-blue-700 hover:to-blue-800 transition-all duration-300"
                >
                  <i className="fas fa-phone"></i> Call
                </a>
                <button
                  onClick={() => {/* Open lead form */}}
                  className="bg-gradient-to-r from-purple-600 to-purple-700 px-3.5 py-2.5 rounded-xl text-white font-semibold text-xs flex items-center gap-2 hover:from-purple-700 hover:to-purple-800 transition-all duration-300"
                >
                  <i className="fas fa-heart"></i> Express Interest
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
