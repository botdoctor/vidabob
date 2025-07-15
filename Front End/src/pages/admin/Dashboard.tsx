import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminService } from '../../lib/adminService';
import { Car, Users, Calendar, DollarSign, TrendingUp, Activity, ShoppingCart } from 'lucide-react';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [dashboardData, setDashboardData] = useState<any>(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await adminService.getDashboardStats();
      setDashboardData(data);
    } catch (err: any) {
      console.error('Error fetching dashboard data:', err);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error || !dashboardData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Dashboard</h2>
          <p className="text-gray-600 mb-4">{error || 'Unable to load dashboard data'}</p>
          <button
            onClick={fetchDashboardData}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors duration-200"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const stats = [
    {
      title: 'Total Vehicles',
      value: dashboardData.stats.totalVehicles.value,
      icon: Car,
      color: 'bg-blue-500',
      change: dashboardData.stats.totalVehicles.change
    },
    {
      title: 'Total Customers',
      value: dashboardData.stats.totalCustomers.value,
      icon: Users,
      color: 'bg-green-500',
      change: dashboardData.stats.totalCustomers.change
    },
    {
      title: 'Active Bookings',
      value: dashboardData.stats.activeBookings.value,
      icon: Calendar,
      color: 'bg-yellow-500',
      change: dashboardData.stats.activeBookings.change
    },
    {
      title: 'Total Revenue',
      value: `$${dashboardData.stats.totalRevenue.value.toLocaleString()}`,
      icon: DollarSign,
      color: 'bg-purple-500',
      change: dashboardData.stats.totalRevenue.change
    }
  ];

  // Add vehicles sold stat if it exists
  if (dashboardData.stats.vehiclesSold) {
    stats.push({
      title: 'Vehicles Sold',
      value: dashboardData.stats.vehiclesSold.value,
      icon: ShoppingCart,
      color: 'bg-orange-500',
      change: dashboardData.stats.vehiclesSold.change
    });
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTimeAgo = (date: string) => {
    const now = new Date();
    const then = new Date(date);
    const diffInSeconds = Math.floor((now.getTime() - then.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;
    return formatDate(date);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome to the Viida Motors admin panel</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <div className={`${stat.color} rounded-full p-3`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <TrendingUp className={`h-4 w-4 ${parseFloat(stat.change) >= 0 ? 'text-green-500' : 'text-red-500'}`} />
              <span className={`text-sm ml-1 ${parseFloat(stat.change) >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {parseFloat(stat.change) >= 0 ? '+' : ''}{stat.change}%
              </span>
              <span className="text-sm text-gray-500 ml-1">from last month</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Bookings */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Bookings</h2>
          <div className="space-y-4">
            {dashboardData.recentBookings.length > 0 ? (
              dashboardData.recentBookings.slice(0, 5).map((booking: any) => (
                <div key={booking.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-semibold text-gray-900">
                      {booking.vehicle}
                    </p>
                    <p className="text-sm text-gray-600">
                      {formatDate(booking.startDate)} - {formatDate(booking.endDate)}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Customer: {booking.customer}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">${booking.totalCost}</p>
                    <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                      booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                      booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      booking.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {booking.status}
                    </span>
                    <p className="text-xs text-gray-500 mt-1">
                      {formatTimeAgo(booking.createdAt)}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-8">No bookings yet</p>
            )}
          </div>
        </div>

        {/* Reseller Statistics */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Reseller Network</h2>
          {dashboardData.resellerStats ? (
            <>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Total Resellers</span>
                  <span className="font-semibold text-gray-900">
                    {dashboardData.resellerStats.totalResellers}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Active Resellers</span>
                  <span className="font-semibold text-green-600">
                    {dashboardData.resellerStats.activeResellers}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Total Commissions Paid</span>
                  <span className="font-semibold text-blue-600">
                    ${dashboardData.resellerStats.totalCommissionsPaid.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Reseller Bookings (This Month)</span>
                  <span className="font-semibold text-purple-600">
                    {dashboardData.resellerStats.resellerBookingsThisMonth.count}
                  </span>
                </div>
              </div>
              
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Top Performing Resellers</h3>
                <div className="space-y-3">
                  {dashboardData.resellerStats.topResellers.length > 0 ? (
                    dashboardData.resellerStats.topResellers.slice(0, 3).map((reseller) => (
                      <div key={reseller.id} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold">
                            {reseller.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">{reseller.name}</p>
                            <p className="text-xs text-gray-500">@{reseller.username}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-semibold text-gray-900">
                            ${reseller.totalCommissions.toLocaleString()}
                          </p>
                          <p className="text-xs text-gray-500">{reseller.commissionRate}% rate</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-sm text-center py-4">No reseller data available</p>
                  )}
                </div>
                {dashboardData.resellerStats.topResellers.length > 3 && (
                  <button 
                    onClick={() => navigate('/admin/resellers')}
                    className="mt-4 text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    View All Resellers →
                  </button>
                )}
              </div>
            </>
          ) : (
            <p className="text-gray-500 text-center py-8">No reseller data available</p>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button 
            onClick={() => navigate('/admin/vehicles')}
            className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-semibold transition-colors duration-200"
          >
            Add New Vehicle
          </button>
          <button 
            onClick={() => navigate('/admin/rentals')}
            className="bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-lg font-semibold transition-colors duration-200"
          >
            Process Rental
          </button>
          <button 
            onClick={() => navigate('/admin/analytics')}
            className="bg-purple-600 hover:bg-purple-700 text-white py-3 px-6 rounded-lg font-semibold transition-colors duration-200"
          >
            View Analytics
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;