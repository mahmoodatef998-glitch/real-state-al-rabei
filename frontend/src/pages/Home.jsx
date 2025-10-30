import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PropertyCard from '../components/PropertyCard';
import { apiService } from '../config/api';
import systemStatus from '../utils/systemStatus';
import { testConnection } from '../utils/connectionTest';

export default function Home({ onOpenPropertyModal, onOpenGalleryModal }) {
  const [newArrivals, setNewArrivals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [systemInfo, setSystemInfo] = useState(null);

  useEffect(() => {
    fetchNewArrivals();
    checkSystemStatus();
    // Run connection test
    testConnection();
  }, []);

  const checkSystemStatus = async () => {
    try {
      const status = await systemStatus.logStatus();
      setSystemInfo(status);
    } catch (error) {
      console.error('Error checking system status:', error);
    }
  };

  const fetchNewArrivals = async () => {
    try {
      const response = await apiService.properties.getNewArrivals(6);
      setNewArrivals(response.properties || []);
    } catch (error) {
      console.error('Error fetching new arrivals:', error);
      // Fallback to empty array if API fails
      setNewArrivals([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="route">
      {/* Hero Section */}
      <section className="min-h-screen relative flex items-center justify-center text-center pt-16">
        <div className="relative z-10 max-w-4xl px-6 py-12">
          <div className="hero-section">
            <h1 className="hero-title">
              <span className="text-white">Alrabie</span> 
              <span className="text-blue-400">Real Estate</span>
            </h1>
            <p className="hero-subtitle">
              Leading Real Estate Platform in Ajman, UAE
            </p>
            <div className="hero-buttons">
              <Link to="/properties" className="btn-arabic">
                Browse Properties
              </Link>
              <Link to="/add" className="btn-secondary">
                Add Property
              </Link>
            </div>
            <p className="hero-features">
              ✓ Real Data • ✓ English Interface • ✓ Easy to Use
              {systemInfo && (
                <span className={`ml-2 px-2 py-1 rounded text-xs ${
                  systemInfo.backend.status === 'online' 
                    ? 'bg-green-500/20 text-green-300 border border-green-500/30' 
                    : 'bg-red-500/20 text-red-300 border border-red-500/30'
                }`}>
                  {systemInfo.backend.status === 'online' ? '🟢 System Online' : '🔴 System Offline'}
                </span>
              )}
            </p>
          </div>
        </div>
      </section>

      {/* New Arrivals Section */}
      <section className="container mx-auto px-4 py-12">
        <div className="properties-section">
          <div className="text-center mb-12">
            <h2 className="section-title">New Arrivals</h2>
            <p className="section-subtitle">Discover the latest properties added to our platform</p>
          </div>
          {loading ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
            </div>
          ) : newArrivals.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {newArrivals.map(property => (
                <PropertyCard 
                  key={property.id} 
                  property={property} 
                  onOpenPropertyModal={onOpenPropertyModal} 
                  onOpenGalleryModal={onOpenGalleryModal} 
                />
              ))}
            </div>
          ) : (
            <div className="error-container">
              <div className="error-icon">🏠</div>
              <div className="error-message">No properties available at the moment</div>
              <p className="text-gray-400">Make sure the backend is running or try adding new properties</p>
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h2 className="section-title">Why Choose Alrabie Real Estate?</h2>
          <p className="section-subtitle">
            We provide comprehensive real estate services with focus on customer satisfaction and property quality
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="feature-card">
            <div className="feature-icon bg-blue-500/20">
              <i className="fas fa-home text-blue-400 text-2xl"></i>
            </div>
            <h3 className="feature-title">Premium Properties</h3>
            <p className="feature-description">Carefully selected premium properties across Ajman and the Emirates</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon bg-green-500/20">
              <i className="fas fa-users text-green-400 text-2xl"></i>
            </div>
            <h3 className="feature-title">Expert Team</h3>
            <p className="feature-description">Professional agents with years of experience in the UAE real estate market</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon bg-purple-500/20">
              <i className="fas fa-handshake text-purple-400 text-2xl"></i>
            </div>
            <h3 className="feature-title">Customer Service</h3>
            <p className="feature-description">24/7 support and personalized service to help you find the perfect property</p>
          </div>
        </div>
      </section>
    </div>
  );
}
