
import { Route } from "react-router-dom";
import CategoryPage from "@/pages/CategoryPage";
import Videos from "@/pages/Videos";
import Audio from "@/pages/Audio";
import Documents from "@/pages/Documents";
import Comedy from "@/pages/Comedy";
import Educational from "@/pages/Educational";
import Music from "@/pages/Music";
import News from "@/pages/NewsAndPolitics";
import Podcasts from "@/pages/Podcasts";
import Shorts from "@/pages/Shorts";
import Sports from "@/pages/Sports";
import Weather from "@/pages/Weather";
import Disasters from "@/pages/Disasters";

export const categoryRoutes = [
  <Route key="videos" path="/videos" element={<Videos />} />,
  <Route key="videos-category" path="/videos/:category" element={<Videos />} />,
  <Route key="audio" path="/audio" element={<Audio />} />,
  <Route key="audio-category" path="/audio/:category" element={<Audio />} />,
  <Route key="documents" path="/documents" element={<Documents />} />,
  <Route key="comedy" path="/comedy" element={<Comedy />} />,
  <Route key="education" path="/education" element={<CategoryPage category="Education" icon="GraduationCap" />} />,
  <Route key="educational" path="/educational" element={<Educational />} />,
  <Route key="entertainment" path="/entertainment" element={<CategoryPage category="Entertainment" icon="Clapperboard" />} />,
  <Route key="experiments" path="/experiments" element={<CategoryPage category="Experiments" icon="FlaskConical" />} />,
  <Route key="extreme" path="/extreme" element={<CategoryPage category="Extreme Activities" icon="Mountain" />} />,
  <Route key="film" path="/film" element={<CategoryPage category="Film" icon="Film" />} />,
  <Route key="film-animation" path="/film-animation" element={<CategoryPage category="Film & Animation" icon="Clapperboard" />} />,
  <Route key="film-movies" path="/film-movies" element={<CategoryPage category="Film & Movies" icon="Film" />} />,
  <Route key="foods" path="/foods" element={<CategoryPage category="Foods" icon="Utensils" />} />,
  <Route key="fungi" path="/fungi" element={<CategoryPage category="Fungi" icon="Mountain" />} />,
  <Route key="funny" path="/funny" element={<CategoryPage category="Funny" icon="Laugh" />} />,
  <Route key="music" path="/music" element={<Music />} />,
  <Route key="news" path="/news" element={<News />} />,
  <Route key="podcasts" path="/podcasts" element={<Podcasts />} />,
  <Route key="shorts" path="/shorts" element={<Shorts />} />,
  <Route key="sports" path="/sports" element={<Sports />} />,
  <Route key="weather" path="/weather" element={<Weather />} />,
  <Route key="disasters" path="/disasters" element={<Disasters />} />,
  <Route key="courts" path="/courts" element={<CategoryPage category="Courts" icon="Gavel" />} />,
  <Route key="courts-police" path="/courts-police" element={<CategoryPage category="Courts & Police" icon="Gavel" />} />,
  <Route key="science-tech" path="/science-tech" element={<CategoryPage category="Science & Technology" icon="Microscope" />} />,
];
