import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Youtube, Phone, Mail, MapPin, MessageCircle } from 'lucide-react';
import Logo from './Logo';
import { useLanguage } from '../contexts/LanguageContext';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const navigate = useNavigate();
  const { t } = useLanguage();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };


  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <Link to="/" aria-label="Vida Motors Home">
              <Logo height={50} />
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed">
              {t('footer.description')}
            </p>
            <div className="flex space-x-4">
              <button className="bg-blue-600 hover:bg-blue-700 p-2 rounded-lg transition-colors duration-200">
                <Facebook className="h-5 w-5" />
              </button>
              <button className="bg-blue-500 hover:bg-blue-600 p-2 rounded-lg transition-colors duration-200">
                <Twitter className="h-5 w-5" />
              </button>
              <button className="bg-pink-600 hover:bg-pink-700 p-2 rounded-lg transition-colors duration-200">
                <Instagram className="h-5 w-5" />
              </button>
              <button className="bg-red-600 hover:bg-red-700 p-2 rounded-lg transition-colors duration-200">
                <Youtube className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">{t('footer.quickLinks')}</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/"
                  className="text-gray-400 hover:text-white transition-colors duration-200 block"
                >
                  {t('nav.home')}
                </Link>
              </li>
              <li>
                <Link
                  to="/inventory"
                  className="text-gray-400 hover:text-white transition-colors duration-200 block"
                >
                  {t('footer.vehicleInventory')}
                </Link>
              </li>
              <li>
                <Link
                  to="/sell-car"
                  className="text-gray-400 hover:text-white transition-colors duration-200 block"
                >
                  {t('footer.sellYourCar')}
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="text-gray-400 hover:text-white transition-colors duration-200 block"
                >
                  {t('footer.aboutUs')}
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-gray-400 hover:text-white transition-colors duration-200 block"
                >
                  {t('nav.contact')}
                </Link>
              </li>
              <li>
                <Link
                  to="/admin"
                  className="text-gray-400 hover:text-white transition-colors duration-200 block"
                >
                  {t('nav.admin')}
                </Link>
              </li>
              <li>
                <Link
                  to="/reseller"
                  className="text-gray-400 hover:text-white transition-colors duration-200 block"
                >
                  {t('nav.reseller')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold mb-4">{t('footer.ourServices')}</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <span className="text-gray-400">{t('footer.newCarSales')}</span>
              </li>
              <li>
                <span className="text-gray-400">{t('footer.usedCarSales')}</span>
              </li>
              <li>
                <span className="text-gray-400">{t('footer.vehicleRentals')}</span>
              </li>
              <li>
                <span className="text-gray-400">{t('footer.financingLeasing')}</span>
              </li>
              <li>
                <span className="text-gray-400">{t('footer.serviceMaintenance')}</span>
              </li>
              <li>
                <span className="text-gray-400">{t('footer.partsAccessories')}</span>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">{t('footer.contactInfo')}</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-blue-400 mt-0.5" />
                <span className="text-gray-400">
                  Guanacaste<br />
                  Costa Rica
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <a 
                  href="https://wa.me/50661657093" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center space-x-3 text-gray-400 hover:text-blue-400 transition-colors"
                >
                  <MessageCircle className="h-5 w-5 text-blue-400" />
                  <span>+506 6165 7093</span>
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-blue-400" />
                <span className="text-gray-400">info@viidamotors.com</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="text-sm text-gray-400">
            © {currentYear} Viida Motors. {t('footer.allRightsReserved')}
          </div>
          <div className="flex space-x-6 text-sm text-gray-400 mt-4 md:mt-0">
            <button className="hover:text-white transition-colors duration-200">
              {t('footer.privacyPolicy')}
            </button>
            <button className="hover:text-white transition-colors duration-200">
              {t('footer.termsOfService')}
            </button>
            <button className="hover:text-white transition-colors duration-200">
              {t('footer.cookiePolicy')}
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;