
import React from 'react';
import { Cloud, Waves, Ship, Anchor, Zap, Droplets } from 'lucide-react';
import { SidebarCategoryLinks } from './SidebarCategoryLinks';

export const EnvironmentWeatherLinks: React.FC = () => {
  const environmentAndWeatherLinks = [
    { 
      id: 'weather', 
      icon: Cloud, 
      label: 'Weather', 
      path: '/weather',
      subItems: [
        { id: 'weather-forecast', label: 'Weather Forecast', path: '/weather/forecast' },
        { id: 'weather-storms', label: 'Storms & Hurricanes', path: '/weather/storms' },
        { id: 'weather-climate', label: 'Climate Change', path: '/weather/climate' },
        { id: 'weather-extreme', label: 'Extreme Weather', path: '/weather/extreme' }
      ]
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
        { id: 'landslides', label: 'Landslides', path: '/disasters/landslides' },
        { id: 'tsunami', label: 'Tsunami', path: '/disasters/tsunami' }
      ]
    },
    { 
      id: 'floods', 
      icon: Droplets, 
      label: 'Floods', 
      path: '/floods',
      subItems: [
        { id: 'floods-flash-flood', label: 'Flash Floods', path: '/floods/flash-flood' },
        { id: 'floods-deluge', label: 'Deluge', path: '/floods/deluge' },
        { id: 'floods-downpour', label: 'Downpour', path: '/floods/downpour' },
        { id: 'floods-drown', label: 'Drowning Hazards', path: '/floods/drown' },
        { id: 'floods-engulf', label: 'Engulfing Waters', path: '/floods/engulf' },
        { id: 'floods-stream', label: 'Stream Flooding', path: '/floods/stream' }
      ]
    },
    { 
      id: 'oceans', 
      icon: Waves, 
      label: 'Waters & Oceans', 
      path: '/oceans',
      subItems: [
        { id: 'oceans-marine-life', label: 'Marine Life', path: '/oceans/marine-life' },
        { id: 'oceans-deep-sea', label: 'Deep Sea', path: '/oceans/deep-sea' },
        { id: 'oceans-coral-reefs', label: 'Coral Reefs', path: '/oceans/coral-reefs' },
        { id: 'oceans-exploration', label: 'Ocean Exploration', path: '/oceans/exploration' }
      ]
    },
    { 
      id: 'boats', 
      icon: Ship, 
      label: 'Boats', 
      path: '/boats',
      subItems: [
        { id: 'all-boats', label: 'All Boats', path: '/boats/all' },
        { id: 'yachts', label: 'Yachts', path: '/boats/yachts' },
        { id: 'sailboats', label: 'Sailboats', path: '/boats/sailboats' },
        { id: 'speedboats', label: 'Speedboats', path: '/boats/speedboats' }
      ]
    },
    { 
      id: 'shipping-ports', 
      icon: Anchor, 
      label: 'Shipping Ports', 
      path: '/shipping-ports',
      subItems: [
        { id: 'ports-cargo', label: 'Cargo Ports', path: '/shipping-ports/cargo' },
        { id: 'ports-cruise', label: 'Cruise Terminals', path: '/shipping-ports/cruise' },
        { id: 'ports-history', label: 'Historic Ports', path: '/shipping-ports/history' }
      ]
    },
  ];

  return <SidebarCategoryLinks title="ENVIRONMENT & WEATHER" links={environmentAndWeatherLinks} />;
};
