import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { useVehicle } from '../../hooks/useVehicles';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { resellerService } from '../../lib/resellerService';
import { 
  ArrowLeft,
  Calendar,
  Fuel,
  Gauge,
  Car,
  Settings,
  Clock,
  DollarSign,
  CreditCard,
  Banknote,
  Calculator,
  TrendingUp,
  ChevronLeft,
  ChevronRight,
  Star,
  Check
} from 'lucide-react';

// Image Gallery Component
const ImageGallery = ({ images }: { images: string[] }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="space-y-4">
      <div className="relative w-full h-[500px] bg-gray-100 rounded-lg overflow-hidden">
        <img
          src={images[currentImageIndex]}
          alt={`Vehicle image ${currentImageIndex + 1}`}
          className="w-full h-full object-cover"
        />
        
        {images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-3 rounded-full shadow-lg transition-all duration-200 hover:scale-110"
              aria-label="Previous image"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-3 rounded-full shadow-lg transition-all duration-200 hover:scale-110"
              aria-label="Next image"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </>
        )}

        {images.length > 1 && (
          <div className="absolute top-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
            {currentImageIndex + 1} / {images.length}
          </div>
        )}
      </div>

      {images.length > 1 && (
        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              className={`relative aspect-square rounded-lg overflow-hidden transition-all duration-200 ${
                index === currentImageIndex
                  ? 'ring-2 ring-blue-600 scale-105'
                  : 'hover:ring-2 hover:ring-gray-300 hover:scale-105'
              }`}
            >
              <img
                src={image}
                alt={`Thumbnail ${index + 1}`}
                className="w-full h-full object-cover"
              />
              {index === currentImageIndex && (
                <div className="absolute inset-0 bg-blue-600/20"></div>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const ResellerVehicleDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t } = useLanguage();
  const { vehicle, loading, error } = useVehicle(id || '');

  // Get query parameters
  const startDate = searchParams.get('start') || '';
  const endDate = searchParams.get('end') || '';
  const initialCharge = parseInt(searchParams.get('charge') || '0');

  const [upchargePercentage, setUpchargePercentage] = useState(initialCharge);
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'credit'>('cash');
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingData, setBookingData] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    pickupTime: '10:00',
    notes: ''
  });

  const commissionRate = user?.commissionRate || 10;

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  if (error || !vehicle) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{t('error.pageNotFound')}</h2>
          <p className="text-gray-600 mb-4">{t('inventory.noResults')}</p>
          <button
            onClick={() => navigate('/reseller/vehicles')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors duration-200"
          >
            {t('common.back')}
          </button>
        </div>
      </div>
    );
  }

  const images = vehicle.images?.length > 0 ? vehicle.images : [vehicle.primaryImage];

  // Calculate pricing
  const calculatePricing = () => {
    if (!startDate || !endDate) return null;

    const days = Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24));
    const basePrice = vehicle.rentalPrice || 0;
    const subtotal = basePrice * days;
    const upchargeAmount = (subtotal * upchargePercentage) / 100;
    const totalBeforeEva = subtotal + upchargeAmount;
    const evaCharge = paymentMethod === 'credit' ? (totalBeforeEva * 14) / 100 : 0;
    const totalWithEva = totalBeforeEva + evaCharge;
    const commissionAmount = (subtotal * commissionRate) / 100;
    const totalEarnings = commissionAmount + upchargeAmount;

    return {
      days,
      basePrice,
      subtotal,
      upchargeAmount,
      totalBeforeEva,
      evaCharge,
      totalWithEva,
      commissionAmount,
      totalEarnings,
      clientTotal: paymentMethod === 'credit' ? totalWithEva : totalBeforeEva
    };
  };

  const pricing = calculatePricing();

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pricing) return;

    try {
      const bookingPayload = {
        vehicleId: vehicle.id,
        customerName: bookingData.customerName,
        customerEmail: bookingData.customerEmail,
        customerPhone: bookingData.customerPhone,
        pickupDate: startDate,
        returnDate: endDate,
        pickupTime: bookingData.pickupTime,
        notes: bookingData.notes,
        upchargePercentage: upchargePercentage,
        upcharge: pricing.upchargeAmount,
        totalDays: pricing.days,
        dailyRate: pricing.basePrice,
        subtotal: pricing.subtotal,
        totalCost: pricing.clientTotal,
        currency: 'USD' as const,
        paymentMethod: paymentMethod,
        evaCharge: pricing.evaCharge
      };

      await resellerService.submitBooking(bookingPayload);
      alert(t('reseller.bookingSuccess'));
      navigate('/reseller/vehicles');
    } catch (error: any) {
      console.error('Error submitting booking:', error);
      alert(t('reseller.bookingError'));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate('/reseller/vehicles')}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors duration-200"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>{t('common.back')}</span>
            </button>
            <h1 className="text-xl font-bold text-gray-900">{t('reseller.vehicleDetails')}</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <section className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Image Gallery */}
          <div>
            <ImageGallery images={images} />
          </div>

          {/* Vehicle Information & Pricing */}
          <div className="space-y-6">
            <div className="space-y-2">
              {vehicle.status === 'featured' && (
                <div className="inline-flex items-center px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium mb-2">
                  <Star className="h-3 w-3 mr-1" />
                  {t('featured.title')}
                </div>
              )}
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900">
                {vehicle.year} {vehicle.make} {vehicle.model}
              </h1>
              <p className="text-xl text-gray-600">{vehicle.category.charAt(0).toUpperCase() + vehicle.category.slice(1)}</p>
            </div>

            {/* Quick Specs */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-3 p-3 bg-white rounded-lg shadow-sm">
                <Gauge className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-600">{t('vehicle.mileage')}</p>
                  <p className="font-semibold">{vehicle.mileage.toLocaleString()} mi</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-white rounded-lg shadow-sm">
                <Fuel className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-600">{t('vehicle.fuelType')}</p>
                  <p className="font-semibold capitalize">{vehicle.engine.fuel}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-white rounded-lg shadow-sm">
                <Settings className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-600">{t('vehicle.transmission')}</p>
                  <p className="font-semibold capitalize">{vehicle.transmission}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-white rounded-lg shadow-sm">
                <Car className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-600">{t('vehicle.seats')}</p>
                  <p className="font-semibold">{vehicle.seats} {t('vehicle.seats')}</p>
                </div>
              </div>
            </div>

            {/* Rental Period */}
            {startDate && endDate && (
              <div className="bg-blue-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2 flex items-center">
                  <Calendar className="h-5 w-5 mr-2 text-blue-600" />
                  {t('booking.rentalPeriod')}
                </h3>
                <p className="text-gray-700">
                  {new Date(startDate).toLocaleDateString()} - {new Date(endDate).toLocaleDateString()}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  {pricing?.days} {t('rentals.days')}
                </p>
              </div>
            )}

            {/* Reseller Charge Selection */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                <Calculator className="h-5 w-5 mr-2 text-blue-600" />
                {t('reseller.selectCharge')}
              </h3>
              <div className="grid grid-cols-5 gap-2">
                {[0, 5, 10, 15, 20].map(percentage => (
                  <button
                    key={percentage}
                    onClick={() => setUpchargePercentage(percentage)}
                    className={`py-3 rounded-lg font-medium transition-all duration-200 ${
                      upchargePercentage === percentage
                        ? 'bg-blue-600 text-white shadow-lg transform scale-105'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-md'
                    }`}
                  >
                    {percentage}%
                  </button>
                ))}
              </div>
            </div>

            {/* Payment Method Selection */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                <DollarSign className="h-5 w-5 mr-2 text-green-600" />
                {t('reseller.selectPaymentMethod')}
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setPaymentMethod('cash')}
                  className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                    paymentMethod === 'cash'
                      ? 'border-green-600 bg-green-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Banknote className={`h-8 w-8 mx-auto mb-2 ${
                    paymentMethod === 'cash' ? 'text-green-600' : 'text-gray-400'
                  }`} />
                  <p className={`font-semibold ${
                    paymentMethod === 'cash' ? 'text-green-600' : 'text-gray-700'
                  }`}>
                    {t('reseller.cash')}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    {t('common.no')} {t('reseller.evaCharge')}
                  </p>
                </button>
                <button
                  onClick={() => setPaymentMethod('credit')}
                  className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                    paymentMethod === 'credit'
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <CreditCard className={`h-8 w-8 mx-auto mb-2 ${
                    paymentMethod === 'credit' ? 'text-blue-600' : 'text-gray-400'
                  }`} />
                  <p className={`font-semibold ${
                    paymentMethod === 'credit' ? 'text-blue-600' : 'text-gray-700'
                  }`}>
                    {t('reseller.creditCard')}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    +14% {t('reseller.evaCharge')}
                  </p>
                </button>
              </div>
            </div>

            {/* Pricing Summary */}
            {pricing && (
              <div className="bg-gray-100 rounded-lg p-6 space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  {t('reseller.pricingBreakdown')}
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between text-gray-700">
                    <span>{t('reseller.baseRate')} ({pricing.days} {t('rentals.days')} @ ${pricing.basePrice}/{t('vehicle.perDay')})</span>
                    <span className="font-medium">${pricing.subtotal.toFixed(2)}</span>
                  </div>
                  {upchargePercentage > 0 && (
                    <div className="flex justify-between text-gray-700">
                      <span>{t('reseller.resellerCharge')} ({upchargePercentage}%)</span>
                      <span className="font-medium">+${pricing.upchargeAmount.toFixed(2)}</span>
                    </div>
                  )}
                  {paymentMethod === 'credit' && (
                    <div className="flex justify-between text-gray-700">
                      <span>{t('reseller.evaCharge')}</span>
                      <span className="font-medium">+${pricing.evaCharge.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="border-t pt-3 space-y-2">
                    <div className="flex justify-between text-lg font-semibold">
                      <span>{t('reseller.customerPays')} ({paymentMethod === 'cash' ? t('reseller.cash') : t('reseller.creditCard')})</span>
                      <span className="text-xl">${pricing.clientTotal.toFixed(2)}</span>
                    </div>
                    <div className="bg-green-100 rounded-lg p-3 mt-4">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <TrendingUp className="h-5 w-5 mr-2 text-green-600" />
                          <span className="text-green-800 font-medium">{t('reseller.totalEarnings')}</span>
                        </div>
                        <span className="text-xl font-bold text-green-800">${pricing.totalEarnings.toFixed(2)}</span>
                      </div>
                      <div className="text-sm text-green-700 mt-2 space-y-1">
                        <div className="flex justify-between">
                          <span>{t('reseller.commission')} ({commissionRate}%)</span>
                          <span>${pricing.commissionAmount.toFixed(2)}</span>
                        </div>
                        {upchargePercentage > 0 && (
                          <div className="flex justify-between">
                            <span>{t('reseller.resellerCharge')}</span>
                            <span>${pricing.upchargeAmount.toFixed(2)}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Book Button */}
            <button
              onClick={() => setShowBookingModal(true)}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors duration-200 shadow-lg"
            >
              {t('reseller.bookForCustomer')}
            </button>
          </div>
        </div>
      </section>

      {/* Features List */}
      {vehicle.features.length > 0 && (
        <section className="container mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">{t('vehicle.features')} & {t('vehicle.equipment')}</h2>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {vehicle.features.map((feature, index) => (
                <div
                  key={index}
                  className="bg-white rounded-lg shadow-md p-4 flex items-center space-x-3 hover:shadow-lg transition-shadow"
                >
                  <Check className="h-5 w-5 text-green-600 flex-shrink-0" />
                  <span className="text-gray-700 font-medium">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Booking Modal */}
      {showBookingModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  {t('reseller.confirmBooking')}
                </h2>
                <button
                  onClick={() => setShowBookingModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleBookingSubmit} className="space-y-6">
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

                {/* Final Pricing Summary */}
                {pricing && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 mb-3">{t('booking.bookingDetails')}</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>{t('reseller.paymentMethod')}</span>
                        <span className="font-medium">
                          {paymentMethod === 'cash' ? t('reseller.cash') : t('reseller.creditCard')}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>{t('booking.totalCost')}</span>
                        <span className="font-medium">${pricing.clientTotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-green-600 font-medium">
                        <span>{t('reseller.yourEarnings')}</span>
                        <span>${pricing.totalEarnings.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                )}

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

export default ResellerVehicleDetail;