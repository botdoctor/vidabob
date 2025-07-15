import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Mail, MessageCircle } from 'lucide-react';
import Logo from './Logo';
import LanguageToggle from './LanguageToggle';
import { useLanguage } from '../contexts/LanguageContext';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const headerHeight = "h-20"; // Increased from h-16
  const location = useLocation();
  const { t } = useLanguage();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`flex justify-between items-center ${headerHeight}`}>
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" aria-label="Vida Motors Home">
              <Logo height={50} />
            </Link>
          </div>

          <nav className="hidden md:flex space-x-8">
            <Link
              to="/"
              className={`transition-colors duration-200 ${
                isActive('/') ? 'text-blue-600 font-semibold' : 'text-gray-700 hover:text-blue-600'
              }`}
            >
              {t('nav.home')}
            </Link>
            <Link
              to="/inventory"
              className={`transition-colors duration-200 ${
                isActive('/inventory') ? 'text-blue-600 font-semibold' : 'text-gray-700 hover:text-blue-600'
              }`}
            >
              {t('nav.inventory')}
            </Link>
            <Link
              to="/rentals"
              className={`transition-colors duration-200 ${
                isActive('/rentals') ? 'text-blue-600 font-semibold' : 'text-gray-700 hover:text-blue-600'
              }`}
            >
              {t('nav.rentals')}
            </Link>
            <Link
              to="/sell-car"
              className={`transition-colors duration-200 ${
                isActive('/sell-car') ? 'text-blue-600 font-semibold' : 'text-gray-700 hover:text-blue-600'
              }`}
            >
              {t('nav.sellCar')}
            </Link>
            <Link
              to="/about"
              className={`transition-colors duration-200 ${
                isActive('/about') ? 'text-blue-600 font-semibold' : 'text-gray-700 hover:text-blue-600'
              }`}
            >
              {t('nav.about')}
            </Link>
            <Link
              to="/contact"
              className={`transition-colors duration-200 ${
                isActive('/contact') ? 'text-blue-600 font-semibold' : 'text-gray-700 hover:text-blue-600'
              }`}
            >
              {t('nav.contact')}
            </Link>
          </nav>

          {/* Contact Info & Language Toggle */}
          <div className="hidden lg:flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <a 
                href="https://wa.me/50661657093" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center space-x-2 text-sm text-gray-600 hover:text-blue-600 transition-colors"
              >
                <MessageCircle className="h-4 w-4" />
                <span>+506 6165 7093</span>
              </a>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Mail className="h-4 w-4" />
              <span>info@viidamotors.com</span>
            </div>
            <LanguageToggle />
          </div>

          {/* Mobile Language Toggle & Menu Button */}
          <div className="flex items-center space-x-2 lg:hidden">
            <LanguageToggle />
            <button
              onClick={toggleMenu}
              className="p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-100 transition-colors duration-200"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link
              to="/"
              onClick={() => setIsMenuOpen(false)}
              className={`block px-3 py-2 rounded-md transition-colors duration-200 ${
                isActive('/') ? 'text-blue-600 bg-blue-50' : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
              }`}
            >
              {t('nav.home')}
            </Link>
            <Link
              to="/inventory"
              onClick={() => setIsMenuOpen(false)}
              className={`block px-3 py-2 rounded-md transition-colors duration-200 ${
                isActive('/inventory') ? 'text-blue-600 bg-blue-50' : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
              }`}
            >
              {t('nav.inventory')}
            </Link>
            <Link
              to="/rentals"
              onClick={() => setIsMenuOpen(false)}
              className={`block px-3 py-2 rounded-md transition-colors duration-200 ${
                isActive('/rentals') ? 'text-blue-600 bg-blue-50' : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
              }`}
            >
              {t('nav.rentals')}
            </Link>
            <Link
              to="/sell-car"
              onClick={() => setIsMenuOpen(false)}
              className={`block px-3 py-2 rounded-md transition-colors duration-200 ${
                isActive('/sell-car') ? 'text-blue-600 bg-blue-50' : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
              }`}
            >
              {t('nav.sellCar')}
            </Link>
            <Link
              to="/about"
              onClick={() => setIsMenuOpen(false)}
              className={`block px-3 py-2 rounded-md transition-colors duration-200 ${
                isActive('/about') ? 'text-blue-600 bg-blue-50' : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
              }`}
            >
              {t('nav.about')}
            </Link>
            <Link
              to="/contact"
              onClick={() => setIsMenuOpen(false)}
              className={`block px-3 py-2 rounded-md transition-colors duration-200 ${
                isActive('/contact') ? 'text-blue-600 bg-blue-50' : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
              }`}
            >
              {t('nav.contact')}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;