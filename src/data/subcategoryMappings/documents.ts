
import { FileText } from 'lucide-react';
import { SubcategoryMapping } from './types';

export const documentsSubcategories: SubcategoryMapping = {
  // Documents & Media Routes
  'documents-word': {
    title: 'Word Processing',
    description: 'Microsoft Word tutorials, templates and tips',
    icon: FileText,
    parent: { route: '/documents', name: 'Documents' }
  },
  'documents-excel': {
    title: 'Excel Spreadsheets',
    description: 'Microsoft Excel tutorials, formulas and data analysis',
    icon: FileText,
    parent: { route: '/documents', name: 'Documents' }
  },
  'documents-writing': {
    title: 'Writing & Composition',
    description: 'Writing techniques, styles and document creation',
    icon: FileText,
    parent: { route: '/documents', name: 'Documents' }
  },
};
