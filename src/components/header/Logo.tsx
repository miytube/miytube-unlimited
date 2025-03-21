
import React from 'react';
import { Link } from 'react-router-dom';

export const Logo: React.FC = () => {
  return (
    <Link to="/" className="flex items-center gap-1">
      <span className="text-primary font-bold text-2xl">Miy</span>
      <span className="font-bold text-2xl">Tube</span>
    </Link>
  );
};
