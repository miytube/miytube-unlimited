
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
        { id: 'speeches-informative', label: 'Informative — Educate', path: '/speeches/informative' },
        { id: 'speeches-motivational', label: 'Motivational — Inspire', path: '/speeches/motivational' },
        { id: 'speeches-entertaining', label: 'Entertaining — Amuse', path: '/speeches/entertaining' },
        { id: 'speeches-persuasive', label: 'Persuasive — Convince', path: '/speeches/persuasive' },
        { id: 'speeches-commencement', label: 'Commencement — Celebratory', path: '/speeches/commencement' },
        { id: 'speeches-eulogy', label: 'Eulogy or Funeral — Honor', path: '/speeches/eulogy' },
        { id: 'speeches-demonstrative', label: 'Demonstrative — Teach', path: '/speeches/demonstrative' },
        { id: 'speeches-debate', label: 'Debate — About a Subject', path: '/speeches/debate' },
        { id: 'speeches-pitch', label: 'Pitch — Support an Idea', path: '/speeches/pitch' },
        { id: 'speeches-farewell', label: 'Farewell — Goodbyes', path: '/speeches/farewell' },
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
