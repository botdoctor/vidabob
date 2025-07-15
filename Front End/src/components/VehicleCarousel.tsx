import React, { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useVehicles } from '../hooks/useVehicles';
import VehicleCardSaleOnly from './VehicleCardSaleOnly';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const VehicleCarousel: React.FC = () => {
  const { vehicles: dbVehicles, loading, error } = useVehicles();
  const navigate = useNavigate();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  
  // Filter for vehicles that are for sale
  const vehicles = dbVehicles.filter(vehicle => 
    vehicle.type === 'sale' || vehicle.type === 'both'
  );

  const checkScrollButtons = () => {
    const container = scrollContainerRef.current;
    if (container) {
      setCanScrollLeft(container.scrollLeft > 0);
      setCanScrollRight(
        container.scrollLeft < container.scrollWidth - container.clientWidth - 10
      );
    }
  };

  const scroll = (direction: 'left' | 'right') => {
    const container = scrollContainerRef.current;
    if (container) {
      const scrollAmount = 320; // Width of one card plus gap
      const newScrollLeft = direction === 'left' 
        ? container.scrollLeft - scrollAmount 
        : container.scrollLeft + scrollAmount;
      
      container.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth'
      });
    }
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', checkScrollButtons);
      checkScrollButtons(); // Initial check
      
      return () => {
        container.removeEventListener('scroll', checkScrollButtons);
      };
    }
  }, [vehicles]);

  if (loading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Vehicles
            </h2>
            <p className="text-lg text-gray-600">
              Loading our latest inventory...
            </p>
          </div>
          <div className="flex space-x-4 overflow-hidden">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="flex-shrink-0 w-80 bg-white rounded-lg shadow-md p-6 animate-pulse">
                <div className="h-48 bg-gray-200 rounded-lg mb-4"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded mb-2 w-2/3"></div>
                <div className="h-4 bg-gray-200 rounded w-1/3"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error || vehicles.length === 0) {
    return null; // Don't show the section if there's an error or no vehicles
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Our Vehicles
          </h2>
          <p className="text-lg text-gray-600">
            Browse our selection of quality vehicles
          </p>
        </div>

        <div className="relative">
          {/* Left scroll button */}
          <button
            onClick={() => scroll('left')}
            className={`absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full shadow-lg p-2 transition-all duration-200 ${
              canScrollLeft 
                ? 'opacity-100 hover:scale-110' 
                : 'opacity-0 pointer-events-none'
            }`}
            aria-label="Scroll left"
          >
            <ChevronLeft className="h-6 w-6 text-gray-600" />
          </button>

          {/* Right scroll button */}
          <button
            onClick={() => scroll('right')}
            className={`absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full shadow-lg p-2 transition-all duration-200 ${
              canScrollRight 
                ? 'opacity-100 hover:scale-110' 
                : 'opacity-0 pointer-events-none'
            }`}
            aria-label="Scroll right"
          >
            <ChevronRight className="h-6 w-6 text-gray-600" />
          </button>

          {/* Scrollable container */}
          <div 
            ref={scrollContainerRef}
            className="flex space-x-4 overflow-x-auto scrollbar-hide pb-4"
          >
            {vehicles.map(vehicle => (
              <div key={vehicle.id} className="flex-shrink-0 w-80">
                <VehicleCardSaleOnly vehicle={vehicle} />
              </div>
            ))}
          </div>
        </div>

        {/* View All Button */}
        <div className="text-center mt-8">
          <button
            onClick={() => navigate('/inventory')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors duration-200"
          >
            View Full Inventory
          </button>
        </div>
      </div>
    </section>
  );
};

export default VehicleCarousel;