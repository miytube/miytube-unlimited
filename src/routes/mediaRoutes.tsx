
import { Route } from "react-router-dom";
import Images from "@/pages/Images";
import Audio from "@/pages/Audio";
import Documents from "@/pages/Documents";
import Blog from "@/pages/Blog";
import LongVideos from "@/pages/LongVideos";
import TalkAtCha from "@/pages/TalkAtCha";
import Shorts from "@/pages/Shorts";
import ShortsWatch from "@/pages/ShortsWatch";
import Videos from "@/pages/Videos";

export const mediaRoutes = [
  /* Media Type Routes */
  <Route key="images" path="/images" element={<Images />} />,
  <Route key="audio" path="/audio" element={<Audio />} />,
  <Route key="documents" path="/documents" element={<Documents />} />,
  <Route key="blog" path="/blog" element={<Blog />} />,
  <Route key="long-videos" path="/long-videos" element={<LongVideos />} />,
  <Route key="talk-at-cha" path="/talk-at-cha" element={<TalkAtCha />} />,
  
  /* Video Routes */
  <Route key="shorts" path="/shorts" element={<Shorts />} />,
  <Route key="shorts-id" path="/shorts/:id" element={<ShortsWatch />} />,
  <Route key="videos" path="/videos" element={<Videos />} />,
  <Route key="videos-category" path="/videos/:category" element={<Videos />} />,
];
