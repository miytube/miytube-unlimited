
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
import Videos from "./pages/Videos";
import Music from "./pages/Music";
import Sports from "./pages/Sports";
import Gaming from "./pages/Gaming";

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
            <Route path="/upload/video" element={<VideoUpload />} />
            <Route path="/videos" element={<Videos />} />
            <Route path="/videos/:category" element={<Videos />} />
            <Route path="/music" element={<Music />} />
            <Route path="/music/:category" element={<Music />} />
            <Route path="/sports" element={<Sports />} />
            <Route path="/sports/:category" element={<Sports />} />
            <Route path="/gaming" element={<Gaming />} />
            <Route path="/gaming/:category" element={<Gaming />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </UploadedVideosProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
