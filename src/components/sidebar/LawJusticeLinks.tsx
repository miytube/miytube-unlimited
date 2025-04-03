
import React from 'react';
import { Gavel, Shield, Car, Bomb, Flame } from 'lucide-react';
import { SidebarCategoryLinks } from './SidebarCategoryLinks';

export const LawJusticeLinks: React.FC = () => {
  const lawAndJusticeLinks = [
    { 
      id: 'courts-police', 
      icon: Gavel, 
      label: 'Courts & Police', 
      path: '/courts-police',
      subItems: [
        { id: 'police-sheriffs', label: 'Police, Sheriffs & Highway Patrol', path: '/courts-police/police-sheriffs' },
        { id: 'fbi-atf', label: 'FBI, ATF & Bomb Squad', path: '/courts-police/fbi-atf' },
        { id: 'police-chases', label: 'Police Car Chases', path: '/courts-police/car-chases' },
        { id: 'police-shootings', label: 'Police Shootings', path: '/courts-police/shootings' }
      ]
    },
    { 
      id: 'fire-department', 
      icon: Flame, 
      label: 'Fire Department', 
      path: '/fire-department' 
    },
    { 
      id: 'military', 
      icon: Shield, 
      label: 'Military', 
      path: '/military',
      subItems: [
        { id: 'military-personnel', label: 'Military Personnel', path: '/military/personnel' },
        { id: 'military-airplanes', label: 'Military Airplanes', path: '/military/airplanes' },
        { id: 'military-ships', label: 'Military Ships', path: '/military/ships' },
        { id: 'military-boats', label: 'Military Boats', path: '/military/boats' },
        { id: 'military-aircraft-carriers', label: 'Aircraft Carriers', path: '/military/aircraft-carriers' },
        { id: 'military-submarines', label: 'Military Submarines', path: '/military/submarines' },
        { id: 'military-weapons', label: 'Military Weapons', path: '/military/weapons' },
        { id: 'military-heavy-weapons', label: 'Heavy Weapons', path: '/military/heavy-weapons' }
      ]
    }
  ];

  return <SidebarCategoryLinks title="LAW & JUSTICE" links={lawAndJusticeLinks} />;
};
