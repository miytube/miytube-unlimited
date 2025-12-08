
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronDown, ChevronRight } from 'lucide-react';

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

interface CollapsibleNavLinkProps {
  item: SidebarLink;
  location: { pathname: string };
}

const CollapsibleNavLink: React.FC<CollapsibleNavLinkProps> = ({ item, location }) => {
  const isActive = location.pathname === item.path || location.pathname.startsWith(`${item.path}/`);
  const isChildActive = item.subItems?.some(subItem => 
    location.pathname === subItem.path || location.pathname.startsWith(`${subItem.path}/`)
  );
  
  // Auto-expand if a child is active, otherwise start collapsed
  const [isExpanded, setIsExpanded] = useState(isActive || isChildActive);
  
  const Icon = item.icon;
  const hasSubItems = item.subItems && item.subItems.length > 0;
  
  const handleToggle = (e: React.MouseEvent) => {
    if (hasSubItems) {
      e.preventDefault();
      setIsExpanded(!isExpanded);
    }
  };
  
  if (hasSubItems) {
    return (
      <div className="mb-1">
        <div 
          onClick={handleToggle}
          className={`flex items-center gap-3 px-3 py-2 rounded-md hover:bg-secondary transition-colors cursor-pointer ${
            isActive || isChildActive ? 'bg-secondary font-medium' : ''
          }`}
        >
          <Icon size={20} />
          <span className="flex-1">{item.label}</span>
          {isExpanded ? (
            <ChevronDown size={16} className="text-muted-foreground" />
          ) : (
            <ChevronRight size={16} className="text-muted-foreground" />
          )}
        </div>
        
        {isExpanded && (
          <div className="pl-8 space-y-1 mt-1">
            <Link
              to={item.path}
              className={`block px-3 py-1 text-sm rounded-md hover:bg-secondary/60 transition-colors ${
                location.pathname === item.path ? 'text-primary font-medium' : 'text-muted-foreground'
              }`}
            >
              All {item.label}
            </Link>
            {item.subItems!.map(subItem => {
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
        {links.map(link => (
          <CollapsibleNavLink key={link.id} item={link} location={location} />
        ))}
      </div>
    </div>
  );
};
