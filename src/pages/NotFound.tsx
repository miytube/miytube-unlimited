
import React from 'react';
import { Layout } from '@/components/Layout';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <Layout>
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center animate-fade-in">
        <div className="text-7xl font-bold text-primary mb-4">404</div>
        <h1 className="text-3xl font-bold mb-4">Page Not Found</h1>
        <p className="text-muted-foreground mb-8 max-w-md">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link
          to="/"
          className="px-6 py-2 bg-primary text-white rounded-full hover:bg-primary/90 transition-colors"
        >
          Back to Home
        </Link>
      </div>
    </Layout>
  );
};

export default NotFound;
