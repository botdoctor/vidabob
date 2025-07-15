import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link, useLocation } from 'react-router-dom';
import { useVehicle } from '../hooks/useVehicles';
import { 
  ArrowLeft, 
  Calendar,
  Fuel, 
  Gauge, 
  Car,
  DollarSign,
  Settings,
  Check,
  Share2,
  Heart,
  Phone,
  Mail,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
  Zap,
  Star,
  Home
} from 'lucide-react';
import Logo from '../components/Logo';

// Traditional Image Gallery Component
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
      {/* Main Image Display */}
      <div className="relative w-full h-[500px] bg-gray-100 rounded-lg overflow-hidden">
        <img
          src={images[currentImageIndex]}
          alt={`Vehicle image ${currentImageIndex + 1}`}
          className="w-full h-full object-cover"
        />
        
        {/* Navigation Arrows */}
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

        {/* Image Counter */}
        {images.length > 1 && (
          <div className="absolute top-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
            {currentImageIndex + 1} / {images.length}
          </div>
        )}
      </div>

      {/* Thumbnail Gallery */}
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

// Feature Card Component
const FeatureCard = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) => (
  <div className="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-lg transition-shadow">
    <div className="flex flex-col items-center space-y-3">
      <div className="p-3 bg-blue-100 rounded-full text-blue-600">
        {icon}
      </div>
      <h3 className="font-semibold text-gray-700">{label}</h3>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
    </div>
  </div>
);

const VehicleDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { vehicle, loading, error } = useVehicle(id || '');
  const [showContactForm, setShowContactForm] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  
  // Determine context from URL
  const isRentalContext = location.pathname.includes('/rental');
  const isSaleContext = location.pathname.includes('/sale');

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading vehicle details...</p>
        </div>
      </div>
    );
  }

  if (error || !vehicle) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Vehicle Not Found</h2>
          <p className="text-gray-600 mb-4">The vehicle you're looking for doesn't exist or has been removed.</p>
          <button
            onClick={() => navigate('/inventory')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors duration-200"
          >
            Back to Inventory
          </button>
        </div>
      </div>
    );
  }

  const images = vehicle.images?.length > 0 ? vehicle.images : [vehicle.primaryImage];
  const isForSale = vehicle.type === 'sale' || vehicle.type === 'both';
  const isForRent = vehicle.type === 'rental' || vehicle.type === 'both';

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${vehicle.year} ${vehicle.make} ${vehicle.model}`,
        text: vehicle.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Thank you for your inquiry! We will contact you soon.');
    setShowContactForm(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate(-1)}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors duration-200"
              >
                <ArrowLeft className="h-5 w-5" />
                <span>Back</span>
              </button>
              <div className="h-6 w-px bg-gray-300"></div>
              <Link to="/" className="flex items-center space-x-2">
                <Logo height={30} />
                <span className="text-xl font-bold text-gray-900 hidden sm:inline">VIDA MOTORS</span>
              </Link>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setIsFavorite(!isFavorite)}
                className={`p-2 rounded-lg transition-colors duration-200 ${
                  isFavorite 
                    ? 'bg-red-100 text-red-600' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <Heart className={`h-5 w-5 ${isFavorite ? 'fill-current' : ''}`} />
              </button>
              <button
                onClick={handleShare}
                className="p-2 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-lg transition-colors duration-200"
              >
                <Share2 className="h-5 w-5" />
              </button>
            </div>
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

          {/* Vehicle Information */}
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex items-center space-x-2 mb-2">
                {vehicle.status === 'featured' && (
                  <div className="inline-flex items-center px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
                    <Star className="h-3 w-3 mr-1" />
                    Featured Vehicle
                  </div>
                )}
                {isRentalContext && (
                  <div className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                    <Calendar className="h-3 w-3 mr-1" />
                    Rental Vehicle
                  </div>
                )}
                {isSaleContext && (
                  <div className="inline-flex items-center px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                    <DollarSign className="h-3 w-3 mr-1" />
                    For Sale
                  </div>
                )}
              </div>
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900">
                {vehicle.year} {vehicle.make} {vehicle.model}
              </h1>
              <p className="text-xl text-gray-600">{vehicle.category.charAt(0).toUpperCase() + vehicle.category.slice(1)}</p>
            </div>
            
            <p className="text-lg text-gray-600 leading-relaxed">
              {vehicle.description || `Experience excellence with this ${vehicle.year} ${vehicle.make} ${vehicle.model}. This ${vehicle.category} offers exceptional value with its ${vehicle.transmission} transmission and ${vehicle.engine.fuel} engine.`}
            </p>
            
            {/* Pricing */}
            <div className="bg-gray-100 rounded-lg p-6 space-y-4">
              {/* Show sale price only in sale context or when no specific context */}
              {(!isRentalContext && isForSale) && (
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 font-medium">Sale Price</span>
                  <span className="text-3xl font-bold text-gray-900">${(vehicle.salePrice || 0).toLocaleString()}</span>
                </div>
              )}
              {/* Show rental price only in rental context or when no specific context */}
              {(!isSaleContext && isForRent) && (
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 font-medium">Rental Rate</span>
                  <span className="text-2xl font-bold text-blue-600">${vehicle.rentalPrice}/day</span>
                </div>
              )}
            </div>
            
            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
              {/* Show rental button only in rental context */}
              {isRentalContext && isForRent && (
                <button
                  onClick={() => navigate(`/rentals?vehicle=${vehicle.id}`)}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200 flex items-center justify-center space-x-2"
                >
                  <Calendar className="h-5 w-5" />
                  <span>Check Availability</span>
                </button>
              )}
              <button
                onClick={() => setShowContactForm(true)}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200 flex items-center justify-center space-x-2"
              >
                <MessageSquare className="h-5 w-5" />
                <span>Contact Us</span>
              </button>
              {/* Show test drive button only in sale context */}
              {isSaleContext && isForSale && (
                <button
                  onClick={() => navigate('/contact')}
                  className="flex-1 border-2 border-gray-300 hover:border-gray-400 text-gray-700 px-6 py-3 rounded-lg font-semibold transition-colors duration-200"
                >
                  Schedule Test Drive
                </button>
              )}
              {/* Show both buttons when no specific context (backward compatibility) */}
              {!isRentalContext && !isSaleContext && (
                <>
                  {isForRent && (
                    <button
                      onClick={() => navigate(`/rentals?vehicle=${vehicle.id}`)}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200 flex items-center justify-center space-x-2"
                    >
                      <Calendar className="h-5 w-5" />
                      <span>Check Availability</span>
                    </button>
                  )}
                  {isForSale && (
                    <button
                      onClick={() => navigate('/contact')}
                      className="flex-1 border-2 border-gray-300 hover:border-gray-400 text-gray-700 px-6 py-3 rounded-lg font-semibold transition-colors duration-200"
                    >
                      Schedule Test Drive
                    </button>
                  )}
                </>
              )}
            </div>

            {/* Quick Specs */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-3 p-3 bg-white rounded-lg shadow-sm">
                <Gauge className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-600">Mileage</p>
                  <p className="font-semibold">{vehicle.mileage.toLocaleString()} mi</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-white rounded-lg shadow-sm">
                <Fuel className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-600">Fuel Type</p>
                  <p className="font-semibold capitalize">{vehicle.engine.fuel}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-white rounded-lg shadow-sm">
                <Settings className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-600">Transmission</p>
                  <p className="font-semibold capitalize">{vehicle.transmission}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-white rounded-lg shadow-sm">
                <Car className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-600">Seats</p>
                  <p className="font-semibold">{vehicle.seats} Seats</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Detailed Specifications */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Detailed Specifications</h2>
          <p className="text-lg text-gray-600">Everything you need to know about this vehicle</p>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="border-b border-gray-200 pb-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Exterior Color</h3>
                  <p className="text-gray-600">{vehicle.color.exterior}</p>
                </div>
                {vehicle.color.interior && (
                  <div className="border-b border-gray-200 pb-4">
                    <h3 className="font-semibold text-gray-900 mb-2">Interior Color</h3>
                    <p className="text-gray-600">{vehicle.color.interior}</p>
                  </div>
                )}
                <div className="border-b border-gray-200 pb-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Condition</h3>
                  <p className="text-gray-600">{vehicle.condition.charAt(0).toUpperCase() + vehicle.condition.slice(1)}</p>
                </div>
                {vehicle.drivetrain && (
                  <div className="border-b border-gray-200 pb-4">
                    <h3 className="font-semibold text-gray-900 mb-2">Drivetrain</h3>
                    <p className="text-gray-600">{vehicle.drivetrain.toUpperCase()}</p>
                  </div>
                )}
              </div>
              
              <div className="space-y-4">
                {vehicle.engine.horsepower && (
                  <div className="border-b border-gray-200 pb-4">
                    <h3 className="font-semibold text-gray-900 mb-2">Horsepower</h3>
                    <p className="text-gray-600">{vehicle.engine.horsepower} HP</p>
                  </div>
                )}
                {vehicle.doors && (
                  <div className="border-b border-gray-200 pb-4">
                    <h3 className="font-semibold text-gray-900 mb-2">Doors</h3>
                    <p className="text-gray-600">{vehicle.doors} Doors</p>
                  </div>
                )}
                {vehicle.towingCapacity && (
                  <div className="border-b border-gray-200 pb-4">
                    <h3 className="font-semibold text-gray-900 mb-2">Towing Capacity</h3>
                    <p className="text-gray-600">{vehicle.towingCapacity.toLocaleString()} lbs</p>
                  </div>
                )}
                {vehicle.location && (
                  <div className="border-b border-gray-200 pb-4">
                    <h3 className="font-semibold text-gray-900 mb-2">Location</h3>
                    <p className="text-gray-600">{vehicle.location}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features List */}
      {vehicle.features.length > 0 && (
        <section className="container mx-auto px-4 py-16 bg-gray-100">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Features & Equipment</h2>
            <p className="text-lg text-gray-600">This vehicle comes loaded with these features</p>
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

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl text-white p-12 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Make This Yours?</h2>
          <p className="text-lg mb-8 opacity-90">
            Don't miss out on this exceptional {vehicle.year} {vehicle.make} {vehicle.model}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => setShowContactForm(true)}
              className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 rounded-lg font-semibold transition-colors duration-200"
            >
              Contact Us Now
            </button>
            <button
              onClick={() => navigate('/inventory')}
              className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-3 rounded-lg font-semibold transition-colors duration-200"
            >
              View More Vehicles
            </button>
          </div>
        </div>
      </section>

      {/* Contact Form Modal */}
      {showContactForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-900">Contact Us</h3>
              <button
                onClick={() => setShowContactForm(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleContactSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input
                  type="tel"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                <textarea
                  rows={4}
                  required
                  placeholder={`I'm interested in the ${vehicle.year} ${vehicle.make} ${vehicle.model}...`}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-semibold transition-colors duration-200"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default VehicleDetail;