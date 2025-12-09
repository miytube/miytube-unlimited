
import React from 'react';
import { Layout } from '@/components/Layout';
import { Leaf, Carrot, Flower2, TreePine } from 'lucide-react';
import { Link } from 'react-router-dom';

const subcategories = [
  { name: 'Herbs', path: '/plants/herbs', icon: Leaf, description: 'Medicinal and culinary herbs' },
  { name: 'Vegetables', path: '/plants/vegetables', icon: Carrot, description: 'Vegetable gardens and farming' },
  { name: 'Flowers', path: '/plants/flowers', icon: Flower2, description: 'Beautiful flowers and arrangements' },
  { name: 'Trees', path: '/plants/trees', icon: TreePine, description: 'Forests and woodland ecosystems' },
];

const Plants = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">MiyTube / Plants</h1>
          <p className="text-muted-foreground">Explore plant life including herbs, vegetables, flowers, and trees</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {subcategories.map((sub) => (
            <Link
              key={sub.path}
              to={sub.path}
              className="group p-6 rounded-lg border border-border bg-card hover:bg-accent transition-colors"
            >
              <sub.icon className="w-10 h-10 text-primary mb-4 group-hover:scale-110 transition-transform" />
              <h2 className="text-xl font-semibold text-foreground mb-2">{sub.name}</h2>
              <p className="text-sm text-muted-foreground">{sub.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Plants;
