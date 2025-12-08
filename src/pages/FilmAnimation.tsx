
import React from 'react';
import { Layout } from '@/components/Layout';
import { Link } from 'react-router-dom';
import { 
  Film, Upload, ChevronDown, Heart, Sword, Laugh, Drama, Scale, 
  FlaskConical, Flame, Skull, Castle, Compass, Clapperboard, Bookmark, 
  Bomb, Music, Scissors, FileText, Popcorn
} from 'lucide-react';
import { useUploadedVideos } from '@/context/UploadedVideosContext';
import { VideoCard } from '@/components/VideoCard';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

const filmCategories = [
  { path: '/film/romance', label: 'Film (romance)', icon: Heart },
  { path: '/film/action-crime-thriller', label: 'Film (action, crime, thriller)', icon: Bomb },
  { path: '/film/action-thriller-adventure', label: 'Film (action, thriller, adventure)', icon: Sword },
  { path: '/film/adventure-fantasy', label: 'Film (adventure, fantasy, thriller)', icon: Castle },
  { path: '/film/comedy-drama-crime', label: 'Film (comedy, drama, crime)', icon: Bookmark },
  { path: '/film/comedy', label: 'Film (comedy)', icon: Laugh },
  { path: '/film/crime-drama-thriller', label: 'Film (crime, drama, thriller)', icon: Scale },
  { path: '/film/documentary-drama-crime', label: 'Film (documentary, drama, crime)', icon: Film },
  { path: '/film/drama', label: 'Film (drama)', icon: Drama },
  { path: '/film/gangsters-crime-drama', label: 'Film (gangsters, crime, drama)', icon: Skull },
  { path: '/film/mystery-fiction', label: 'Film (mystery, fiction, etc..)', icon: FlaskConical },
  { path: '/film/romance-comedy-drama', label: 'Film (romance, comedy, drama)', icon: Heart },
  { path: '/film/scientific', label: 'Film (scientific)', icon: FlaskConical },
  { path: '/film/war-action-thriller', label: 'Film (war films, action, thriller)', icon: Sword },
  { path: '/film/westerns-action-drama', label: 'Film (westerns, action, drama)', icon: Flame },
  { path: '/film/westerns-crime-thriller', label: 'Film (westerns, crime, thriller)', icon: Flame },
  { path: '/film/movies-action-thriller', label: 'Film, Movies (action, thriller)', icon: Bomb },
  { path: '/film/movies-clips', label: 'Film, Movies (clips)', icon: Scissors },
  { path: '/film/movies-created', label: 'Films, Movies (created, filmed)', icon: Clapperboard },
];

const animationCategories = [
  { path: '/film-animation/action', label: 'Film & Animation (action)', icon: Sword },
  { path: '/film-animation/movies', label: 'Film & Animation Movies', icon: Popcorn },
  { path: '/film-animation/fantasy-drama', label: 'Film Animation (fantasy, drama)', icon: Castle },
  { path: '/film-animation/adventure', label: 'Film Animation (adventure)', icon: Compass },
  { path: '/film-animation/cartoons', label: 'Film Animation (cartoons)', icon: Clapperboard },
  { path: '/film-animation/comedy-crime', label: 'Film Animation (comedy, crime)', icon: Bookmark },
  { path: '/film-animation/comedy', label: 'Film Animation (comedy)', icon: Laugh },
  { path: '/film-animation/drama', label: 'Film Animation (drama)', icon: Drama },
  { path: '/film-animation/musical-comedy', label: 'Film Animation (musical, comedy)', icon: Music },
  { path: '/film-animation/parody-comedy', label: 'Film Animation (parody, comedy)', icon: Laugh },
  { path: '/film-animation/short-film', label: 'Film Animation (short film)', icon: Film },
  { path: '/film-animation/clips-trailers', label: 'Film, Animation (clips, trailers)', icon: Scissors },
  { path: '/film-animation/horror', label: 'Film, Animation, Movies (horror)', icon: Skull },
];

const FilmAnimation: React.FC = () => {
  const { uploadedVideos } = useUploadedVideos();
  const [filmOpen, setFilmOpen] = React.useState(true);
  const [animationOpen, setAnimationOpen] = React.useState(true);

  // Filter videos for film & animation category
  const categoryVideos = uploadedVideos.filter(video => 
    video.category?.toLowerCase().includes('film') || 
    video.category?.toLowerCase().includes('animation') ||
    video.category?.toLowerCase().includes('movie')
  );

  return (
    <Layout>
      <div className="py-6 animate-fade-in w-full max-w-[1400px] mx-auto px-2 sm:px-4">
        <p className="text-sm text-muted-foreground mb-2">
          <span className="font-semibold text-primary">MiyTube</span> / Film & Animation
        </p>
        
        <div className="flex items-center gap-3 mb-8">
          <Film className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">Film & Animation</h1>
          <Link to="/upload" className="ml-auto flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-colors">
            <Upload size={18} />
            <span>Upload</span>
          </Link>
        </div>

        {/* Film & Movies Dropdown */}
        <div className="mb-6">
          <Collapsible open={filmOpen} onOpenChange={setFilmOpen}>
            <CollapsibleTrigger className="flex items-center justify-between w-full p-4 bg-card rounded-lg border hover:bg-accent transition-colors">
              <div className="flex items-center gap-3">
                <Film className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-semibold">Film & Movies</h2>
              </div>
              <ChevronDown className={`h-5 w-5 transition-transform ${filmOpen ? 'rotate-180' : ''}`} />
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 p-4 bg-card/50 rounded-b-lg border-x border-b">
                {filmCategories.map((category) => (
                  <Link
                    key={category.path}
                    to={category.path}
                    className="flex items-center gap-2 p-3 rounded-md hover:bg-accent transition-colors"
                  >
                    <category.icon className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{category.label}</span>
                  </Link>
                ))}
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>

        {/* Film Animation Dropdown */}
        <div className="mb-8">
          <Collapsible open={animationOpen} onOpenChange={setAnimationOpen}>
            <CollapsibleTrigger className="flex items-center justify-between w-full p-4 bg-card rounded-lg border hover:bg-accent transition-colors">
              <div className="flex items-center gap-3">
                <Clapperboard className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-semibold">Film Animation</h2>
              </div>
              <ChevronDown className={`h-5 w-5 transition-transform ${animationOpen ? 'rotate-180' : ''}`} />
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 p-4 bg-card/50 rounded-b-lg border-x border-b">
                {animationCategories.map((category) => (
                  <Link
                    key={category.path}
                    to={category.path}
                    className="flex items-center gap-2 p-3 rounded-md hover:bg-accent transition-colors"
                  >
                    <category.icon className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{category.label}</span>
                  </Link>
                ))}
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>

        {/* Videos Section */}
        {categoryVideos.length > 0 ? (
          <div className="mb-8">
            <h2 className="text-xl font-medium mb-4">Film & Animation Videos</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {[...categoryVideos].reverse().slice(0, 20).map((video) => (
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
          </div>
        ) : (
          <div className="text-center py-12 bg-card rounded-lg mb-8">
            <Film className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">No Film & Animation Videos Yet</h3>
            <p className="text-muted-foreground mb-4">Be the first to upload film and animation content!</p>
            <Link 
              to="/upload" 
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
            >
              <Upload size={18} />
              <span>Upload Film & Animation Content</span>
            </Link>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default FilmAnimation;
