import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { useVehicles } from '../hooks/useVehicles';
import VehicleCardSaleOnly from './VehicleCardSaleOnly';
import { Filter, Grid, List } from 'lucide-react';

const FeaturedVehicles: React.FC = () => {
  const { vehicles: dbVehicles, loading, error } = useVehicles();
  const navigate = useNavigate();
  const [filter, setFilter] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  // Use database vehicles if available, otherwise fall back to static data
  const vehicles = dbVehicles;

  const filteredVehicles = vehicles.filter(vehicle => {
    // Only show vehicles that are for sale
    const isForSale = vehicle.type === 'sale' || vehicle.type === 'both';
    if (!isForSale) return false;
    
    if (filter === 'all') return true;
    return vehicle.category === filter;
  });

  const categories = [
    { id: 'all', label: 'All Vehicles' },
    { id: 'sedan', label: 'Sedans' },
    { id: 'suv', label: 'SUVs' },
    { id: 'truck', label: 'Trucks' },
    { id: 'coupe', label: 'Coupes' }
  ];

  if (loading) {
    return (
      <section id="inventory" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Vehicle Inventory
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Loading our latest vehicles...
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
      </section>
    );
  }

  if (error) {
    return (
      <section id="inventory" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Vehicle Inventory
            </h2>
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded max-w-md mx-auto">
              <p className="font-bold">Error loading vehicles</p>
              <p className="text-sm">{error}</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="inventory" className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Our Vehicle Inventory
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover our extensive collection of premium vehicles available for purchase. 
            Each vehicle is carefully inspected and comes with our quality guarantee.
          </p>
        </div>

        {/* Filter and View Controls */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 space-y-4 md:space-y-0">
          <div className="flex items-center space-x-2">
            <Filter className="h-5 w-5 text-gray-600" />
            <span className="text-sm font-medium text-gray-700">Filter by:</span>
            <div className="flex flex-wrap gap-2">
              {categories.map(category => (
                <button
                  key={category.id}
                  onClick={() => setFilter(category.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${
                    filter === category.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {category.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-700">View:</span>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-md transition-colors duration-200 ${
                viewMode === 'grid'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Grid className="h-5 w-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-md transition-colors duration-200 ${
                viewMode === 'list'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              <List className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-sm text-gray-600">
            Showing {filteredVehicles.length} of {vehicles.length} vehicles
          </p>
        </div>

        {/* Vehicle Grid */}
        <div className={`grid gap-6 ${
          viewMode === 'grid' 
            ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
            : 'grid-cols-1'
        }`}>
          {filteredVehicles.map(vehicle => (
            <VehicleCardSaleOnly key={vehicle.id} vehicle={vehicle} />
          ))}
        </div>

        {filteredVehicles.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg">
              No vehicles found matching your criteria.
            </div>
            <button
              onClick={() => setFilter('all')}
              className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors duration-200"
            >
              Show All Vehicles
            </button>
          </div>
        )}

        {/* Call to Action */}
        <div className="text-center mt-12">
          <div className="bg-blue-600 text-white rounded-2xl p-8">
            <h3 className="text-2xl font-bold mb-4">Don't See What You're Looking For?</h3>
            <p className="text-blue-100 mb-6">
              We have access to thousands of vehicles through our dealer network. 
              Let us help you find the perfect vehicle for your needs.
            </p>
            <button
              onClick={() => navigate('/contact')}
              className="bg-yellow-500 hover:bg-yellow-400 text-blue-900 px-8 py-3 rounded-lg font-semibold transition-colors duration-200"
            >
              Request a Vehicle
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedVehicles;