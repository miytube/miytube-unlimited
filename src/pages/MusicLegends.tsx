import React, { useEffect, useMemo, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ChevronRight, Star, Upload } from 'lucide-react';
import { Layout } from '@/components/Layout';
import { VideoCard } from '@/components/VideoCard';
import { useUploadedVideos } from '@/context/UploadedVideosContext';
import { usePageSEO } from '@/hooks/usePageSEO';
import { serializeJsonLd } from '@/lib/seo';
import { buildMusicLegendSchema, musicLegendPageMetadata } from '@/lib/musicLegendSEO';
import { groupVideosByMusicLegend } from '@/utils/musicLegendsGrouping';
import {
  MUSIC_LEGENDS, MUSIC_LEGENDS_ALPHABETICAL, MUSIC_LEGENDS_BASE_PATH, MUSIC_LEGENDS_TAGLINE,
  MUSIC_LEGEND_GROUPS, getMusicLegendBySlug, musicLegendPath, type MusicLegend,
} from '@/data/musicLegends';

const PAGE_SIZE = 20;
const SHELF_SIZE = 4;
const countLabel = (count: number) => `${count} ${count === 1 ? 'video' : 'videos'}`;

const renderCard = (video: any) => (
  <VideoCard
    key={video.id} id={video.id} title={video.title} thumbnail={video.thumbnail} channelName="Your Channel"
    views={video.views} timestamp={video.timestamp} duration={video.duration} description={video.description}
    category={video.category} subcategory={video.subcategory} tags={video.tags}
  />
);

const LegendSEO: React.FC<{ legend?: MusicLegend; visible: any[]; total: number; offset?: number }> = ({ legend, visible, total, offset = 0 }) => {
  usePageSEO(musicLegendPageMetadata(legend));
  return (
    <Helmet>
      <script id="music-legend-jsonld" type="application/ld+json">
        {serializeJsonLd(buildMusicLegendSchema(legend, visible, total, offset))}
      </script>
    </Helmet>
  );
};

const Crumbs: React.FC<{ legend?: MusicLegend }> = ({ legend }) => (
  <p className="text-sm text-muted-foreground mb-3 flex items-center gap-1 flex-wrap">
    <Link to="/" className="font-semibold text-primary">MiyTube</Link>
    <ChevronRight className="h-3 w-3" />
    <Link to="/music" className="hover:text-primary">Music</Link>
    <ChevronRight className="h-3 w-3" />
    {legend ? <Link to={MUSIC_LEGENDS_BASE_PATH} className="hover:text-primary">Music Legends</Link> : <span>Music Legends</span>}
    {legend && (<><ChevronRight className="h-3 w-3" /><span>{legend.name}</span></>)}
  </p>
);

const MusicLegends: React.FC = () => {
  const { artistSlug } = useParams();
  const { uploadedVideos } = useUploadedVideos();
  const groups = useMemo(() => groupVideosByMusicLegend(uploadedVideos as any[]), [uploadedVideos]);
  const legend = getMusicLegendBySlug(artistSlug);

  if (artistSlug && !legend) return <Navigate to={MUSIC_LEGENDS_BASE_PATH} replace />;

  return (
    <Layout>
      <div className="py-6 animate-fade-in w-full max-w-[1400px] mx-auto px-2 sm:px-4">
        <Crumbs legend={legend} />
        {legend
          ? <ArtistPage key={legend.slug} legend={legend} videos={groups.get(legend.id) || []} />
          : <Hub groups={groups} />}
      </div>
    </Layout>
  );
};

export default MusicLegends;

