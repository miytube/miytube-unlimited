
import React from 'react';
import { Plane, Utensils, Pizza, Map, Sailboat, Waves } from 'lucide-react';
import { SidebarCategoryLinks } from './SidebarCategoryLinks';

export const PlacesLocationsLinks: React.FC = () => {
  const placesAndLocationsLinks = [
    { 
      id: 'travel-events', 
      icon: Map, 
      label: 'Travel & Events', 
      path: '/travel-events',
      subItems: [
        { id: 'cities-towns', label: 'Cities & Towns', path: '/travel-events/cities-towns' },
        { id: 'hotels', label: 'Hotels', path: '/travel-events/hotels' },
        { id: 'expensive-hotels', label: 'Expensive Hotels', path: '/travel-events/expensive-hotels' },
        { id: 'night-clubs', label: 'Night Clubs & Restaurants', path: '/travel-events/night-clubs' },
        { id: 'street-foods', label: 'Foods & Street Foods', path: '/travel-events/street-foods' },
        { id: 'travel-hacks', label: 'Travel Hacks', path: '/travel-events/travel-hacks' },
        { id: 'beaches', label: 'Beaches', path: '/travel-events/beaches' },
        { id: 'lagoons', label: 'Lagoons', path: '/travel-events/lagoons' },
        { id: 'airplanes-airships', label: 'Airships & Blimps', path: '/travel-events/airplanes-airships' },
        { id: 'airplanes-cargo', label: 'Cargo Planes', path: '/travel-events/airplanes-cargo' },
        { id: 'airplanes-commercial', label: 'Commercial Jets', path: '/travel-events/airplanes-commercial' },
        { id: 'airplanes-business', label: 'Business Jets', path: '/travel-events/airplanes-business' },
        { id: 'airplanes-land-water', label: 'Land & Water Planes', path: '/travel-events/airplanes-land-water' },
        { id: 'airplanes-pilots', label: 'Pilots & Captains', path: '/travel-events/airplanes-pilots' },
        { id: 'airplanes-single-engine', label: 'Single Engine Planes', path: '/travel-events/airplanes-single-engine' }
      ]
    },
    { 
      id: 'airports', 
      icon: Plane, 
      label: 'Airports', 
      path: '/airports',
      subItems: [
        { id: 'airport-fails', label: 'Airport Fails', path: '/airports/fails' }
      ]
    },
    { 
      id: 'restaurants', 
      icon: Utensils, 
      label: 'Restaurants', 
      path: '/restaurants' 
    },
    { 
      id: 'foods', 
      icon: Pizza, 
      label: 'Foods', 
      path: '/foods' 
    },
    { 
      id: 'beaches', 
      icon: Waves, 
      label: 'Beaches & Lagoons', 
      path: '/beaches' 
    },
  ];

  return <SidebarCategoryLinks title="PLACES & LOCATIONS" links={placesAndLocationsLinks} />;
};
