
import { Zap, Mountain, Waves } from 'lucide-react';
import { SubcategoryMapping } from './types';

export const disastersSubcategories: SubcategoryMapping = {
  // Disasters Routes
  'disasters-avalanche': {
    title: 'Avalanches',
    description: 'Avalanche footage, safety information and analysis',
    icon: Zap,
    parent: { route: '/disasters', name: 'Disasters' }
  },
  'disasters-earthquakes': {
    title: 'Earthquakes',
    description: 'Earthquake footage, safety information and analysis',
    icon: Zap,
    parent: { route: '/disasters', name: 'Disasters' }
  },
  'disasters-fires': {
    title: 'Fires & Explosions',
    description: 'Fire disasters, prevention and rescue operations',
    icon: Zap,
    parent: { route: '/disasters', name: 'Disasters' }
  },
  'disasters-hurricanes': {
    title: 'Hurricanes & Tornadoes',
    description: 'Extreme weather events, storms and aftermath',
    icon: Zap,
    parent: { route: '/disasters', name: 'Disasters' }
  },
  'disasters-volcano': {
    title: 'Volcanic Eruptions',
    description: 'Volcanic activity, eruptions and geological impact',
    icon: Zap,
    parent: { route: '/disasters', name: 'Disasters' }
  },
  'disasters-landslides': {
    title: 'Landslides',
    description: 'Landslide events, mudslides, and geological hazards',
    icon: Mountain,
    parent: { route: '/disasters', name: 'Disasters' }
  },
  'disasters-tsunami': {
    title: 'Tsunami',
    description: 'Tsunami events, coastal disasters and wave footage',
    icon: Waves,
    parent: { route: '/disasters', name: 'Disasters' }
  },
};
