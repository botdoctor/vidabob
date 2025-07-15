import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Vehicle } from '../types';
import { Fuel, Gauge, Calendar, Palette, Settings, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface VehicleCardProps {
  vehicle: Vehicle;
  showRentButton?: boolean;
  onRent?: (vehicle: Vehicle) => void;
}

const VehicleCard: React.FC<VehicleCardProps> = ({ vehicle, showRentButton = false, onRent }) => {
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const { t } = useLanguage();

  // Get all images or fallback to primaryImage
  const images = vehicle.images?.length > 0 ? vehicle.images : [vehicle.primaryImage];

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(price);
  };

  const getFuelIcon = () => {
    switch (vehicle.engine.fuel) {
      case 'electric':
        return '⚡';
      case 'hybrid':
        return '🔋';
      default:
        return '⛽';
    }
  };

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      {/* Image with Carousel */}
      <div 
        className="relative h-48 overflow-hidden group"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        <img
          src={images[currentImageIndex]}
          alt={`${vehicle.make} ${vehicle.model}`}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        
        {/* Image navigation arrows - only show if multiple images */}
        {images.length > 1 && isHovering && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-1 rounded-full transition-all duration-200"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-1 rounded-full transition-all duration-200"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        )}

        {/* Image indicators */}
        {images.length > 1 && (
          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentImageIndex(index);
                }}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentImageIndex 
                    ? 'bg-white' 
                    : 'bg-white/50 hover:bg-white/70'
                }`}
              />
            ))}
          </div>
        )}

        {/* Badges */}
        {vehicle.isFeatures && (
          <div className="absolute top-4 left-4 bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg">
            {t('featured.badge')}
          </div>
        )}
        <div className="absolute top-4 right-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold capitalize shadow-lg">
          {vehicle.type === 'both' ? t('featured.forSale') + ' & ' + t('nav.rentals') : vehicle.type === 'sale' ? t('featured.forSale') : t('featured.forRental')}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="mb-4">
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            {vehicle.year} {vehicle.make} {vehicle.model}
          </h3>
          <p className="text-gray-600 text-sm line-clamp-2">
            {vehicle.description}
          </p>
        </div>

        {/* Specs */}
        <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
          <div className="flex items-center space-x-2 text-gray-600">
            <Calendar className="h-4 w-4" />
            <span>{vehicle.year}</span>
          </div>
          <div className="flex items-center space-x-2 text-gray-600">
            <Gauge className="h-4 w-4" />
            <span>{vehicle.mileage.toLocaleString()} mi</span>
          </div>
          <div className="flex items-center space-x-2 text-gray-600">
            <span className="text-base">{getFuelIcon()}</span>
            <span className="capitalize">{vehicle.engine.fuel}</span>
          </div>
          <div className="flex items-center space-x-2 text-gray-600">
            <Settings className="h-4 w-4" />
            <span className="capitalize">{vehicle.transmission}</span>
          </div>
        </div>

        {/* Color */}
        <div className="flex items-center space-x-2 mb-4">
          <Palette className="h-4 w-4 text-gray-600" />
          <span className="text-sm text-gray-600">{vehicle.color.exterior}</span>
        </div>

        {/* Features */}
        <div className="mb-4">
          <h4 className="text-sm font-semibold text-gray-900 mb-2">{t('vehicle.features')}</h4>
          <div className="flex flex-wrap gap-1">
            {vehicle.features.slice(0, 3).map((feature, index) => (
              <span
                key={index}
                className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs"
              >
                {feature}
              </span>
            ))}
            {vehicle.features.length > 3 && (
              <span className="text-blue-600 text-xs">
                +{vehicle.features.length - 3} {t('common.more')}
              </span>
            )}
          </div>
        </div>

        {/* Pricing */}
        <div className="border-t pt-4">
          <div className="flex justify-between items-center mb-4">
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {formatPrice(vehicle.salePrice || 0)}
              </div>
              <div className="text-sm text-gray-600">{t('common.price')}</div>
            </div>
            {vehicle.rentalPrice && (
              <div className="text-right">
                <div className="text-xl font-bold text-blue-600">
                  {formatPrice(vehicle.rentalPrice)}{t('vehicle.perDay')}
                </div>
                <div className="text-sm text-gray-600">{t('booking.dailyRate')}</div>
              </div>
            )}
          </div>

          <div className="flex space-x-2">
            <button 
              onClick={() => navigate(`/vehicle/${vehicle.id}`)}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-semibold transition-colors duration-200">
              {t('vehicle.viewDetails')}
            </button>
            {showRentButton && vehicle.rentalPrice && onRent ? (
              <button 
                onClick={() => onRent(vehicle)}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg font-semibold transition-colors duration-200"
              >
                {t('vehicle.rent')}
              </button>
            ) : (
              <button 
                onClick={() => navigate('/contact')}
                className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-4 rounded-lg font-semibold transition-colors duration-200"
              >
                {t('hero.contactUs')}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VehicleCard;