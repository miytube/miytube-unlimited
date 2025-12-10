import { Layout } from "@/components/Layout";
import { Train, Upload } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useUploadedVideos } from "@/context/UploadedVideosContext";
import { filterVideosByCategory } from "@/utils/videoFiltering";
import { VideoCard } from "@/components/VideoCard";
import { VideoGridSkeleton } from "@/components/skeletons";

const subcategories = [
  { id: 'railroad', name: 'Railroad', path: '/trains/railroad', description: 'Railroad trains and track footage' },
  { id: 'railway', name: 'Railway', path: '/trains/railway', description: 'Railway systems and train journeys' },
  { id: 'steam', name: 'Steam Trains', path: '/trains/steam', description: 'Classic steam locomotive footage and history' },
  { id: 'freight', name: 'Freight Trains', path: '/trains/freight', description: 'Cargo and freight train operations' },
  { id: 'passenger', name: 'Passenger Trains', path: '/trains/passenger', description: 'Passenger rail and commuter trains' },
];

const Trains = () => {
  const { uploadedVideos, isLoading } = useUploadedVideos();
  const trainVideos = filterVideosByCategory(uploadedVideos, 'trains');

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Train className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold">Trains</h1>
              <p className="text-muted-foreground">Railroad and railway train videos</p>
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
                    <Train className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold">{sub.name}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">{sub.description}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Train Videos</h2>
          {isLoading ? (
            <VideoGridSkeleton count={8} />
          ) : trainVideos.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {trainVideos.slice(0, 20).map((video) => (
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
          ) : (
            <div className="text-center py-12 bg-muted/30 rounded-lg">
              <Train className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-4">No train videos yet</p>
              <Link to="/upload">
                <Button variant="outline">Upload Train Video</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Trains;
