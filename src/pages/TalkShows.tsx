
import React from 'react';
import { Layout } from '@/components/Layout';
import { Tv, Sun, Moon, Mic } from 'lucide-react';
import { Link } from 'react-router-dom';

const subcategories = [
  { name: 'Morning Shows', path: '/talk-shows/morning', icon: Sun, description: 'Morning talk shows and breakfast television programs' },
  { name: 'Evening Talk Shows', path: '/talk-shows/evening', icon: Moon, description: 'Evening and primetime talk show programs' },
  { name: 'Interview Programs', path: '/talk-shows/interviews', icon: Mic, description: 'In-depth interview shows and celebrity conversations' },
];

const TalkShows = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Tv className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold text-foreground">MiyTube / Talk Shows</h1>
          </div>
          <p className="text-muted-foreground">Explore talk show programs including morning shows, evening talk shows, and interview programs</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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

export default TalkShows;
