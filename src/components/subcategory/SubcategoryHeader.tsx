
import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Upload, LucideIcon } from 'lucide-react';

interface SubcategoryHeaderProps {
  parentRoute: string;
  parentName: string;
  pageTitle: string;
  pageDescription: string;
  IconComponent: LucideIcon;
}

const SubcategoryHeader: React.FC<SubcategoryHeaderProps> = ({
  parentRoute,
  parentName,
  pageTitle,
  pageDescription,
  IconComponent,
}) => {
  return (
    <>
      {/* MiyTube Breadcrumb */}
      <div className="flex items-center gap-2 mb-4 text-sm text-muted-foreground">
        <span className="font-semibold text-primary">MiyTube</span>
        <ChevronRight size={14} />
        <Link to={parentRoute} className="hover:text-primary">
          {parentName}
        </Link>
        <ChevronRight size={14} />
        <span className="text-foreground">{pageTitle}</span>
      </div>
      
      <div className="flex items-center justify-between gap-3 mb-8">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-3">
            <IconComponent className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">{pageTitle}</h1>
          </div>
          <p className="text-muted-foreground">
            {pageDescription}
          </p>
        </div>
        <Link 
          to="/upload" 
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-full hover:bg-primary/90 transition-colors"
        >
          <Upload size={18} />
          <span>Upload Content</span>
        </Link>
      </div>
    </>
  );
};

export default SubcategoryHeader;
