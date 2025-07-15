import { useState, useEffect } from 'react';
import api from '../lib/api';

export interface Customer {
  _id: string;
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  totalBookings?: number;
  totalSpent?: number;
}

export const useCustomers = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch all users with role 'customer'
      const response = await api.get('/users', {
        params: { role: 'customer' }
      });
      
      // Transform the data
      const customersData = response.data.users.map((user: any) => ({
        ...user,
        id: user._id || user.id,
        name: `${user.firstName} ${user.lastName}`,
      }));
      
      // Fetch booking stats for each customer
      const customersWithStats = await Promise.all(
        customersData.map(async (customer: any) => {
          try {
            const bookingsResponse = await api.get(`/users/${customer._id}/bookings`);
            const bookings = bookingsResponse.data.bookings || [];
            
            const totalSpent = bookings.reduce((sum: number, booking: any) => {
              if (booking.status !== 'cancelled') {
                return sum + (booking.totalCost || 0);
              }
              return sum;
            }, 0);
            
            return {
              ...customer,
              totalBookings: bookings.length,
              totalSpent
            };
          } catch (err) {
            // If we can't get booking stats, return customer without them
            return {
              ...customer,
              totalBookings: 0,
              totalSpent: 0
            };
          }
        })
      );
      
      setCustomers(customersWithStats);
    } catch (err: any) {
      console.error('Error fetching customers:', err);
      setError(err.response?.data?.error || 'Failed to fetch customers');
    } finally {
      setLoading(false);
    }
  };

  const deleteCustomer = async (customerId: string) => {
    try {
      await api.delete(`/users/${customerId}`);
      await fetchCustomers(); // Refresh the list
      return true;
    } catch (err: any) {
      console.error('Error deleting customer:', err);
      throw new Error(err.response?.data?.error || 'Failed to delete customer');
    }
  };

  const updateCustomer = async (customerId: string, updates: Partial<Customer>) => {
    try {
      await api.put(`/users/${customerId}`, updates);
      await fetchCustomers(); // Refresh the list
      return true;
    } catch (err: any) {
      console.error('Error updating customer:', err);
      throw new Error(err.response?.data?.error || 'Failed to update customer');
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  return {
    customers,
    loading,
    error,
    refetch: fetchCustomers,
    deleteCustomer,
    updateCustomer
  };
};