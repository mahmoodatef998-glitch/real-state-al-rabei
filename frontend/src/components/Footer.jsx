import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="mt-16 bg-gradient-to-r from-slate-900/90 to-slate-800/90 backdrop-blur-md border-t border-white/10">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Company Info */}
          <div>
            <div className="text-2xl font-bold tracking-wider mb-6">
              <span className="text-white">Alrabie</span>
              <span className="text-blue-400"> Real Estate</span>
            </div>
            <p className="text-gray-300 mb-6 text-lg leading-relaxed">
              Your trusted partner in real estate. We help you find the perfect property across Ajman and the UAE.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                <i className="fab fa-facebook-f text-xl"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                <i className="fab fa-twitter text-xl"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                <i className="fab fa-instagram text-xl"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                <i className="fab fa-linkedin text-xl"></i>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-blue-400 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/properties" className="text-gray-300 hover:text-blue-400 transition-colors">
                  Properties
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-300 hover:text-blue-400 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-300 hover:text-blue-400 transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white font-bold mb-4">Contact Info</h3>
            <div className="space-y-2 text-gray-300">
              <div className="flex items-center gap-2">
                <i className="fas fa-map-marker-alt text-blue-400"></i>
                <span>Ajman, UAE</span>
              </div>
              <div className="flex items-center gap-2">
                <i className="fas fa-phone text-blue-400"></i>
                <span>+971 50 123 4567</span>
              </div>
              <div className="flex items-center gap-2">
                <i className="fas fa-envelope text-blue-400"></i>
                <span>info@alrabie.ae</span>
              </div>
              <div className="flex items-center gap-2">
                <i className="fab fa-whatsapp text-green-400"></i>
                <span>+971 50 123 4567</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 mt-8 pt-8 text-center">
          <p className="text-gray-400">
            © 2024 Alrabie Property. All rights reserved. | Built with React + Vite
          </p>
        </div>
      </div>
    </footer>
  );
}
