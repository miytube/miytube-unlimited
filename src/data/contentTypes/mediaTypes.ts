
import { Image, FileText } from 'lucide-react';
import { ContentType } from '@/types/upload';

export const mediaContentTypes: Record<string, ContentType> = {
  image: {
    id: "image",
    name: "Image",
    icon: Image,
    description: "Upload your photos, illustrations, graphics, and visual content.",
    acceptedTypes: "image/*",
    supportedFormats: ['JPG', 'PNG', 'GIF', 'SVG', 'WebP'],
    maxSize: "50MB",
    categories: [
      { id: 'photography', name: 'Photography', subcategories: [
        { id: 'portrait', name: 'Portrait' },
        { id: 'landscape', name: 'Landscape' },
        { id: 'street', name: 'Street' },
      ]},
      { id: 'graphic', name: 'Graphic Design', subcategories: [
        { id: 'illustration', name: 'Illustration' },
        { id: 'typography', name: 'Typography' },
      ]},
    ],
    destination: "Images Gallery"
  },
  document: {
    id: "document",
    name: "Document",
    icon: FileText,
    description: "Upload your documents, articles, presentations, and written content.",
    acceptedTypes: ".pdf,.doc,.docx,.txt,.ppt,.pptx,.odt",
    supportedFormats: ['PDF', 'DOC', 'DOCX', 'TXT', 'PPT', 'PPTX'],
    maxSize: "500MB",
    categories: [
      { id: 'academic', name: 'Academic', subcategories: [
        { id: 'research', name: 'Research Paper' },
        { id: 'thesis', name: 'Thesis' },
      ]},
      { id: 'business', name: 'Business', subcategories: [
        { id: 'presentation', name: 'Presentation' },
        { id: 'report', name: 'Report' },
      ]},
    ],
    destination: "Documents Library"
  },
};
