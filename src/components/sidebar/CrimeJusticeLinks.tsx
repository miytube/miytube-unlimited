
import React from 'react';
import { Scale, Shield, Gavel, Lock, AlertTriangle, Siren } from 'lucide-react';
import { SidebarCategoryLinks } from './SidebarCategoryLinks';

export const CrimeJusticeLinks: React.FC = () => {
  const crimeJusticeLinks = [
    { 
      id: 'courts', 
      icon: Gavel, 
      label: 'Courts', 
      path: '/courts',
      subItems: [
        { id: 'courts-indictment', label: 'Indictment & Charges', path: '/courts/indictment' },
        { id: 'courts-sentencing', label: 'Sentencing & Judgement', path: '/courts/sentencing' },
        { id: 'courts-supreme', label: 'Supreme Courts & District', path: '/courts/supreme' },
        { id: 'courts-crime', label: 'Courts & Police Crime', path: '/courts/crime' }
      ]
    },
    { 
      id: 'crime', 
      icon: AlertTriangle, 
      label: 'Crime', 
      path: '/crime',
      subItems: [
        { id: 'crime-shootouts', label: 'Shoot-outs', path: '/crime/shootouts' },
        { id: 'crime-gangs', label: 'Gangs', path: '/crime/gangs' },
        { id: 'crime-fraud', label: 'Fraud & Scammers', path: '/crime/fraud' },
        { id: 'crime-works', label: 'How Crime Works', path: '/crime/works' },
        { id: 'crime-enterprises', label: 'Criminal Enterprises', path: '/crime/enterprises' },
        { id: 'crime-gangsters', label: 'Gangsters', path: '/crime/gangsters' }
      ]
    },
    { 
      id: 'police', 
      icon: Shield, 
      label: 'Police', 
      path: '/police',
      subItems: [
        { id: 'police-chases', label: 'Police Chases', path: '/police/chases' },
        { id: 'police-sheriff', label: 'Sheriff & Highway Patrol', path: '/police/sheriff' },
        { id: 'police-stops', label: 'Police Stops (What to Do)', path: '/police/stops' }
      ]
    },
    { 
      id: 'jails', 
      icon: Lock, 
      label: 'Jails & Prisons', 
      path: '/jails',
      subItems: [
        { id: 'jails-county', label: 'County Jails', path: '/jails/county' },
        { id: 'jails-prisons', label: 'Prisons', path: '/jails/prisons' }
      ]
    },
    { 
      id: 'attorney', 
      icon: Scale, 
      label: 'Attorney & Legal', 
      path: '/attorney',
      subItems: [
        { id: 'attorney-info', label: 'Legal Information', path: '/attorney/info' },
        { id: 'attorney-stats', label: 'Legal Statistics', path: '/attorney/stats' }
      ]
    },
    { 
      id: 'drugs', 
      icon: Siren, 
      label: 'Drugs', 
      path: '/drugs',
      subItems: [
        { id: 'drugs-money', label: 'Drugs & Money & Dealers', path: '/drugs/money' },
        { id: 'drugs-documentary', label: 'Drug Documentaries', path: '/drugs/documentary' }
      ]
    },
    { 
      id: 'military', 
      icon: Shield, 
      label: 'Military', 
      path: '/military',
      subItems: [
        { id: 'military-army', label: 'Army', path: '/military/army' },
        { id: 'military-coast-guard', label: 'Coast Guard', path: '/military/coast-guard' },
        { id: 'military-conduct', label: 'Conduct & Policy', path: '/military/conduct' },
        { id: 'military-marines', label: 'Marines', path: '/military/marines' },
        { id: 'military-navy', label: 'Navy', path: '/military/navy' },
        { id: 'military-pilots', label: 'Pilots', path: '/military/pilots' },
        { id: 'military-reserves', label: 'Reserves', path: '/military/reserves' },
        { id: 'military-weapons', label: 'Weapons & Guns', path: '/military/weapons' },
        { id: 'military-aircrafts', label: 'Military Aircrafts', path: '/military/aircrafts' },
        { id: 'military-documentary', label: 'Military Documentary', path: '/military/documentary' },
        { id: 'military-ships', label: 'Military Ships', path: '/military/ships' },
        { id: 'military-submarines', label: 'Submarines', path: '/military/submarines' },
        { id: 'military-war', label: 'Military War', path: '/military/war' },
        { id: 'military-drones', label: 'Weapons Drones', path: '/military/drones' },
        { id: 'military-personnel', label: 'Personnel', path: '/military/personnel' }
      ]
    },
  ];

  return <SidebarCategoryLinks title="CRIME & JUSTICE" links={crimeJusticeLinks} />;
};
