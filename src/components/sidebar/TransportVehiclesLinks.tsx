
import React from 'react';
import { Car, Truck, Ship, Plane } from 'lucide-react';
import { SidebarCategoryLinks } from './SidebarCategoryLinks';

export const TransportVehiclesLinks: React.FC = () => {
  const transportAndVehiclesLinks = [
    { 
      id: 'autos-vehicles', 
      icon: Car, 
      label: 'Autos & Vehicles', 
      path: '/autos-vehicles',
      subItems: [
        { id: 'supercars', label: 'Supercars', path: '/autos-vehicles/supercars' },
        { id: 'expensive-cars', label: 'Expensive Cars', path: '/autos-vehicles/expensive-cars' },
        { id: 'car-repairs', label: 'Car Repairs', path: '/autos-vehicles/car-repairs' },
        { id: 'car-hacks', label: 'Car Hacks', path: '/autos-vehicles/car-hacks' }
      ]
    },
    { 
      id: 'shipping', 
      icon: Truck, 
      label: 'Shipping', 
      path: '/shipping',
      subItems: [
        { id: 'cargo-ships', label: 'Cargo Ships', path: '/shipping/cargo-ships' },
        { id: 'oil-tankers', label: 'Oil Tankers', path: '/shipping/oil-tankers' },
      ]
    },
    { 
      id: 'boats', 
      icon: Ship, 
      label: 'Boats', 
      path: '/boats',
      subItems: [
        { id: 'all-boats', label: 'All Boats', path: '/boats/all' },
        { id: 'yachts', label: 'Yachts', path: '/boats/yachts' }
      ]
    }
  ];

  return <SidebarCategoryLinks title="TRANSPORT & VEHICLES" links={transportAndVehiclesLinks} />;
};
