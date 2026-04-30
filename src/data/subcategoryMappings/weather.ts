
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
  'weather-hail': {
    title: 'Hail Storms',
    description: 'Hail storms, hailstone footage, and severe weather',
    icon: CloudLightning,
    parent: { route: '/weather', name: 'Weather' }
  },
  // Bad Weather category
  'bad-weather-hurricanes': {
    title: 'Hurricanes',
    description: 'Hurricane footage, tropical cyclones, and severe storm systems',
    icon: Wind,
    parent: { route: '/bad-weather', name: 'Bad Weather' }
  },
  'bad-weather-snow-storms': {
    title: 'Snow Storms',
    description: 'Blizzards, snow storms, and heavy snowfall events',
    icon: CloudSnow,
    parent: { route: '/bad-weather', name: 'Bad Weather' }
  },
  'bad-weather-tornados': {
    title: 'Tornados',
    description: 'Tornado footage, twisters, and funnel cloud events',
    icon: Wind,
    parent: { route: '/bad-weather', name: 'Bad Weather' }
  },
  'bad-weather-tsunami': {
    title: 'Tsunami',
    description: 'Tsunami events, coastal disasters, and giant wave footage',
    icon: CloudRain,
    parent: { route: '/bad-weather', name: 'Bad Weather' }
  },
  'bad-weather-avalanches': {
    title: 'Avalanches',
    description: 'Avalanche events, snow slides, and mountain hazards',
    icon: CloudSnow,
    parent: { route: '/bad-weather', name: 'Bad Weather' }
  },
  'bad-weather-mudslides': {
    title: 'Mudslides',
    description: 'Mudslide events, landslides, and debris flow disasters',
    icon: CloudRain,
    parent: { route: '/bad-weather', name: 'Bad Weather' }
  },
  'bad-weather-black-ice': {
    title: 'Black Ice',
    description: 'Black ice conditions, icy roads, and winter driving hazards',
    icon: CloudSnow,
    parent: { route: '/bad-weather', name: 'Bad Weather' }
  },
};
