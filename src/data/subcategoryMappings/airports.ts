import { Plane, Briefcase, PlaneTakeoff, Users, Sofa, ShieldCheck, Luggage, FileCheck, Globe, Building2 } from 'lucide-react';
import { SubcategoryMapping } from './types';

export const airportsSubcategories: SubcategoryMapping = {
  'airports/passenger': {
    title: 'Passenger',
    description: 'Airport passenger experiences and travel footage',
    icon: Users,
    parent: { route: '/airports', name: 'Airports' }
  },
  'airports/bag-checks': {
    title: 'Bag Checks',
    description: 'Airport security and baggage screening procedures',
    icon: Briefcase,
    parent: { route: '/airports', name: 'Airports' }
  },
  'airports/flights': {
    title: 'Flights',
    description: 'Flight departures, arrivals, and aviation content',
    icon: PlaneTakeoff,
    parent: { route: '/airports', name: 'Airports' }
  },
  'airports/check-in-lines': {
    title: 'Check In Lines',
    description: 'Airport check-in processes and queue experiences',
    icon: Plane,
    parent: { route: '/airports', name: 'Airports' }
  },
  'airports/lounges': {
    title: 'Lounges',
    description: 'Airport lounges and premium waiting areas',
    icon: Sofa,
    parent: { route: '/airports', name: 'Airports' }
  },
  'airports/security': {
    title: 'Security',
    description: 'Airport security checkpoints and procedures',
    icon: ShieldCheck,
    parent: { route: '/airports', name: 'Airports' }
  },
  'airports/baggage-claim': {
    title: 'Baggage Claim',
    description: 'Baggage claim areas and luggage retrieval',
    icon: Luggage,
    parent: { route: '/airports', name: 'Airports' }
  },
  'airports/customs': {
    title: 'Customs',
    description: 'Airport customs and declaration procedures',
    icon: FileCheck,
    parent: { route: '/airports', name: 'Airports' }
  },
  'airports/immigration': {
    title: 'Immigration',
    description: 'Immigration checkpoints and passport control',
    icon: Globe,
    parent: { route: '/airports', name: 'Airports' }
  },
  'airports/terminals': {
    title: 'Terminals',
    description: 'Airport terminals and gate areas',
    icon: Building2,
    parent: { route: '/airports', name: 'Airports' }
  }
};
