
import React from 'react';
import { Link } from 'react-router-dom';
import miyTubeLogo from '@/assets/miytube-logo.png';
import { useSite } from '@/hooks/useSite';

export const Logo: React.FC = () => {
  const site = useSite();

  if (site.id === 'miytube') {
    return (
      <Link to="/" className="flex items-center gap-1">
        <img src={miyTubeLogo} alt="MiyTube Video Platform" className="h-8 object-contain" />
      </Link>
    );
  }

  return (
    <Link to="/" className="flex items-baseline gap-0.5" aria-label={site.name}>
      <span className="text-primary font-bold text-lg sm:text-xl">{site.wordmark[0]}</span>
      <span className="font-bold text-lg sm:text-xl">{site.wordmark[1]}</span>
    </Link>
  );
};
