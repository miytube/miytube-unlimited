
import React from 'react';
import { Car, Truck } from 'lucide-react';
import { SidebarCategoryLinks } from './SidebarCategoryLinks';

export const TransportVehiclesLinks: React.FC = () => {
  const transportAndVehiclesLinks = [
    { id: 'autos-vehicles', icon: Car, label: 'Autos & Vehicles', path: '/autos-vehicles' },
    { id: 'shipping', icon: Truck, label: 'Shipping', path: '/shipping' },
  ];

  return <SidebarCategoryLinks title="TRANSPORT & VEHICLES" links={transportAndVehiclesLinks} />;
};
