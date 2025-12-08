
import React from 'react';
import { Camera, Star, Image, Shirt, Sun, Snowflake } from 'lucide-react';
import { SidebarCategoryLinks } from './SidebarCategoryLinks';

export const ModelsPhotosLinks: React.FC = () => {
  const modelsPhotosLinks = [
    { 
      id: 'models', 
      icon: Star, 
      label: 'Models', 
      path: '/models',
      subItems: [
        { id: 'models-fashion', label: 'Fashion Models', path: '/models/fashion' },
        { id: 'models-female-male', label: 'Female & Male Models', path: '/models/female-male' },
        { id: 'models-fit', label: 'Fit Models', path: '/models/fit' },
        { id: 'models-mature', label: 'Mature Models', path: '/models/mature' },
        { id: 'models-plus-size', label: 'Plus Size & Curvy', path: '/models/plus-size' },
        { id: 'models-swimsuit', label: 'Swimsuit & Lingerie', path: '/models/swimsuit' }
      ]
    },
    { 
      id: 'models-seasonal', 
      icon: Shirt, 
      label: 'Seasonal Modeling', 
      path: '/models/seasonal',
      subItems: [
        { id: 'models-fall', label: 'Fall Clothes', path: '/models/fall' },
        { id: 'models-summer', label: 'Summer Clothes', path: '/models/summer' },
        { id: 'models-winter', label: 'Winter Clothes', path: '/models/winter' },
        { id: 'models-fashion-fails', label: 'Fashion Fails', path: '/models/fashion-fails' }
      ]
    },
    { 
      id: 'pictures', 
      icon: Image, 
      label: 'Pictures & Photos', 
      path: '/pictures',
      subItems: [
        { id: 'pictures-photography', label: 'Photography', path: '/pictures/photography' },
        { id: 'pictures-portraits', label: 'Portraits', path: '/pictures/portraits' }
      ]
    },
  ];

  return <SidebarCategoryLinks title="MODELS & PHOTOS" links={modelsPhotosLinks} />;
};
