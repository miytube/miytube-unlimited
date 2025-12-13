
import { Link } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { TreePine, History, Dna, Heart, Users, Search } from 'lucide-react';

const Family = () => {
  const subcategories = [
    { name: 'Roots', path: '/family/roots', icon: TreePine, description: 'Ancestry and genealogy' },
    { name: 'History', path: '/family/history', icon: History, description: 'Family heritage and stories' },
    { name: 'DNA', path: '/family/dna', icon: Dna, description: 'Genetic ancestry discoveries' },
    { name: 'Traditions', path: '/family/traditions', icon: Heart, description: 'Cultural customs and celebrations' },
    { name: 'Reunions', path: '/family/reunions', icon: Users, description: 'Family gatherings and events' },
    { name: 'Genealogy Tools', path: '/family/genealogy-tools', icon: Search, description: 'Research resources and tools' }
  ];

  return (
    <Layout>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground">MiyTube / Family</h1>
          <p className="text-muted-foreground mt-2">Explore family heritage, ancestry, and genetic discoveries</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {subcategories.map((sub) => (
            <Link
              key={sub.path}
              to={sub.path}
              className="p-4 rounded-lg border border-border bg-card hover:bg-accent transition-colors"
            >
              <div className="flex items-center gap-3">
                <sub.icon className="h-6 w-6 text-primary" />
                <div>
                  <h3 className="font-semibold text-foreground">{sub.name}</h3>
                  <p className="text-sm text-muted-foreground">{sub.description}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Family;
