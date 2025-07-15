import React, { useState, useEffect } from 'react';
import { useVehicles } from '../hooks/useVehicles';
import VehicleCardRentalOnly from '../components/VehicleCardRentalOnly';
import { Vehicle } from '../types';
import { availabilityService } from '../lib/availabilityService';
import { bookingService } from '../lib/bookingService';
import { useLanguage } from '../contexts/LanguageContext';
import { Calendar, Clock, DollarSign, User, Phone, Mail, MapPin } from 'lucide-react';
import DatePicker from 'react-datepicker';
import { getImageUrl } from '../utils/imageUrl';

const Rentals: React.FC = () => {
  const { vehicles: dbVehicles, loading: vehiclesLoading, error: vehiclesError } = useVehicles();
  const { t } = useLanguage();
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [showRentalForm, setShowRentalForm] = useState(false);
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null]);
  const [startDate, endDate] = dateRange;
  const filterStartDate = startDate ? startDate.toISOString().split('T')[0] : '';
  const filterEndDate = endDate ? endDate.toISOString().split('T')[0] : '';
  const [availableVehicles, setAvailableVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [rentalDateRange, setRentalDateRange] = useState<[Date | null, Date | null]>([null, null]);
  const [rentalStartDate, rentalEndDate] = rentalDateRange;
  const [rentalData, setRentalData] = useState({
    startDate: '',
    endDate: '',
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    customerAddress: ''
  });

  // Get all rental vehicles (without date filter)
  const allRentalVehicles = dbVehicles.filter(vehicle => 
    vehicle.type === 'rental' || vehicle.type === 'both'
  );

  // Use available vehicles if date range is selected, otherwise show all rental vehicles
  const rentalVehicles = (filterStartDate && filterEndDate) ? availableVehicles : allRentalVehicles;

  // Fetch available vehicles when date range changes
  useEffect(() => {
    const fetchAvailableVehicles = async () => {
      if (!filterStartDate || !filterEndDate) {
        setAvailableVehicles([]);
        setError('');
        return;
      }

      // Validate date range
      if (new Date(filterEndDate) <= new Date(filterStartDate)) {
        setError('End date must be after start date.');
        setAvailableVehicles([]);
        return;
      }

      setLoading(true);
      setError('');

      try {
        // Use the new date range availability service
        const response = await availabilityService.getAvailableVehiclesForRange(filterStartDate, filterEndDate);
        setAvailableVehicles(response.vehicles);
      } catch (err: any) {
        console.error('Error fetching available vehicles:', err);
        setError('Failed to check vehicle availability. Please check your internet connection and try again.');
        setAvailableVehicles([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAvailableVehicles();
  }, [filterStartDate, filterEndDate]);

  const handleRentVehicle = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    // If dates are already selected in the main filter, use them for the rental form
    if (startDate && endDate) {
      setRentalDateRange([startDate, endDate]);
    }
    setShowRentalForm(true);
  };

  const calculateRentalCost = () => {
    if (!selectedVehicle || !rentalStartDate || !rentalEndDate) return 0;
    
    const days = Math.ceil((rentalEndDate.getTime() - rentalStartDate.getTime()) / (1000 * 60 * 60 * 24));
    
    return days * (selectedVehicle.rentalPrice || 0);
  };

  const handleSubmitRental = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedVehicle || !rentalStartDate || !rentalEndDate) return;

    try {
      // Calculate rental details
      const days = Math.ceil((rentalEndDate.getTime() - rentalStartDate.getTime()) / (1000 * 60 * 60 * 24));
      const subtotal = days * (selectedVehicle.rentalPrice || 0);
      
      // Create booking payload matching backend expectations
      const bookingPayload = {
        vehicleId: selectedVehicle.id,
        customerName: rentalData.customerName,
        customerEmail: rentalData.customerEmail,
        customerPhone: rentalData.customerPhone,
        customerAddress: rentalData.customerAddress,
        pickupDate: rentalStartDate.toISOString().split('T')[0],
        returnDate: rentalEndDate.toISOString().split('T')[0],
        pickupTime: '10:00 AM', // Default pickup time
        totalDays: days,
        dailyRate: selectedVehicle.rentalPrice || 0,
        subtotal: subtotal,
        totalCost: subtotal,
        currency: 'USD',
        status: 'confirmed',
        notes: ''
      };

      // Submit booking to backend using public endpoint
      await bookingService.createPublicBooking(bookingPayload);
      
      alert('Rental booking created successfully!');
      
      // Reset form
      setShowRentalForm(false);
      setSelectedVehicle(null);
      setRentalData({
        startDate: '',
        endDate: '',
        customerName: '',
        customerEmail: '',
        customerPhone: '',
        customerAddress: ''
      });
      setRentalDateRange([null, null]);
      
      // Refresh available vehicles if dates are selected
      if (filterStartDate && filterEndDate) {
        const response = await availabilityService.getAvailableVehiclesForRange(filterStartDate, filterEndDate);
        setAvailableVehicles(response.vehicles);
      }
    } catch (error: any) {
      console.error('Error creating booking:', error);
      alert(error.response?.data?.message || 'Failed to create booking. Please try again.');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setRentalData({
      ...rentalData,
      [e.target.name]: e.target.value
    });
  };

  // Show loading state for initial vehicle fetch
  if (vehiclesLoading) {
    return (
      <div className="py-16 bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              {t('rentals.title')}
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Loading rental vehicles...
            </p>
          </div>
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="bg-white rounded-lg shadow-md p-6 animate-pulse">
                <div className="h-48 bg-gray-200 rounded-lg mb-4"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded mb-2 w-2/3"></div>
                <div className="h-4 bg-gray-200 rounded w-1/3"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Show error state for vehicle fetch
  if (vehiclesError) {
    return (
      <div className="py-16 bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              {t('rentals.title')}
            </h1>
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded max-w-md mx-auto">
              <p className="font-bold">Error loading vehicles</p>
              <p className="text-sm">{vehiclesError}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-16 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {t('rentals.title')}
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {t('rentals.description')}
          </p>
        </div>

        {/* Rental Benefits */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="bg-white rounded-lg p-6 text-center shadow-md">
            <Clock className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('rentals.flexibleDuration')}</h3>
            <p className="text-gray-600 text-sm">{t('rentals.flexibleDesc')}</p>
          </div>
          <div className="bg-white rounded-lg p-6 text-center shadow-md">
            <DollarSign className="h-12 w-12 text-green-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('rentals.competitiveRates')}</h3>
            <p className="text-gray-600 text-sm">{t('rentals.competitiveDesc')}</p>
          </div>
          <div className="bg-white rounded-lg p-6 text-center shadow-md">
            <Calendar className="h-12 w-12 text-purple-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('rentals.easyBooking')}</h3>
            <p className="text-gray-600 text-sm">{t('rentals.easyBookingDesc')}</p>
          </div>
        </div>

        {/* Date Range Filter */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-col space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('rentals.checkAvailability')}</h3>
              <p className="text-gray-600 text-sm">{t('rentals.selectDates')}</p>
            </div>
            
            <div className="flex flex-col items-center">
              <label className="block text-sm font-medium text-gray-700 mb-2 text-center">
                <Calendar className="h-4 w-4 inline mr-1" />
                Select Rental Period
              </label>
              <div className="flex flex-col items-center">
                <DatePicker
                  selectsRange={true}
                  startDate={startDate}
                  endDate={endDate}
                  onChange={(update) => {
                    setDateRange(update as [Date | null, Date | null]);
                  }}
                  minDate={new Date()}
                  monthsShown={2}
                  inline
                  calendarClassName="border border-gray-300 rounded-lg shadow-lg"
                  dayClassName={(date) => {
                    const isInRange = startDate && endDate && date >= startDate && date <= endDate;
                    const isStart = startDate && date.toDateString() === startDate.toDateString();
                    const isEnd = endDate && date.toDateString() === endDate.toDateString();
                    
                    if (isStart || isEnd) {
                      return 'bg-blue-600 text-white hover:bg-blue-700 rounded-full';
                    }
                    if (isInRange) {
                      return 'bg-blue-100 text-blue-900';
                    }
                    return 'hover:bg-gray-100';
                  }}
                />
              </div>
              
              {(startDate || endDate) && (
                <div className="flex flex-col items-center space-y-2 mt-4">
                  <button
                    onClick={() => {
                      setDateRange([null, null]);
                    }}
                    className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors duration-200 whitespace-nowrap border border-gray-300"
                  >
                    Clear Dates
                  </button>
                  {startDate && endDate && (
                    <div className="text-sm text-gray-600 text-center">
                      {Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))} days selected
                    </div>
                  )}
                </div>
              )}
            </div>
          
          {(filterStartDate && filterEndDate) && (
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                <span className="font-medium">Rental Period:</span> {new Date(filterStartDate).toLocaleDateString('en-US', { 
                  month: 'short', 
                  day: 'numeric' 
                })} - {new Date(filterEndDate).toLocaleDateString('en-US', { 
                  month: 'short', 
                  day: 'numeric',
                  year: 'numeric'
                })} ({Math.ceil((new Date(filterEndDate).getTime() - new Date(filterStartDate).getTime()) / (1000 * 60 * 60 * 24))} days)
              </p>
              {loading ? (
                <p className="text-sm text-blue-600 mt-1">Checking availability...</p>
              ) : error ? (
                <p className="text-sm text-red-600 mt-1">{error}</p>
              ) : (
                <p className="text-sm text-blue-600 mt-1">
                  {rentalVehicles.length} vehicle{rentalVehicles.length !== 1 ? 's' : ''} available
                </p>
              )}
            </div>
          )}
          </div>
        </div>

        {/* Available Rental Vehicles */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            {(filterStartDate && filterEndDate) ? 'Available' : 'All'} Rental Vehicles
            {(filterStartDate && filterEndDate) && (
              <span className="text-lg font-normal text-gray-600 ml-2">
                ({rentalVehicles.length} available)
              </span>
            )}
          </h2>
          
          {loading ? (
            <div className="text-center py-12 bg-white rounded-lg shadow-md">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Checking Availability...
              </h3>
              <p className="text-gray-600">
                Please wait while we check which vehicles are available.
              </p>
            </div>
          ) : error ? (
            <div className="text-center py-12 bg-white rounded-lg shadow-md">
              <Calendar className="h-16 w-16 text-red-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Error Checking Availability
              </h3>
              <p className="text-gray-600 mb-4">{error}</p>
              <button
                onClick={() => {
                  setFilterStartDate('');
                  setFilterEndDate('');
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors duration-200"
              >
                View All Vehicles
              </button>
            </div>
          ) : rentalVehicles.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow-md">
              <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {(filterStartDate && filterEndDate) ? 'No vehicles available' : 'No rental vehicles found'}
              </h3>
              <p className="text-gray-600 mb-4">
                {(filterStartDate && filterEndDate)
                  ? 'All vehicles are rented during the selected dates. Please try different dates.' 
                  : 'We currently don\'t have any vehicles available for rental.'
                }
              </p>
              {(filterStartDate && filterEndDate) && (
                <button
                  onClick={() => {
                    setFilterStartDate('');
                    setFilterEndDate('');
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors duration-200"
                >
                  View All Vehicles
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {rentalVehicles.map(vehicle => (
                <VehicleCardRentalOnly 
                  key={vehicle.id} 
                  vehicle={vehicle} 
                  showRentButton={true}
                  onRent={handleRentVehicle}
                />
              ))}
            </div>
          )}
        </div>

        {/* Rental Form Modal */}
        {showRentalForm && selectedVehicle && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">
                    Rent {selectedVehicle.make} {selectedVehicle.model}
                  </h2>
                  <button
                    onClick={() => setShowRentalForm(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ✕
                  </button>
                </div>

                <form onSubmit={handleSubmitRental} className="space-y-6">
                  {/* Vehicle Info */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center space-x-4">
                      <img
                        src={getImageUrl(selectedVehicle.primaryImage || selectedVehicle.image)}
                        alt={`${selectedVehicle.make} ${selectedVehicle.model}`}
                        className="w-20 h-16 object-cover rounded"
                      />
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {selectedVehicle.year} {selectedVehicle.make} {selectedVehicle.model}
                        </h3>
                        <p className="text-blue-600 font-semibold">
                          ${selectedVehicle.rentalPrice}/day
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Rental Dates */}
                  <div className="flex flex-col items-center">
                    <label className="block text-sm font-medium text-gray-700 mb-2 text-center">
                      Select Rental Period *
                    </label>
                    <DatePicker
                      selectsRange={true}
                      startDate={rentalStartDate}
                      endDate={rentalEndDate}
                      onChange={(update) => {
                        setRentalDateRange(update as [Date | null, Date | null]);
                      }}
                      minDate={new Date()}
                      monthsShown={2}
                      inline
                      className="border border-gray-300 rounded-lg"
                      calendarClassName="!font-sans"
                    />
                    {rentalStartDate && rentalEndDate && (
                      <div className="mt-2 text-sm text-gray-600 text-center">
                        Selected: {rentalStartDate.toLocaleDateString()} - {rentalEndDate.toLocaleDateString()} 
                        ({Math.ceil((rentalEndDate.getTime() - rentalStartDate.getTime()) / (1000 * 60 * 60 * 24))} days)
                      </div>
                    )}
                  </div>

                  {/* Customer Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">Customer Information</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          name="customerName"
                          value={rentalData.customerName}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email *
                        </label>
                        <input
                          type="email"
                          name="customerEmail"
                          value={rentalData.customerEmail}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Phone *
                        </label>
                        <input
                          type="tel"
                          name="customerPhone"
                          value={rentalData.customerPhone}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Address *
                        </label>
                        <input
                          type="text"
                          name="customerAddress"
                          value={rentalData.customerAddress}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Cost Summary */}
                  {rentalStartDate && rentalEndDate && (
                    <div className="bg-blue-50 rounded-lg p-4">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Rental Summary</h3>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span>Daily Rate:</span>
                          <span>${selectedVehicle.rentalPrice}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Duration:</span>
                          <span>{Math.ceil((rentalEndDate.getTime() - rentalStartDate.getTime()) / (1000 * 60 * 60 * 24))} days</span>
                        </div>
                        <div className="flex justify-between font-semibold text-lg border-t pt-2">
                          <span>Total Cost:</span>
                          <span>${calculateRentalCost()}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex space-x-4">
                    <button
                      type="button"
                      onClick={() => setShowRentalForm(false)}
                      className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-3 px-6 rounded-lg font-semibold transition-colors duration-200"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-semibold transition-colors duration-200"
                    >
                      Book Rental
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Rentals;