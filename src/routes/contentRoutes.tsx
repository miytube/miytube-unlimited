
import { Route } from "react-router-dom";
import Music from "@/pages/Music";
import MusicUpload from "@/pages/MusicUpload";
import Sports from "@/pages/Sports";
import Gaming from "@/pages/Gaming";
import Podcasts from "@/pages/Podcasts";
import Audiobooks from "@/pages/Audiobooks";
import Meditation from "@/pages/Meditation";
import Educational from "@/pages/Educational";
import NatureSounds from "@/pages/NatureSounds";
import Comedy from "@/pages/Comedy";
import NewsAndPolitics from "@/pages/NewsAndPolitics";
import Weather from "@/pages/Weather";
import Oceans from "@/pages/Oceans";
import Disasters from "@/pages/Disasters";

export const contentRoutes = [
  /* Content Category Routes */
  <Route key="music" path="/music" element={<Music />} />,
  <Route key="music-category" path="/music/:category" element={<Music />} />,
  <Route key="music-upload" path="/upload/music" element={<MusicUpload />} />,
  <Route key="sports" path="/sports" element={<Sports />} />,
  <Route key="sports-category" path="/sports/:category" element={<Sports />} />,
  <Route key="gaming" path="/gaming" element={<Gaming />} />,
  <Route key="gaming-category" path="/gaming/:category" element={<Gaming />} />,
  <Route key="podcasts" path="/podcasts" element={<Podcasts />} />,
  <Route key="podcasts-category" path="/podcasts/:category" element={<Podcasts />} />,
  <Route key="audiobooks" path="/audiobooks" element={<Audiobooks />} />,
  <Route key="audiobooks-category" path="/audiobooks/:category" element={<Audiobooks />} />,
  <Route key="meditation" path="/meditation" element={<Meditation />} />,
  <Route key="meditation-category" path="/meditation/:category" element={<Meditation />} />,
  <Route key="educational" path="/educational" element={<Educational />} />,
  <Route key="educational-category" path="/educational/:category" element={<Educational />} />,
  <Route key="nature-sounds" path="/nature-sounds" element={<NatureSounds />} />,
  <Route key="nature-sounds-category" path="/nature-sounds/:category" element={<NatureSounds />} />,
  <Route key="comedy" path="/comedy" element={<Comedy />} />,
  <Route key="comedy-category" path="/comedy/:category" element={<Comedy />} />,
  <Route key="news" path="/news" element={<NewsAndPolitics />} />,
  <Route key="news-category" path="/news/:category" element={<NewsAndPolitics />} />,
  <Route key="weather" path="/weather" element={<Weather />} />,
  <Route key="weather-category" path="/weather/:category" element={<Weather />} />,
  <Route key="oceans" path="/oceans" element={<Oceans />} />,
  <Route key="oceans-category" path="/oceans/:category" element={<Oceans />} />,
  <Route key="disasters" path="/disasters" element={<Disasters />} />,
  <Route key="disasters-category" path="/disasters/:category" element={<Disasters />} />,
];
