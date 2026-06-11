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
  const directAliases: Record<string, string> = {
    'sports-nba': 'nba-basketball',
    'sports-nba-basketball': 'nba-basketball',
    'nba': 'nba-basketball',
    'nba-basketbaall': 'nba-basketball',
  };
  if (directAliases[normalized]) return directAliases[normalized];
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

const CAR_REPAIR_TEXT = /\b(wrecked|rebuild|rebuilt|repair|repairs|mechanic|engine|transmission|flood\s+damaged?|damage[d]?|salvage|restoration|restore)\b/i;

const inferCarsMajorRepairSubcategory = (values: Array<string | null | undefined>): string | undefined => {
  const text = values.filter(Boolean).join(' ');
  return CAR_REPAIR_TEXT.test(text) ? 'cars-repairs-major' : undefined;
};

export const canonicalizeCategoryAssignment = (
  category?: string | null,
  subcategory?: string | null,
  textHints: Array<string | null | undefined> = []
): CanonicalCategoryAssignment => {
  const normalizedCategory = resolveSidebarCategorySlug(category ?? undefined);
  const inferredSubcategory = normalizedCategory === 'autos-vehicles'
    ? inferCarsMajorRepairSubcategory([subcategory, ...textHints])
    : undefined;
  const rawNormalizedSubcategory = normalizeCategoryValue(subcategory) || inferredSubcategory;
  const subcategoryAliasesByParent: Record<string, Record<string, string>> = {
    comedy: {
      'roasts-and-jokes': 'roasts',
      'roasts-and-jokes-and-events': 'roasts',
      'roasts-jokes': 'roasts',
      'roasts-jokes-events': 'roasts',
      'comedy-roasts': 'roasts',
      'comedy-roasts-jokes': 'roasts',
      'comedy-roasts-jokes-events': 'roasts',
    },
  };
  const normalizedSubcategory = normalizedCategory && rawNormalizedSubcategory
    ? subcategoryAliasesByParent[normalizedCategory]?.[rawNormalizedSubcategory] || rawNormalizedSubcategory
    : rawNormalizedSubcategory;
  const categoryIsReserved = !!normalizedCategory && RESERVED_TOP_LEVEL_CATEGORIES.has(normalizedCategory);

  // Sidebar label "Cars & Vehicles" points at /autos-vehicles, but every
  // dedicated car page (repairs, hacks, drifting, …) lives under /cars.
  // When the user picks autos-vehicles together with a car-specific
  // subcategory, route it to the cars parent so the chosen watch page
  // actually displays the upload.
  const AUTOS_TO_CARS = normalizedCategory === 'autos-vehicles' &&
    normalizedSubcategory &&
    (normalizedSubcategory.startsWith('cars-') || knownSubcategories.some(
      (row) => row.parent === 'cars' && row.aliases.has(normalizedSubcategory)
    ) || knownSubcategories.some(
      (row) => row.parent === 'cars-repairs' && row.aliases.has(normalizedSubcategory)
    ));
  const effectiveCategory = AUTOS_TO_CARS ? 'cars' : normalizedCategory;

  if (effectiveCategory && normalizedSubcategory) {
    if (categoryIsReserved) {
      return { category: effectiveCategory, subcategory: normalizedSubcategory };
    }

    const childUnderParent = knownSubcategories.find(
      (row) => row.parent === effectiveCategory && row.aliases.has(normalizedSubcategory)
    );
    if (childUnderParent) {
      return { category: effectiveCategory, subcategory: childUnderParent.child };
    }

    const categoryAsLeaf = resolveUniqueSubcategoryAlias(effectiveCategory);
    if (categoryAsLeaf && categoryAsLeaf.aliases.has(normalizedSubcategory)) {
      return { category: categoryAsLeaf.parent, subcategory: categoryAsLeaf.child };
    }

    const userPickedValidParent =
      sidebarMainCategorySlugs.has(effectiveCategory) ||
      knownParentSlugs.has(effectiveCategory);
    if (!userPickedValidParent) {
      const leafFromSub = resolveUniqueSubcategoryAlias(normalizedSubcategory);
      if (leafFromSub && leafFromSub.parent !== effectiveCategory) {
        return { category: leafFromSub.parent, subcategory: leafFromSub.child };
      }
    }

    return { category: effectiveCategory, subcategory: normalizedSubcategory };

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