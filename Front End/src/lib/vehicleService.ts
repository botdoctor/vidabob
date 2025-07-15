import api from './api';
import { Vehicle } from '../types';

// The backend now uses the new vehicle schema directly
// No transformation needed since frontend and backend schemas are aligned

export const vehicleService = {
  // Get all vehicles
  async getAllVehicles(): Promise<Vehicle[]> {
    const response = await api.get<{ vehicles: Vehicle[] }>('/vehicles');
    return response.data.vehicles;
  },

  // Get vehicle by ID
  async getVehicleById(id: string): Promise<Vehicle> {
    const response = await api.get<{ vehicle: Vehicle }>(`/vehicles/${id}`);
    return response.data.vehicle;
  },

  // Create new vehicle (admin only)
  async createVehicle(vehicleData: any, primaryImage?: File, additionalImages?: File[]): Promise<Vehicle> {
    const formData = new FormData();
    
    // Append vehicle data as JSON string
    Object.keys(vehicleData).forEach(key => {
      if (vehicleData[key] !== undefined && vehicleData[key] !== null) {
        if (typeof vehicleData[key] === 'object' && !Array.isArray(vehicleData[key])) {
          formData.append(key, JSON.stringify(vehicleData[key]));
        } else if (Array.isArray(vehicleData[key])) {
          formData.append(key, JSON.stringify(vehicleData[key]));
        } else {
          formData.append(key, vehicleData[key].toString());
        }
      }
    });
    
    // Append files
    if (primaryImage) {
      formData.append('primaryImage', primaryImage);
    }
    
    if (additionalImages && additionalImages.length > 0) {
      additionalImages.forEach(image => {
        formData.append('additionalImages', image);
      });
    }
    
    const response = await api.post<{ vehicle: Vehicle }>('/vehicles', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.vehicle;
  },

  // Update vehicle (admin only)
  async updateVehicle(id: string, vehicleData: any, primaryImage?: File, additionalImages?: File[], keepExistingImages?: boolean): Promise<Vehicle> {
    const formData = new FormData();
    
    // Append vehicle data
    Object.keys(vehicleData).forEach(key => {
      if (vehicleData[key] !== undefined && vehicleData[key] !== null) {
        if (typeof vehicleData[key] === 'object' && !Array.isArray(vehicleData[key])) {
          formData.append(key, JSON.stringify(vehicleData[key]));
        } else if (Array.isArray(vehicleData[key])) {
          formData.append(key, JSON.stringify(vehicleData[key]));
        } else {
          formData.append(key, vehicleData[key].toString());
        }
      }
    });
    
    // Append keepExistingImages flag
    if (keepExistingImages !== undefined) {
      formData.append('keepExistingImages', keepExistingImages.toString());
    }
    
    // Append files
    if (primaryImage) {
      formData.append('primaryImage', primaryImage);
    }
    
    if (additionalImages && additionalImages.length > 0) {
      additionalImages.forEach(image => {
        formData.append('additionalImages', image);
      });
    }
    
    const response = await api.put<{ vehicle: Vehicle }>(`/vehicles/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.vehicle;
  },

  // Delete vehicle (admin only)
  async deleteVehicle(id: string): Promise<void> {
    await api.delete(`/vehicles/${id}`);
  },

  // Check availability
  async checkAvailability(id: string, startDate: string, endDate: string): Promise<boolean> {
    const response = await api.get<{ available: boolean }>(`/vehicles/${id}/availability`, {
      params: { startDate, endDate }
    });
    return response.data.available;
  },

  // Get filtered vehicles
  async getFilteredVehicles(filters: {
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    available?: boolean;
    startDate?: string;
    endDate?: string;
  }): Promise<Vehicle[]> {
    const response = await api.get<{ vehicles: Vehicle[] }>('/vehicles', {
      params: filters
    });
    return response.data.vehicles;
  },

  // Mark vehicle as sold (admin only)
  async markVehicleAsSold(id: string, saleData: {
    salePrice: number;
    customerName?: string;
    customerEmail?: string;
    customerPhone?: string;
    paymentMethod?: 'cash' | 'finance' | 'credit' | 'other';
    notes?: string;
  }): Promise<{ vehicle: Partial<Vehicle>; sale: any }> {
    const response = await api.post<{ 
      message: string;
      vehicle: Partial<Vehicle>;
      sale: any;
    }>(`/vehicles/${id}/sell`, saleData);
    return {
      vehicle: response.data.vehicle,
      sale: response.data.sale
    };
  }
};