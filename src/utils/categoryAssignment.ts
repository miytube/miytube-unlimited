import { subcategoryMappings } from '@/data/subcategoryMappings';
import { sidebarMainCategorySlugs } from '@/data/sidebarMainCategories';
import { normalizeCategoryValue } from '@/utils/normalizeCategory';

export interface CanonicalCategoryAssignment {
  category?: string;
  subcategory?: string;
}

interface KnownSubcategoryAssignment {
  parent: string;
  parentName: string;
  child: string;
  title: string;
  aliases: Set<string>;
}

const normalizeRoute = (value?: string | null): string | undefined =>
  normalizeCategoryValue(value?.replace(/^\/+|\/+$/g, ''));

const buildKnownSubcategories = (): KnownSubcategoryAssignment[] => {
  const seen = new Set<string>();

  return Object.entries(subcategoryMappings).flatMap(([rawKey, info]) => {
    const parent = normalizeRoute(info.parent.route) || normalizeCategoryValue(info.parent.name);
    const normalizedKey = normalizeRoute(rawKey);
    if (!parent || !normalizedKey) return [];

    const routeParts = rawKey.replace(/^\/+|\/+$/g, '').split('/').filter(Boolean);
    let child = routeParts.length > 1 ? normalizeCategoryValue(routeParts[routeParts.length - 1]) : undefined;
    if (!child && normalizedKey.startsWith(`${parent}-`)) {
      child = normalizedKey.slice(parent.length + 1);
    }
    child = child || normalizeCategoryValue(info.title);
    if (!child) return [];

    const key = `${parent}/${child}`;
    if (seen.has(key)) return [];
    seen.add(key);

    const aliases = new Set(
      [
        rawKey,
        rawKey.replace(/^\/+|\/+$/g, ''),
        normalizedKey,
        `${parent}-${child}`,
        `${parent}/${child}`,
        child,
        info.title,
      ]
        .map(normalizeRoute)
        .filter(Boolean) as string[]
    );

    return [{ parent, parentName: info.parent.name, child, title: info.title, aliases }];
  });
};

const knownSubcategories = buildKnownSubcategories();
const knownParentSlugs = new Set(knownSubcategories.map((row) => row.parent));

const resolveSidebarCategorySlug = (value?: string): string | undefined => {
  const normalized = normalizeCategoryValue(value);
  if (!normalized) return undefined;
  if (sidebarMainCategorySlugs.has(normalized)) return normalized;

  const dashIdx = normalized.indexOf('-');
  if (dashIdx > 0) {
    const tail = normalized.slice(dashIdx + 1);
    if (sidebarMainCategorySlugs.has(tail)) return tail;
  }

  return normalized;
};

const resolveUniqueSubcategoryAlias = (value?: string): KnownSubcategoryAssignment | undefined => {
  const normalized = normalizeCategoryValue(value);
  if (!normalized || knownParentSlugs.has(normalized)) return undefined;

  const matches = knownSubcategories.filter((row) => row.aliases.has(normalized));
  const uniqueKeys = new Set(matches.map((row) => `${row.parent}/${row.child}`));
  return uniqueKeys.size === 1 ? matches[0] : undefined;
};

// Reserved top-level categories whose slug must NEVER be re-mapped to a
// nested subcategory (e.g. 'shorts' is its own /shorts feed, NOT /funny/shorts).
const RESERVED_TOP_LEVEL_CATEGORIES = new Set(['shorts']);

export const canonicalizeCategoryAssignment = (
  category?: string | null,
  subcategory?: string | null
): CanonicalCategoryAssignment => {
  const normalizedCategory = resolveSidebarCategorySlug(category ?? undefined);
  const normalizedSubcategory = normalizeCategoryValue(subcategory);
  const categoryIsReserved = !!normalizedCategory && RESERVED_TOP_LEVEL_CATEGORIES.has(normalizedCategory);

  if (normalizedCategory && normalizedSubcategory) {
    if (categoryIsReserved) {
      return { category: normalizedCategory, subcategory: normalizedSubcategory };
    }

    const childUnderParent = knownSubcategories.find(
      (row) => row.parent === normalizedCategory && row.aliases.has(normalizedSubcategory)
    );
    if (childUnderParent) {
      return { category: normalizedCategory, subcategory: childUnderParent.child };
    }

    const categoryAsLeaf = resolveUniqueSubcategoryAlias(normalizedCategory);
    if (categoryAsLeaf && categoryAsLeaf.aliases.has(normalizedSubcategory)) {
      return { category: categoryAsLeaf.parent, subcategory: categoryAsLeaf.child };
    }

    // If the subcategory uniquely identifies a known parent (e.g. user picked
    // "Street Cars/Motorcycles Racing" which lives under /cars), prefer that
    // parent over a mismatched sidebar category (e.g. "autos-vehicles").
    const leafFromSub = resolveUniqueSubcategoryAlias(normalizedSubcategory);
    if (leafFromSub && leafFromSub.parent !== normalizedCategory) {
      return { category: leafFromSub.parent, subcategory: leafFromSub.child };
    }

    return { category: normalizedCategory, subcategory: normalizedSubcategory };
  }

  if (categoryIsReserved) {
    return { category: normalizedCategory, subcategory: normalizedSubcategory };
  }

  const leafFromCategory = resolveUniqueSubcategoryAlias(normalizedCategory);
  if (leafFromCategory) {
    return { category: leafFromCategory.parent, subcategory: leafFromCategory.child };
  }

  const leafFromSubcategory = resolveUniqueSubcategoryAlias(normalizedSubcategory);
  if (!normalizedCategory && leafFromSubcategory) {
    return { category: leafFromSubcategory.parent, subcategory: leafFromSubcategory.child };
  }

  return { category: normalizedCategory, subcategory: normalizedSubcategory };
};

export const getKnownParentCategoryOptions = (): { id: string; name: string }[] => {
  const options = new Map<string, { id: string; name: string }>();
  for (const row of knownSubcategories) {
    if (!options.has(row.parent)) {
      options.set(row.parent, { id: row.parent, name: row.parentName });
    }
  }
  return Array.from(options.values());
};

export const getKnownSubcategoryOptionsForParent = (category?: string): { id: string; name: string }[] => {
  const normalizedCategory = normalizeCategoryValue(category);
  if (!normalizedCategory) return [];

  const options = new Map<string, { id: string; name: string }>();
  for (const row of knownSubcategories) {
    if (row.parent === normalizedCategory && !options.has(row.child)) {
      options.set(row.child, { id: row.child, name: row.title });
    }
  }
  return Array.from(options.values());
};