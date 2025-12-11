
import { Cloud, CloudRain, CloudSnow, Wind, Thermometer, Sun, CloudLightning } from 'lucide-react';
import { SubcategoryMapping } from './types';

export const weatherSubcategories: SubcategoryMapping = {
  'weather-forecast': {
    title: 'Weather Forecast',
    description: 'Weather forecasts, predictions and meteorology',
    icon: Cloud,
    parent: { route: '/weather', name: 'Weather' }
  },
  'weather-storms': {
    title: 'Storms & Hurricanes',
    description: 'Storm systems, hurricanes, and severe weather events',
    icon: CloudLightning,
    parent: { route: '/weather', name: 'Weather' }
  },
  'weather-climate': {
    title: 'Climate Change',
    description: 'Climate science, global warming, and environmental impact',
    icon: Thermometer,
    parent: { route: '/weather', name: 'Weather' }
  },
  'weather-extreme': {
    title: 'Extreme Weather',
    description: 'Extreme weather events, blizzards, and heat waves',
    icon: Wind,
    parent: { route: '/weather', name: 'Weather' }
  },
  'weather-rain': {
    title: 'Rain',
    description: 'Rain sounds, rainfall footage, and precipitation',
    icon: CloudRain,
    parent: { route: '/weather', name: 'Weather' }
  },
  'weather-thunderstorm': {
    title: 'Thunderstorm',
    description: 'Thunderstorms, lightning, and electrical storms',
    icon: CloudLightning,
    parent: { route: '/weather', name: 'Weather' }
  },
  'weather-wind': {
    title: 'Wind',
    description: 'Wind sounds, gusts, and atmospheric conditions',
    icon: Wind,
    parent: { route: '/weather', name: 'Weather' }
  },
  'weather-snow': {
    title: 'Snow',
    description: 'Snowfall, blizzards, and winter weather',
    icon: CloudSnow,
    parent: { route: '/weather', name: 'Weather' }
  },
  'weather-ambient': {
    title: 'Ambient Weather',
    description: 'Ambient weather sounds and atmospheric recordings',
    icon: Sun,
    parent: { route: '/weather', name: 'Weather' }
  },
};
