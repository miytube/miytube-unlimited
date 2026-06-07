import React, { useMemo, useState, useEffect } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { VideoCard } from '@/components/VideoCard';
import { Folder, Upload, ChevronRight } from 'lucide-react';
import { useUploadedVideos } from '@/context/UploadedVideosContext';
import { useCustomCategories } from '@/hooks/useCustomCategories';
import { AdSlot } from '@/components/ads/AdSlot';

type Mode = 'category' | 'subcategory' | 'watch';

interface Props {
  mode: Mode;
}

const CustomCategoryPage: React.FC<Props> = ({ mode }) => {
  const params = useParams();
  const { tree, loading } = useCustomCategories();
  const { getVideosByCategory } = useUploadedVideos();

  const category = useMemo(
    () => tree.find((c) => c.slug === params.categorySlug),
    [tree, params.categorySlug]
  );
  const subcategory = useMemo(
    () => category?.subcategories.find((s) => s.slug === params.subSlug),
    [category, params.subSlug]
  );
  const watchPage = useMemo(
    () => subcategory?.watch_pages.find((w) => w.slug === params.watchSlug),
    [subcategory, params.watchSlug]
  );

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      </Layout>
    );
  }

  if (!category) return <Navigate to="/" replace />;
  if (mode !== 'category' && !subcategory) return <Navigate to={`/c/${category.slug}`} replace />;
  if (mode === 'watch' && !watchPage)
    return <Navigate to={`/c/${category.slug}/${subcategory!.slug}`} replace />;

  const title = watchPage?.name || subcategory?.name || category.name;
  const description = watchPage?.description || subcategory?.description || category.description;

  // Filter videos by slug (videos store normalized slugs in category/subcategory)
  const mostSpecificSlug = (watchPage?.slug || subcategory?.slug || category.slug).toLowerCase();
  const categorySlugLower = category.slug.toLowerCase();
  const videos = getVideosByCategory(categorySlugLower, mostSpecificSlug !== categorySlugLower ? mostSpecificSlug : undefined);

  return (
    <Layout>
      <div className="py-6 animate-fade-in w-full max-w-[1400px] mx-auto px-2 sm:px-4">
        <p className="text-sm text-muted-foreground mb-2 flex items-center gap-1 flex-wrap">
          <Link to="/" className="font-semibold text-primary">MiyTube</Link>
          <ChevronRight className="h-3 w-3" />
          <Link to={`/c/${category.slug}`} className="hover:text-foreground">{category.name}</Link>
          {subcategory && subcategory.slug !== 'main' && (
            <>
              <ChevronRight className="h-3 w-3" />
              <Link to={`/c/${category.slug}/${subcategory.slug}`} className="hover:text-foreground">
                {subcategory.name}
              </Link>
            </>
          )}
          {watchPage && (
            <>
              <ChevronRight className="h-3 w-3" />
              <span>{watchPage.name}</span>
            </>
          )}
        </p>

        <div className="flex items-center gap-3 mb-6 flex-wrap">
          <Folder className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">{title}</h1>
          <Link
            to="/upload"
            className="ml-auto flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-full hover:bg-primary/90 transition-colors"
          >
            <Upload size={18} />
            <span>Upload</span>
          </Link>
        </div>

        <div className="mb-6">
          <AdSlot slot="1406515812" format="horizontal" responsive label="Sponsored" />
        </div>

        {/* Subcategory list when on category page */}
        {mode === 'category' && category.subcategories.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-medium mb-3">Subcategories</h2>
            <div className="flex flex-wrap gap-2">
              {category.subcategories.map((s) => (
                <Link
                  key={s.id}
                  to={`/c/${category.slug}/${s.slug}`}
                  className="px-4 py-2 bg-card hover:bg-muted rounded-full border text-sm"
                >
                  {s.name}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Watch page list when on subcategory page */}
        {mode === 'subcategory' && subcategory && subcategory.watch_pages.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-medium mb-3">Watch Pages</h2>
            <div className="flex flex-wrap gap-2">
              {subcategory.watch_pages.map((w) => (
                <Link
                  key={w.id}
                  to={`/c/${category.slug}/${subcategory.slug}/${w.slug}`}
                  className="px-4 py-2 bg-card hover:bg-muted rounded-full border text-sm"
                >
                  {w.name}
                </Link>
              ))}
            </div>
          </div>
        )}

        {videos.length > 0 ? (
          <VideosPaginated videos={videos} title={title} />
        ) : (
          <div className="text-center py-12 bg-card rounded-lg mb-8">
            <Folder className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">No {title} Videos Yet</h3>
            <p className="text-muted-foreground mb-4">
              Be the first to upload {title.toLowerCase()} content!
            </p>
            <Link
              to="/upload"
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
            >
              <Upload size={18} />
              <span>Upload Content</span>
            </Link>
          </div>
        )}

        <div className="my-6">
          <AdSlot slot="4004758990" format="autorelaxed" responsive label="Sponsored" />
        </div>



        {description && (
          <div className="bg-card p-6 rounded-lg shadow-sm mb-8">
            <h2 className="text-xl font-semibold mb-4">About {title}</h2>
            <p className="text-muted-foreground whitespace-pre-line">{description}</p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default CustomCategoryPage;

const PAGE_SIZE = 20;

const VideosPaginated: React.FC<{ videos: any[]; title: string }> = ({ videos, title }) => {
  const [page, setPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(videos.length / PAGE_SIZE));

  // Reset to page 1 when the underlying list changes (e.g., new upload)
  useEffect(() => { setPage(1); }, [videos.length]);

  const pageVideos = videos.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="mb-8">
      <div className="flex items-baseline justify-between mb-4 flex-wrap gap-2">
        <h2 className="text-xl font-medium">{title} Videos</h2>
        <span className="text-sm text-muted-foreground">
          {videos.length} total · Page {page} of {totalPages}
        </span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {pageVideos.map((video) => (
          <VideoCard
            key={video.id}
            id={video.id}
            title={video.title}
            thumbnail={video.thumbnail}
            channelName="Your Channel"
            views={video.views}
            timestamp={video.timestamp}
            duration={video.duration}
            description={video.description}
            category={video.category}
            subcategory={video.subcategory}
            tags={video.tags}
          />
        ))}
      </div>
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-6 flex-wrap">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 rounded-md border bg-card hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed text-sm"
          >
            Previous
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`px-3 py-2 rounded-md border text-sm min-w-[40px] ${
                p === page ? 'bg-primary text-primary-foreground' : 'bg-card hover:bg-muted'
              }`}
            >
              {p}
            </button>
          ))}
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-4 py-2 rounded-md border bg-card hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed text-sm"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};
