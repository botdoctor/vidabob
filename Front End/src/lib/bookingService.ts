import api from './api';

export interface Booking {
  id: string;
  vehicleId: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  startDate: string;
  endDate: string;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'active' | 'completed' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'refunded';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBookingDto {
  vehicleId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  startDate: string;
  endDate: string;
  notes?: string;
}

export const bookingService = {
  // Get all bookings
  async getAllBookings(): Promise<Booking[]> {
    const response = await api.get<{ bookings: Booking[] }>('/bookings');
    return response.data.bookings;
  },

  // Get booking by ID
  async getBookingById(id: string): Promise<Booking> {
    const response = await api.get<{ booking: Booking }>(`/bookings/${id}`);
    return response.data.booking;
  },

  // Create new booking
  async createBooking(bookingData: CreateBookingDto): Promise<Booking> {
    const response = await api.post<{ booking: Booking }>('/bookings', bookingData);
    return response.data.booking;
  },

  // Create public booking (no authentication required)
  async createPublicBooking(bookingData: any): Promise<Booking> {
    const response = await api.post<{ booking: Booking }>('/bookings/public', bookingData);
    return response.data.booking;
  },

  // Update booking
  async updateBooking(id: string, updates: Partial<Booking>): Promise<Booking> {
    const response = await api.put<{ booking: Booking }>(`/bookings/${id}`, updates);
    return response.data.booking;
  },

  // Cancel booking
  async cancelBooking(id: string): Promise<void> {
    await api.delete(`/bookings/${id}`);
  },

  // Get booking stats (admin only)
  async getBookingStats(): Promise<any> {
    const response = await api.get('/bookings/admin/stats');
    return response.data;
  }
};