
import React from 'react';
import { Layout } from '@/components/Layout';
import { Link, useLocation } from 'react-router-dom';
import { Home, Search, Film, AlertCircle, GraduationCap, Clapperboard, Gavel, Microscope, Mountain, Utensils, Laugh, Music } from 'lucide-react';

const NotFound = () => {
  const location = useLocation();
  
  return (
    <Layout>
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center animate-fade-in w-full">
        <div className="flex items-center justify-center mb-6">
          <AlertCircle size={48} className="text-primary mr-2" />
          <div className="text-7xl font-bold text-primary">404</div>
        </div>
        
        <h1 className="text-3xl font-bold mb-4">Page Not Found</h1>
        <p className="text-muted-foreground mb-4 max-w-md">
          The page <span className="font-medium text-foreground">{location.pathname}</span> doesn't exist or has been moved.
        </p>
        
        <div className="flex flex-wrap gap-4 justify-center mb-8">
          <Link
            to="/"
            className="px-6 py-2 bg-primary text-white rounded-full hover:bg-primary/90 transition-colors flex items-center gap-2"
          >
            <Home size={18} />
            <span>Back to Home</span>
          </Link>
          <Link
            to="/search"
            className="px-6 py-2 border border-primary text-primary rounded-full hover:bg-primary/10 transition-colors flex items-center gap-2"
          >
            <Search size={18} />
            <span>Search Content</span>
          </Link>
          <Link
            to="/shorts"
            className="px-6 py-2 border border-primary text-primary rounded-full hover:bg-primary/10 transition-colors flex items-center gap-2"
          >
            <Film size={18} />
            <span>Browse Shorts</span>
          </Link>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 max-w-2xl">
          <Link to="/education" className="p-3 bg-card rounded-lg hover:bg-secondary transition-colors text-center">
            Education
          </Link>
          <Link to="/entertainment" className="p-3 bg-card rounded-lg hover:bg-secondary transition-colors text-center">
            Entertainment
          </Link>
          <Link to="/film" className="p-3 bg-card rounded-lg hover:bg-secondary transition-colors text-center">
            Film
          </Link>
          <Link to="/film-animation" className="p-3 bg-card rounded-lg hover:bg-secondary transition-colors text-center">
            Film & Animation
          </Link>
          <Link to="/film-movies" className="p-3 bg-card rounded-lg hover:bg-secondary transition-colors text-center">
            Film & Movies
          </Link>
          <Link to="/foods" className="p-3 bg-card rounded-lg hover:bg-secondary transition-colors text-center">
            Foods
          </Link>
          <Link to="/music" className="p-3 bg-card rounded-lg hover:bg-secondary transition-colors text-center">
            Music
          </Link>
          <Link to="/courts" className="p-3 bg-card rounded-lg hover:bg-secondary transition-colors text-center">
            Courts
          </Link>
          <Link to="/courts-police" className="p-3 bg-card rounded-lg hover:bg-secondary transition-colors text-center">
            Courts & Police
          </Link>
          <Link to="/funny" className="p-3 bg-card rounded-lg hover:bg-secondary transition-colors text-center">
            Funny
          </Link>
          <Link to="/sports" className="p-3 bg-card rounded-lg hover:bg-secondary transition-colors text-center">
            Sports
          </Link>
          <Link to="/science-tech" className="p-3 bg-card rounded-lg hover:bg-secondary transition-colors text-center">
            Science & Tech
          </Link>
        </div>
      </div>
    </Layout>
  );
};

export default NotFound;
