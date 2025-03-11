
import { LucideIcon } from 'lucide-react';

export interface ContentType {
  id: string;
  name: string;
  icon: React.ElementType;
  description: string;
  acceptedTypes: string;
  supportedFormats: string[];
  maxSize: string;
  categories: Array<{
    id: string;
    name: string;
    subcategories: Array<{ id: string; name: string }>
  }>;
  destination: string;
}
