import { useState, useEffect } from 'react';
import { bookingService, Booking } from '../lib/bookingService';

export const useBookings = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError(null);
      const fetchedBookings = await bookingService.getAllBookings();
      setBookings(fetchedBookings);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch bookings');
      console.error('Error fetching bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateBooking = async (id: string, updates: Partial<Booking>) => {
    try {
      await bookingService.updateBooking(id, updates);
      await fetchBookings(); // Refresh the list
    } catch (err) {
      console.error('Error updating booking:', err);
      throw err;
    }
  };

  const cancelBooking = async (id: string) => {
    try {
      await bookingService.cancelBooking(id);
      await fetchBookings(); // Refresh the list
    } catch (err) {
      console.error('Error cancelling booking:', err);
      throw err;
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  return {
    bookings,
    loading,
    error,
    refetch: fetchBookings,
    updateBooking,
    cancelBooking
  };
};