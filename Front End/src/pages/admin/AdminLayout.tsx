import React from 'react';
import { Outlet, Link, useLocation, Navigate } from 'react-router-dom';
import { Car, Users, Calendar, BarChart3, Settings, Home, PieChart, LogOut } from 'lucide-react';
import Logo from '../../components/Logo';
import { useAuth } from '../../contexts/AuthContext';
import AdminLogin from '../../components/AdminLogin';

const AdminLayout: React.FC = () => {
  const location = useLocation();
  const { user, logout, loading } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!user || user.role !== 'admin') {
    return <AdminLogin />;
  }

  const menuItems = [
    { path: '/admin', icon: BarChart3, label: 'Dashboard' },
    { path: '/admin/analytics', icon: PieChart, label: 'Analytics' },
    { path: '/admin/vehicles', icon: Car, label: 'Vehicles' },
    { path: '/admin/customers', icon: Users, label: 'Customers' },
    { path: '/admin/resellers', icon: Users, label: 'Resellers' },
    { path: '/admin/rentals', icon: Calendar, label: 'Rentals' },
    { path: '/admin/settings', icon: Settings, label: 'Settings' }
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg">
        <div className="p-6 border-b">
          <div className="flex flex-col items-center space-y-2">
            <Logo height={50} />
            <span className="text-lg font-bold text-gray-900">Admin Panel</span>
            <span className="text-sm text-gray-600">Welcome, {user.email}</span>
          </div>
        </div>
        
        <nav className="mt-6">
          <div className="px-4 mb-4">
            <Link
              to="/"
              className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors duration-200"
            >
              <Home className="h-5 w-5" />
              <span>Back to Website</span>
            </Link>
          </div>
          
          <div className="space-y-1">
            {menuItems.map(item => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-3 px-6 py-3 text-sm font-medium transition-colors duration-200 ${
                  isActive(item.path)
                    ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-600'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-blue-600'
                }`}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.label}</span>
              </Link>
            ))}
          </div>
          
          <div className="px-4 mt-6 pt-6 border-t">
            <button
              onClick={logout}
              className="flex items-center space-x-2 text-gray-600 hover:text-red-600 transition-colors duration-200"
            >
              <LogOut className="h-5 w-5" />
              <span>Logout</span>
            </button>
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;