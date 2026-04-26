import { Route } from "react-router-dom";
import PodcastNews from "@/pages/podcasts/PodcastNews";
import PodcastGossip from "@/pages/podcasts/PodcastGossip";

export const podcastRoutes = [
  <Route key="podcasts-news" path="/podcasts/news" element={<PodcastNews />} />,
  <Route key="podcasts-gossip" path="/podcasts/gossip" element={<PodcastGossip />} />,
];
