
import React from 'react';
import { Layout } from '@/components/Layout';
import { useSubcategoryInfo } from '@/hooks/useSubcategoryInfo';
import { useUploadedVideos } from '@/context/UploadedVideosContext';
import { useCustomCategories } from '@/hooks/useCustomCategories';
import SubcategoryHeader from '@/components/subcategory/SubcategoryHeader';
import VideoContent from '@/components/subcategory/VideoContent';
import AboutSection from '@/components/subcategory/AboutSection';
import { Link, useLocation, Navigate } from 'react-router-dom';
import { Upload } from 'lucide-react';
import { filterVideosBySubcategory } from '@/utils/videoFiltering';

const GenericSubcategoryPage = () => {
  const { uploadedVideos } = useUploadedVideos();
  const { tree } = useCustomCategories();
  const location = useLocation();

  const {
    pageTitle,
    pageDescription,
    IconComponent,
    parentRoute,
    parentName,
    mappingKey,
    isKnown
  } = useSubcategoryInfo();

  if (!isKnown) {
    return <Navigate to="/" replace />;
  }

  const subcategoryVideos = filterVideosBySubcategory(uploadedVideos, pageTitle, mappingKey);

  // Match this static page to a custom category by slug (last URL segment)
  const lastSegment = location.pathname.split('/').filter(Boolean).pop() || '';
  const matchedCustomCat = tree.find((c) => c.slug === lastSegment);
  const customSubs = matchedCustomCat?.subcategories || [];

  return (
    <Layout>
      <div className="py-6 animate-fade-in w-full max-w-[1400px] mx-auto px-4">
        <SubcategoryHeader
          parentRoute={parentRoute}
          parentName={parentName}
          pageTitle={pageTitle}
          pageDescription={pageDescription}
          IconComponent={IconComponent}
        />

        {customSubs.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-medium mb-4">Pages in {pageTitle}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {customSubs.map((s) => (
                <Link
                  key={s.id}
                  to={`/c/${matchedCustomCat!.slug}/${s.slug}`}
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

        {subcategoryVideos.length > 0 ? (
          <VideoContent
            title={`${pageTitle} Videos`}
            videos={subcategoryVideos.map(v => ({
              id: v.id,
              title: v.title,
              thumbnail: v.thumbnail,
              channelName: 'Your Channel',
              views: v.views,
              timestamp: v.timestamp,
              duration: v.duration,
            }))}
          />
        ) : (
          <div className="text-center py-12 bg-card rounded-lg mb-8">
            <IconComponent className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">No {pageTitle} Videos Yet</h3>
            <p className="text-muted-foreground mb-4">Be the first to upload {pageTitle.toLowerCase()} content!</p>
            <Link
              to="/upload"
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
            >
              <Upload size={18} />
              <span>Upload {pageTitle} Content</span>
            </Link>
          </div>
        )}

        <AboutSection title={pageTitle} />
      </div>
    </Layout>
  );
};

export default GenericSubcategoryPage;
