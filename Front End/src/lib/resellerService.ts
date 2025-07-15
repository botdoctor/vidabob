import api from './api';
import { Vehicle } from '../types';

export interface ResellerUser {
  id: string;
  username: string;
  email?: string;
  firstName: string;
  lastName: string;
  commissionRate: number;
  totalCommissions: number;
  isActive: boolean;
  createdAt: string;
}

export interface BookingData {
  vehicleId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  pickupDate: string;
  returnDate: string;
  pickupTime: string;
  notes?: string;
  upchargePercentage: number;
  upcharge?: number;
  totalDays: number;
  dailyRate: number;
  subtotal: number;
  totalCost: number;
  currency: 'USD' | 'CRC';
}

export const resellerService = {
  // Get all resellers (admin only)
  async getResellers(): Promise<{ resellers: ResellerUser[] }> {
    const response = await api.get('/users/role/resellers');
    return response.data;
  },

  // Create a new reseller (admin only)
  async createReseller(resellerData: {
    username: string;
    firstName: string;
    lastName: string;
    email?: string;
    password: string;
    commissionRate: number;
  }): Promise<{ message: string; reseller: ResellerUser }> {
    const response = await api.post('/users/role/resellers', resellerData);
    return response.data;
  },

  // Update reseller commission rate (admin only)
  async updateCommissionRate(resellerId: string, commissionRate: number): Promise<{ message: string; reseller: ResellerUser }> {
    const response = await api.put(`/users/${resellerId}/commission`, { commissionRate });
    return response.data;
  },

  // Toggle reseller active status (admin only)
  async updateResellerStatus(resellerId: string, isActive: boolean): Promise<{ message: string; user: ResellerUser }> {
    const response = await api.put(`/users/${resellerId}`, { isActive });
    return response.data;
  },

  // Submit a booking as a reseller
  async submitBooking(bookingData: BookingData): Promise<{ message: string; booking: any }> {
    const response = await api.post('/bookings', bookingData);
    return response.data;
  },

  // Get reseller's bookings
  async getResellerBookings(resellerId: string): Promise<{ bookings: any[] }> {
    const response = await api.get(`/users/${resellerId}/reseller-bookings`);
    return response.data;
  },

  // Get reseller dashboard statistics
  async getDashboardStats(): Promise<{
    stats: {
      totalSales: { value: number; change: string };
      activeCustomers: { value: number; change: string };
      commissionEarned: { value: string; change: string };
      performanceRating: { value: string; change: string };
    };
    recentActivity: Array<{
      id: string;
      type: string;
      description: string;
      time: string;
      amount: string | null;
    }>;
    reseller: {
      name: string;
      commissionRate: number;
    };
  }> {
    const response = await api.get('/users/reseller/dashboard-stats');
    return response.data;
  },
};