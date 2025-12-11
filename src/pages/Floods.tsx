import { useState } from "react";
import { Layout } from "@/components/Layout";
import { Droplets, Upload } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useUploadedVideos } from "@/context/UploadedVideosContext";
import { filterVideosByCategory } from "@/utils/videoFiltering";
import { VideoCard } from "@/components/VideoCard";
import { VideoGridSkeleton } from "@/components/skeletons";
import { Pagination, PageInfo } from "@/components/Pagination";

const subcategories = [
  { id: 'flash-flood', name: 'Flash Floods', path: '/floods/flash-flood', description: 'Flash flood events and sudden water surges' },
  { id: 'deluge', name: 'Deluge', path: '/floods/deluge', description: 'Major flooding and water deluge events' },
  { id: 'downpour', name: 'Downpour', path: '/floods/downpour', description: 'Heavy rain and downpour causing floods' },
  { id: 'drown', name: 'Drowning Hazards', path: '/floods/drown', description: 'Water safety and drowning awareness' },
  { id: 'engulf', name: 'Engulfing Waters', path: '/floods/engulf', description: 'Rising waters and engulfing flood footage' },
  { id: 'stream', name: 'Stream Flooding', path: '/floods/stream', description: 'Stream and river overflow events' },
];

const VIDEOS_PER_PAGE = 20;

const Floods = () => {
  const { uploadedVideos, isLoading } = useUploadedVideos();
  const [currentPage, setCurrentPage] = useState(1);
  
  const floodVideos = filterVideosByCategory(uploadedVideos, 'floods');
  const totalPages = Math.ceil(floodVideos.length / VIDEOS_PER_PAGE);
  const startIndex = (currentPage - 1) * VIDEOS_PER_PAGE;
  const displayVideos = floodVideos.slice(startIndex, startIndex + VIDEOS_PER_PAGE);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Droplets className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold">Floods</h1>
              <p className="text-muted-foreground">Flood events, disasters and water damage footage</p>
            </div>
          </div>
          <Link to="/upload">
            <Button>
              <Upload className="h-4 w-4 mr-2" />
              Upload
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {subcategories.map((sub) => (
            <Link key={sub.id} to={sub.path}>
              <Card className="hover:bg-accent transition-colors cursor-pointer h-full">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <Droplets className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold">{sub.name}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">{sub.description}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">Flood Videos</h2>
            {floodVideos.length > VIDEOS_PER_PAGE && (
              <PageInfo
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={floodVideos.length}
                itemLabel="videos"
              />
            )}
          </div>
          {isLoading ? (
            <VideoGridSkeleton count={8} />
          ) : displayVideos.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {displayVideos.map((video) => (
                  <VideoCard
                    key={video.id}
                    id={video.id}
                    title={video.title}
                    thumbnail={video.thumbnail || '/placeholder.svg'}
                    channelName="MiyTube"
                    views={`${video.views || 0} views`}
                    timestamp={video.timestamp || ''}
                    duration={video.duration || '0:00'}
                  />
                ))}
              </div>
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </>
          ) : (
            <div className="text-center py-12 bg-muted/30 rounded-lg">
              <Droplets className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-4">No flood videos yet</p>
              <Link to="/upload">
                <Button variant="outline">Upload Flood Video</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Floods;
