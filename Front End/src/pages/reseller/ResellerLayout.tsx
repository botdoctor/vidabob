import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  LayoutDashboard,
  Car,
  LogOut,
  Menu,
  X,
  User,
  Home
} from 'lucide-react';
import Logo from '../../components/Logo';
import LanguageToggle from '../../components/LanguageToggle';
import { useLanguage } from '../../contexts/LanguageContext';

const ResellerLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useLanguage();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const sidebarItems = [
    { 
      id: 'dashboard', 
      label: t('reseller.dashboardTitle'), 
      icon: LayoutDashboard, 
      path: '/reseller' 
    },
    { 
      id: 'vehicles', 
      label: t('reseller.bookVehicles'), 
      icon: Car, 
      path: '/reseller/vehicles' 
    }
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <div className={`bg-white shadow-lg transition-all duration-300 ${
        sidebarOpen ? 'w-64' : 'w-16'
      } hidden md:block`}>
        <div className="p-4">
          <div className="flex items-center space-x-3">
            <Logo height={32} />
            {sidebarOpen && (
              <div>
                <h1 className="text-lg font-bold text-gray-900">{t('reseller.resellerPanel')}</h1>
                <p className="text-xs text-gray-500">{t('reseller.welcome')}, {user?.username}</p>
              </div>
            )}
          </div>
        </div>
        
        <nav className="mt-8">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.id}
                to={item.path}
                className={`flex items-center px-4 py-3 text-sm font-medium transition-colors duration-200 ${
                  isActive(item.path)
                    ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-blue-600'
                }`}
              >
                <Icon className="h-5 w-5" />
                {sidebarOpen && <span className="ml-3">{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Bottom Buttons */}
        <div className="absolute bottom-4 left-4 space-y-2">
          <Link
            to="/"
            className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200 rounded-lg"
          >
            <Home className="h-4 w-4" />
            {sidebarOpen && <span className="ml-2">{t('reseller.returnHome')}</span>}
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors duration-200 rounded-lg"
          >
            <LogOut className="h-4 w-4" />
            {sidebarOpen && <span className="ml-2">{t('reseller.logout')}</span>}
          </button>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden">
          <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-lg z-50">
            <div className="p-4 border-b">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Logo height={32} />
                  <div>
                    <h1 className="text-lg font-bold text-gray-900">{t('reseller.resellerPanel')}</h1>
                    <p className="text-xs text-gray-500">{t('reseller.welcome')}, {user?.username}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="p-2 rounded-md text-gray-500 hover:text-gray-700"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
            
            <nav className="mt-4">
              {sidebarItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.id}
                    to={item.path}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center px-4 py-3 text-sm font-medium transition-colors duration-200 ${
                      isActive(item.path)
                        ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                        : 'text-gray-700 hover:bg-gray-50 hover:text-blue-600'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="ml-3">{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            <div className="absolute bottom-4 left-4 space-y-2">
              <Link
                to="/"
                className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200 rounded-lg"
                onClick={() => setSidebarOpen(false)}
              >
                <Home className="h-4 w-4" />
                <span className="ml-2">{t('reseller.returnHome')}</span>
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors duration-200 rounded-lg"
              >
                <LogOut className="h-4 w-4" />
                <span className="ml-2">{t('reseller.logout')}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Navigation */}
        <header className="bg-white shadow-sm border-b">
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors duration-200"
              >
                <Menu className="h-5 w-5" />
              </button>
              <h2 className="text-xl font-semibold text-gray-800">
                {t('reseller.dashboard')}
              </h2>
            </div>

            <div className="flex items-center space-x-4">
              <LanguageToggle />
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <User className="h-4 w-4" />
                <span>{user?.username}</span>
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                  {t('nav.reseller')}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 bg-gray-50">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default ResellerLayout;