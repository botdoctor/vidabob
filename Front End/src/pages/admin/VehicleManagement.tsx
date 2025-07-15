import React, { useState, useEffect } from 'react';
import { useVehicles } from '../../hooks/useVehicles';
import { vehicleService } from '../../lib/vehicleService';
import { Vehicle } from '../../types';
import { Plus, Edit, Trash2, Search, Filter, Eye, Copy, Star, DollarSign, Upload, X } from 'lucide-react';
import { getImageUrl } from '../../utils/imageUrl';

const VehicleManagement: React.FC = () => {
  const { vehicles, loading, error, refetch } = useVehicles();
  const [showForm, setShowForm] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [showSellModal, setShowSellModal] = useState(false);
  const [sellingVehicle, setSellingVehicle] = useState<Vehicle | null>(null);
  const [sellFormData, setSellFormData] = useState({
    salePrice: 0,
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    paymentMethod: 'cash' as 'cash' | 'finance' | 'credit' | 'other',
    notes: ''
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    make: '',
    model: '',
    year: new Date().getFullYear(),
    price: 0,
    rentalPrice: 0,
    type: 'sale' as 'sale' | 'rental' | 'both',
    category: 'sedan' as 'sedan' | 'suv' | 'truck' | 'coupe' | 'hatchback' | 'convertible',
    fuel: 'gasoline' as 'gasoline' | 'diesel' | 'hybrid' | 'electric',
    transmission: 'automatic' as 'manual' | 'automatic',
    mileage: 0,
    color: '',
    features: '',
    description: ''
  });
  const [primaryImageFile, setPrimaryImageFile] = useState<File | null>(null);
  const [primaryImagePreview, setPrimaryImagePreview] = useState<string>('');
  const [additionalImageFiles, setAdditionalImageFiles] = useState<File[]>([]);
  const [additionalImagePreviews, setAdditionalImagePreviews] = useState<string[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);

  const filteredVehicles = vehicles.filter(vehicle => {
    const matchesSearch = searchTerm === '' || 
      `${vehicle.make} ${vehicle.model} ${vehicle.year}`.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filterType === 'all') return matchesSearch;
    return matchesSearch && vehicle.type === filterType;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return b.year - a.year;
      case 'oldest':
        return a.year - b.year;
      case 'price-high':
        return (b.salePrice || 0) - (a.salePrice || 0);
      case 'price-low':
        return (a.salePrice || 0) - (b.salePrice || 0);
      case 'make':
        return a.make.localeCompare(b.make);
      default:
        return 0;
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      if (!primaryImageFile && !editingVehicle) {
        alert('Please select a primary image');
        setSubmitting(false);
        return;
      }

      const vehicleData = {
        make: formData.make,
        model: formData.model,
        year: formData.year,
        salePrice: formData.type === 'sale' || formData.type === 'both' ? formData.price : undefined,
        rentalPrice: formData.type === 'rental' || formData.type === 'both' ? formData.rentalPrice : undefined,
        type: formData.type,
        category: formData.category,
        engine: {
          fuel: formData.fuel
        },
        transmission: formData.transmission,
        mileage: formData.mileage,
        color: {
          exterior: formData.color
        },
        features: formData.features.split(',').map(f => f.trim()).filter(f => f),
        description: formData.description
      };

      if (editingVehicle) {
        await vehicleService.updateVehicle(
          editingVehicle.id, 
          vehicleData, 
          primaryImageFile || undefined,
          additionalImageFiles.length > 0 ? additionalImageFiles : undefined,
          existingImages.length > 0
        );
      } else {
        await vehicleService.createVehicle(
          vehicleData, 
          primaryImageFile || undefined,
          additionalImageFiles.length > 0 ? additionalImageFiles : undefined
        );
      }

      await refetch();
      resetForm();
    } catch (error) {
      console.error('Error saving vehicle:', error);
      alert('Error saving vehicle. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      make: '',
      model: '',
      year: new Date().getFullYear(),
      price: 0,
      rentalPrice: 0,
      type: 'sale',
      category: 'sedan',
      fuel: 'gasoline',
      transmission: 'automatic',
      mileage: 0,
      color: '',
      features: '',
      description: ''
    });
    setPrimaryImageFile(null);
    setPrimaryImagePreview('');
    setAdditionalImageFiles([]);
    setAdditionalImagePreviews([]);
    setExistingImages([]);
    setShowForm(false);
    setEditingVehicle(null);
  };

  const handleEdit = (vehicle: Vehicle) => {
    setEditingVehicle(vehicle);
    
    setFormData({
      make: vehicle.make,
      model: vehicle.model,
      year: vehicle.year,
      price: vehicle.salePrice || 0,
      rentalPrice: vehicle.rentalPrice || 0,
      type: vehicle.type,
      category: vehicle.category,
      fuel: vehicle.engine.fuel,
      transmission: vehicle.transmission,
      mileage: vehicle.mileage,
      color: vehicle.color.exterior,
      features: vehicle.features.join(', '),
      description: vehicle.description
    });
    
    // Set existing images for preview
    setPrimaryImagePreview(getImageUrl(vehicle.primaryImage));
    const allImages = vehicle.images || [];
    setExistingImages(allImages.map(img => getImageUrl(img)));
    
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this vehicle?')) {
      try {
        await vehicleService.deleteVehicle(id);
        await refetch();
      } catch (error) {
        console.error('Error deleting vehicle:', error);
        alert('Error deleting vehicle. Please try again.');
      }
    }
  };

  const handleViewDetails = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setShowDetails(true);
  };

  const handleSellVehicle = (vehicle: Vehicle) => {
    setSellingVehicle(vehicle);
    setSellFormData({
      salePrice: vehicle.salePrice || 0,
      customerName: '',
      customerEmail: '',
      customerPhone: '',
      paymentMethod: 'cash',
      notes: ''
    });
    setShowSellModal(true);
  };

  const handleSellSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sellingVehicle) return;

    try {
      setSubmitting(true);
      await vehicleService.markVehicleAsSold(sellingVehicle.id, sellFormData);
      await refetch();
      setShowSellModal(false);
      setSellingVehicle(null);
      alert('Vehicle marked as sold successfully!');
    } catch (error) {
      console.error('Error marking vehicle as sold:', error);
      alert('Failed to mark vehicle as sold. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value
    }));
  };

  const handlePrimaryImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPrimaryImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPrimaryImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAdditionalImagesSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      setAdditionalImageFiles(prev => [...prev, ...files]);
      
      // Create previews for new files
      files.forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setAdditionalImagePreviews(prev => [...prev, reader.result as string]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeAdditionalImage = (index: number) => {
    setAdditionalImageFiles(prev => prev.filter((_, i) => i !== index));
    setAdditionalImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const removeExistingImage = (index: number) => {
    setExistingImages(prev => prev.filter((_, i) => i !== index));
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Vehicle Management</h1>
        </div>
        <div className="text-center py-12">
          <div className="text-gray-500 text-lg">Loading vehicles...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Vehicle Management</h1>
        </div>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p className="font-bold">Error loading vehicles</p>
          <p className="text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Vehicle Management</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold flex items-center space-x-2 transition-colors duration-200"
        >
          <Plus className="h-5 w-5" />
          <span>Add Vehicle</span>
        </button>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search vehicles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex items-center space-x-2">
              <Filter className="h-5 w-5 text-gray-600" />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Types</option>
                <option value="sale">For Sale</option>
                <option value="rental">For Rental</option>
                <option value="both">Both</option>
              </select>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-700">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="price-high">Price: High to Low</option>
                <option value="price-low">Price: Low to High</option>
                <option value="make">Make A-Z</option>
              </select>
            </div>
          </div>
        </div>
        
        {/* Quick Stats */}
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-blue-600">{vehicles.length}</div>
            <div className="text-sm text-blue-800">Total Vehicles</div>
          </div>
          <div className="bg-green-50 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-green-600">
              {vehicles.filter(v => v.type === 'sale' || v.type === 'both').length}
            </div>
            <div className="text-sm text-green-800">For Sale</div>
          </div>
          <div className="bg-purple-50 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-purple-600">
              {vehicles.filter(v => v.type === 'rental' || v.type === 'both').length}
            </div>
            <div className="text-sm text-purple-800">For Rental</div>
          </div>
          <div className="bg-yellow-50 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-yellow-600">
              {vehicles.filter(v => v.isFeatures).length}
            </div>
            <div className="text-sm text-yellow-800">Featured</div>
          </div>
        </div>
      </div>

      {/* Vehicle Cards View */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVehicles.map(vehicle => (
          <div 
            key={vehicle.id} 
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200 cursor-pointer"
            onClick={() => handleViewDetails(vehicle)}
          >
            <div className="relative">
              <img
                src={getImageUrl(vehicle.primaryImage)}
                alt={`${vehicle.make} ${vehicle.model}`}
                className="w-full h-48 object-cover"
              />
              {vehicle.status === 'sold' && (
                <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                  SOLD
                </div>
              )}
              {vehicle.isFeatures && vehicle.status !== 'sold' && (
                <div className="absolute top-2 left-2 bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                  Featured
                </div>
              )}
              <div className="absolute top-2 right-2 flex items-center space-x-2">
                {vehicle.images && vehicle.images.length > 1 && (
                  <span className="bg-gray-800 bg-opacity-75 text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center">
                    <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                    </svg>
                    {vehicle.images.length}
                  </span>
                )}
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  vehicle.type === 'sale' ? 'bg-blue-100 text-blue-800' :
                  vehicle.type === 'rental' ? 'bg-green-100 text-green-800' :
                  'bg-purple-100 text-purple-800'
                }`}>
                  {vehicle.type === 'both' ? 'Sale & Rental' : vehicle.type}
                </span>
              </div>
            </div>
            
            <div className="p-4">
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-lg font-semibold text-gray-900">
                  {vehicle.year} {vehicle.make} {vehicle.model}
                </h3>
              </div>
              
              <p className="text-gray-600 text-sm mb-3 line-clamp-2">{vehicle.description}</p>
              
              <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 mb-3">
                <div>Color: {vehicle.color.exterior}</div>
                <div>Mileage: {vehicle.mileage.toLocaleString()} mi</div>
                <div>Fuel: {vehicle.engine.fuel}</div>
                <div>Transmission: {vehicle.transmission}</div>
              </div>
              
              <div className="flex justify-between items-center mb-4">
                <div>
                  <div className="text-lg font-bold text-gray-900">
                    ${(vehicle.salePrice || vehicle.rentalPrice || 0).toLocaleString()}
                  </div>
                  {vehicle.rentalPrice && (
                    <div className="text-sm text-blue-600">
                      ${vehicle.rentalPrice}/day rental
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex space-x-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSellVehicle(vehicle);
                  }}
                  disabled={vehicle.status === 'sold'}
                  className={`flex-1 ${vehicle.status === 'sold' ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700 text-white'} py-2 px-3 rounded text-sm font-medium transition-colors duration-200 flex items-center justify-center space-x-1`}
                >
                  <DollarSign className="h-4 w-4" />
                  <span>{vehicle.status === 'sold' ? 'Sold' : 'Sell'}</span>
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEdit(vehicle);
                  }}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-3 rounded text-sm font-medium transition-colors duration-200 flex items-center justify-center space-x-1"
                >
                  <Edit className="h-4 w-4" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(vehicle.id);
                  }}
                  className="bg-red-600 hover:bg-red-700 text-white py-2 px-3 rounded text-sm font-medium transition-colors duration-200"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredVehicles.length === 0 && (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <div className="text-gray-500 text-lg">
            {searchTerm || filterType !== 'all' ? 'No vehicles found matching your criteria.' : 'No vehicles in inventory.'}
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors duration-200"
          >
            Add Your First Vehicle
          </button>
        </div>
      )}

      {/* Vehicle Details Modal */}
      {showDetails && selectedVehicle && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  {selectedVehicle.year} {selectedVehicle.make} {selectedVehicle.model}
                </h2>
                <button
                  onClick={() => setShowDetails(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <img
                    src={getImageUrl(selectedVehicle.primaryImage)}
                    alt={`${selectedVehicle.make} ${selectedVehicle.model}`}
                    className="primary-vehicle-image w-full h-64 object-cover rounded-lg mb-4"
                  />
                  {selectedVehicle.images && selectedVehicle.images.length > 1 && (
                    <div className="grid grid-cols-4 gap-2">
                      {selectedVehicle.images.filter(img => img !== selectedVehicle.primaryImage).slice(0, 8).map((img, index) => (
                        <img
                          key={index}
                          src={getImageUrl(img)}
                          alt={`${selectedVehicle.make} ${selectedVehicle.model} ${index + 1}`}
                          className="w-full h-20 object-cover rounded cursor-pointer hover:opacity-80 transition-opacity"
                          onClick={() => {
                            // Simple image swap - you could enhance this with a modal gallery
                            const primaryImg = document.querySelector('.primary-vehicle-image') as HTMLImageElement;
                            if (primaryImg) {
                              const tempSrc = primaryImg.src;
                              primaryImg.src = getImageUrl(img);
                              (event?.target as HTMLImageElement).src = tempSrc;
                            }
                          }}
                        />
                      ))}
                    </div>
                  )}
                </div>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-600">Price</label>
                      <p className="text-lg font-bold text-gray-900">${(selectedVehicle.salePrice || selectedVehicle.rentalPrice || 0).toLocaleString()}</p>
                    </div>
                    {selectedVehicle.rentalPrice && (
                      <div>
                        <label className="text-sm font-medium text-gray-600">Rental Price</label>
                        <p className="text-lg font-bold text-blue-600">${selectedVehicle.rentalPrice}/day</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-600">Category</label>
                      <p className="text-gray-900 capitalize">{selectedVehicle.category}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Type</label>
                      <p className="text-gray-900 capitalize">{selectedVehicle.type}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-600">Fuel</label>
                      <p className="text-gray-900 capitalize">{selectedVehicle.engine.fuel}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Transmission</label>
                      <p className="text-gray-900 capitalize">{selectedVehicle.transmission}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-600">Mileage</label>
                      <p className="text-gray-900">{selectedVehicle.mileage.toLocaleString()} miles</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Color</label>
                      <p className="text-gray-900">{selectedVehicle.color.exterior}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6">
                <label className="text-sm font-medium text-gray-600">Description</label>
                <p className="text-gray-900 mt-1">{selectedVehicle.description}</p>
              </div>
              
              <div className="mt-6">
                <label className="text-sm font-medium text-gray-600">Features</label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {selectedVehicle.features.map((feature, index) => (
                    <span
                      key={index}
                      className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="mt-6 flex space-x-4">
                <button
                  onClick={() => {
                    handleEdit(selectedVehicle);
                    setShowDetails(false);
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors duration-200"
                >
                  Edit Vehicle
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sell Vehicle Modal */}
      {showSellModal && sellingVehicle && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  Sell Vehicle
                </h2>
                <button
                  onClick={() => setShowSellModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>

              <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold text-gray-900">
                  {sellingVehicle.year} {sellingVehicle.make} {sellingVehicle.model}
                </h3>
                <p className="text-sm text-gray-600">VIN: {sellingVehicle.vin || 'N/A'}</p>
                <p className="text-sm text-gray-600">Listed Price: ${(sellingVehicle.salePrice || 0).toLocaleString()}</p>
              </div>

              <form onSubmit={handleSellSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Sale Price *</label>
                  <input
                    type="number"
                    value={sellFormData.salePrice}
                    onChange={(e) => setSellFormData({...sellFormData, salePrice: Number(e.target.value)})}
                    required
                    min="1"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Customer Name</label>
                  <input
                    type="text"
                    value={sellFormData.customerName}
                    onChange={(e) => setSellFormData({...sellFormData, customerName: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Customer Email</label>
                  <input
                    type="email"
                    value={sellFormData.customerEmail}
                    onChange={(e) => setSellFormData({...sellFormData, customerEmail: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Customer Phone</label>
                  <input
                    type="tel"
                    value={sellFormData.customerPhone}
                    onChange={(e) => setSellFormData({...sellFormData, customerPhone: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Payment Method</label>
                  <select
                    value={sellFormData.paymentMethod}
                    onChange={(e) => setSellFormData({...sellFormData, paymentMethod: e.target.value as any})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="cash">Cash</option>
                    <option value="finance">Finance</option>
                    <option value="credit">Credit Card</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                  <textarea
                    value={sellFormData.notes}
                    onChange={(e) => setSellFormData({...sellFormData, notes: e.target.value})}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="flex space-x-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowSellModal(false)}
                    className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-3 px-6 rounded-lg font-semibold transition-colors duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-lg font-semibold transition-colors duration-200 disabled:opacity-50"
                  >
                    {submitting ? 'Processing...' : 'Mark as Sold'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  {editingVehicle ? 'Edit Vehicle' : 'Add New Vehicle'}
                </h2>
                <button
                  onClick={resetForm}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Make *</label>
                    <input
                      type="text"
                      name="make"
                      value={formData.make}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Model *</label>
                    <input
                      type="text"
                      name="model"
                      value={formData.model}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Year *</label>
                    <input
                      type="number"
                      name="year"
                      value={formData.year}
                      onChange={handleInputChange}
                      required
                      min="1900"
                      max={new Date().getFullYear() + 1}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Price *</label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      required
                      min="0"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Rental Price (per day)</label>
                    <input
                      type="number"
                      name="rentalPrice"
                      value={formData.rentalPrice}
                      onChange={handleInputChange}
                      min="0"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Type *</label>
                    <select
                      name="type"
                      value={formData.type}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="sale">For Sale</option>
                      <option value="rental">For Rental</option>
                      <option value="both">Both</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="sedan">Sedan</option>
                      <option value="suv">SUV</option>
                      <option value="truck">Truck</option>
                      <option value="coupe">Coupe</option>
                      <option value="hatchback">Hatchback</option>
                      <option value="convertible">Convertible</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Fuel Type *</label>
                    <select
                      name="fuel"
                      value={formData.fuel}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="gasoline">Gasoline</option>
                      <option value="diesel">Diesel</option>
                      <option value="hybrid">Hybrid</option>
                      <option value="electric">Electric</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Transmission *</label>
                    <select
                      name="transmission"
                      value={formData.transmission}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="automatic">Automatic</option>
                      <option value="manual">Manual</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Mileage *</label>
                    <input
                      type="number"
                      name="mileage"
                      value={formData.mileage}
                      onChange={handleInputChange}
                      required
                      min="0"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Color *</label>
                    <input
                      type="text"
                      name="color"
                      value={formData.color}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Primary Image *</label>
                  <div className="space-y-2">
                    <div className="flex items-center justify-center w-full">
                      <label htmlFor="primary-image" className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                        {primaryImagePreview ? (
                          <div className="relative w-full h-full">
                            <img src={primaryImagePreview} alt="Primary" className="w-full h-full object-cover rounded-lg" />
                            <button
                              type="button"
                              onClick={(e) => {
                                e.preventDefault();
                                setPrimaryImageFile(null);
                                setPrimaryImagePreview('');
                              }}
                              className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-1 rounded-full"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <Upload className="w-10 h-10 mb-3 text-gray-400" />
                            <p className="mb-2 text-sm text-gray-500">
                              <span className="font-semibold">Click to upload</span> or drag and drop
                            </p>
                            <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                          </div>
                        )}
                        <input
                          id="primary-image"
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={handlePrimaryImageSelect}
                          required={!editingVehicle}
                        />
                      </label>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Additional Images</label>
                  <div className="space-y-4">
                    <div className="flex items-center justify-center w-full">
                      <label htmlFor="additional-images" className="flex flex-col items-center justify-center w-full h-20 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                        <div className="flex items-center space-x-2">
                          <Upload className="w-6 h-6 text-gray-400" />
                          <span className="text-sm text-gray-500">Add more images</span>
                        </div>
                        <input
                          id="additional-images"
                          type="file"
                          className="hidden"
                          accept="image/*"
                          multiple
                          onChange={handleAdditionalImagesSelect}
                        />
                      </label>
                    </div>
                    
                    {/* Show existing images if editing */}
                    {editingVehicle && existingImages.length > 0 && (
                      <div>
                        <p className="text-sm text-gray-600 mb-2">Existing Images</p>
                        <div className="grid grid-cols-6 gap-2">
                          {existingImages.map((img, index) => (
                            <div key={`existing-${index}`} className="relative group">
                              <img 
                                src={img} 
                                alt={`Existing ${index + 1}`} 
                                className="h-20 w-full object-cover rounded"
                              />
                              <button
                                type="button"
                                onClick={() => removeExistingImage(index)}
                                className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <Trash2 className="h-3 w-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* Show new additional images */}
                    {additionalImagePreviews.length > 0 && (
                      <div>
                        <p className="text-sm text-gray-600 mb-2">New Images</p>
                        <div className="grid grid-cols-6 gap-2">
                          {additionalImagePreviews.map((img, index) => (
                            <div key={`new-${index}`} className="relative group">
                              <img 
                                src={img} 
                                alt={`New ${index + 1}`} 
                                className="h-20 w-full object-cover rounded"
                              />
                              <button
                                type="button"
                                onClick={() => removeAdditionalImage(index)}
                                className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <Trash2 className="h-3 w-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Features (comma-separated)</label>
                  <input
                    type="text"
                    name="features"
                    value={formData.features}
                    onChange={handleInputChange}
                    placeholder="Premium Sound System, Leather Seats, Navigation"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="flex space-x-4">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-3 px-6 rounded-lg font-semibold transition-colors duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-semibold transition-colors duration-200 disabled:opacity-50"
                  >
                    {submitting ? 'Saving...' : editingVehicle ? 'Update Vehicle' : 'Add Vehicle'}
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

export default VehicleManagement;