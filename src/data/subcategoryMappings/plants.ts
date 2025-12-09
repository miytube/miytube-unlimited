import { SubcategoryMapping } from './types';
import { Leaf, Carrot, Flower2, TreePine } from 'lucide-react';

export const plantsSubcategories: SubcategoryMapping = {
  'plants/herbs': {
    title: 'Herbs',
    description: 'Medicinal and culinary herbs from around the world',
    icon: Leaf,
    parent: {
      route: '/pets-animals',
      name: 'Plants'
    }
  },
  'plants/vegetables': {
    title: 'Vegetables',
    description: 'Vegetable gardens and farming techniques',
    icon: Carrot,
    parent: {
      route: '/pets-animals',
      name: 'Plants'
    }
  },
  'plants/flowers': {
    title: 'Flowers',
    description: 'Beautiful flowers and floral arrangements',
    icon: Flower2,
    parent: {
      route: '/pets-animals',
      name: 'Plants'
    }
  },
  'plants/trees': {
    title: 'Trees',
    description: 'Forests, trees, and woodland ecosystems',
    icon: TreePine,
    parent: {
      route: '/pets-animals',
      name: 'Plants'
    }
  },
};
