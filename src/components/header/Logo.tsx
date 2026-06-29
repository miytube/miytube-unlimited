
import React from 'react';
import { Link } from 'react-router-dom';
import miyTubeLogo from '@/assets/miytube-logo.png';

export const Logo: React.FC = () => {
  return (
    <Link to="/" className="flex items-center gap-1">
      <img src={miyTubeLogo} alt="MiyTube Video Platform" className="h-8 object-contain" />
    </Link>
  );
};
