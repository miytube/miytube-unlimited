import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { ChevronDown, Folder } from 'lucide-react';
import { useCustomCategories } from '@/hooks/useCustomCategories';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Button } from '@/components/ui/button';

export const CustomCategoriesLinks: React.FC = () => {
  const { tree, loading } = useCustomCategories();
  const [openId, setOpenId] = useState<string | null>(null);
  const [openSubId, setOpenSubId] = useState<string | null>(null);

  if (loading || tree.length === 0) return null;

  return (
    <div className="space-y-1">
      {tree.map((cat) => (
        <Collapsible
          key={cat.id}
          open={openId === cat.id}
          onOpenChange={(o) => setOpenId(o ? cat.id : null)}
        >
          <div className="flex items-center">
            <NavLink
              to={`/c/${cat.slug}`}
              className={({ isActive }) =>
                `flex-1 flex items-center gap-2 px-2 py-1.5 rounded-md text-sm hover:bg-muted ${
                  isActive ? 'bg-muted font-medium' : ''
                }`
              }
            >
              <Folder className="h-4 w-4" />
              <span className="truncate">{cat.name}</span>
            </NavLink>
            {cat.subcategories.length > 0 && (
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="icon" className="h-7 w-7">
                  <ChevronDown
                    className={`h-3 w-3 transition-transform ${
                      openId === cat.id ? 'rotate-180' : ''
                    }`}
                  />
                </Button>
              </CollapsibleTrigger>
            )}
          </div>
          <CollapsibleContent className="pl-5 space-y-1">
            {cat.subcategories.map((sub) => (
              <Collapsible
                key={sub.id}
                open={openSubId === sub.id}
                onOpenChange={(o) => setOpenSubId(o ? sub.id : null)}
              >
                <div className="flex items-center">
                  <NavLink
                    to={`/c/${cat.slug}/${sub.slug}`}
                    className={({ isActive }) =>
                      `flex-1 px-2 py-1 rounded-md text-xs hover:bg-muted ${
                        isActive ? 'bg-muted font-medium' : ''
                      }`
                    }
                  >
                    {sub.name}
                  </NavLink>
                  {sub.watch_pages.length > 0 && (
                    <CollapsibleTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-6 w-6">
                        <ChevronDown
                          className={`h-3 w-3 transition-transform ${
                            openSubId === sub.id ? 'rotate-180' : ''
                          }`}
                        />
                      </Button>
                    </CollapsibleTrigger>
                  )}
                </div>
                <CollapsibleContent className="pl-4 space-y-0.5">
                  {sub.watch_pages.map((w) => (
                    <NavLink
                      key={w.id}
                      to={`/c/${cat.slug}/${sub.slug}/${w.slug}`}
                      className={({ isActive }) =>
                        `block px-2 py-1 rounded-md text-xs hover:bg-muted ${
                          isActive ? 'bg-muted font-medium' : 'text-muted-foreground'
                        }`
                      }
                    >
                      {w.name}
                    </NavLink>
                  ))}
                </CollapsibleContent>
              </Collapsible>
            ))}
          </CollapsibleContent>
        </Collapsible>
      ))}
    </div>
  );
};
