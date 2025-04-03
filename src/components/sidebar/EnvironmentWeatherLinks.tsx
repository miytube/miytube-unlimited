
import React from 'react';
import { Cloud, Waves, Ship, Anchor, Zap, Droplets, Mountain } from 'lucide-react';
import { SidebarCategoryLinks } from './SidebarCategoryLinks';

export const EnvironmentWeatherLinks: React.FC = () => {
  const environmentAndWeatherLinks = [
    { 
      id: 'weather', 
      icon: Cloud, 
      label: 'Weather', 
      path: '/weather' 
    },
    { 
      id: 'disasters', 
      icon: Zap, 
      label: 'Disasters', 
      path: '/disasters',
      subItems: [
        { id: 'avalanche', label: 'Avalanche', path: '/disasters/avalanche' },
        { id: 'earthquakes', label: 'Earthquakes', path: '/disasters/earthquakes' },
        { id: 'fires', label: 'Fires', path: '/disasters/fires' },
        { id: 'floods', label: 'Floods', path: '/disasters/floods' },
        { id: 'landslides', label: 'Landslides', path: '/disasters/landslides' },
        { id: 'tsunami', label: 'Tsunami', path: '/disasters/tsunami' }
      ]
    },
    { 
      id: 'oceans', 
      icon: Waves, 
      label: 'Waters & Oceans', 
      path: '/oceans' 
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
    },
    { 
      id: 'shipping-ports', 
      icon: Anchor, 
      label: 'Shipping Ports', 
      path: '/shipping-ports' 
    },
  ];

  return <SidebarCategoryLinks title="ENVIRONMENT & WEATHER" links={environmentAndWeatherLinks} />;
};
