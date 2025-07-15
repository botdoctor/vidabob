import api from './api';

export interface DashboardStats {
  stats: {
    totalVehicles: { value: number; change: string };
    totalCustomers: { value: number; change: string };
    activeBookings: { value: number; change: string };
    totalRevenue: { value: number; change: string };
  };
  recentBookings: Array<{
    id: string;
    vehicle: string;
    customer: string;
    startDate: string;
    endDate: string;
    totalCost: number;
    status: string;
    createdAt: string;
  }>;
  vehicleStats: {
    rental: number;
    sale: number;
    both: number;
    total: number;
  };
  resellerStats?: {
    totalResellers: number;
    activeResellers: number;
    totalCommissionsPaid: number;
    resellerBookingsThisMonth: {
      count: number;
      revenue: number;
    };
    topResellers: Array<{
      id: string;
      name: string;
      username: string;
      totalCommissions: number;
      commissionRate: number;
    }>;
  };
}

export interface AnalyticsData {
  salesData: {
    totalRevenue: number;
    totalBookings: number;
    monthlySales: Array<{
      month: string;
      revenue: number;
      bookings: number;
    }>;
  };
  vehicleCategories: Array<{
    category: string;
    count: number;
    revenue: number;
    bookings: number;
  }>;
  topPerformingVehicles: Array<{
    make: string;
    model: string;
    year: number;
    revenue: number;
    bookings: number;
    type: string;
  }>;
  customerMetrics: {
    totalCustomers: number;
    newCustomersThisMonth: number;
    repeatCustomers: number;
  };
  recentActivity: {
    sales: Array<{
      id: string;
      type: string;
      description: string;
      amount: number;
      time: string;
    }>;
    bookings: Array<{
      id: string;
      type: string;
      description: string;
      amount: number;
      time: string;
    }>;
    customers: Array<{
      id: string;
      type: string;
      description: string;
      time: string;
    }>;
  };
}

export const adminService = {
  // Get admin dashboard statistics
  async getDashboardStats(): Promise<DashboardStats> {
    const response = await api.get('/stats/admin/dashboard');
    return response.data;
  },

  // Get admin analytics data
  async getAnalyticsData(timeRange: string = '30d'): Promise<AnalyticsData> {
    const response = await api.get('/stats/admin/analytics', {
      params: { timeRange }
    });
    return response.data;
  }
};