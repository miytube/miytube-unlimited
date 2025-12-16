
import React from 'react';
import { Route } from "react-router-dom";
import GenericSubcategoryPage from "@/pages/categories/GenericSubcategoryPage";

export const sidebarSubcategoryRoutes = [
  // Videos subcategories
  <Route key="videos-latest" path="/videos/latest" element={<GenericSubcategoryPage />} />,
  <Route key="videos-featured" path="/videos/featured" element={<GenericSubcategoryPage />} />,
  <Route key="videos-most-viewed" path="/videos/most-viewed" element={<GenericSubcategoryPage />} />,
  
  // Comedy subcategories (new)
  <Route key="comedy-sketches" path="/comedy/sketches" element={<GenericSubcategoryPage />} />,
  <Route key="comedy-improv" path="/comedy/improv" element={<GenericSubcategoryPage />} />,
  <Route key="comedy-parody" path="/comedy/parody" element={<GenericSubcategoryPage />} />,
  
  // Gaming subcategories
  <Route key="gaming-action" path="/gaming/action" element={<GenericSubcategoryPage />} />,
  <Route key="gaming-rpg" path="/gaming/rpg" element={<GenericSubcategoryPage />} />,
  <Route key="gaming-sports" path="/gaming/sports" element={<GenericSubcategoryPage />} />,
  <Route key="gaming-streaming" path="/gaming/streaming" element={<GenericSubcategoryPage />} />,
  <Route key="gaming-reviews" path="/gaming/reviews" element={<GenericSubcategoryPage />} />,
  
  // Podcasts subcategories
  <Route key="podcasts-news" path="/podcasts/news" element={<GenericSubcategoryPage />} />,
  <Route key="podcasts-comedy" path="/podcasts/comedy" element={<GenericSubcategoryPage />} />,
  <Route key="podcasts-interview" path="/podcasts/interview" element={<GenericSubcategoryPage />} />,
  <Route key="podcasts-educational" path="/podcasts/educational" element={<GenericSubcategoryPage />} />,
  
  // Audiobooks subcategories
  <Route key="audiobooks-fiction" path="/audiobooks/fiction" element={<GenericSubcategoryPage />} />,
  <Route key="audiobooks-nonfiction" path="/audiobooks/nonfiction" element={<GenericSubcategoryPage />} />,
  <Route key="audiobooks-self-help" path="/audiobooks/self-help" element={<GenericSubcategoryPage />} />,
  <Route key="audiobooks-mystery" path="/audiobooks/mystery" element={<GenericSubcategoryPage />} />,
  
  // Music subcategories
  <Route key="music-lyrics" path="/music/lyrics" element={<GenericSubcategoryPage />} />,
  
  // Meditation subcategories
  <Route key="meditation-guided" path="/meditation/guided" element={<GenericSubcategoryPage />} />,
  <Route key="meditation-sleep" path="/meditation/sleep" element={<GenericSubcategoryPage />} />,
  
  // Quotes & Poems subcategories
  <Route key="quotes-inspirational" path="/quotes-poems/inspirational" element={<GenericSubcategoryPage />} />,
  <Route key="quotes-love" path="/quotes-poems/love" element={<GenericSubcategoryPage />} />,
  <Route key="poems-classic" path="/quotes-poems/classic" element={<GenericSubcategoryPage />} />,
  <Route key="poems-modern" path="/quotes-poems/modern" element={<GenericSubcategoryPage />} />,
  
  // Education subcategories
  <Route key="education-learn" path="/education/learn" element={<GenericSubcategoryPage />} />,
  
  // How-to & Style subcategories
  <Route key="howto-diy" path="/how-to-style/diy" element={<GenericSubcategoryPage />} />,
  <Route key="howto-fashion" path="/how-to-style/fashion" element={<GenericSubcategoryPage />} />,
  <Route key="howto-beauty" path="/how-to-style/beauty" element={<GenericSubcategoryPage />} />,
  <Route key="howto-home" path="/how-to-style/home" element={<GenericSubcategoryPage />} />,
  
  // News & Politics subcategories
  <Route key="news-breaking" path="/news/breaking" element={<GenericSubcategoryPage />} />,
  <Route key="news-politics" path="/news/politics" element={<GenericSubcategoryPage />} />,
  <Route key="news-world" path="/news/world" element={<GenericSubcategoryPage />} />,
  <Route key="news-local" path="/news/local" element={<GenericSubcategoryPage />} />,
  
  // People & Blogs subcategories
  <Route key="people-vlogs" path="/people-blogs/vlogs" element={<GenericSubcategoryPage />} />,
  <Route key="people-lifestyle" path="/people-blogs/lifestyle" element={<GenericSubcategoryPage />} />,
  <Route key="people-family" path="/people-blogs/family" element={<GenericSubcategoryPage />} />,
  <Route key="people-daily" path="/people-blogs/daily" element={<GenericSubcategoryPage />} />,
  
  // Relationships subcategories
  <Route key="relationships-dating" path="/relationships/dating" element={<GenericSubcategoryPage />} />,
  <Route key="relationships-love" path="/relationships/love" element={<GenericSubcategoryPage />} />,
  <Route key="relationships-marriage" path="/relationships/marriage" element={<GenericSubcategoryPage />} />,
  <Route key="relationships-divorce" path="/relationships/divorce" element={<GenericSubcategoryPage />} />,
  <Route key="relationships-breakups" path="/relationships/breakups" element={<GenericSubcategoryPage />} />,
  <Route key="relationships-attraction" path="/relationships/attraction" element={<GenericSubcategoryPage />} />,
  <Route key="relationships-single" path="/relationships/single" element={<GenericSubcategoryPage />} />,
  <Route key="relationships-intimacy" path="/relationships/intimacy" element={<GenericSubcategoryPage />} />,
  <Route key="relationships-long-distance" path="/relationships/long-distance" element={<GenericSubcategoryPage />} />,
  <Route key="relationships-communication" path="/relationships/communication" element={<GenericSubcategoryPage />} />,
  <Route key="relationships-family-dynamics" path="/relationships/family-dynamics" element={<GenericSubcategoryPage />} />,
  <Route key="relationships-trust" path="/relationships/trust" element={<GenericSubcategoryPage />} />,
  <Route key="relationships-conflict" path="/relationships/conflict" element={<GenericSubcategoryPage />} />,
  
  // Nonprofits subcategories
  <Route key="nonprofits-charity" path="/nonprofits/charity" element={<GenericSubcategoryPage />} />,
  <Route key="nonprofits-volunteer" path="/nonprofits/volunteer" element={<GenericSubcategoryPage />} />,
  <Route key="nonprofits-fundraising" path="/nonprofits/fundraising" element={<GenericSubcategoryPage />} />,
  <Route key="nonprofits-awareness" path="/nonprofits/awareness" element={<GenericSubcategoryPage />} />,
  
  // Models subcategories
  <Route key="models-fashion" path="/models/fashion" element={<GenericSubcategoryPage />} />,
  <Route key="models-runway" path="/models/runway" element={<GenericSubcategoryPage />} />,
  <Route key="models-photoshoots" path="/models/photoshoots" element={<GenericSubcategoryPage />} />,
  <Route key="models-interviews" path="/models/interviews" element={<GenericSubcategoryPage />} />,
  
  // Airports subcategories
  <Route key="airports-security" path="/airports/security" element={<GenericSubcategoryPage />} />,
  <Route key="airports-lounges" path="/airports/lounges" element={<GenericSubcategoryPage />} />,
  
  // Restaurants subcategories
  <Route key="restaurants-fine-dining" path="/restaurants/fine-dining" element={<GenericSubcategoryPage />} />,
  <Route key="restaurants-fast-food" path="/restaurants/fast-food" element={<GenericSubcategoryPage />} />,
  <Route key="restaurants-reviews" path="/restaurants/reviews" element={<GenericSubcategoryPage />} />,
  <Route key="restaurants-celebrity-chefs" path="/restaurants/celebrity-chefs" element={<GenericSubcategoryPage />} />,
  
  // Foods subcategories
  <Route key="foods-recipes" path="/foods/recipes" element={<GenericSubcategoryPage />} />,
  <Route key="foods-cooking" path="/foods/cooking" element={<GenericSubcategoryPage />} />,
  <Route key="foods-baking" path="/foods/baking" element={<GenericSubcategoryPage />} />,
  <Route key="foods-street" path="/foods/street" element={<GenericSubcategoryPage />} />,
  
  // Beaches subcategories
  <Route key="beaches-tropical" path="/beaches/tropical" element={<GenericSubcategoryPage />} />,
  <Route key="beaches-surfing" path="/beaches/surfing" element={<GenericSubcategoryPage />} />,
  <Route key="beaches-resorts" path="/beaches/resorts" element={<GenericSubcategoryPage />} />,
  
  // Weather subcategories
  <Route key="weather-forecast" path="/weather/forecast" element={<GenericSubcategoryPage />} />,
  <Route key="weather-storms" path="/weather/storms" element={<GenericSubcategoryPage />} />,
  <Route key="weather-climate" path="/weather/climate" element={<GenericSubcategoryPage />} />,
  <Route key="weather-extreme" path="/weather/extreme" element={<GenericSubcategoryPage />} />,
  
  // Disasters subcategories (new)
  <Route key="disasters-floods" path="/disasters/floods" element={<GenericSubcategoryPage />} />,
  <Route key="disasters-landslides" path="/disasters/landslides" element={<GenericSubcategoryPage />} />,
  <Route key="disasters-tsunami" path="/disasters/tsunami" element={<GenericSubcategoryPage />} />,
  
  // Oceans subcategories
  <Route key="oceans-marine-life" path="/oceans/marine-life" element={<GenericSubcategoryPage />} />,
  <Route key="oceans-deep-sea" path="/oceans/deep-sea" element={<GenericSubcategoryPage />} />,
  <Route key="oceans-coral-reefs" path="/oceans/coral-reefs" element={<GenericSubcategoryPage />} />,
  <Route key="oceans-exploration" path="/oceans/exploration" element={<GenericSubcategoryPage />} />,
  
  // Boats subcategories (new)
  <Route key="boats-sailboats" path="/boats/sailboats" element={<GenericSubcategoryPage />} />,
  <Route key="boats-speedboats" path="/boats/speedboats" element={<GenericSubcategoryPage />} />,
  
  // Shipping Ports subcategories
  <Route key="shipping-ports-cargo" path="/shipping-ports/cargo" element={<GenericSubcategoryPage />} />,
  <Route key="shipping-ports-cruise" path="/shipping-ports/cruise" element={<GenericSubcategoryPage />} />,
  <Route key="shipping-ports-history" path="/shipping-ports/history" element={<GenericSubcategoryPage />} />,
  
  // Documents subcategories
  <Route key="documents-templates" path="/documents/templates" element={<GenericSubcategoryPage />} />,
  <Route key="documents-forms" path="/documents/forms" element={<GenericSubcategoryPage />} />,
  <Route key="documents-guides" path="/documents/guides" element={<GenericSubcategoryPage />} />,
  <Route key="documents-reports" path="/documents/reports" element={<GenericSubcategoryPage />} />,
  
  // Blog subcategories
  <Route key="blog-latest" path="/blog/latest" element={<GenericSubcategoryPage />} />,
  <Route key="blog-featured" path="/blog/featured" element={<GenericSubcategoryPage />} />,
  
  // Trains subcategories
  <Route key="trains" path="/trains" element={<GenericSubcategoryPage />} />,
  <Route key="trains-railroad" path="/trains/railroad" element={<GenericSubcategoryPage />} />,
  <Route key="trains-railway" path="/trains/railway" element={<GenericSubcategoryPage />} />,
  <Route key="trains-steam" path="/trains/steam" element={<GenericSubcategoryPage />} />,
  <Route key="trains-freight" path="/trains/freight" element={<GenericSubcategoryPage />} />,
  <Route key="trains-passenger" path="/trains/passenger" element={<GenericSubcategoryPage />} />,
  <Route key="trains-crashes" path="/trains/crashes" element={<GenericSubcategoryPage />} />,
  <Route key="trains-commercial" path="/trains/commercial" element={<GenericSubcategoryPage />} />,
  <Route key="trains-riders" path="/trains/riders" element={<GenericSubcategoryPage />} />,
  
  // Swimming subcategories
  <Route key="swim" path="/swim" element={<GenericSubcategoryPage />} />,
  <Route key="swim-diving" path="/swim/diving" element={<GenericSubcategoryPage />} />,
  <Route key="swim-plunge" path="/swim/plunge" element={<GenericSubcategoryPage />} />,
  <Route key="swim-plummet" path="/swim/plummet" element={<GenericSubcategoryPage />} />,
  <Route key="swim-jump" path="/swim/jump" element={<GenericSubcategoryPage />} />,
  <Route key="swim-freestyle" path="/swim/freestyle" element={<GenericSubcategoryPage />} />,
  
  // Floods subcategories
  <Route key="floods" path="/floods" element={<GenericSubcategoryPage />} />,
  <Route key="floods-flash-flood" path="/floods/flash-flood" element={<GenericSubcategoryPage />} />,
  <Route key="floods-deluge" path="/floods/deluge" element={<GenericSubcategoryPage />} />,
  <Route key="floods-downpour" path="/floods/downpour" element={<GenericSubcategoryPage />} />,
  <Route key="floods-drown" path="/floods/drown" element={<GenericSubcategoryPage />} />,
  <Route key="floods-engulf" path="/floods/engulf" element={<GenericSubcategoryPage />} />,
  <Route key="floods-stream" path="/floods/stream" element={<GenericSubcategoryPage />} />,
  
  // Film Horror subcategories
  <Route key="film-horror" path="/film/horror" element={<GenericSubcategoryPage />} />,
  <Route key="film-horror-terror" path="/film/horror/terror" element={<GenericSubcategoryPage />} />,
  <Route key="film-horror-fear" path="/film/horror/fear" element={<GenericSubcategoryPage />} />,
  <Route key="film-horror-fright" path="/film/horror/fright" element={<GenericSubcategoryPage />} />,
  <Route key="film-horror-dread" path="/film/horror/dread" element={<GenericSubcategoryPage />} />,
  <Route key="film-horror-slasher" path="/film/horror/slasher" element={<GenericSubcategoryPage />} />,
  
  // Racing Track subcategories
  <Route key="racing-track" path="/racing-track" element={<GenericSubcategoryPage />} />,
  <Route key="racing-track-accidents" path="/racing-track/accidents" element={<GenericSubcategoryPage />} />,
  <Route key="racing-track-crashes" path="/racing-track/crashes" element={<GenericSubcategoryPage />} />,
  
  // Crime subcategories
  <Route key="crime-shootouts" path="/crime/shootouts" element={<GenericSubcategoryPage />} />,
  <Route key="crime-gangs" path="/crime/gangs" element={<GenericSubcategoryPage />} />,
  <Route key="crime-fraud" path="/crime/fraud" element={<GenericSubcategoryPage />} />,
  <Route key="crime-works" path="/crime/works" element={<GenericSubcategoryPage />} />,
  <Route key="crime-enterprises" path="/crime/enterprises" element={<GenericSubcategoryPage />} />,
  <Route key="crime-gangsters" path="/crime/gangsters" element={<GenericSubcategoryPage />} />,
  
  // People subcategories
  <Route key="people-kindness" path="/people/kindness" element={<GenericSubcategoryPage />} />,
  <Route key="people-giving" path="/people/giving" element={<GenericSubcategoryPage />} />,
  <Route key="people-help" path="/people/help" element={<GenericSubcategoryPage />} />,
  
  // Real Estate subcategories
  <Route key="real-estate-residential" path="/real-estate/residential" element={<GenericSubcategoryPage />} />,
  <Route key="real-estate-commercial" path="/real-estate/commercial" element={<GenericSubcategoryPage />} />,
  <Route key="real-estate-luxury" path="/real-estate/luxury" element={<GenericSubcategoryPage />} />,
  <Route key="real-estate-mistakes" path="/real-estate/mistakes" element={<GenericSubcategoryPage />} />,
  <Route key="real-estate-fails" path="/real-estate/fails" element={<GenericSubcategoryPage />} />,
];
