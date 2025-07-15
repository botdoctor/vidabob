import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { resellerService } from '../../lib/resellerService';
import { useLanguage } from '../../contexts/LanguageContext';
import { 
  Car, 
  Users, 
  DollarSign, 
  TrendingUp,
  Calendar,
  Target,
  Award,
  Clock
} from 'lucide-react';

const ResellerDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { t } = useLanguage();
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
      const data = await resellerService.getDashboardStats();
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
          <p className="text-gray-600">{t('reseller.loadingDashboard')}</p>
        </div>
      </div>
    );
  }

  if (error || !dashboardData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{t('reseller.errorLoadingDashboard')}</h2>
          <p className="text-gray-600 mb-4">{error || t('reseller.unableToLoadDashboard')}</p>
          <button
            onClick={fetchDashboardData}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors duration-200"
          >
            {t('reseller.retry')}
          </button>
        </div>
      </div>
    );
  }

  const stats = [
    {
      title: t('reseller.totalSales'),
      value: dashboardData.stats.totalSales.value,
      change: dashboardData.stats.totalSales.change,
      icon: Car,
      color: 'bg-blue-500'
    },
    {
      title: t('reseller.activeCustomers'),
      value: dashboardData.stats.activeCustomers.value,
      change: dashboardData.stats.activeCustomers.change,
      icon: Users,
      color: 'bg-green-500'
    },
    {
      title: t('reseller.commissionEarned'),
      value: dashboardData.stats.commissionEarned.value,
      change: dashboardData.stats.commissionEarned.change,
      icon: DollarSign,
      color: 'bg-yellow-500'
    },
    {
      title: t('reseller.commission') + ' %',
      value: `${dashboardData.reseller.commissionRate}%`,
      change: '',
      icon: TrendingUp,
      color: 'bg-purple-500'
    }
  ];

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

  // Placeholder tasks (could be fetched from API in the future)
  const upcomingTasks = [
    {
      id: 1,
      task: 'Follow up with potential customers',
      deadline: 'Today, 3:00 PM',
      priority: 'high'
    },
    {
      id: 2,
      task: 'Review new vehicle inventory',
      deadline: 'Tomorrow, 10:00 AM',
      priority: 'medium'
    },
    {
      id: 3,
      task: 'Submit monthly sales report',
      deadline: 'Friday, 5:00 PM',
      priority: 'high'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {t('reseller.welcomeBack')}, {dashboardData.reseller.name}!
            </h1>
            <p className="text-gray-600 mt-1">
              {t('reseller.dashboardDescription')}
            </p>
          </div>
          <div className="bg-blue-100 p-3 rounded-full">
            <Award className="h-8 w-8 text-blue-600" />
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                  {stat.change && <p className="text-sm text-green-600 mt-1">{stat.change}</p>}
                </div>
                <div className={`${stat.color} p-3 rounded-full`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">{t('reseller.recentActivity')}</h2>
            <button
              onClick={() => navigate('/reseller/vehicles')}
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              {t('reseller.viewAllBookings')}
            </button>
          </div>
          <div className="space-y-4">
            {dashboardData.recentActivity.length === 0 ? (
              <p className="text-gray-500 text-center py-8">{t('reseller.noRecentActivity')}</p>
            ) : (
              dashboardData.recentActivity.map((activity: any) => (
                <div key={activity.id} className="flex items-start space-x-3">
                  <div className={`p-2 rounded-full ${
                    activity.type === 'sale' ? 'bg-green-100' : 'bg-blue-100'
                  }`}>
                    <Car className={`h-4 w-4 ${
                      activity.type === 'sale' ? 'text-green-600' : 'text-blue-600'
                    }`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900">{activity.description}</p>
                    <p className="text-xs text-gray-500 mt-1">{formatTimeAgo(activity.time)}</p>
                  </div>
                  {activity.amount && (
                    <span className="text-sm font-medium text-green-600">
                      {activity.amount}
                    </span>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Upcoming Tasks */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">{t('reseller.upcomingTasks')}</h2>
          </div>
          <div className="space-y-4">
            {upcomingTasks.map((task) => (
              <div key={task.id} className="border border-gray-200 rounded-lg p-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{task.task}</p>
                    <div className="flex items-center mt-1 text-xs text-gray-500">
                      <Clock className="h-3 w-3 mr-1" />
                      {task.deadline}
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    task.priority === 'high' 
                      ? 'bg-red-100 text-red-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {task.priority}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResellerDashboard;