
import { LucideIcon } from 'lucide-react';

export interface SubcategoryInfo {
  title: string;
  description: string;
  icon: LucideIcon;
  parent: {
    route: string;
    name: string;
  };
}

export interface SubcategoryMapping {
  [key: string]: SubcategoryInfo;
}
