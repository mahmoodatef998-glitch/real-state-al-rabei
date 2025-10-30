import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useSearch } from '../context/SearchContext';

export default function Header({ onOpenLogin, onOpenRegister }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, isAuthenticated, logout, hasAnyRole } = useAuth();
  const { searchQuery, setSearchQuery } = useSearch();
  const location = useLocation();

  // Build nav dynamically based on auth state
  const buildNav = () => {
    const baseNav = [
      ['/', 'Home'],
      ['/properties', 'Properties'],
      ['/about', 'About Us']
    ];

    if (isAuthenticated && user && hasAnyRole(['admin', 'agent'])) {
      baseNav.push(
        ['/add', 'Add Property'],
        ['/leads', 'Leads'],
        ['/dashboard', 'Dashboard']
      );
    }

    return baseNav;
  };

  const nav = buildNav();

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <header className="fixed inset-x-0 top-0 z-40 bg-gradient-to-r from-slate-900/90 to-slate-800/90 backdrop-blur-md border-b border-white/10 shadow-lg">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link to="/" className="text-xl font-bold tracking-wider hover:scale-105 transition-transform duration-300">
            <span className="text-white">Alrabie</span>
            <span className="text-blue-400"> Real Estate</span>
          </Link>
          <nav className="hidden md:flex gap-3 text-gray-300">
            {nav.map(([path, label]) => (
              <Link
                key={path}
                to={path}
                className={`nav-link px-3 py-1 rounded focus-enhanced transition-all duration-300 hover:bg-blue-500/20 hover:text-blue-300 ${
                  isActive(path) ? 'bg-white/6 text-white' : ''
                }`}
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2">
            <div className="relative">
              <input
                type="text"
                placeholder="Search properties, location, type..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-72 px-4 py-2 pl-10 pr-4 bg-white/5 border border-white/10 rounded-full text-white placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300"
              />
              <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
            </div>
          </div>
          <div className="text-sm text-gray-400 desktop-only">Ajman, UAE</div>
          
          {isAuthenticated ? (
            <div className="flex items-center gap-3 bg-white/5 px-3 py-1 rounded-full">
              <div className="w-8 h-8 rounded-full avatar flex items-center justify-center text-sm font-bold">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div className="hidden sm:block text-sm">
                <div className="font-medium">{user.name}</div>
                <div className="text-xs text-gray-400 capitalize">{user.role}</div>
              </div>
              <button 
                onClick={logout}
                className="ml-3 text-sm text-red-400 hover:underline"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button 
                onClick={onOpenLogin}
                className="px-4 py-2 text-sm text-blue-400 hover:text-blue-300 transition-colors"
              >
                Login
              </button>
              <button 
                onClick={onOpenRegister}
                className="px-4 py-2 text-sm bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
              >
                Register
              </button>
            </div>
          )}
          
          <button
            className="md:hidden text-gray-300 ml-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            ☰
          </button>
        </div>
      </div>

      {/* Mobile nav */}
      <div className={`md:hidden ${mobileMenuOpen ? 'block' : 'hidden'} bg-black/80 border-t border-white/5`}>
        <div className="container mx-auto px-4 py-3 flex flex-col gap-2">
          <input
            type="text"
            placeholder="Search properties..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300"
          />
          {nav.map(([path, label]) => (
            <Link
              key={path}
              to={path}
              className="px-3 py-2 rounded text-gray-200 focus-enhanced transition-all duration-300 hover:bg-blue-500/20 hover:text-blue-300"
              onClick={() => setMobileMenuOpen(false)}
            >
              {label}
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
}
