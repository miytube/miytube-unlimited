
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
  ];

  return <SidebarCategoryLinks title="CRIME & JUSTICE" links={crimeJusticeLinks} />;
};
