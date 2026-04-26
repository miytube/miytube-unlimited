import React from 'react';
import { Layout } from '@/components/Layout';
import { Globe, Upload, Newspaper, Landmark, MapPin, Radio, Mic } from 'lucide-react';
import { Link } from 'react-router-dom';

const NewsAndPolitics = () => {
  const subcategories = [
    { name: 'Breaking News', icon: Newspaper, route: '/news/breaking', description: 'Real-time updates on developing stories' },
    { name: 'Politics', icon: Landmark, route: '/news/politics', description: 'Government, elections and policy' },
    { name: 'World News', icon: Globe, route: '/news/world', description: 'International news and global affairs' },
    { name: 'Local News', icon: MapPin, route: '/news/local', description: 'Community and regional reporting' },
    { name: 'News Shows', icon: Radio, route: '/news/shows', description: '60 Minutes-style news programs' },
    { name: 'News Podcasts', icon: Mic, route: '/news/podcasts', description: 'Audio news and political commentary' },
  ];

  return (
    <Layout>
      <div className="py-6 animate-fade-in w-full max-w-[1400px] mx-auto px-4">
        <p className="text-sm text-muted-foreground mb-2">
          <span className="font-semibold text-primary">MiyTube</span> / News &amp; Politics
        </p>

        <div className="flex items-center justify-between gap-3 mb-8">
          <div className="flex items-center gap-3">
            <Globe className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">News &amp; Politics</h1>
            <p className="text-muted-foreground ml-2">
              Stay informed with news and political content
            </p>
          </div>
          <Link
            to="/upload"
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-colors"
          >
            <Upload size={18} />
            <span>Upload News</span>
          </Link>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-6">Subcategories</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {subcategories.map((sub) => {
              const Icon = sub.icon;
              return (
                <Link
                  key={sub.route}
                  to={sub.route}
                  className="group bg-card hover:bg-accent border border-border rounded-lg p-6 transition-colors"
                >
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-1">{sub.name}</h3>
                      <p className="text-sm text-muted-foreground">{sub.description}</p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        <div className="bg-card p-6 rounded-lg shadow-sm mb-8">
          <h2 className="text-xl font-semibold mb-4">About News &amp; Politics</h2>
          <p className="text-muted-foreground">
            Explore breaking news, political analysis, world affairs and local stories. Choose a
            subcategory above to dive into the topics that matter most to you.
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default NewsAndPolitics;
