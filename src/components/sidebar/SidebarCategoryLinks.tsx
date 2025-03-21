
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

interface SidebarLink {
  id: string;
  icon: React.ElementType;
  label: string;
  path: string;
  subItems?: Array<{id: string, label: string, path: string}>;
}

interface SidebarCategoryProps {
  title: string;
  links: SidebarLink[];
}

export const renderNavLink = (item: SidebarLink, location: { pathname: string }) => {
  const isActive = location.pathname === item.path || location.pathname.startsWith(`${item.path}/`);
  const Icon = item.icon;
  
  if (item.subItems && item.subItems.length > 0) {
    const isParentOrChildActive = isActive || item.subItems.some(subItem => 
      location.pathname === subItem.path || location.pathname.startsWith(`${subItem.path}/`)
    );
    
    return (
      <div key={item.id} className="mb-1">
        <Link 
          to={item.path} 
          className={`flex items-center gap-3 px-3 py-2 rounded-md hover:bg-secondary transition-colors ${
            isParentOrChildActive ? 'bg-secondary font-medium' : ''
          }`}
        >
          <Icon size={20} />
          <span>{item.label}</span>
        </Link>
        
        {isParentOrChildActive && (
          <div className="pl-8 space-y-1 mt-1">
            {item.subItems.map(subItem => {
              const isSubActive = location.pathname === subItem.path || location.pathname.startsWith(`${subItem.path}/`);
              
              return (
                <Link
                  key={subItem.id}
                  to={subItem.path}
                  className={`block px-3 py-1 text-sm rounded-md hover:bg-secondary/60 transition-colors ${
                    isSubActive ? 'text-primary font-medium' : 'text-muted-foreground'
                  }`}
                >
                  {subItem.label}
                </Link>
              );
            })}
          </div>
        )}
      </div>
    );
  }
  
  return (
    <Link 
      key={item.id} 
      to={item.path} 
      className={`flex items-center gap-3 px-3 py-2 rounded-md hover:bg-secondary transition-colors ${
        isActive ? 'bg-secondary font-medium' : ''
      }`}
    >
      <Icon size={20} />
      <span>{item.label}</span>
    </Link>
  );
};

export const SidebarCategoryLinks: React.FC<SidebarCategoryProps> = ({ title, links }) => {
  const location = useLocation();
  
  return (
    <div className="border-t pt-4 mt-4">
      <h3 className="text-xs font-semibold text-muted-foreground mb-2 px-3">{title}</h3>
      <div className="space-y-1">
        {links.map(link => renderNavLink(link, location))}
      </div>
    </div>
  );
};
