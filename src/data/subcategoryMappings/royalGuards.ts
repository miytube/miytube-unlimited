import { Shield, Crown, Sword, Castle, Medal, Flag } from 'lucide-react';
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
  },
  'royal-security-guards/palace-guards': {
    title: 'Palace Guards',
    description: 'Royal palace security and protection forces',
    icon: Castle,
    parent: { route: '/royal-security-guards', name: 'Royal Security Guards' }
  },
  'royal-security-guards/honor-guards': {
    title: 'Honor Guards',
    description: 'Military honor guard ceremonies and traditions',
    icon: Medal,
    parent: { route: '/royal-security-guards', name: 'Royal Security Guards' }
  },
  'royal-security-guards/ceremonial-units': {
    title: 'Ceremonial Units',
    description: 'Ceremonial military units and their traditions',
    icon: Flag,
    parent: { route: '/royal-security-guards', name: 'Royal Security Guards' }
  }
};
