
import React from 'react';
import { Gavel } from 'lucide-react';
import { SidebarCategoryLinks } from './SidebarCategoryLinks';

export const LawJusticeLinks: React.FC = () => {
  const lawAndJusticeLinks = [
    { id: 'courts-police', icon: Gavel, label: 'Courts & Police', path: '/courts-police' },
  ];

  return <SidebarCategoryLinks title="LAW & JUSTICE" links={lawAndJusticeLinks} />;
};
