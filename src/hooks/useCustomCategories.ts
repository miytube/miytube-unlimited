import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface CustomCategory {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  sort_order: number;
  is_active: boolean;
}

export interface CustomSubcategory {
  id: string;
  category_id: string;
  name: string;
  slug: string;
  description: string | null;
  sort_order: number;
  is_active: boolean;
}

export interface CustomWatchPage {
  id: string;
  subcategory_id: string;
  name: string;
  slug: string;
  description: string | null;
  sort_order: number;
  is_active: boolean;
}

export interface CustomCategoryTree extends CustomCategory {
  subcategories: (CustomSubcategory & { watch_pages: CustomWatchPage[] })[];
}

export const useCustomCategories = (includeInactive = false) => {
  const [tree, setTree] = useState<CustomCategoryTree[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const [cats, subs, watches] = await Promise.all([
      supabase.from('custom_categories').select('*').order('sort_order').order('name'),
      supabase.from('custom_subcategories').select('*').order('sort_order').order('name'),
      supabase.from('custom_watch_pages').select('*').order('sort_order').order('name'),
    ]);

    const filterActive = <T extends { is_active: boolean }>(arr: T[] | null) =>
      (arr || []).filter((r) => includeInactive || r.is_active);

    const built: CustomCategoryTree[] = filterActive(cats.data as CustomCategory[]).map((c) => ({
      ...c,
      subcategories: filterActive(subs.data as CustomSubcategory[])
        .filter((s) => s.category_id === c.id)
        .map((s) => ({
          ...s,
          watch_pages: filterActive(watches.data as CustomWatchPage[]).filter(
            (w) => w.subcategory_id === s.id
          ),
        })),
    }));

    setTree(built);
    setLoading(false);
  }, [includeInactive]);

  useEffect(() => {
    load();
  }, [load]);

  return { tree, loading, reload: load };
};
