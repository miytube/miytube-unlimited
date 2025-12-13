
import { Shield, Crown, Sword } from 'lucide-react';
import { SubcategoryMapping } from './types';

export const royalGuardsSubcategories: SubcategoryMapping = {
  'royal-security-guards/british': {
    title: 'British Royal Guards',
    description: 'British Royal Guard ceremonies, traditions, and service',
    icon: Crown,
    parent: { route: '/royal-security-guards', name: 'Royal Security Guards' }
  },
  'royal-security-guards/elite-military': {
    title: 'Elite Military Guards',
    description: 'Elite military security forces and ceremonial guards worldwide',
    icon: Sword,
    parent: { route: '/royal-security-guards', name: 'Royal Security Guards' }
  }
};
