
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { UploadedVideosProvider } from "./context/UploadedVideosContext";
import Index from "./pages/Index";
import Watch from "./pages/Watch";
import Search from "./pages/Search";
import NotFound from "./pages/NotFound";
import Monetization from "./pages/Monetization";
import Advertising from "./pages/Advertising";
import Images from "./pages/Images";
import Audio from "./pages/Audio";
import Documents from "./pages/Documents";
import Blog from "./pages/Blog";
import LongVideos from "./pages/LongVideos";
import TalkAtCha from "./pages/TalkAtCha";
import Shorts from "./pages/Shorts";
import VideoUpload from "./pages/VideoUpload";
import Upload from "./pages/Upload"; 
import Videos from "./pages/Videos";
import Music from "./pages/Music";
import MusicUpload from "./pages/MusicUpload";
import Sports from "./pages/Sports";
import Gaming from "./pages/Gaming";
// Import new pages
import Podcasts from "./pages/Podcasts";
import Audiobooks from "./pages/Audiobooks";
import Meditation from "./pages/Meditation";
import Educational from "./pages/Educational";
import NatureSounds from "./pages/NatureSounds";
import Comedy from "./pages/Comedy";
import NewsAndPolitics from "./pages/NewsAndPolitics";
import Weather from "./pages/Weather";
import Oceans from "./pages/Oceans";
import Disasters from "./pages/Disasters";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <UploadedVideosProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/watch" element={<Watch />} />
            <Route path="/search" element={<Search />} />
            <Route path="/monetization" element={<Monetization />} />
            <Route path="/advertising" element={<Advertising />} />
            <Route path="/images" element={<Images />} />
            <Route path="/audio" element={<Audio />} />
            <Route path="/documents" element={<Documents />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/long-videos" element={<LongVideos />} />
            <Route path="/talk-at-cha" element={<TalkAtCha />} />
            <Route path="/shorts" element={<Shorts />} />
            <Route path="/shorts/:id" element={<Shorts />} />
            <Route path="/upload/video" element={<VideoUpload />} />
            <Route path="/upload" element={<Upload />} />
            <Route path="/upload/music" element={<MusicUpload />} />
            <Route path="/videos" element={<Videos />} />
            <Route path="/videos/:category" element={<Videos />} />
            <Route path="/music" element={<Music />} />
            <Route path="/music/:category" element={<Music />} />
            <Route path="/sports" element={<Sports />} />
            <Route path="/sports/:category" element={<Sports />} />
            <Route path="/gaming" element={<Gaming />} />
            <Route path="/gaming/:category" element={<Gaming />} />
            
            {/* New routes for the newly created pages */}
            <Route path="/podcasts" element={<Podcasts />} />
            <Route path="/podcasts/:category" element={<Podcasts />} />
            <Route path="/audiobooks" element={<Audiobooks />} />
            <Route path="/audiobooks/:category" element={<Audiobooks />} />
            <Route path="/meditation" element={<Meditation />} />
            <Route path="/meditation/:category" element={<Meditation />} />
            <Route path="/educational" element={<Educational />} />
            <Route path="/educational/:category" element={<Educational />} />
            <Route path="/nature-sounds" element={<NatureSounds />} />
            <Route path="/nature-sounds/:category" element={<NatureSounds />} />
            <Route path="/comedy" element={<Comedy />} />
            <Route path="/comedy/:category" element={<Comedy />} />
            <Route path="/news" element={<NewsAndPolitics />} />
            <Route path="/news/:category" element={<NewsAndPolitics />} />
            <Route path="/weather" element={<Weather />} />
            <Route path="/weather/:category" element={<Weather />} />
            <Route path="/oceans" element={<Oceans />} />
            <Route path="/oceans/:category" element={<Oceans />} />
            <Route path="/disasters" element={<Disasters />} />
            <Route path="/disasters/:category" element={<Disasters />} />
            
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </UploadedVideosProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
