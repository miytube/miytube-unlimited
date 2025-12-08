
import React from 'react';
import { Layout } from '@/components/Layout';
import { Film, User, Newspaper, Mic } from 'lucide-react';
import { Link } from 'react-router-dom';

const Hollywood = () => {
  const subcategories = [
    {
      title: 'Actors & Actress: Bios & History',
      description: 'Explore biographies, names, and history of Hollywood stars',
      icon: User,
      path: '/hollywood/bios'
    },
    {
      title: 'Actors & Actress: News & Gossip',
      description: 'Latest news, information, and gossip from Hollywood',
      icon: Newspaper,
      path: '/hollywood/news'
    },
    {
      title: 'Actors & Actress: Interviews & Work',
      description: 'Interviews and behind-the-scenes work of Hollywood talent',
      icon: Mic,
      path: '/hollywood/interviews'
    }
  ];

  return (
    <Layout>
      <div className="py-6 animate-fade-in w-full max-w-[1400px] mx-auto px-4">
        <div className="flex items-center gap-3 mb-6">
          <Film className="h-8 w-8 text-primary" />
          <div>
            <p className="text-sm text-muted-foreground">MiyTube / Hollywood</p>
            <h1 className="text-3xl font-bold">Hollywood</h1>
          </div>
        </div>
        
        <p className="text-muted-foreground mb-8">
          Explore the world of Hollywood actors and actresses
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {subcategories.map((sub) => (
            <Link
              key={sub.path}
              to={sub.path}
              className="bg-card border rounded-lg p-6 hover:border-primary transition-colors"
            >
              <sub.icon className="h-10 w-10 text-primary mb-4" />
              <h3 className="text-lg font-semibold mb-2">{sub.title}</h3>
              <p className="text-sm text-muted-foreground">{sub.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Hollywood;
