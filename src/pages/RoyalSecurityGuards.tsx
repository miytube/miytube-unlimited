
import { Link } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { Crown, Sword } from 'lucide-react';

const RoyalSecurityGuards = () => {
  const subcategories = [
    { name: 'British', path: '/royal-security-guards/british', icon: Crown, description: 'British Royal Guard traditions' },
    { name: 'Elite Military', path: '/royal-security-guards/elite-military', icon: Sword, description: 'Elite military security forces' }
  ];

  return (
    <Layout>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground">MiyTube / Royal Security Guards</h1>
          <p className="text-muted-foreground mt-2">Royal guards, ceremonial forces, and elite military security</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
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

export default RoyalSecurityGuards;
