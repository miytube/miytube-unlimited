import { Link } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { Trophy, Heart, Film } from 'lucide-react';

const RealityTV = () => {
  const subcategories = [
    { name: 'Competition Shows', path: '/reality-tv/competition', icon: Trophy, description: 'Reality competition and elimination shows' },
    { name: 'Dating Shows', path: '/reality-tv/dating', icon: Heart, description: 'Romance and dating reality programs' },
    { name: 'Documentary Series', path: '/reality-tv/documentary', icon: Film, description: 'Documentary-style reality programming' },
  ];

  return (
    <Layout>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground">Reality TV</h1>
          <p className="text-muted-foreground mt-2">MiyTube / Reality TV</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {subcategories.map((subcategory) => (
            <Link
              key={subcategory.path}
              to={subcategory.path}
              className="group p-6 bg-card border border-border rounded-lg hover:border-primary transition-colors"
            >
              <div className="flex items-center gap-3 mb-3">
                <subcategory.icon className="h-6 w-6 text-primary" />
                <h2 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
                  {subcategory.name}
                </h2>
              </div>
              <p className="text-muted-foreground">{subcategory.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default RealityTV;
