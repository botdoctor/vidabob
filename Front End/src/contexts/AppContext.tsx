import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Vehicle } from '../types';
import { vehicles as initialVehicles } from '../data/vehicles';

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  createdAt: Date;
}

interface Rental {
  id: string;
  vehicleId: string;
  customerId: string;
  startDate: Date;
  endDate: Date;
  totalCost: number;
  status: 'active' | 'completed' | 'cancelled';
  createdAt: Date;
}

interface AppContextType {
  vehicles: Vehicle[];
  customers: Customer[];
  rentals: Rental[];
  addVehicle: (vehicle: Omit<Vehicle, 'id'>) => void;
  updateVehicle: (id: string, vehicle: Partial<Vehicle>) => void;
  deleteVehicle: (id: string) => void;
  addCustomer: (customer: Omit<Customer, 'id' | 'createdAt'>) => void;
  addRental: (rental: Omit<Rental, 'id' | 'createdAt'>) => void;
  updateRental: (id: string, rental: Partial<Rental>) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [vehicles, setVehicles] = useState<Vehicle[]>(initialVehicles);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [rentals, setRentals] = useState<Rental[]>([]);

  const addVehicle = (vehicle: Omit<Vehicle, 'id'>) => {
    const newVehicle: Vehicle = {
      ...vehicle,
      id: Date.now().toString()
    };
    setVehicles(prev => [...prev, newVehicle]);
  };

  const updateVehicle = (id: string, updatedVehicle: Partial<Vehicle>) => {
    setVehicles(prev => prev.map(vehicle => 
      vehicle.id === id ? { ...vehicle, ...updatedVehicle } : vehicle
    ));
  };

  const deleteVehicle = (id: string) => {
    setVehicles(prev => prev.filter(vehicle => vehicle.id !== id));
  };

  const addCustomer = (customer: Omit<Customer, 'id' | 'createdAt'>) => {
    const newCustomer: Customer = {
      ...customer,
      id: Date.now().toString(),
      createdAt: new Date()
    };
    setCustomers(prev => [...prev, newCustomer]);
  };

  const addRental = (rental: Omit<Rental, 'id' | 'createdAt'>) => {
    const newRental: Rental = {
      ...rental,
      id: Date.now().toString(),
      createdAt: new Date()
    };
    setRentals(prev => [...prev, newRental]);
  };

  const updateRental = (id: string, updatedRental: Partial<Rental>) => {
    setRentals(prev => prev.map(rental => 
      rental.id === id ? { ...rental, ...updatedRental } : rental
    ));
  };

  return (
    <AppContext.Provider value={{
      vehicles,
      customers,
      rentals,
      addVehicle,
      updateVehicle,
      deleteVehicle,
      addCustomer,
      addRental,
      updateRental
    }}>
      {children}
    </AppContext.Provider>
  );
};