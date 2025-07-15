import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { useVehicles } from '../../hooks/useVehicles';
import { availabilityService } from '../../lib/availabilityService';
import { resellerService } from '../../lib/resellerService';
import { Vehicle } from '../../types';
import { Calendar, DollarSign, Calculator, TrendingUp, Clock, Car, Gauge, Settings } from 'lucide-react';

const ResellerVehicles: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { vehicles, loading: vehiclesLoading, error: vehiclesError } = useVehicles();
  const { t } = useLanguage();
  const [filterStartDate, setFilterStartDate] = useState('');
  const [filterEndDate, setFilterEndDate] = useState('');
  const [availableVehicles, setAvailableVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [upchargePercentage, setUpchargePercentage] = useState(0);
  const [bookingData, setBookingData] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    pickupTime: '10:00',
    notes: ''
  });

  // User's commission rate (from backend)
  const commissionRate = user?.commissionRate || 10; // Default 10% if not set

  // Get all rental vehicles (without date filter)
  const allRentalVehicles = vehicles.filter(vehicle => 
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

      if (new Date(filterEndDate) <= new Date(filterStartDate)) {
        setError('End date must be after start date.');
        setAvailableVehicles([]);
        return;
      }

      setLoading(true);
      setError('');

      try {
        const response = await availabilityService.getAvailableVehiclesForRange(filterStartDate, filterEndDate);
        setAvailableVehicles(response.vehicles);
      } catch (err: any) {
        console.error('Error fetching available vehicles:', err);
        setError('Failed to check vehicle availability. Please try again.');
        setAvailableVehicles([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAvailableVehicles();
  }, [filterStartDate, filterEndDate]);

  const calculatePricing = (vehicle: Vehicle) => {
    if (!filterStartDate || !filterEndDate) return null;

    const days = Math.ceil((new Date(filterEndDate).getTime() - new Date(filterStartDate).getTime()) / (1000 * 60 * 60 * 24));
    const basePrice = vehicle.rentalPrice || 0;
    const subtotal = basePrice * days;
    const upchargeAmount = (subtotal * upchargePercentage) / 100;
    const totalWithUpcharge = subtotal + upchargeAmount;
    const commissionAmount = (subtotal * commissionRate) / 100;
    const totalEarnings = commissionAmount + upchargeAmount;
    const clientTotal = totalWithUpcharge;

    return {
      days,
      basePrice,
      subtotal,
      upchargeAmount,
      totalWithUpcharge,
      commissionAmount,
      totalEarnings,
      clientTotal
    };
  };

  const handleBookVehicle = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setShowBookingModal(true);
  };

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedVehicle || !filterStartDate || !filterEndDate) return;

    const pricing = calculatePricing(selectedVehicle);
    if (!pricing) return;

    try {
      const bookingPayload = {
        vehicleId: selectedVehicle.id,
        customerName: bookingData.customerName,
        customerEmail: bookingData.customerEmail,
        customerPhone: bookingData.customerPhone,
        pickupDate: filterStartDate,
        returnDate: filterEndDate,
        pickupTime: bookingData.pickupTime,
        notes: bookingData.notes,
        upchargePercentage: upchargePercentage,
        upcharge: pricing.upchargeAmount,
        totalDays: pricing.days,
        dailyRate: pricing.basePrice,
        subtotal: pricing.subtotal,
        totalCost: pricing.clientTotal,
        currency: 'USD' as const,
      };

      const response = await resellerService.submitBooking(bookingPayload);
      alert(t('reseller.bookingSuccess'));
      
      setShowBookingModal(false);
      setSelectedVehicle(null);
      setBookingData({
        customerName: '',
        customerEmail: '',
        customerPhone: '',
        pickupTime: '10:00',
        notes: ''
      });
      
      // Refresh available vehicles
      if (filterStartDate && filterEndDate) {
        const availabilityResponse = await availabilityService.getAvailableVehiclesForRange(filterStartDate, filterEndDate);
        setAvailableVehicles(availabilityResponse.vehicles);
      }
    } catch (error: any) {
      console.error('Error submitting booking:', error);
      alert(t('reseller.bookingError'));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">{t('reseller.vehicleBooking')}</h1>
        <p className="text-gray-600">
          {t('reseller.checkAvailability')}
        </p>
      </div>

      {/* Commission Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center space-x-2">
          <TrendingUp className="h-5 w-5 text-blue-600" />
          <span className="text-blue-800 font-medium">
            {t('reseller.commissionRate')}: {commissionRate}%
          </span>
        </div>
      </div>

      {/* Date Range Filter */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex flex-col space-y-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('reseller.checkAvailability')}</h3>
            <p className="text-gray-600 text-sm">{t('rentals.selectDates')}</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="start-date" className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="h-4 w-4 inline mr-1" />
                {t('booking.pickupDate')}
              </label>
              <input
                id="start-date"
                type="date"
                value={filterStartDate}
                onChange={(e) => setFilterStartDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label htmlFor="end-date" className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="h-4 w-4 inline mr-1" />
                {t('booking.returnDate')}
              </label>
              <input
                id="end-date"
                type="date"
                value={filterEndDate}
                onChange={(e) => setFilterEndDate(e.target.value)}
                min={filterStartDate || new Date().toISOString().split('T')[0]}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Calculator className="h-4 w-4 inline mr-1" />
              {t('reseller.selectCharge')}
            </label>
            <div className="flex flex-wrap gap-2">
              {[5, 10, 15, 20].map(percentage => (
                <button
                  key={percentage}
                  onClick={() => setUpchargePercentage(percentage)}
                  className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                    upchargePercentage === percentage
                      ? 'bg-blue-600 text-white shadow-lg transform scale-105'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-md'
                  }`}
                >
                  {percentage}%
                </button>
              ))}
              <button
                onClick={() => setUpchargePercentage(0)}
                className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                  upchargePercentage === 0
                    ? 'bg-blue-600 text-white shadow-lg transform scale-105'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-md'
                }`}
              >
                0%
              </button>
            </div>
          </div>
          
          {(filterStartDate || filterEndDate || upchargePercentage > 0) && (
            <div className="flex justify-end">
              <button
                onClick={() => {
                  setFilterStartDate('');
                  setFilterEndDate('');
                  setUpchargePercentage(0);
                }}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              >
                {t('common.clear')}
              </button>
            </div>
          )}
          
          {(filterStartDate && filterEndDate) && (
            <div className="mt-4 p-3 bg-green-50 rounded-lg">
              <p className="text-sm text-green-800">
                <span className="font-medium">{t('booking.rentalPeriod')}:</span> {new Date(filterStartDate).toLocaleDateString('en-US', { 
                  month: 'short', 
                  day: 'numeric' 
                })} - {new Date(filterEndDate).toLocaleDateString('en-US', { 
                  month: 'short', 
                  day: 'numeric',
                  year: 'numeric'
                })} ({Math.ceil((new Date(filterEndDate).getTime() - new Date(filterStartDate).getTime()) / (1000 * 60 * 60 * 24))} {t('rentals.days')})
              </p>
              {loading ? (
                <p className="text-sm text-green-600 mt-1">{t('rentals.checkingAvailability')}</p>
              ) : error ? (
                <p className="text-sm text-red-600 mt-1">{error}</p>
              ) : (
                <p className="text-sm text-green-600 mt-1">
                  {rentalVehicles.length} {t('rentals.available')}
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Vehicle Grid */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          {(filterStartDate && filterEndDate) ? t('rentals.availableRentalVehicles') : t('rentals.allRentalVehicles')}
          {(filterStartDate && filterEndDate) && (
            <span className="text-lg font-normal text-gray-600 ml-2">
              ({rentalVehicles.length} {t('rentals.available')})
            </span>
          )}
        </h2>
        
        {vehiclesLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading vehicles from database...</p>
          </div>
        ) : vehiclesError ? (
          <div className="text-center py-12">
            <Calendar className="h-16 w-16 text-red-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Vehicles</h3>
            <p className="text-gray-600">{vehiclesError}</p>
          </div>
        ) : loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">{t('rentals.checkingAvailability')}</p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <Calendar className="h-16 w-16 text-red-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('rentals.errorCheckingTitle')}</h3>
            <p className="text-gray-600">{error}</p>
          </div>
        ) : rentalVehicles.length === 0 ? (
          <div className="text-center py-12">
            <Car className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {(filterStartDate && filterEndDate) ? t('rentals.noVehiclesAvailable') : t('rentals.noRentalVehicles')}
            </h3>
            <p className="text-gray-600">
              {(filterStartDate && filterEndDate)
                ? t('rentals.allRentedMessage')
                : t('rentals.noRentalsMessage')
              }
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rentalVehicles.map(vehicle => (
              <div key={vehicle.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-w-16 aspect-h-9 bg-gray-100">
                  <img
                    src={vehicle.primaryImage || vehicle.image}
                    alt={`${vehicle.make} ${vehicle.model}`}
                    className="w-full h-48 object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-lg text-gray-900">
                    {vehicle.year} {vehicle.make} {vehicle.model}
                  </h3>
                  <p className="text-sm text-gray-600 capitalize mb-3">{vehicle.category}</p>
                  
                  <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 mb-4">
                    <div className="flex items-center">
                      <Gauge className="h-4 w-4 mr-1" />
                      <span>{vehicle.mileage.toLocaleString()} mi</span>
                    </div>
                    <div className="flex items-center">
                      <Settings className="h-4 w-4 mr-1" />
                      <span className="capitalize">{vehicle.transmission}</span>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => {
                      if (!filterStartDate || !filterEndDate) {
                        alert(t('reseller.selectDatesToBook'));
                        return;
                      }
                      // Navigate to vehicle detail page
                      navigate(`/reseller/vehicle/${vehicle.id}?start=${filterStartDate}&end=${filterEndDate}&charge=${upchargePercentage}`);
                    }}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-semibold transition-colors duration-200"
                  >
                    {t('reseller.viewDetails')}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Booking Modal */}
      {showBookingModal && selectedVehicle && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  {t('reseller.bookThisVehicle')}: {selectedVehicle.make} {selectedVehicle.model}
                </h2>
                <button
                  onClick={() => setShowBookingModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleBookingSubmit} className="space-y-6">
                {/* Pricing Summary */}
                {(() => {
                  const pricing = calculatePricing(selectedVehicle);
                  return pricing ? (
                    <div className="bg-blue-50 rounded-lg p-4">
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">{t('reseller.pricingBreakdown')}</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>{t('reseller.baseRate')} ({pricing.days} {t('rentals.days')} @ ${pricing.basePrice}/{t('vehicle.perDay')}):</span>
                          <span>${pricing.subtotal}</span>
                        </div>
                        <div className="flex justify-between text-blue-600">
                          <span>{t('reseller.yourCommission')} ({commissionRate}%):</span>
                          <span>+${pricing.commissionAmount.toFixed(2)}</span>
                        </div>
                        {upchargePercentage > 0 && (
                          <div className="flex justify-between text-blue-600">
                            <span>{t('reseller.yourCharge')} ({upchargePercentage}%):</span>
                            <span>+${pricing.upchargeAmount.toFixed(2)}</span>
                          </div>
                        )}
                        <div className="flex justify-between font-semibold text-lg border-t border-blue-200 pt-2 mt-2">
                          <span>{t('reseller.customerPays')}:</span>
                          <span>${pricing.clientTotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between font-semibold text-green-600">
                          <span>{t('reseller.totalEarnings')}:</span>
                          <span>${pricing.totalEarnings.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  ) : null;
                })()}

                {/* Customer Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">{t('reseller.customerInfo')}</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t('reseller.customerName')} *
                      </label>
                      <input
                        type="text"
                        required
                        value={bookingData.customerName}
                        onChange={(e) => setBookingData({...bookingData, customerName: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t('common.email')} *
                      </label>
                      <input
                        type="email"
                        required
                        value={bookingData.customerEmail}
                        onChange={(e) => setBookingData({...bookingData, customerEmail: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t('common.phone')} *
                      </label>
                      <input
                        type="tel"
                        required
                        value={bookingData.customerPhone}
                        onChange={(e) => setBookingData({...bookingData, customerPhone: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Clock className="h-4 w-4 inline mr-1" />
                        {t('reseller.pickupTime')}
                      </label>
                      <input
                        type="time"
                        value={bookingData.pickupTime}
                        onChange={(e) => setBookingData({...bookingData, pickupTime: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('common.notes')} ({t('common.optional')})
                    </label>
                    <textarea
                      rows={3}
                      value={bookingData.notes}
                      onChange={(e) => setBookingData({...bookingData, notes: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder={t('form.enterMessage')}
                    />
                  </div>
                </div>

                <div className="flex space-x-4">
                  <button
                    type="button"
                    onClick={() => setShowBookingModal(false)}
                    className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-3 px-6 rounded-lg font-semibold transition-colors duration-200"
                  >
                    {t('common.cancel')}
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-semibold transition-colors duration-200"
                  >
                    {t('reseller.confirmBooking')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResellerVehicles;