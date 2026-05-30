
import React from 'react';
import { Layout } from '@/components/Layout';
import { useSubcategoryInfo } from '@/hooks/useSubcategoryInfo';
import { useUploadedVideos } from '@/context/UploadedVideosContext';
import { useCustomCategories } from '@/hooks/useCustomCategories';
import SubcategoryHeader from '@/components/subcategory/SubcategoryHeader';
import VideoContent from '@/components/subcategory/VideoContent';
import AboutSection from '@/components/subcategory/AboutSection';
import { Link, useLocation, Navigate } from 'react-router-dom';
import { Film, Upload } from 'lucide-react';
import { filterVideosBySubcategory } from '@/utils/videoFiltering';
import { getSidebarMainCategoryRoute } from '@/data/sidebarMainCategories';
import { normalizeCategoryValue } from '@/utils/normalizeCategory';

const GenericSubcategoryPage = () => {
  const { uploadedVideos, getVideosByCategory } = useUploadedVideos();
  const { tree, loading: customCategoriesLoading } = useCustomCategories();
  const location = useLocation();
  const pathParts = location.pathname.split('/').filter(Boolean);
  const [categorySlug, subcategorySlug, watchSlug] = pathParts;
  const currentPath = location.pathname.replace(/\/$/, '') || '/';

  const {
    pageTitle,
    pageDescription,
    IconComponent,
    parentRoute,
    parentName,
    mappingKey,
    isKnown
  } = useSubcategoryInfo();

  const matchedCustomCat = tree.find(
    (c) => c.slug === categorySlug || currentPath === getSidebarMainCategoryRoute(c.slug) || currentPath.startsWith(`${getSidebarMainCategoryRoute(c.slug)}/`)
  );
  const matchedCustomRoute = matchedCustomCat ? getSidebarMainCategoryRoute(matchedCustomCat.slug) : undefined;
  const customPathParts = matchedCustomRoute && currentPath.startsWith(`${matchedCustomRoute}/`)
    ? currentPath.slice(matchedCustomRoute.length + 1).split('/').filter(Boolean)
    : matchedCustomRoute === currentPath
      ? []
      : pathParts.slice(1);
  const [customSubSlug, customWatchSlug] = customPathParts;
  const matchedCustomSub = customSubSlug
    ? matchedCustomCat?.subcategories.find((s) => s.slug === customSubSlug)
    : undefined;
  const matchedCustomWatch = customWatchSlug
    ? matchedCustomSub?.watch_pages.find((w) => w.slug === customWatchSlug)
    : undefined;
  const normalizedCustomSubSlug = normalizeCategoryValue(customSubSlug);
  const normalizedCustomWatchSlug = normalizeCategoryValue(customWatchSlug);
  const matchedCanonicalStaticPage = Boolean(
    !isKnown &&
      matchedCustomCat &&
      !matchedCustomSub &&
      !matchedCustomWatch &&
      normalizedCustomSubSlug &&
      normalizeCategoryValue(`${matchedCustomCat.slug}-${normalizedCustomSubSlug}`) === normalizedCustomSubSlug
  );
  const isCustomRoute = Boolean(
    matchedCustomCat &&
      (!customSubSlug || matchedCustomSub || matchedCanonicalStaticPage) &&
      (!customWatchSlug || matchedCustomWatch)
  );

  if (!isKnown && customCategoriesLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      </Layout>
    );
  }

  if (!isKnown && !isCustomRoute) {
    // Fall back to the parent category route (e.g. /education) when the
    // specific sub-path doesn't exist, instead of dumping the user on Home.
    if (categorySlug && pathParts.length > 1) {
      return <Navigate to={`/${categorySlug}`} replace />;
    }
    return <Navigate to="/" replace />;
  }

  const displayTitle = isCustomRoute && matchedCustomCat
    ? matchedCustomWatch?.name || matchedCustomSub?.name || matchedCustomCat.name
    : pageTitle;
  const displayDescription = isCustomRoute && matchedCustomCat
    ? matchedCustomWatch?.description || matchedCustomSub?.description || matchedCustomCat.description || pageDescription
    : pageDescription;
  const DisplayIcon = isCustomRoute ? Film : IconComponent;
  const subcategoryVideos = isCustomRoute && matchedCustomCat
    ? getVideosByCategory(
        matchedCustomCat.slug,
        (matchedCustomWatch?.slug || matchedCustomSub?.slug || normalizedCustomWatchSlug || normalizedCustomSubSlug || matchedCustomCat.slug) !== matchedCustomCat.slug
          ? (matchedCustomWatch?.slug || matchedCustomSub?.slug || normalizedCustomWatchSlug || normalizedCustomSubSlug)
          : undefined
      )
    : filterVideosBySubcategory(uploadedVideos, pageTitle, mappingKey);

  // Match static pages to custom child pages by slug (for static category landing pages)
  const lastSegment = pathParts[pathParts.length - 1] || '';
  const staticMatchedCustomCat = isCustomRoute ? matchedCustomCat : tree.find((c) => c.slug === lastSegment);
  const customSubs = staticMatchedCustomCat?.subcategories || [];
  const customWatchPages = isCustomRoute && matchedCustomSub && !customWatchSlug
    ? matchedCustomSub.watch_pages
    : [];

  return (
    <Layout>
      <div className="py-6 animate-fade-in w-full max-w-[1400px] mx-auto px-4">
        <SubcategoryHeader
          parentRoute={isCustomRoute ? matchedCustomRoute || `/${matchedCustomCat!.slug}` : parentRoute}
          parentName={isCustomRoute ? matchedCustomCat!.name : parentName}
          pageTitle={displayTitle}
          pageDescription={displayDescription}
          IconComponent={DisplayIcon}
        />

        {customSubs.length > 0 && !customSubSlug && !customWatchSlug && (
          <div className="mb-8">
            <h2 className="text-xl font-medium mb-4">Pages in {pageTitle}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {customSubs.map((s) => (
                <Link
                  key={s.id}
                  to={`${getSidebarMainCategoryRoute(staticMatchedCustomCat!.slug) || `/c/${staticMatchedCustomCat!.slug}`}/${s.slug}`}
                  className="group block p-4 bg-card hover:bg-muted border rounded-lg transition-colors"
                >
                  <h3 className="font-semibold text-base group-hover:text-primary">{s.name}</h3>
                  {s.description && (
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{s.description}</p>
                  )}
                </Link>
              ))}
            </div>
          </div>
        )}

        {customWatchPages.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-medium mb-4">Pages in {displayTitle}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {customWatchPages.map((w) => (
                <Link
                  key={w.id}
                  to={`${matchedCustomRoute || `/c/${matchedCustomCat!.slug}`}/${matchedCustomSub!.slug}/${w.slug}`}
                  className="group block p-4 bg-card hover:bg-muted border rounded-lg transition-colors"
                >
                  <h3 className="font-semibold text-base group-hover:text-primary">{w.name}</h3>
                  {w.description && (
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{w.description}</p>
                  )}
                </Link>
              ))}
            </div>
          </div>
        )}

        {subcategoryVideos.length > 0 ? (
          <VideoContent
            title={`${displayTitle} Videos`}
            videos={subcategoryVideos.map(v => ({
              id: v.id,
              title: v.title,
              thumbnail: v.thumbnail,
              channelName: 'Your Channel',
              views: v.views,
              timestamp: v.timestamp,
              duration: v.duration,
                description: v.description,
                category: v.category,
                subcategory: v.subcategory,
                tags: v.tags,
            }))}
          />
        ) : (
          <div className="text-center py-12 bg-card rounded-lg mb-8">
            <DisplayIcon className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">No {displayTitle} Videos Yet</h3>
            <p className="text-muted-foreground mb-4">Be the first to upload {displayTitle.toLowerCase()} content!</p>
            <Link
              to="/upload"
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
            >
              <Upload size={18} />
              <span>Upload {displayTitle} Content</span>
            </Link>
          </div>
        )}

        <AboutSection title={displayTitle} />
      </div>
    </Layout>
  );
};

export default GenericSubcategoryPage;
