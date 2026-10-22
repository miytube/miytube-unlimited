import { Link, useLocation } from 'react-router-dom';
import { MessagesSquare, Upload } from 'lucide-react';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import VideoContent from '@/components/subcategory/VideoContent';
import { useUploadedVideos } from '@/context/UploadedVideosContext';
import { filterVideosBySubcategory } from '@/utils/videoFiltering';
import { debateWatchRoute, debateWatchTitle } from '@/data/subcategoryMappings/debate';

const Debate = () => {
  const { pathname } = useLocation();
  const { uploadedVideos } = useUploadedVideos();
  const isWatchPage = pathname === debateWatchRoute;
  const title = isWatchPage ? debateWatchTitle : 'Debate';
  const videos = filterVideosBySubcategory(uploadedVideos, title, pathname.slice(1));

  return (
    <Layout>
      <main className="mx-auto w-full max-w-[1400px] px-4 py-6">
        <nav aria-label="Breadcrumb" className="mb-4 flex flex-wrap gap-2 text-sm text-muted-foreground">
          <Link to="/" className="font-semibold text-primary">MiyTube</Link>
          <span>/ Government &amp; Politics /</span>
          {isWatchPage ? <><Link to="/debate" className="text-primary">Debate</Link><span>/ {debateWatchTitle}</span></> : <span>Debate</span>}
        </nav>
        <header className="mb-8 flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0 flex-1 basis-64">
            <div className="flex items-start gap-3">
              <MessagesSquare className="mt-1 h-8 w-8 shrink-0 text-primary" />
              <h1 className="min-w-0 break-words text-3xl font-bold">{title}</h1>
            </div>
            <p className="mt-2 text-muted-foreground">Political debates featuring governors, attorney generals and other participants.</p>
          </div>
          <Button asChild><Link to="/upload"><Upload className="mr-2 h-4 w-4" />Upload Debate</Link></Button>
        </header>
        {!isWatchPage && (
          <section className="mb-8">
            <h2 className="mb-4 text-xl font-semibold">Watchpages</h2>
            <Link to={debateWatchRoute} className="block rounded-lg border border-border bg-card p-5 font-semibold transition-colors hover:bg-accent">
              {debateWatchTitle}
            </Link>
          </section>
        )}
        {videos.length > 0 ? (
          <VideoContent title="Debate Videos" videos={videos.map((video) => ({ ...video, channelName: 'Your Channel' }))} />
        ) : (
          <section className="py-12 text-center">
            <MessagesSquare className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
            <h2 className="text-xl font-semibold">No debate videos yet</h2>
          </section>
        )}
      </main>
    </Layout>
  );
};

export default Debate;