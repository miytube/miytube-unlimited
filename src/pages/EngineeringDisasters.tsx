import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { Wrench, Building, Zap, FlaskConical, ChevronRight, Upload, Play, Eye, Clock } from 'lucide-react';
import { VideoCard } from '@/components/VideoCard';
import { Pagination } from '@/components/Pagination';
import { useUploadedVideos } from '@/context/UploadedVideosContext';
import { filterVideosByCategory } from '@/utils/videoFiltering';
import { engineeringDisastersCaseStudies } from '@/data/engineeringDisastersCaseStudies';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const EngineeringDisasters = () => {
  const { uploadedVideos } = useUploadedVideos();
  const [currentPage, setCurrentPage] = useState(1);
  const videosPerPage = 20;

  const subcategories = [
    { name: 'Civil', path: '/engineering-disasters/civil', icon: Building, description: 'Bridge collapses, building failures, dam breaks' },
    { name: 'Mechanical', path: '/engineering-disasters/mechanical', icon: Wrench, description: 'Machine failures, vehicle crashes' },
    { name: 'Electrical', path: '/engineering-disasters/electrical', icon: Zap, description: 'Power grid failures, electrical fires' },
    { name: 'Chemical', path: '/engineering-disasters/chemical', icon: FlaskConical, description: 'Chemical spills, plant explosions' },
  ];

  const filteredVideos = filterVideosByCategory(uploadedVideos, 'engineering disasters');
  const totalPages = Math.ceil(filteredVideos.length / videosPerPage);
  const startIndex = (currentPage - 1) * videosPerPage;
  const displayedVideos = filteredVideos.slice(startIndex, startIndex + videosPerPage);

  const formatViews = (views: number) => {
    if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M`;
    if (views >= 1000) return `${(views / 1000).toFixed(0)}K`;
    return views.toString();
  };

  return (
    <Layout>
      <div className="flex items-center gap-2 mb-4 text-sm text-muted-foreground">
        <span className="font-semibold text-primary">MiyTube</span>
        <ChevronRight size={14} />
        <span className="text-foreground">Engineering Disasters</span>
      </div>

      <div className="flex items-center justify-between gap-3 mb-8">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-3">
            <Wrench className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">Engineering Disasters</h1>
          </div>
          <p className="text-muted-foreground">
            Structural failures, industrial accidents, and engineering catastrophes
          </p>
        </div>
        <Link 
          to="/upload" 
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-colors"
        >
          <Upload size={18} />
          <span>Upload Content</span>
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {subcategories.map((sub) => (
          <Link
            key={sub.path}
            to={sub.path}
            className="p-4 rounded-lg border border-border bg-card hover:bg-accent transition-colors"
          >
            <sub.icon className="h-6 w-6 text-primary mb-2" />
            <h3 className="font-semibold">{sub.name}</h3>
            <p className="text-sm text-muted-foreground">{sub.description}</p>
          </Link>
        ))}
      </div>

      {/* User Uploaded Videos */}
      {displayedVideos.length > 0 && (
        <>
          <h2 className="text-2xl font-bold mb-4">Uploaded Videos</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
            {displayedVideos.map((video) => (
              <VideoCard
                key={video.id}
                id={video.id}
                title={video.title}
                thumbnail={video.thumbnail || '/placeholder.svg'}
                channelName="MiyTube User"
                views={video.views || '0'}
                timestamp={video.timestamp || ''}
                duration={video.duration || ''}
              />
            ))}
          </div>
          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          )}
        </>
      )}

      {/* Famous Case Studies */}
      <h2 className="text-2xl font-bold mb-4">Famous Case Studies</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {engineeringDisastersCaseStudies.map((video) => (
          <Card key={video.id} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group">
            <div className="relative aspect-video">
              <img
                src={video.thumbnailUrl}
                alt={video.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Play className="h-12 w-12 text-white" />
              </div>
              <Badge className="absolute bottom-2 right-2 bg-black/80 text-white">
                <Clock className="h-3 w-3 mr-1" />
                {video.duration}
              </Badge>
            </div>
            <CardContent className="p-3">
              <h3 className="font-medium line-clamp-2 mb-1">{video.title}</h3>
              <p className="text-sm text-muted-foreground line-clamp-2 mb-2">{video.description}</p>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <Badge variant="outline" className="capitalize">{video.subcategory}</Badge>
                <span className="flex items-center gap-1">
                  <Eye className="h-3 w-3" />
                  {formatViews(video.views)}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </Layout>
  );
};

export default EngineeringDisasters;
