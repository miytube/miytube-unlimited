
import { Route } from "react-router-dom";
import Music from "@/pages/Music";
import MusicGenre from "@/pages/MusicGenre";
import MusicUpload from "@/pages/MusicUpload";
import MusicMeditation from "@/pages/MusicMeditation";

// All music genre routes
const musicGenres = [
  'lyrics', 'mandarin', 'mandarin-lyrics', 'christmas', 'christmas-lyrics',
  'blues', 'classical', 'country', 'folk', 'funk-rock', 'alternative',
  'rock-soul-pop', 'funk-hiphop-rap', 'history', 'heavy-metal', 'mexican-spanish',
  'soundtracks', 'parody', 'pop', 'rap-reggaeton', 'relaxation', 'salsa',
  'soul-train', 'garage', 'artists-interviews', 'artists-news', 'challenges',
  'christian', 'r-and-b'
];

export const musicRoutes = [
  <Route key="music-main" path="/music" element={<Music />} />,
  <Route key="music-upload" path="/upload/music" element={<MusicUpload />} />,
  <Route key="musical-instruments" path="/musical-instruments" element={<MusicGenre />} />,
  <Route key="music-meditation" path="/music-meditation" element={<MusicMeditation />} />,
  <Route key="muiscmeditation" path="/muiscmeditation" element={<MusicMeditation />} />,
  ...musicGenres.map(genre => (
    <Route key={`music-${genre}`} path={`/music/${genre}`} element={<MusicGenre />} />
  )),
];
