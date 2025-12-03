
import React from 'react';
import { Link } from 'react-router-dom';
import { Music, Mic, BookOpen, Volume2, Moon, Headphones, MessageSquare, GraduationCap, Gamepad2, TreePine, Laugh, Users } from 'lucide-react';

interface MusicCategoriesProps {
  categories: string[];
}

// Map category names to their routes and icons
const categoryConfig: Record<string, { route: string; icon: React.ElementType }> = {
  'Music': { route: '/music', icon: Music },
  'Podcasts': { route: '/podcasts', icon: Mic },
  'Audiobooks': { route: '/audiobooks', icon: BookOpen },
  'Sound Effects': { route: '/sound-effects', icon: Volume2 },
  'Meditation': { route: '/meditation', icon: Moon },
  'ASMR': { route: '/asmr', icon: Headphones },
  'Speech': { route: '/speeches', icon: MessageSquare },
  'Educational': { route: '/education', icon: GraduationCap },
  'Gaming': { route: '/gaming', icon: Gamepad2 },
  'Nature Sounds': { route: '/nature-sounds', icon: TreePine },
  'Comedy': { route: '/comedy', icon: Laugh },
  'Interviews': { route: '/music-artists-interviews', icon: Users },
};

export const MusicCategories: React.FC<MusicCategoriesProps> = ({ categories }) => {
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Popular Categories</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {categories.map((category) => {
          const config = categoryConfig[category] || { route: `/${category.toLowerCase().replace(/\s+/g, '-')}`, icon: Music };
          const IconComponent = config.icon;
          
          return (
            <Link key={category} to={config.route} className="block">
              <div className="aspect-square rounded-lg overflow-hidden relative group bg-card flex items-center justify-center hover:bg-accent transition-colors">
                <div className="text-center">
                  <IconComponent size={32} className="mx-auto mb-2 text-primary" />
                  <div className="font-medium">{category}</div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};
