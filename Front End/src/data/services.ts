import { Service } from '../types';

export const services: Service[] = [
  {
    id: '1',
    title: 'New & Used Car Sales',
    description: 'Extensive inventory of premium vehicles from top manufacturers with competitive pricing and financing options.',
    icon: 'Car',
    features: ['Wide Selection', 'Competitive Pricing', 'Trade-In Options', 'Financing Available', 'Warranty Included']
  },
  {
    id: '2',
    title: 'Vehicle Rentals',
    description: 'Flexible rental options for business and leisure with premium vehicles and exceptional service.',
    icon: 'Key',
    features: ['Daily/Weekly/Monthly', 'Premium Fleet', 'Insurance Options', 'Delivery Service', '24/7 Support']
  },
  {
    id: '3',
    title: 'Financing & Leasing',
    description: 'Customized financing solutions to help you drive away in your dream vehicle today.',
    icon: 'CreditCard',
    features: ['Competitive Rates', 'Flexible Terms', 'Quick Approval', 'Lease Options', 'Credit Solutions']
  },
  {
    id: '4',
    title: 'Service & Maintenance',
    description: 'Professional automotive service center with certified technicians and genuine parts.',
    icon: 'Wrench',
    features: ['Certified Technicians', 'Genuine Parts', 'Oil Changes', 'Brake Service', 'Warranty Work']
  }
];