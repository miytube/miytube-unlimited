
import React from 'react';
import { Plane, House, Utensils, Pizza } from 'lucide-react';
import { SidebarCategoryLinks } from './SidebarCategoryLinks';

export const PlacesLocationsLinks: React.FC = () => {
  const placesAndLocationsLinks = [
    { id: 'travel-events', icon: Plane, label: 'Travel & Events', path: '/travel-events',
      subItems: [
        { id: 'airplanes-airships', label: 'Airships & Blimps', path: '/travel-events/airplanes-airships' },
        { id: 'airplanes-cargo', label: 'Cargo Planes', path: '/travel-events/airplanes-cargo' },
        { id: 'airplanes-commercial', label: 'Commercial Jets', path: '/travel-events/airplanes-commercial' },
        { id: 'airplanes-land-water', label: 'Land & Water Planes', path: '/travel-events/airplanes-land-water' },
        { id: 'airplanes-pilots', label: 'Pilots & Captains', path: '/travel-events/airplanes-pilots' },
        { id: 'airplanes-single-engine', label: 'Single Engine Planes', path: '/travel-events/airplanes-single-engine' }
      ]
    },
    { id: 'airports', icon: Plane, label: 'Airports', path: '/airports',
      subItems: [
        { id: 'airport-fails', label: 'Airport Fails', path: '/airports/fails' }
      ]
    },
    { id: 'real-estate', icon: House, label: 'Real Estate', path: '/real-estate' },
    { id: 'restaurants', icon: Utensils, label: 'Restaurants', path: '/restaurants' },
    { id: 'foods', icon: Pizza, label: 'Foods', path: '/foods' },
  ];

  return <SidebarCategoryLinks title="PLACES & LOCATIONS" links={placesAndLocationsLinks} />;
};
