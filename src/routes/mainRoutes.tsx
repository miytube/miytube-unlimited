
import { Route } from "react-router-dom";
import Index from "@/pages/Index";
import Watch from "@/pages/Watch";
import Search from "@/pages/Search";
import NotFound from "@/pages/NotFound";
import Monetization from "@/pages/Monetization";
import Advertising from "@/pages/Advertising";
import Channel from "@/pages/Channel";
import About from "@/pages/About";
import Copyright from "@/pages/Copyright";
import Contact from "@/pages/Contact";
import Terms from "@/pages/Terms";
import Privacy from "@/pages/Privacy";
import Upload from "@/pages/Upload";
import VideoUpload from "@/pages/VideoUpload";
import Trending from "@/pages/Trending";

export const mainRoutes = [
  /* Main Routes */
  <Route key="home" path="/" element={<Index />} />,
  <Route key="watch" path="/watch" element={<Watch />} />,
  <Route key="search" path="/search" element={<Search />} />,
  <Route key="monetization" path="/monetization" element={<Monetization />} />,
  <Route key="advertising" path="/advertising" element={<Advertising />} />,
  <Route key="channel" path="/channel" element={<Channel />} />,
  <Route key="trending" path="/trending" element={<Trending />} />,
  
  /* Upload Routes */
  <Route key="upload-video" path="/upload/video" element={<VideoUpload />} />,
  <Route key="upload" path="/upload" element={<Upload />} />,
  
  /* Information Pages */
  <Route key="about" path="/about" element={<About />} />,
  <Route key="copyright" path="/copyright" element={<Copyright />} />,
  <Route key="contact" path="/contact" element={<Contact />} />,
  <Route key="terms" path="/terms" element={<Terms />} />,
  <Route key="privacy" path="/privacy" element={<Privacy />} />,
  
  /* Catch-all Route */
  <Route key="not-found" path="*" element={<NotFound />} />,
];
