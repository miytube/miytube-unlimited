
import React from 'react';
import { Link } from 'react-router-dom';
import { ImagePlus } from 'lucide-react';

export const LogoPlaceholder = () => {
  const handleLogoClick = () => {
    // You can add file upload logic here in the future
    console.log('Logo placeholder clicked');
  };

  return (
    <div className="w-full bg-muted py-4">
      <div className="container mx-auto px-4 flex justify-center items-center">
        <Link 
          to="/" 
          className="flex items-center gap-2 hover:opacity-80 transition-opacity"
        >
          <button
            onClick={handleLogoClick}
            className="w-12 h-12 bg-card border-2 border-dashed border-muted-foreground/30 rounded-lg flex items-center justify-center hover:bg-muted cursor-pointer"
            type="button"
          >
            <ImagePlus className="w-6 h-6 text-muted-foreground" />
          </button>
          <div className="flex items-baseline">
            <span className="text-primary font-bold text-2xl">Miy</span>
            <span className="font-bold text-2xl">Tube</span>
          </div>
        </Link>
      </div>
    </div>
  );
};
