
import { Route } from 'react-router-dom';
import FilmAnimation from '@/pages/FilmAnimation';
import GenericSubcategoryPage from '@/pages/categories/GenericSubcategoryPage';

export const filmRoutes = [
  // Main Film & Animation page
  <Route key="film-animation" path="/film-animation" element={<FilmAnimation />} />,
  
  // Film & Movies subcategories
  <Route key="film-romance" path="/film/romance" element={<GenericSubcategoryPage />} />,
  <Route key="film-action-crime-thriller" path="/film/action-crime-thriller" element={<GenericSubcategoryPage />} />,
  <Route key="film-action-thriller-adventure" path="/film/action-thriller-adventure" element={<GenericSubcategoryPage />} />,
  <Route key="film-adventure-fantasy" path="/film/adventure-fantasy" element={<GenericSubcategoryPage />} />,
  <Route key="film-comedy-drama-crime" path="/film/comedy-drama-crime" element={<GenericSubcategoryPage />} />,
  <Route key="film-comedy" path="/film/comedy" element={<GenericSubcategoryPage />} />,
  <Route key="film-crime-drama-thriller" path="/film/crime-drama-thriller" element={<GenericSubcategoryPage />} />,
  <Route key="film-documentary-drama-crime" path="/film/documentary-drama-crime" element={<GenericSubcategoryPage />} />,
  <Route key="film-drama" path="/film/drama" element={<GenericSubcategoryPage />} />,
  <Route key="film-gangsters-crime-drama" path="/film/gangsters-crime-drama" element={<GenericSubcategoryPage />} />,
  <Route key="film-mystery-fiction" path="/film/mystery-fiction" element={<GenericSubcategoryPage />} />,
  <Route key="film-romance-comedy-drama" path="/film/romance-comedy-drama" element={<GenericSubcategoryPage />} />,
  <Route key="film-scientific" path="/film/scientific" element={<GenericSubcategoryPage />} />,
  <Route key="film-war-action-thriller" path="/film/war-action-thriller" element={<GenericSubcategoryPage />} />,
  <Route key="film-westerns-action-drama" path="/film/westerns-action-drama" element={<GenericSubcategoryPage />} />,
  <Route key="film-westerns-crime-thriller" path="/film/westerns-crime-thriller" element={<GenericSubcategoryPage />} />,
  <Route key="film-westerns" path="/film/westerns" element={<GenericSubcategoryPage />} />,
  <Route key="film-movies-action-thriller" path="/film/movies-action-thriller" element={<GenericSubcategoryPage />} />,
  <Route key="film-movies-clips" path="/film/movies-clips" element={<GenericSubcategoryPage />} />,
  <Route key="film-movies-created" path="/film/movies-created" element={<GenericSubcategoryPage />} />,
  
  // Main Film page (redirect to film-animation)
  <Route key="film-main" path="/film" element={<FilmAnimation />} />,
  
  // Film Animation subcategories
  <Route key="film-animation-action" path="/film-animation/action" element={<GenericSubcategoryPage />} />,
  <Route key="film-animation-movies" path="/film-animation/movies" element={<GenericSubcategoryPage />} />,
  <Route key="film-animation-fantasy-drama" path="/film-animation/fantasy-drama" element={<GenericSubcategoryPage />} />,
  <Route key="film-animation-adventure" path="/film-animation/adventure" element={<GenericSubcategoryPage />} />,
  <Route key="film-animation-cartoons" path="/film-animation/cartoons" element={<GenericSubcategoryPage />} />,
  <Route key="film-animation-comedy-crime" path="/film-animation/comedy-crime" element={<GenericSubcategoryPage />} />,
  <Route key="film-animation-comedy" path="/film-animation/comedy" element={<GenericSubcategoryPage />} />,
  <Route key="film-animation-drama" path="/film-animation/drama" element={<GenericSubcategoryPage />} />,
  <Route key="film-animation-musical-comedy" path="/film-animation/musical-comedy" element={<GenericSubcategoryPage />} />,
  <Route key="film-animation-parody-comedy" path="/film-animation/parody-comedy" element={<GenericSubcategoryPage />} />,
  <Route key="film-animation-short-film" path="/film-animation/short-film" element={<GenericSubcategoryPage />} />,
  <Route key="film-animation-clips-trailers" path="/film-animation/clips-trailers" element={<GenericSubcategoryPage />} />,
  <Route key="film-animation-horror" path="/film-animation/horror" element={<GenericSubcategoryPage />} />,
];
