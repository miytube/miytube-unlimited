
import React from 'react';
import { Baby, Gamepad2, BookOpen, Palette, Music, Film, GraduationCap } from 'lucide-react';
import { SidebarCategoryLinks } from './SidebarCategoryLinks';

export const KidsEducationLinks: React.FC = () => {
  const kidsEducationLinks = [
    { 
      id: 'kids', 
      icon: Baby, 
      label: 'Kids', 
      path: '/kids',
      subItems: [
        { id: 'kids-beauty', label: 'Beauty & Cosmetics', path: '/kids/beauty' },
        { id: 'kids-cartoons', label: 'Cartoons & Comedy', path: '/kids/cartoons' },
        { id: 'kids-education', label: 'Kids Education', path: '/kids/education' },
        { id: 'kids-funny', label: 'Funny & Comedy & Fails', path: '/kids/funny' },
        { id: 'kids-oceanography', label: 'Oceanography & Ocean Science', path: '/kids/oceanography' },
        { id: 'kids-fish', label: 'Kids Animals & Fish', path: '/kids/fish' },
        { id: 'kids-animation', label: 'Animation Film & Superhero', path: '/kids/animation' }
      ]
    },
    { 
      id: 'kids-education-main', 
      icon: GraduationCap, 
      label: 'Kids Education', 
      path: '/kids-education',
      subItems: [
        { id: 'kids-edu-alphabets', label: 'Alphabets & Letters', path: '/kids-education/alphabets' },
        { id: 'kids-edu-animals', label: 'Animals', path: '/kids-education/animals' },
        { id: 'kids-edu-colors', label: 'Colors & Shapes', path: '/kids-education/colors' },
        { id: 'kids-edu-foods', label: 'Foods & Fruits', path: '/kids-education/foods' },
        { id: 'kids-edu-math', label: 'Math & Counting', path: '/kids-education/math' },
        { id: 'kids-edu-reading', label: 'Reading & Language', path: '/kids-education/reading' }
      ]
    },
    { 
      id: 'kids-content', 
      icon: Film, 
      label: 'Kids Content', 
      path: '/kids-content',
      subItems: [
        { id: 'kids-film', label: 'Kids Film (Comedy, Adventure)', path: '/kids-content/film' },
        { id: 'kids-games', label: 'Kids Games', path: '/kids-content/games' },
        { id: 'kids-music', label: 'Kids Music & Nursery Rhymes', path: '/kids-content/music' },
        { id: 'kids-videos', label: 'Kids Videos (Toys, Games)', path: '/kids-content/videos' }
      ]
    },
  ];

  return <SidebarCategoryLinks title="KIDS" links={kidsEducationLinks} />;
};
