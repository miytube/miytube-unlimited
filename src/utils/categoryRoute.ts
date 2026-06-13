import { subcategoryMappings } from '@/data/subcategoryMappings';
import {
  sidebarMainCategoryOptions,
  getSidebarMainCategoryRoute,
} from '@/data/sidebarMainCategories';
import { canonicalizeCategoryAssignment } from '@/utils/categoryAssignment';

const trimSlashes = (value: string) => value.replace(/^\/+|\/+$/g, '');

const CUSTOM_PAGE_CATEGORIES = new Set(sidebarMainCategoryOptions.map((o) => o.slug));

const knownSidebarSlugs = new Set(sidebarMainCategoryOptions.map((o) => o.slug));

/**
 * Resolve a category slug to the slug actually registered as a sidebar main
 * category. Videos sometimes get persisted with a namespaced prefix (e.g.
 * `sports-tennis` when the real sidebar slug is `tennis`). Without this
 * fallback the breadcrumb link points to a route that no router entry
 * handles, so clicking it appears to "refresh" the page.
 */
const resolveSidebarSlug = (slug: string): string | undefined => {
  if (knownSidebarSlugs.has(slug)) return slug;
  // Try stripping a single-word prefix like "sports-", "music-", etc.
  const dashIdx = slug.indexOf('-');
  if (dashIdx > 0) {
    const tail = slug.slice(dashIdx + 1);
    if (knownSidebarSlugs.has(tail)) return tail;
  }
  return undefined;
};

export const getUploadDestinationRoute = (category?: string, subcategory?: string) => {
  const canonical = canonicalizeCategoryAssignment(category, subcategory);
  const cleanCategory = canonical.category ? trimSlashes(canonical.category) : (category ? trimSlashes(category) : '');
  const cleanSubcategory = canonical.subcategory ? trimSlashes(canonical.subcategory) : (subcategory ? trimSlashes(subcategory) : '');

  if (!cleanCategory) return '/';

  if (cleanCategory === 'college-sports') {
    if (!cleanSubcategory) return '/sports/college';
    if (cleanSubcategory === 'football-bowl-games') return '/sports/college/bowl';
    return `/sports/college/${cleanSubcategory}`;
  }
  if (cleanCategory === 'professional-track-and-field') {
    return cleanSubcategory === 'track-and-field' || cleanSubcategory === 'track-field'
      ? '/sports/track-field/professional/track-field'
      : '/sports/track-field/professional';
  }
  if (cleanCategory === 'track-field' && cleanSubcategory === 'professional-track-and-field') {
    return '/sports/track-field/professional';
  }
  if (cleanCategory === 'racing-sports') {
    if (!cleanSubcategory || cleanSubcategory === 'racing') return '/sports/racing';
    return cleanSubcategory.startsWith('drag-racing')
      ? `/sports/${cleanSubcategory}`
      : `/sports/${cleanSubcategory}`;
  }
  if (cleanCategory === 'cars') {
    const carRepairRoutes: Record<string, string> = {
      'cars-repairs-major': '/cars/repairs/major',
      'cars-repairs-minor': '/cars/repairs/minor',
      'cars-repairs-hacks': '/cars/repairs/hacks',
      'cars-repairs-maintenance': '/cars/repairs/maintenance',
    };
    if (cleanSubcategory && carRepairRoutes[cleanSubcategory]) return carRepairRoutes[cleanSubcategory];
  }
  if (cleanCategory === 'news' && cleanSubcategory === 'news-and-politics') {
    return '/news';
  }
  if (!cleanSubcategory) {
    const resolvedNoSub = resolveSidebarSlug(cleanCategory);
    if (resolvedNoSub) {
      return getSidebarMainCategoryRoute(resolvedNoSub) || `/${resolvedNoSub}`;
    }
    return `/${cleanCategory}`;
  }


  const nestedStaticRoute = `/${cleanCategory}/${cleanSubcategory}`;
  if (subcategoryMappings[nestedStaticRoute] || subcategoryMappings[nestedStaticRoute.slice(1)]) {
    return nestedStaticRoute;
  }

  if (subcategoryMappings[`/${cleanSubcategory}`]) return `/${cleanSubcategory}`;
  if (subcategoryMappings[cleanSubcategory]) return cleanSubcategory.startsWith('/') ? cleanSubcategory : `/${cleanSubcategory}`;

  if (cleanSubcategory.startsWith(`${cleanCategory}/`)) return `/${cleanSubcategory}`;
  if (cleanSubcategory.startsWith(`${cleanCategory}-`)) {
    const shortenedSubcategory = cleanSubcategory.slice(cleanCategory.length + 1);
    const shortenedRoute = `/${cleanCategory}/${shortenedSubcategory}`;
    if (subcategoryMappings[shortenedRoute] || subcategoryMappings[shortenedRoute.slice(1)]) {
      return shortenedRoute;
    }
    if (CUSTOM_PAGE_CATEGORIES.has(cleanCategory)) return `/c/${cleanCategory}/${cleanSubcategory}`;
    return `/${cleanCategory}/${cleanSubcategory}`;
  }

  // Admin-created sidebar watch pages live under /c/ when no static watch route
  // exists. This keeps dynamic pages like NBA Championship Finals available,
  // while static pages like /comedy/roasts keep their real watch-page URL.
  if (CUSTOM_PAGE_CATEGORIES.has(cleanCategory)) {
    return `/c/${cleanCategory}/${cleanSubcategory}`;
  }

  // Fall back to the sidebar main-category route so links generated for
  // namespaced category slugs (e.g. "sports-tennis") still resolve to the
  // actual page ("/c/tennis") instead of an unrouted /sports-tennis URL.
  const resolvedSlug = resolveSidebarSlug(cleanCategory);
  if (resolvedSlug) {
    const baseRoute = getSidebarMainCategoryRoute(resolvedSlug) || `/${resolvedSlug}`;
    return cleanSubcategory ? `${baseRoute}/${cleanSubcategory}` : baseRoute;
  }

  return `/${cleanCategory}/${cleanSubcategory}`;
};
