import React, { useState } from 'react';
import { useBookings } from '../../hooks/useBookings';
import { useVehicles } from '../../hooks/useVehicles';
import { Calendar, Search, Filter, Eye, Edit, CheckCircle, XCircle } from 'lucide-react';

const RentalManagement: React.FC = () => {
  const { bookings, loading, error, updateBooking, cancelBooking } = useBookings();
  const { vehicles } = useVehicles();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedRental, setSelectedRental] = useState<any>(null);

  const filteredRentals = bookings.filter(booking => {
    const vehicle = vehicles.find(v => v.id === (booking.vehicleId?._id || booking.vehicleId));
    
    const matchesSearch = searchTerm === '' || 
      (vehicle && `${vehicle.make} ${vehicle.model}`.toLowerCase().includes(searchTerm.toLowerCase())) ||
      booking.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.customerEmail.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (statusFilter === 'all') return matchesSearch;
    return matchesSearch && booking.status === statusFilter;
  });

  const handleStatusChange = async (bookingId: string, newStatus: 'pending' | 'confirmed' | 'cancelled' | 'completed') => {
    try {
      await updateBooking(bookingId, { status: newStatus });
    } catch (err) {
      console.error('Failed to update booking status:', err);
      alert('Failed to update booking status');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const calculateDuration = (startDate: Date, endDate: Date) => {
    const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    return days;
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Rental Management</h1>
        </div>
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <div className="text-gray-500">Loading bookings...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Rental Management</h1>
        </div>
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <Calendar className="h-12 w-12 text-red-400 mx-auto mb-4" />
          <div className="text-red-600 text-lg mb-2">Failed to load bookings</div>
          <div className="text-gray-500">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Rental Management</h1>
        <div className="text-sm text-gray-600">
          Total Bookings: {bookings.length}
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by vehicle or customer..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="h-5 w-5 text-gray-600" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Rental Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rental ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vehicle</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Cost</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredRentals.map(booking => {
                const vehicle = vehicles.find(v => v.id === (booking.vehicleId?._id || booking.vehicleId));
                const startDate = new Date(booking.pickupDate);
                const endDate = new Date(booking.returnDate);
                const duration = booking.totalDays || calculateDuration(startDate, endDate);
                
                return (
                  <tr key={booking.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      #{booking.id.slice(-6)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {vehicle && (
                          <>
                            <img
                              src={vehicle.image}
                              alt={`${vehicle.make} ${vehicle.model}`}
                              className="w-12 h-8 object-cover rounded mr-4"
                            />
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {vehicle.year} {vehicle.make} {vehicle.model}
                              </div>
                              <div className="text-sm text-gray-500">{vehicle.color}</div>
                            </div>
                          </>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{booking.customerName}</div>
                        <div className="text-sm text-gray-500">{booking.customerEmail}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {startDate.toLocaleDateString()} - {endDate.toLocaleDateString()}
                      </div>
                      <div className="text-sm text-gray-500">{duration} days</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      ${booking.totalCost}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(booking.status)}`}>
                        {booking.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => setSelectedRental(booking)}
                          className="text-blue-600 hover:text-blue-900"
                          title="View Details"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        {booking.status === 'confirmed' && (
                          <>
                            <button
                              onClick={() => handleStatusChange(booking.id, 'completed')}
                              className="text-green-600 hover:text-green-900"
                              title="Mark as Completed"
                            >
                              <CheckCircle className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleStatusChange(booking.id, 'cancelled')}
                              className="text-red-600 hover:text-red-900"
                              title="Cancel Rental"
                            >
                              <XCircle className="h-4 w-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {filteredRentals.length === 0 && (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <div className="text-gray-500 text-lg">
            {searchTerm || statusFilter !== 'all' ? 'No rentals found matching your criteria.' : 'No rentals yet.'}
          </div>
        </div>
      )}

      {/* Rental Details Modal */}
      {selectedRental && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  Rental Details #{selectedRental.id.slice(-6)}
                </h2>
                <button
                  onClick={() => setSelectedRental(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-6">
                {/* Vehicle Info */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Vehicle Information</h3>
                  {(() => {
                    const vehicle = vehicles.find(v => v.id === (selectedRental.vehicleId?._id || selectedRental.vehicleId));
                    return vehicle ? (
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center space-x-4">
                          <img
                            src={vehicle.image}
                            alt={`${vehicle.make} ${vehicle.model}`}
                            className="w-20 h-16 object-cover rounded"
                          />
                          <div>
                            <h4 className="font-semibold text-gray-900">
                              {vehicle.year} {vehicle.make} {vehicle.model}
                            </h4>
                            <p className="text-gray-600">{vehicle.color}</p>
                            <p className="text-blue-600 font-semibold">
                              ${vehicle.rentalPrice}/day
                            </p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <p className="text-gray-500">Vehicle information not available</p>
                    );
                  })()}
                </div>

                {/* Customer Info */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Customer Information</h3>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                    <p><span className="font-medium">Name:</span> {selectedRental.customerName}</p>
                    <p><span className="font-medium">Email:</span> {selectedRental.customerEmail}</p>
                    <p><span className="font-medium">Phone:</span> {selectedRental.customerPhone}</p>
                    {selectedRental.customerAddress && (
                      <p><span className="font-medium">Address:</span> {selectedRental.customerAddress}</p>
                    )}
                  </div>
                </div>

                {/* Rental Details */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Rental Details</h3>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                    <p><span className="font-medium">Pickup Date:</span> {new Date(selectedRental.pickupDate).toLocaleDateString()}</p>
                    <p><span className="font-medium">Return Date:</span> {new Date(selectedRental.returnDate).toLocaleDateString()}</p>
                    <p><span className="font-medium">Pickup Time:</span> {selectedRental.pickupTime}</p>
                    <p><span className="font-medium">Duration:</span> {selectedRental.totalDays} days</p>
                    <p><span className="font-medium">Total Cost:</span> ${selectedRental.totalCost}</p>
                    <p><span className="font-medium">Status:</span> 
                      <span className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedRental.status)}`}>
                        {selectedRental.status}
                      </span>
                    </p>
                    <p><span className="font-medium">Booked On:</span> {new Date(selectedRental.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>

                {/* Actions */}
                {selectedRental.status === 'confirmed' && (
                  <div className="flex space-x-4">
                    <button
                      onClick={() => {
                        handleStatusChange(selectedRental.id, 'completed');
                        setSelectedRental(null);
                      }}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg font-semibold transition-colors duration-200"
                    >
                      Mark as Completed
                    </button>
                    <button
                      onClick={() => {
                        handleStatusChange(selectedRental.id, 'cancelled');
                        setSelectedRental(null);
                      }}
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg font-semibold transition-colors duration-200"
                    >
                      Cancel Rental
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RentalManagement;