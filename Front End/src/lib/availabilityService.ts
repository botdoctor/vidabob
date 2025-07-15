import api from './api';
import { Vehicle } from '../types';

export interface AvailabilityResponse {
  date: string;
  totalVehicles: number;
  availableCount: number;
  bookedCount: number;
  vehicles: Vehicle[];
}

export interface VehicleAvailabilityResponse {
  vehicleId: string;
  startDate: string;
  endDate: string;
  available: boolean;
  message: string;
}

export const availabilityService = {
  // Get available vehicles for a specific date
  async getAvailableVehicles(date: string): Promise<AvailabilityResponse> {
    const response = await api.get<AvailabilityResponse>(`/availability?date=${date}`);
    return response.data;
  },

  // Get available vehicles for a date range
  async getAvailableVehiclesForRange(startDate: string, endDate: string): Promise<AvailabilityResponse> {
    const response = await api.get<AvailabilityResponse>(`/availability?startDate=${startDate}&endDate=${endDate}`);
    return response.data;
  },

  // Check if a specific vehicle is available for a date range
  async checkVehicleAvailability(
    vehicleId: string, 
    startDate: string, 
    endDate: string
  ): Promise<VehicleAvailabilityResponse> {
    const response = await api.get<VehicleAvailabilityResponse>(
      `/availability/${vehicleId}?startDate=${startDate}&endDate=${endDate}`
    );
    return response.data;
  }
};