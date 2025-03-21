
import { IconMapping } from './types';
import { mediaIcons } from './mediaIcons';
import { businessIcons } from './businessIcons';
import { peopleIcons } from './peopleIcons';
import { vehicleIcons } from './vehicleIcons';
import { miscIcons } from './miscIcons';
import { healthIcons } from './healthIcons';

// Combine all icon mappings into a single object
export const iconComponents: IconMapping = {
  ...mediaIcons,
  ...businessIcons,
  ...peopleIcons,
  ...vehicleIcons,
  ...miscIcons,
  ...healthIcons,
};

// Re-export types
export type { IconMapping } from './types';

// Re-export individual icon groups for selective imports
export {
  mediaIcons,
  businessIcons,
  peopleIcons,
  vehicleIcons,
  miscIcons,
  healthIcons
};