const Hub: React.FC<{ groups: Map<number, any[]> }> = ({ groups }) => {
  const [group, setGroup] = useState('All');
  const roster = MUSIC_LEGENDS.filter((item) => group === 'All' || item.group === group);
  const shelves = roster.filter((item) => groups.has(item.id));
  const visible = shelves.flatMap((item) => groups.get(item.id)!.slice(0, SHELF_SIZE));
  const total = [...groups.values()].reduce((sum, list) => sum + list.length, 0);

  return (
    <>
      <LegendSEO visible={visible} total={total} />
      <header className="mb-8 rounded-xl border bg-card p-6 sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary flex items-center gap-2">
          <Star className="h-4 w-4" /> MiyTube Music Legends
        </p>
        <h1 className="mt-2 text-3xl sm:text-5xl font-black tracking-tight">Music Legends</h1>
        <p className="mt-2 text-lg sm:text-xl text-muted-foreground">{MUSIC_LEGENDS_TAGLINE}</p>
        <p className="mt-4 max-w-2xl text-sm text-muted-foreground">
          The greatest artists who ever lived, each with a home for their videos, performances and interviews.
        </p>
      </header>

      <div className="mb-6 flex flex-wrap gap-2" role="group" aria-label="Filter legends by genre">
        {['All', ...MUSIC_LEGEND_GROUPS].map((name) => (
          <button
            key={name} type="button" onClick={() => setGroup(name)} aria-pressed={group === name}
            className={`px-4 py-2 rounded-full border text-sm font-medium ${group === name ? 'bg-primary text-primary-foreground' : 'bg-card hover:bg-muted'}`}
          >
            {name}
          </button>
        ))}
      </div>

      <section aria-label="The legends" className="mb-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {roster.map((item) => {
          const count = groups.get(item.id)?.length || 0;
          return (
            <Link key={item.slug} to={musicLegendPath(item)} className="group flex flex-col rounded-lg border bg-card p-5 transition-colors hover:bg-muted">
              <div className="flex items-baseline justify-between gap-2">
                <span className="text-xs font-semibold uppercase tracking-wide text-primary">{item.genre}</span>
                <span className="text-sm font-bold tabular-nums text-muted-foreground">{String(item.id).padStart(2, '0')}</span>
              </div>
              <h2 className="mt-2 text-xl font-bold group-hover:text-primary">{item.name}</h2>
              <p className="mt-2 flex-1 text-sm text-muted-foreground line-clamp-3">{item.description}</p>
              <p className="mt-4 text-sm font-medium">{count > 0 ? countLabel(count) : 'Videos coming soon'}</p>
            </Link>
          );
        })}
      </section>

      <div className="space-y-10 mb-8">
        {shelves.map((item) => {
          const list = groups.get(item.id)!;
          return (
            <section key={item.slug}>
              <div className="flex items-end justify-between gap-3 flex-wrap border-b pb-2 mb-4">
                <h2 className="text-2xl font-bold">
                  <Link to={musicLegendPath(item)} className="hover:text-primary">{item.name}</Link>
                  <span className="ml-2 text-base font-normal text-muted-foreground">{countLabel(list.length)}</span>
                </h2>
                {list.length > SHELF_SIZE && (
                  <Link to={musicLegendPath(item)} className="inline-flex items-center gap-1 text-sm font-medium hover:text-primary">
                    See all {list.length} <ChevronRight className="h-4 w-4" />
                  </Link>
                )}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {list.slice(0, SHELF_SIZE).map(renderCard)}
              </div>
            </section>
          );
        })}
      </div>
    </>
  );
};

const ArtistPage: React.FC<{ legend: MusicLegend; videos: any[] }> = ({ legend, videos }) => {
  const [page, setPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(videos.length / PAGE_SIZE));
  useEffect(() => { setPage(1); }, [videos.length]);
  const offset = (page - 1) * PAGE_SIZE;
  const pageVideos = videos.slice(offset, offset + PAGE_SIZE);

  return (
    <>
      <LegendSEO legend={legend} visible={pageVideos} total={videos.length} offset={offset} />
      <header className="mb-8 rounded-xl border bg-card p-6 sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Music Legends · {legend.genre}</p>
        <h1 className="mt-2 text-3xl sm:text-5xl font-black tracking-tight">{legend.name}</h1>
        <p className="mt-3 max-w-3xl text-muted-foreground">{legend.description}</p>
      </header>

      {videos.length > 0 ? (
        <section className="mb-10">
          <div className="flex items-baseline justify-between mb-4 flex-wrap gap-2">
            <h2 className="text-xl font-medium">{legend.name} Videos</h2>
            <span className="text-sm text-muted-foreground">{videos.length} total · Page {page} of {totalPages}</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">{pageVideos.map(renderCard)}</div>
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-6 flex-wrap">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p} onClick={() => setPage(p)} aria-current={p === page ? 'page' : undefined}
                  className={`px-3 py-2 rounded-md border text-sm min-w-[40px] ${p === page ? 'bg-primary text-primary-foreground' : 'bg-card hover:bg-muted'}`}
                >
                  {p}
                </button>
              ))}
            </div>
          )}
        </section>
      ) : (
        <section className="mb-10 rounded-lg border border-dashed p-8 text-center">
          <h2 className="text-xl font-semibold">{legend.name} videos are coming soon</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Music uploads with “{legend.name}” in the title appear here automatically.
          </p>
          <Link to="/upload/music" className="mt-4 inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
            <Upload className="h-4 w-4" /> Upload Music
          </Link>
        </section>
      )}

      <nav aria-label="More Music Legends" className="mb-8">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-3">More Music Legends</h2>
        <div className="flex flex-wrap gap-2">
          {MUSIC_LEGENDS_ALPHABETICAL.filter((item) => item.id !== legend.id).map((item) => (
            <Link key={item.slug} to={musicLegendPath(item)} className="px-3 py-1.5 bg-card hover:bg-muted rounded-full border text-sm">
              {item.name}
            </Link>
          ))}
        </div>
      </nav>
    </>
  );
};
