
import React from 'react';
import { Gavel, Shield, Flame, Anchor, Plane, Ship, Car, Target, Users, Truck, Building } from 'lucide-react';
import { SidebarCategoryLinks } from './SidebarCategoryLinks';

export const LawJusticeLinks: React.FC = () => {
  const lawAndJusticeLinks = [
    { 
      id: 'police-department', 
      icon: Shield, 
      label: 'Police Department', 
      path: '/police-department',
      subItems: [
        { id: 'police-fails', label: 'Police Fails', path: '/police-fails' },
        { id: 'police-trainings', label: 'Police Trainings', path: '/police-trainings' },
        { id: 'police-personnel', label: 'Police Personnel', path: '/police-personnel' },
        { id: 'police-equipment', label: 'Police Equipment', path: '/police-equipment' },
        { id: 'police-weapons', label: 'Police Weapons', path: '/police-weapons' },
        { id: 'police-boot-camp', label: 'Police Boot Camp', path: '/police-boot-camp' },
        { id: 'police-vehicle-chases', label: 'Vehicle Chases', path: '/police-vehicle-chases' },
        { id: 'police-vehicle-crashes', label: 'Vehicle Crashes', path: '/police-vehicle-crashes' },
        { id: 'police-shootings', label: 'Police Shootings', path: '/police-shootings' }
      ]
    },
    { 
      id: 'fire-department', 
      icon: Flame, 
      label: 'Fire Department', 
      path: '/fire-department',
      subItems: [
        { id: 'fire-department-fails', label: 'Fire Department Fails', path: '/fire-department-fails' },
        { id: 'fire-trucks', label: 'Fire Trucks', path: '/fire-trucks' },
        { id: 'fire-personnel-training', label: 'Fire Personnel Training', path: '/fire-personnel-training' },
        { id: 'fire-house-fires', label: 'House Fires', path: '/fire-house-fires' },
        { id: 'fire-building-fires', label: 'Building Fires', path: '/fire-building-fires' },
        { id: 'fire-land-fires', label: 'Land Fires', path: '/fire-land-fires' }
      ]
    },
    { 
      id: 'military', 
      icon: Shield, 
      label: 'Military', 
      path: '/military',
      subItems: [
        { id: 'military-army', label: 'Army', path: '/military/army' },
        { id: 'military-airforce', label: 'Air Force', path: '/military/airforce' },
        { id: 'military-navy', label: 'Navy', path: '/military/navy' },
        { id: 'military-coast-guard', label: 'Coast Guard', path: '/military/coast-guard' },
        { id: 'military-marines', label: 'Marines', path: '/military/marines' }
      ]
    },
    { 
      id: 'courts-police', 
      icon: Gavel, 
      label: 'Courts & Police', 
      path: '/courts-police',
      subItems: [
        { id: 'court-trials', label: 'Court Trials', path: '/court-trials' },
        { id: 'courts-indictment', label: 'Courts Indictment', path: '/courts-indictment' },
        { id: 'courts-sentencing', label: 'Courts Sentencing', path: '/courts-sentencing' }
      ]
    }
  ];

  return <SidebarCategoryLinks title="LAW, JUSTICE & MILITARY" links={lawAndJusticeLinks} />;
};
