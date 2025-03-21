
import React from 'react';
import { Newspaper } from 'lucide-react';
import { SidebarCategoryLinks } from './SidebarCategoryLinks';

export const DocumentMediaLinks: React.FC = () => {
  const documentAndMediaLinks = [
    { id: 'documents', icon: Newspaper, label: 'Documents', path: '/documents' },
    { id: 'blog', icon: Newspaper, label: 'Blog', path: '/blog' },
  ];

  return <SidebarCategoryLinks title="DOCUMENTS & MEDIA" links={documentAndMediaLinks} />;
};
