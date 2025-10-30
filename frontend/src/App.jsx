import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { SearchProvider } from './context/SearchContext';
import { initializeMockData } from './data/mockData';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Properties from './pages/Properties';
import PropertyModal from './components/PropertyModal';
import GalleryModal from './components/GalleryModal';
import LoginModal from './components/LoginModal';
import RegisterModal from './components/RegisterModal';
import LeadForm from './components/LeadForm';
import AddProperty from './pages/AddProperty';

export default function App() {
  const [selectedPropertyId, setSelectedPropertyId] = useState(null);
  const [showPropertyModal, setShowPropertyModal] = useState(false);
  const [showGalleryModal, setShowGalleryModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);

  // Initialize mock data on app start
  useEffect(() => {
    initializeMockData();
  }, []);
  const [showLeadForm, setShowLeadForm] = useState(false);

  const openPropertyModal = (propertyId) => {
    setSelectedPropertyId(propertyId);
    setShowPropertyModal(true);
  };

  const closePropertyModal = () => {
    setShowPropertyModal(false);
    setSelectedPropertyId(null);
  };

  const openGalleryModal = (propertyId) => {
    setSelectedPropertyId(propertyId);
    setShowGalleryModal(true);
  };

  const closeGalleryModal = () => {
    setShowGalleryModal(false);
    setSelectedPropertyId(null);
  };

  const openLoginModal = () => {
    setShowLoginModal(true);
  };

  const closeLoginModal = () => {
    setShowLoginModal(false);
  };

  const openRegisterModal = () => {
    setShowRegisterModal(true);
  };

  const closeRegisterModal = () => {
    setShowRegisterModal(false);
  };

  // const openLeadForm = () => {
  //   setShowLeadForm(true);
  // };

  const closeLeadForm = () => {
    setShowLeadForm(false);
  };

  const switchToRegister = () => {
    setShowLoginModal(false);
    setShowRegisterModal(true);
  };

  const switchToLogin = () => {
    setShowRegisterModal(false);
    setShowLoginModal(true);
  };

  return (
    <AuthProvider>
      <SearchProvider>
        <Router>
          <div className="min-h-screen flex flex-col">
            {/* Background */}
            <div className="fixed inset-0 -z-10">
              <div 
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{
                  backgroundImage: "url('https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1920&q=80')"
                }}
              ></div>
              <div className="absolute inset-0 bg-black/70"></div>
            </div>

            <Header 
              onOpenLogin={openLoginModal} 
              onOpenRegister={openRegisterModal} 
            />
          
            <main className="flex-1">
              <Routes>
                <Route 
                  path="/" 
                  element={<Home onOpenPropertyModal={openPropertyModal} onOpenGalleryModal={openGalleryModal} />} 
                />
                <Route 
                  path="/properties" 
                  element={<Properties onOpenPropertyModal={openPropertyModal} onOpenGalleryModal={openGalleryModal} />} 
                />
                <Route 
                  path="/add" 
                  element={<AddProperty />} 
                />
                <Route 
                  path="/leads" 
                  element={<div className="min-h-screen pt-20 flex items-center justify-center"><div className="text-white text-xl">Leads Page - Coming Soon</div></div>} 
                />
                <Route 
                  path="/dashboard" 
                  element={<div className="min-h-screen pt-20 flex items-center justify-center"><div className="text-white text-xl">Dashboard Page - Coming Soon</div></div>} 
                />
                <Route 
                  path="/about" 
                  element={<div className="min-h-screen pt-20 flex items-center justify-center"><div className="text-white text-xl">About Page - Coming Soon</div></div>} 
                />
                <Route 
                  path="*" 
                  element={<Home onOpenPropertyModal={openPropertyModal} onOpenGalleryModal={openGalleryModal} />} 
                />
              </Routes>
            </main>

            <Footer />

            {/* Global Modals */}
            {showPropertyModal && (
              <PropertyModal 
                propertyId={selectedPropertyId} 
                onClose={closePropertyModal} 
              />
            )}
            
            {showGalleryModal && (
              <GalleryModal 
                propertyId={selectedPropertyId} 
                onClose={closeGalleryModal} 
              />
            )}
            
            {showLoginModal && (
              <LoginModal 
                onClose={closeLoginModal} 
                onSwitchToRegister={switchToRegister} 
              />
            )}
            
            {showRegisterModal && (
              <RegisterModal 
                onClose={closeRegisterModal} 
                onSwitchToLogin={switchToLogin} 
              />
            )}

            {showLeadForm && (
              <LeadForm 
                propertyId={selectedPropertyId} 
                onClose={closeLeadForm}
                onSuccess={() => {
                  closeLeadForm();
                  // You could add a success message here
                }}
              />
            )}
          </div>
        </Router>
      </SearchProvider>
    </AuthProvider>
  );
}