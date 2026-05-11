
import React, { useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { useCustomCategories } from '@/hooks/useCustomCategories';
import { getSidebarMainCategoryRoute } from '@/data/sidebarMainCategories';

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
          data-sidebar-collapsible-trigger
          data-sidebar-collapsible-state={isExpanded ? 'open' : 'closed'}
          className={`flex items-center gap-3 px-3 py-2 rounded-md hover:bg-secondary transition-colors cursor-pointer ${
            isActive || isChildActive ? 'bg-secondary font-medium' : ''
          }`}
        >
          <Icon size={20} />
          <span className="flex-1">{item.label}</span>
          <ChevronDown 
            size={16} 
            className={`text-muted-foreground transition-transform duration-200 ${
              isExpanded ? 'rotate-0' : '-rotate-90'
            }`} 
          />
        </div>
        
        <div 
          className={`overflow-hidden transition-all duration-300 ease-out ${
            isExpanded ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="pl-8 space-y-0.5 mt-1">
            <Link
              to={item.path}
              className={`block px-3 py-1.5 text-sm rounded-md hover:bg-secondary/60 transition-all duration-200 ${
                location.pathname === item.path ? 'text-primary font-medium' : 'text-muted-foreground'
              } ${isExpanded ? 'animate-slide-in-item' : ''}`}
              style={{ animationDelay: '0ms' }}
            >
              All {item.label}
            </Link>
            {item.subItems!.map((subItem, index) => {
              const isSubActive = location.pathname === subItem.path || location.pathname.startsWith(`${subItem.path}/`);
              
              return (
                <Link
                  key={subItem.id}
                  to={subItem.path}
                  className={`block px-3 py-1.5 text-sm rounded-md hover:bg-secondary/60 transition-all duration-200 ${
                    isSubActive ? 'text-primary font-medium' : 'text-muted-foreground'
                  } ${isExpanded ? 'animate-slide-in-item' : ''}`}
                  style={{ animationDelay: `${(index + 1) * 30}ms` }}
                >
                  {subItem.label}
                </Link>
              );
            })}
          </div>
        </div>
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

const sortByLabel = <T extends { label: string }>(arr: T[]): T[] =>
  [...arr].sort((a, b) => a.label.localeCompare(b.label, undefined, { sensitivity: 'base' }));

const normalizePath = (path: string) => path.replace(/\/+$/, '').toLowerCase();

const isRedundantWatchPage = (
  sub: { name: string; slug: string },
  watch: { name: string; slug: string }
) =>
  sub.slug.toLowerCase() === watch.slug.toLowerCase() ||
  sub.name.trim().toLowerCase() === watch.name.trim().toLowerCase();

export const SidebarCategoryLinks: React.FC<SidebarCategoryProps> = ({ title, links }) => {
  const location = useLocation();
  const { tree } = useCustomCategories();
  const storageKey = `sidebar-category-${title.toLowerCase().replace(/\s+/g, '-')}`;

  // Inject custom sub-categories / watch pages created from the admin into
  // the matching hardcoded sidebar link (matched by link slug == custom category slug).
  const enrichedLinks = useMemo(() => {
    return links.map((link) => {
      const linkPath = link.path || '';
      const segments = linkPath.replace(/^\//, '').split('/').filter(Boolean);
      const lastSegment = segments[segments.length - 1] || '';
      const cat = tree.find((c) => {
        const mappedRoute = getSidebarMainCategoryRoute(c.slug);
        if (mappedRoute && mappedRoute === linkPath) return true;
        // Only match by slug for top-level single-segment paths to avoid
        // injecting a top-level custom category into a nested hardcoded link.
        if (segments.length === 1 && c.slug === lastSegment) return true;
        return false;
      });
      if (!cat) return link;
      const extras: Array<{ id: string; label: string; path: string }> = [];
      const seenPaths = new Set((link.subItems || []).map((item) => normalizePath(item.path)));
      const addExtra = (item: { id: string; label: string; path: string }) => {
        const pathKey = normalizePath(item.path);
        if (seenPaths.has(pathKey)) return;
        seenPaths.add(pathKey);
        extras.push(item);
      };
      const sidebarRoute = getSidebarMainCategoryRoute(cat.slug);
      cat.subcategories.forEach((sub) => {
        const subPath = sidebarRoute ? `${sidebarRoute}/${sub.slug}` : `/c/${cat.slug}/${sub.slug}`;
        // Only add the sub-category row if it isn't already represented
        addExtra({ id: `cc-${sub.id}`, label: sub.name, path: subPath });
        sub.watch_pages.forEach((w) => {
          if (isRedundantWatchPage(sub, w)) return;
          addExtra({
            id: `cc-w-${w.id}`,
            label: `${sub.name} • ${w.name}`,
            path: `${subPath}/${w.slug}`,
          });
        });
      });
      if (extras.length === 0) return link;
      return { ...link, subItems: [...(link.subItems || []), ...extras] };
    });
  }, [links, tree]);

  const sortedLinks = sortByLabel(enrichedLinks).map(link => ({
    ...link,
    subItems: link.subItems ? sortByLabel(link.subItems) : link.subItems,
  }));
  const [isOpen, setIsOpen] = useState(() => {
    const saved = localStorage.getItem(storageKey);
    return saved !== null ? saved === 'true' : true;
  });
  
  const handleToggle = () => {
    const newState = !isOpen;
    setIsOpen(newState);
    localStorage.setItem(storageKey, String(newState));
  };
  
  return (
    <div className="border-t pt-4 mt-4">
      <button
        onClick={handleToggle}
        className="flex items-center justify-between w-full px-3 py-1 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
      >
        <span>{title}</span>
        <ChevronDown 
          size={14} 
          className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
        />
      </button>
      <div 
        className={`overflow-hidden transition-all duration-300 ease-out ${
          isOpen ? 'max-h-[2000px] opacity-100 mt-2' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="space-y-1">
          {sortedLinks.map(link => (
            <CollapsibleNavLink key={link.id} item={link} location={location} />
          ))}
        </div>
      </div>
    </div>
  );
};
