import { useState, useEffect } from 'react';
import { Vehicle } from '../types';
import { vehicleService } from '../lib/vehicleService';

export const useVehicles = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchVehicles = async () => {
    try {
      setLoading(true);
      setError(null);
      const fetchedVehicles = await vehicleService.getAllVehicles();
      setVehicles(fetchedVehicles);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch vehicles');
      console.error('Error fetching vehicles:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  return {
    vehicles,
    loading,
    error,
    refetch: fetchVehicles
  };
};

export const useVehicle = (id: string) => {
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVehicle = async () => {
      try {
        setLoading(true);
        setError(null);
        const fetchedVehicle = await vehicleService.getVehicleById(id);
        setVehicle(fetchedVehicle);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch vehicle');
        console.error('Error fetching vehicle:', err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchVehicle();
    }
  }, [id]);

  return {
    vehicle,
    loading,
    error
  };
};