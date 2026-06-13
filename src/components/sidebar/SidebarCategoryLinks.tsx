
import React, { useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { useCustomCategories } from '@/hooks/useCustomCategories';
import { getSidebarMainCategoryRoute } from '@/data/sidebarMainCategories';

interface SidebarSubItem {
  id: string;
  label: string;
  path: string;
  subItems?: Array<{ id: string; label: string; path: string }>;
}

interface SidebarLink {
  id: string;
  icon: React.ElementType;
  label: string;
  path: string;
  subItems?: SidebarSubItem[];
}

interface SidebarCategoryProps {
  title: string;
  links: SidebarLink[];
}

interface CollapsibleNavLinkProps {
  item: SidebarLink;
  location: { pathname: string };
}

const NestedSubItem: React.FC<{
  subItem: SidebarSubItem;
  location: { pathname: string };
  index: number;
  isExpanded: boolean;
}> = ({ subItem, location, index, isExpanded: parentExpanded }) => {
  const isSelfActive = location.pathname === subItem.path;
  const isChildActive = subItem.subItems?.some(
    (c) => location.pathname === c.path || location.pathname.startsWith(`${c.path}/`)
  );
  const [open, setOpen] = useState(isSelfActive || isChildActive);
  return (
    <div>
      <div
        className={`flex items-center gap-1 px-3 py-1.5 text-sm rounded-md hover:bg-secondary/60 transition-all duration-200 ${
          isSelfActive || isChildActive ? 'text-primary font-medium' : 'text-muted-foreground'
        } ${parentExpanded ? 'animate-slide-in-item' : ''}`}
        style={{ animationDelay: `${(index + 1) * 30}ms` }}
      >
        <button
          type="button"
          onClick={(e) => { e.preventDefault(); setOpen(!open); }}
          className="p-0.5 hover:text-foreground"
          aria-label={open ? 'Collapse' : 'Expand'}
        >
          <ChevronRight size={12} className={`transition-transform ${open ? 'rotate-90' : ''}`} />
        </button>
        <Link to={subItem.path} className="flex-1">{subItem.label}</Link>
      </div>
      {open && (
        <div className="pl-6 space-y-0.5 mt-0.5">
          {subItem.subItems!.map((c) => {
            const cActive = location.pathname === c.path || location.pathname.startsWith(`${c.path}/`);
            return (
              <Link
                key={c.id}
                to={c.path}
                className={`block px-3 py-1 text-sm rounded-md hover:bg-secondary/60 ${
                  cActive ? 'text-primary font-medium' : 'text-muted-foreground'
                }`}
              >
                {c.label}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};


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
          data-sidebar-collapsible-trigger
          data-sidebar-collapsible-state={isExpanded ? 'open' : 'closed'}
          className={`flex items-center gap-3 px-3 py-2 rounded-md hover:bg-secondary transition-colors cursor-pointer ${
            isActive || isChildActive ? 'bg-secondary font-medium' : ''
          }`}
        >
          <Link to={item.path} className="flex flex-1 items-center gap-3 min-w-0">
            <Icon size={20} />
            <span className="truncate">{item.label}</span>
          </Link>
          <button
            type="button"
            onClick={handleToggle}
            className="p-1 text-muted-foreground hover:text-foreground"
            aria-label={isExpanded ? 'Collapse' : 'Expand'}
          >
            <ChevronDown 
              size={16} 
              className={`transition-transform duration-200 ${
                isExpanded ? 'rotate-0' : '-rotate-90'
              }`} 
            />
          </button>
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
              {item.label}
            </Link>
            {item.subItems!.map((subItem, index) => {
              const isSubActive = location.pathname === subItem.path || location.pathname.startsWith(`${subItem.path}/`);
              const hasNested = subItem.subItems && subItem.subItems.length > 0;

              if (hasNested) {
                return (
                  <NestedSubItem
                    key={subItem.id}
                    subItem={subItem}
                    location={location}
                    index={index}
                    isExpanded={isExpanded}
                  />
                );
              }

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
  const normalizeForMatch = (value: string) =>
    value
      .toLowerCase()
      .replace(/&/g, 'and')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  const enrichedLinks = useMemo(() => {
    return links.map((link) => {
      const linkPath = link.path || '';
      const segments = linkPath.replace(/^\//, '').split('/').filter(Boolean);
      const lastSegment = segments[segments.length - 1] || '';
      const linkLabelKey = normalizeForMatch(link.label || '');
      const lastSegmentKey = normalizeForMatch(lastSegment);
      const cat = tree.find((c) => {
        const mappedRoute = getSidebarMainCategoryRoute(c.slug);
        if (mappedRoute && mappedRoute === linkPath) return true;
        const catSlugKey = normalizeForMatch(c.slug);
        const catNameKey = normalizeForMatch(c.name);
        // Match top-level or nested links whose label/last segment matches
        // the custom category's slug or normalized name. This lets admins
        // create a category like "Soccer & Football" (slug soccer-and-football)
        // and have it auto-attach to the hardcoded "Soccer & Football" link.
        if (catSlugKey === lastSegmentKey) return true;
        if (catNameKey && catNameKey === linkLabelKey) return true;
        if (catSlugKey === linkLabelKey) return true;
        return false;
      });
      if (!cat) return link;
      const extras: Array<{ id: string; label: string; path: string }> = [];
      const existingItems = (link.subItems || []).flatMap((item) => [item, ...(item.subItems || [])]);
      const seenPaths = new Set(existingItems.map((item) => normalizePath(item.path)));
      const normalizeLabel = (label: string) => label.trim().toLowerCase().replace(/\s+/g, ' ');
      const seenLabels = new Set(existingItems.map((item) => normalizeLabel(item.label)));
      const addExtra = (item: { id: string; label: string; path: string }) => {
        const pathKey = normalizePath(item.path);
        const labelKey = normalizeLabel(item.label);
        if (seenPaths.has(pathKey) || seenLabels.has(labelKey)) return;
        seenPaths.add(pathKey);
        seenLabels.add(labelKey);
        extras.push(item);
      };
      cat.subcategories.forEach((sub) => {
        // Always link via /c/ so CustomCategoryPage handles it. Hardcoded
        // routes like /music/:category and /sports/:category are claimed by
        // built-in landing pages first and would silently render the wrong
        // screen ("recycling" back to a generic page).
        const subPath = `/c/${cat.slug}/${sub.slug}`;
        const isHiddenSub = sub.slug === 'main';
        if (!isHiddenSub) {
          addExtra({ id: `cc-${sub.id}`, label: sub.name, path: subPath });
        }
        sub.watch_pages.forEach((w) => {
          if (isRedundantWatchPage(sub, w)) return;
          if (seenLabels.has(normalizeLabel(w.name))) return;
          addExtra({
            id: `cc-w-${w.id}`,
            label: isHiddenSub ? w.name : `${sub.name} • ${w.name}`,
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
