import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, ChevronRight } from 'lucide-react';
import { VideoCard } from '@/components/VideoCard';
import { groupVideosByLegend } from '@/utils/legendsGrouping';
import { LEGENDS_BASE_PATH, getLegendProfileUrl } from '@/data/sportsBeginEndLegends';

const SHELF_SIZE = 4;

const shelfId = (slug: string) => `shelf-${slug}`;

const renderCard = (video: any) => (
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
);

const scrollToShelf = (id: string) => {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
};

export const LegendsShelves: React.FC<{ videos: any[] }> = ({ videos }) => {
  const { shelves, unassigned } = useMemo(() => groupVideosByLegend(videos), [videos]);

  return (
    <div className="mb-8">
      <nav aria-label="Jump to a legend" className="mb-8">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-3">
          Jump to a legend
        </h2>
        <div className="flex flex-wrap gap-2">
          {shelves.map(({ legend, videos: list }) => (
            <button
              key={legend.slug}
              type="button"
              onClick={() => scrollToShelf(shelfId(legend.slug))}
              className="px-3 py-1.5 bg-card hover:bg-muted rounded-full border text-sm"
            >
              {legend.name} <span className="text-muted-foreground">({list.length})</span>
            </button>
          ))}
          {unassigned.length > 0 && (
            <button
              type="button"
              onClick={() => scrollToShelf('shelf-more-legends')}
              className="px-3 py-1.5 bg-card hover:bg-muted rounded-full border text-sm"
            >
              More Legends Videos <span className="text-muted-foreground">({unassigned.length})</span>
            </button>
          )}
        </div>
      </nav>

      <div className="space-y-10">
        {shelves.map(({ legend, videos: list }) => (
          <section key={legend.slug} id={shelfId(legend.slug)} className="scroll-mt-32">
            <div className="flex items-end justify-between gap-3 flex-wrap border-b pb-2 mb-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-primary">{legend.sport}</p>
                <h2 className="text-2xl font-bold">
                  <Link to={`${LEGENDS_BASE_PATH}/${legend.slug}`} className="hover:text-primary">
                    {legend.name}
                  </Link>
                  <span className="ml-2 text-base font-normal text-muted-foreground">
                    {list.length} {list.length === 1 ? 'video' : 'videos'}
                  </span>
                </h2>
              </div>
              <div className="flex items-center gap-4 text-sm google-anno-skip">
                {list.length > SHELF_SIZE && (
                  <Link
                    to={`${LEGENDS_BASE_PATH}/${legend.slug}`}
                    className="inline-flex items-center gap-1 font-medium hover:text-primary"
                  >
                    See all {list.length} <ChevronRight className="h-4 w-4" />
                  </Link>
                )}
                <a
                  href={getLegendProfileUrl(legend)}
                  target="_blank"
                  rel="noopener"
                  className="inline-flex items-center gap-1 font-medium text-primary hover:underline"
                >
                  View Timeline on Sports Begin End <ArrowUpRight className="h-4 w-4" />
                </a>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {list.slice(0, SHELF_SIZE).map(renderCard)}
            </div>
          </section>
        ))}

        {unassigned.length > 0 && (
          <section id="shelf-more-legends" className="scroll-mt-32">
            <div className="border-b pb-2 mb-4">
              <h2 className="text-2xl font-bold">More Legends Videos</h2>
              <p className="text-sm text-muted-foreground">Team films, classic games and moments.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {unassigned.map(renderCard)}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export const LegendTimelineBanner: React.FC<{ legend: Parameters<typeof getLegendProfileUrl>[0] }> = ({ legend }) => (
  <a
    href={getLegendProfileUrl(legend, 'legend_watchpage')}
    target="_blank"
    rel="noopener"
    className="google-anno-skip mb-6 flex items-center justify-between gap-3 rounded-lg border bg-card p-4 hover:bg-muted transition-colors"
  >
    <div>
      <p className="font-semibold">{legend.name}: from childhood to retirement</p>
      <p className="text-sm text-muted-foreground">
        See childhood photos, high school years and the full career timeline on Sports Begin End.
      </p>
    </div>
    <ArrowUpRight className="h-5 w-5 shrink-0 text-primary" />
  </a>
);
