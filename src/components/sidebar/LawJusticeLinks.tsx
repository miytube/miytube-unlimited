
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
      id: 'military-marines', 
      icon: Ship, 
      label: 'Military: Marines', 
      path: '/military-marines',
      subItems: [
        { id: 'marine-training', label: 'Marine Training', path: '/marine-training' },
        { id: 'marine-boot-camp', label: 'Marine Boot Camp', path: '/marine-boot-camp' },
        { id: 'marine-ships', label: 'Marine Ships', path: '/marine-ships' },
        { id: 'marine-personnel', label: 'Marine Personnel', path: '/marine-personnel' },
        { id: 'marine-weapons', label: 'Marine Weapons', path: '/marine-weapons' },
        { id: 'marine-pilots', label: 'Marine Pilots', path: '/marine-pilots' },
        { id: 'marine-duties', label: 'Marine Duties', path: '/marine-duties' }
      ]
    },
    { 
      id: 'military-army', 
      icon: Shield, 
      label: 'Military: Army', 
      path: '/military-army',
      subItems: [
        { id: 'army-training', label: 'Army Training', path: '/army-training' },
        { id: 'army-boot-camp', label: 'Army Boot Camp', path: '/army-boot-camp' },
        { id: 'army-ships', label: 'Army Ships', path: '/army-ships' },
        { id: 'army-personnel', label: 'Army Personnel', path: '/army-personnel' },
        { id: 'army-weapons', label: 'Army Weapons', path: '/army-weapons' },
        { id: 'army-pilots', label: 'Army Pilots', path: '/army-pilots' },
        { id: 'army-duties', label: 'Army Duties', path: '/army-duties' }
      ]
    },
    { 
      id: 'military-navy', 
      icon: Anchor, 
      label: 'Military: Navy', 
      path: '/military-navy',
      subItems: [
        { id: 'navy-training', label: 'Navy Training', path: '/navy-training' },
        { id: 'navy-boot-camp', label: 'Navy Boot Camp', path: '/navy-boot-camp' },
        { id: 'navy-ships', label: 'Navy Ships', path: '/navy-ships' },
        { id: 'navy-personnel', label: 'Navy Personnel', path: '/navy-personnel' },
        { id: 'navy-weapons', label: 'Navy Weapons', path: '/navy-weapons' },
        { id: 'navy-pilots', label: 'Navy Pilots', path: '/navy-pilots' },
        { id: 'navy-duties', label: 'Navy Duties', path: '/navy-duties' }
      ]
    },
    { 
      id: 'military-coast-guard', 
      icon: Anchor, 
      label: 'Military: Coast Guard', 
      path: '/military-coast-guard',
      subItems: [
        { id: 'coast-guard-training', label: 'Coast Guard Training', path: '/coast-guard-training' },
        { id: 'coast-guard-boot-camp', label: 'Coast Guard Boot Camp', path: '/coast-guard-boot-camp' },
        { id: 'coast-guard-ships', label: 'Coast Guard Ships', path: '/coast-guard-ships' },
        { id: 'coast-guard-personnel', label: 'Coast Guard Personnel', path: '/coast-guard-personnel' },
        { id: 'coast-guard-weapons', label: 'Coast Guard Weapons', path: '/coast-guard-weapons' },
        { id: 'coast-guard-pilots', label: 'Coast Guard Pilots', path: '/coast-guard-pilots' },
        { id: 'coast-guard-duties', label: 'Coast Guard Duties', path: '/coast-guard-duties' }
      ]
    },
    { 
      id: 'military-airforce', 
      icon: Plane, 
      label: 'Military: Airforce', 
      path: '/military-airforce',
      subItems: [
        { id: 'airforce-training', label: 'Airforce Training', path: '/airforce-training' },
        { id: 'airforce-boot-camp', label: 'Airforce Boot Camp', path: '/airforce-boot-camp' },
        { id: 'airforce-planes', label: 'Airforce Planes', path: '/airforce-planes' },
        { id: 'airforce-ships', label: 'Airforce Ships', path: '/airforce-ships' },
        { id: 'airforce-personnel', label: 'Airforce Personnel', path: '/airforce-personnel' },
        { id: 'airforce-weapons', label: 'Airforce Weapons', path: '/airforce-weapons' },
        { id: 'airforce-pilots', label: 'Airforce Pilots', path: '/airforce-pilots' },
        { id: 'airforce-duties', label: 'Airforce Duties', path: '/airforce-duties' }
      ]
    },
    { 
      id: 'military-weapons-drones', 
      icon: Target, 
      label: 'Military Weapons Drones', 
      path: '/military-weapons-drones' 
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
