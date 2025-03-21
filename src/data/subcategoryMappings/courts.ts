
import { Gavel } from 'lucide-react';
import { SubcategoryMapping } from './types';

export const courtsSubcategories: SubcategoryMapping = {
  // Courts & Crime Routes
  'courts-police-trails': {
    title: 'Court Trials',
    description: 'Court proceedings, trials and legal procedures',
    icon: Gavel,
    parent: { route: '/courts-police', name: 'Courts & Police' }
  },
  'courts-police-sentencing': {
    title: 'Sentencing & Judgments',
    description: 'Court sentences, judgments and legal decisions',
    icon: Gavel,
    parent: { route: '/courts-police', name: 'Courts & Police' }
  },
  'courts-police-supreme-court': {
    title: 'Supreme Court',
    description: 'Supreme court cases, decisions and constitutional law',
    icon: Gavel,
    parent: { route: '/courts-police', name: 'Courts & Police' }
  },
  'courts-police-fraud': {
    title: 'Fraud & Scams',
    description: 'Financial fraud, scams and criminal deception',
    icon: Gavel,
    parent: { route: '/courts-police', name: 'Courts & Police' }
  },
  'courts-police-gangs': {
    title: 'Criminal Gangs',
    description: 'Gang activity, criminal enterprises and law enforcement',
    icon: Gavel,
    parent: { route: '/courts-police', name: 'Courts & Police' }
  },
  'courts-police-crime': {
    title: 'Crime',
    description: 'Criminal activities, definitions and consequences',
    icon: Gavel,
    parent: { route: '/courts-police', name: 'Courts & Police' }
  },
  'courts-police-enterprises': {
    title: 'Criminal Enterprises',
    description: 'Organized crime operations and criminal business activities',
    icon: Gavel,
    parent: { route: '/courts-police', name: 'Courts & Police' }
  },
};
