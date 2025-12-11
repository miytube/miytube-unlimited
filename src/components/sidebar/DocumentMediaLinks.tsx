
import React from 'react';
import { FileText, PenTool, Mic } from 'lucide-react';
import { SidebarCategoryLinks } from './SidebarCategoryLinks';

export const DocumentMediaLinks: React.FC = () => {
  const documentAndMediaLinks = [
    { 
      id: 'documents', 
      icon: FileText, 
      label: 'Documents', 
      path: '/documents',
      subItems: [
        { id: 'documents-templates', label: 'Templates', path: '/documents/templates' },
        { id: 'documents-forms', label: 'Forms', path: '/documents/forms' },
        { id: 'documents-guides', label: 'Guides', path: '/documents/guides' },
        { id: 'documents-reports', label: 'Reports', path: '/documents/reports' }
      ]
    },
    { 
      id: 'speeches', 
      icon: Mic, 
      label: 'Speeches', 
      path: '/speeches',
      subItems: [
        { id: 'speeches-commencement', label: 'Commencement Speech', path: '/speeches/commencement' },
        { id: 'speeches-eulogy', label: 'Eulogy & Memorial', path: '/speeches/eulogy' },
        { id: 'speeches-informative', label: 'Informative Speech', path: '/speeches/informative' },
        { id: 'speeches-motivational', label: 'Motivational Speech', path: '/speeches/motivational' },
        { id: 'speeches-persuasive', label: 'Persuasive & Protest', path: '/speeches/persuasive' },
        { id: 'speeches-quotes-poems', label: 'Quotes, Poems, Statements', path: '/speeches/quotes-poems' }
      ]
    },
    { 
      id: 'blog', 
      icon: PenTool, 
      label: 'Blog', 
      path: '/blog',
      subItems: [
        { id: 'blog-latest', label: 'Latest Posts', path: '/blog/latest' },
        { id: 'blog-featured', label: 'Featured Posts', path: '/blog/featured' },
        { id: 'blog-create', label: 'Create Post', path: '/blog/create' }
      ]
    },
  ];

  return <SidebarCategoryLinks title="DOCUMENTS & MEDIA" links={documentAndMediaLinks} />;
};
