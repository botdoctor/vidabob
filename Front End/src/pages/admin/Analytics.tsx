import React, { useState, useEffect } from 'react';
import { adminService } from '../../lib/adminService';
import { 
  BarChart3, 
  TrendingUp, 
  DollarSign, 
  Car, 
  Users, 
  Calendar,
  PieChart,
  Activity,
  ArrowUp,
  ArrowDown
} from 'lucide-react';

const Analytics: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [analyticsData, setAnalyticsData] = useState<any>(null);
  const [timeRange, setTimeRange] = useState('30d');

  useEffect(() => {
    fetchAnalyticsData();
  }, [timeRange]);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await adminService.getAnalyticsData(timeRange);
      setAnalyticsData(data);
    } catch (err: any) {
      console.error('Error fetching analytics data:', err);
      setError('Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (error || !analyticsData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Analytics</h2>
          <p className="text-gray-600 mb-4">{error || 'Unable to load analytics data'}</p>
          <button
            onClick={fetchAnalyticsData}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors duration-200"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const formatTimeAgo = (date: string) => {
    const now = new Date();
    const then = new Date(date);
    const diffInSeconds = Math.floor((now.getTime() - then.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;
    return then.toLocaleDateString();
  };

  const getMonthName = (monthYear: string) => {
    const [year, month] = monthYear.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return date.toLocaleDateString('en-US', { month: 'short' });
  };

  // Calculate growth percentages
  const currentMonthRevenue = analyticsData.salesData.monthlySales[analyticsData.salesData.monthlySales.length - 1]?.revenue || 0;
  const previousMonthRevenue = analyticsData.salesData.monthlySales[analyticsData.salesData.monthlySales.length - 2]?.revenue || 0;
  const revenueGrowth = previousMonthRevenue > 0 
    ? ((currentMonthRevenue - previousMonthRevenue) / previousMonthRevenue * 100).toFixed(1)
    : '0';

  const currentMonthBookings = analyticsData.salesData.monthlySales[analyticsData.salesData.monthlySales.length - 1]?.bookings || 0;
  const previousMonthBookings = analyticsData.salesData.monthlySales[analyticsData.salesData.monthlySales.length - 2]?.bookings || 0;
  const bookingsGrowth = previousMonthBookings > 0
    ? ((currentMonthBookings - previousMonthBookings) / previousMonthBookings * 100).toFixed(1)
    : '0';

  const StatCard = ({ title, value, change, icon: Icon, color }: any) => (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
        <div className={`${color} rounded-full p-3`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>
      <div className="mt-4 flex items-center">
        {parseFloat(change) > 0 ? (
          <ArrowUp className="h-4 w-4 text-green-500" />
        ) : parseFloat(change) < 0 ? (
          <ArrowDown className="h-4 w-4 text-red-500" />
        ) : null}
        <span className={`text-sm ml-1 ${parseFloat(change) > 0 ? 'text-green-500' : parseFloat(change) < 0 ? 'text-red-500' : 'text-gray-500'}`}>
          {Math.abs(parseFloat(change))}%
        </span>
        <span className="text-sm text-gray-500 ml-1">from last month</span>
      </div>
    </div>
  );

  // Get totals from vehicle categories
  const totalVehicleRevenue = analyticsData.vehicleCategories.reduce((sum: number, cat: any) => sum + cat.revenue, 0);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="7d">Last 7 days</option>
          <option value="30d">Last 30 days</option>
          <option value="90d">Last 90 days</option>
          <option value="1y">Last year</option>
        </select>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Revenue"
          value={`$${(analyticsData.salesData.totalRevenue / 1000).toFixed(1)}K`}
          change={revenueGrowth}
          icon={DollarSign}
          color="bg-green-500"
        />
        <StatCard
          title="Total Bookings"
          value={analyticsData.salesData.totalBookings}
          change={bookingsGrowth}
          icon={Calendar}
          color="bg-blue-500"
        />
        <StatCard
          title="Active Customers"
          value={analyticsData.customerMetrics.totalCustomers}
          change={((analyticsData.customerMetrics.newCustomersThisMonth / analyticsData.customerMetrics.totalCustomers) * 100).toFixed(1)}
          icon={Users}
          color="bg-purple-500"
        />
        <StatCard
          title="Repeat Customers"
          value={analyticsData.customerMetrics.repeatCustomers}
          change="0"
          icon={Activity}
          color="bg-yellow-500"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Monthly Revenue Chart */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Monthly Revenue</h2>
            <BarChart3 className="h-6 w-6 text-gray-600" />
          </div>
          <div className="space-y-4">
            {analyticsData.salesData.monthlySales.slice(-6).map((data: any, index: number) => {
              const maxRevenue = Math.max(...analyticsData.salesData.monthlySales.slice(-6).map((d: any) => d.revenue));
              return (
                <div key={data.month} className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700 w-12">{getMonthName(data.month)}</span>
                  <div className="flex items-center space-x-4 flex-1">
                    <div className="flex-1 bg-gray-200 rounded-full h-2 mx-4">
                      <div
                        className="bg-green-500 h-2 rounded-full"
                        style={{ width: `${(data.revenue / maxRevenue) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm font-semibold text-gray-900 w-20 text-right">
                      ${(data.revenue / 1000).toFixed(1)}K
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Monthly Bookings Chart */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Monthly Bookings</h2>
            <TrendingUp className="h-6 w-6 text-gray-600" />
          </div>
          <div className="space-y-4">
            {analyticsData.salesData.monthlySales.slice(-6).map((data: any, index: number) => {
              const maxBookings = Math.max(...analyticsData.salesData.monthlySales.slice(-6).map((d: any) => d.bookings));
              return (
                <div key={data.month} className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700 w-12">{getMonthName(data.month)}</span>
                  <div className="flex items-center space-x-4 flex-1">
                    <div className="flex-1 bg-gray-200 rounded-full h-2 mx-4">
                      <div
                        className="bg-blue-500 h-2 rounded-full"
                        style={{ width: maxBookings > 0 ? `${(data.bookings / maxBookings) * 100}%` : '0%' }}
                      />
                    </div>
                    <span className="text-sm font-semibold text-gray-900 w-20 text-right">
                      {data.bookings} bookings
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Vehicle Categories & Top Performers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Vehicle Categories */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Vehicle Categories</h2>
            <PieChart className="h-6 w-6 text-gray-600" />
          </div>
          <div className="space-y-4">
            {analyticsData.vehicleCategories
              .sort((a: any, b: any) => b.revenue - a.revenue)
              .map((category: any, index: number) => (
                <div key={category.category} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700 capitalize">{category.category}</span>
                    <span className="text-sm text-gray-600">{category.count} vehicles</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          index === 0 ? 'bg-blue-500' :
                          index === 1 ? 'bg-green-500' :
                          index === 2 ? 'bg-yellow-500' :
                          index === 3 ? 'bg-purple-500' : 'bg-red-500'
                        }`}
                        style={{ width: totalVehicleRevenue > 0 ? `${(category.revenue / totalVehicleRevenue) * 100}%` : '0%' }}
                      />
                    </div>
                    <span className="text-sm font-semibold text-gray-900">
                      ${(category.revenue / 1000).toFixed(1)}K
                    </span>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Top Performing Vehicles */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Top Performing Vehicles</h2>
          <div className="space-y-4">
            {analyticsData.topPerformingVehicles.length > 0 ? (
              analyticsData.topPerformingVehicles.map((vehicle: any, index: number) => (
                <div key={`${vehicle.make}-${vehicle.model}-${index}`} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="bg-blue-100 rounded-full p-2">
                      <Car className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{vehicle.year} {vehicle.make} {vehicle.model}</p>
                      <p className="text-sm text-gray-600">
                        {vehicle.bookings} bookings
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">${vehicle.revenue.toLocaleString()}</p>
                    <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                      vehicle.type === 'sale' ? 'bg-green-100 text-green-800' : 
                      vehicle.type === 'rental' ? 'bg-blue-100 text-blue-800' :
                      'bg-purple-100 text-purple-800'
                    }`}>
                      {vehicle.type}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-8">No vehicle data available</p>
            )}
          </div>
        </div>
      </div>

      {/* Customer Metrics */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Customer Metrics</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">{analyticsData.customerMetrics.totalCustomers}</div>
            <div className="text-sm text-gray-600">Total Customers</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600">{analyticsData.customerMetrics.newCustomersThisMonth}</div>
            <div className="text-sm text-gray-600">New This Month</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600">{analyticsData.customerMetrics.repeatCustomers}</div>
            <div className="text-sm text-gray-600">Repeat Customers</div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Recent Activity</h2>
        <div className="space-y-4">
          {/* Recent Sales */}
          {analyticsData.recentActivity.sales.map((activity: any) => (
            <div key={activity.id} className="flex items-center space-x-4 p-3 bg-green-50 rounded-lg">
              <div className="bg-green-500 rounded-full p-2">
                <DollarSign className="h-4 w-4 text-white" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900">Vehicle Sale</p>
                <p className="text-sm text-gray-600">{activity.description}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-gray-900">${activity.amount}</p>
                <p className="text-sm text-gray-500">{formatTimeAgo(activity.time)}</p>
              </div>
            </div>
          ))}
          
          {/* Recent Bookings */}
          {analyticsData.recentActivity.bookings.map((activity: any) => (
            <div key={activity.id} className="flex items-center space-x-4 p-3 bg-blue-50 rounded-lg">
              <div className="bg-blue-500 rounded-full p-2">
                <Calendar className="h-4 w-4 text-white" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900">New Booking</p>
                <p className="text-sm text-gray-600">{activity.description}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-gray-900">${activity.amount}</p>
                <p className="text-sm text-gray-500">{formatTimeAgo(activity.time)}</p>
              </div>
            </div>
          ))}
          
          {/* Recent Customers */}
          {analyticsData.recentActivity.customers.map((activity: any) => (
            <div key={activity.id} className="flex items-center space-x-4 p-3 bg-purple-50 rounded-lg">
              <div className="bg-purple-500 rounded-full p-2">
                <Users className="h-4 w-4 text-white" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900">New Customer</p>
                <p className="text-sm text-gray-600">{activity.description}</p>
              </div>
              <span className="text-sm text-gray-500">{formatTimeAgo(activity.time)}</span>
            </div>
          ))}
          
          {(analyticsData.recentActivity.sales.length === 0 && 
            analyticsData.recentActivity.bookings.length === 0 && 
            analyticsData.recentActivity.customers.length === 0) && (
            <p className="text-gray-500 text-center py-8">No recent activity</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Analytics;