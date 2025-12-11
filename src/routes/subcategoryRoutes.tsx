
import { Route } from "react-router-dom";
import SubcategoryPage from "@/components/SubcategoryPage";
import GenericSubcategoryPage from "@/pages/categories/GenericSubcategoryPage";
import BoxingPage from "@/pages/categories/sports/BoxingPage";
import BusinessPage from "@/pages/categories/business/BusinessPage";
import CryptocurrencyPage from "@/pages/categories/business/CryptocurrencyPage";
import CarsPage from "@/pages/categories/cars/CarsPage";
import CarRepairsPage from "@/pages/categories/cars/CarRepairsPage";

import { 
  Film, GraduationCap, Car, Scissors, HeartHandshake, Users, Dog, 
  Microscope, Plane, Pizza, Utensils, Quote, Clapperboard, Star, 
  Gavel, Ship, UserRound, House, Anchor, Truck
} from 'lucide-react';

export const subcategoryRoutes = [
  /* Sports/Boxing Routes */
  <Route key="sports-boxing" path="/sports/boxing" element={<BoxingPage />} />,
  <Route key="sports-boxing-professional" path="/sports/boxing/professional" element={<GenericSubcategoryPage />} />,
  <Route key="sports-boxing-street-fighting" path="/sports/boxing/street-fighting" element={<GenericSubcategoryPage />} />,
  <Route key="sports-boxing-training" path="/sports/boxing/training" element={<GenericSubcategoryPage />} />,
  <Route key="sports-boxing-amateur" path="/sports/boxing/amateur" element={<GenericSubcategoryPage />} />,
  
  /* Business Routes */
  <Route key="business" path="/business" element={<BusinessPage />} />,
  <Route key="business-cryptocurrency" path="/business/cryptocurrency" element={<CryptocurrencyPage />} />,
  <Route key="business-leadership" path="/business/leadership" element={<GenericSubcategoryPage />} />,
  <Route key="business-finance" path="/business/finance" element={<GenericSubcategoryPage />} />,
  <Route key="business-services" path="/business/services" element={<GenericSubcategoryPage />} />,
  <Route key="business-farming" path="/business/farming" element={<GenericSubcategoryPage />} />,
  <Route key="business-commerce" path="/business/commerce" element={<GenericSubcategoryPage />} />,
  <Route key="business-internet" path="/business/internet" element={<GenericSubcategoryPage />} />,
  
  /* Cars Routes */
  <Route key="cars" path="/cars" element={<CarsPage />} />,
  <Route key="cars-repairs" path="/cars/repairs" element={<CarRepairsPage />} />,
  <Route key="cars-repairs-major" path="/cars/repairs/major" element={<GenericSubcategoryPage />} />,
  <Route key="cars-repairs-minor" path="/cars/repairs/minor" element={<GenericSubcategoryPage />} />,
  <Route key="cars-repairs-hacks" path="/cars/repairs/hacks" element={<GenericSubcategoryPage />} />,
  <Route key="cars-repairs-maintenance" path="/cars/repairs/maintenance" element={<GenericSubcategoryPage />} />,
  <Route key="cars-drifting" path="/cars/drifting" element={<GenericSubcategoryPage />} />,
  <Route key="cars-expensive" path="/cars/expensive" element={<GenericSubcategoryPage />} />,
  <Route key="cars-future" path="/cars/future" element={<GenericSubcategoryPage />} />,
  <Route key="cars-types" path="/cars/types" element={<GenericSubcategoryPage />} />,
  <Route key="cars-strange" path="/cars/strange" element={<GenericSubcategoryPage />} />,
  <Route key="cars-supercars" path="/cars/supercars" element={<GenericSubcategoryPage />} />,
  <Route key="cars-accidents" path="/cars/accidents" element={<GenericSubcategoryPage />} />,
  <Route key="cars-crashes" path="/cars/crashes" element={<GenericSubcategoryPage />} />,
  <Route key="cars-motorcycles" path="/cars/motorcycles" element={<GenericSubcategoryPage />} />,
  
  /* Fitness Routes */
  <Route key="fitness-calisthenics" path="/fitness/calisthenics" element={<GenericSubcategoryPage />} />,
  
  /* Comedy Routes */
  <Route key="comedy-standup" path="/comedy/standup" element={<GenericSubcategoryPage />} />,
  <Route key="comedy-roasts" path="/comedy/roasts" element={<GenericSubcategoryPage />} />,
  <Route key="comedy-snl" path="/comedy/snl" element={<GenericSubcategoryPage />} />,
  <Route key="comedy-sitcom" path="/comedy/sitcom" element={<GenericSubcategoryPage />} />,
  <Route key="comedy-pranks" path="/comedy/pranks" element={<GenericSubcategoryPage />} />,
  <Route key="comedy-interviews" path="/comedy/interviews" element={<GenericSubcategoryPage />} />,
  
  /* Dating Routes */
  <Route key="relationships-dating" path="/relationships/dating" element={<GenericSubcategoryPage />} />,
  <Route key="relationships-breakups" path="/relationships/breakups" element={<GenericSubcategoryPage />} />,
  <Route key="relationships-flirting" path="/relationships/flirting" element={<GenericSubcategoryPage />} />,
  <Route key="relationships-singles" path="/relationships/singles" element={<GenericSubcategoryPage />} />,
  <Route key="relationships-divorce" path="/relationships/divorce" element={<GenericSubcategoryPage />} />,
  
  /* Disasters Routes */
  <Route key="disasters-avalanche" path="/disasters/avalanche" element={<GenericSubcategoryPage />} />,
  <Route key="disasters-earthquakes" path="/disasters/earthquakes" element={<GenericSubcategoryPage />} />,
  <Route key="disasters-fires" path="/disasters/fires" element={<GenericSubcategoryPage />} />,
  <Route key="disasters-hurricanes" path="/disasters/hurricanes" element={<GenericSubcategoryPage />} />,
  <Route key="disasters-volcano" path="/disasters/volcano" element={<GenericSubcategoryPage />} />,
  
  /* Education Routes */
  <Route key="education-anatomy" path="/education/anatomy" element={<GenericSubcategoryPage />} />,
  <Route key="education-countries-history" path="/education/countries-history" element={<GenericSubcategoryPage />} />,
  <Route key="education-immigration" path="/education/immigration" element={<GenericSubcategoryPage />} />,
  <Route key="education-geography" path="/education/geography" element={<GenericSubcategoryPage />} />,
  <Route key="education-laws" path="/education/laws" element={<GenericSubcategoryPage />} />,
  <Route key="education-medicine" path="/education/medicine" element={<GenericSubcategoryPage />} />,
  <Route key="education-religion" path="/education/religion" element={<GenericSubcategoryPage />} />,
  <Route key="education-nursing" path="/education/nursing" element={<GenericSubcategoryPage />} />,
  <Route key="education-speech-commencement" path="/education/speech-commencement" element={<GenericSubcategoryPage />} />,
  <Route key="education-speech-eulogy" path="/education/speech-eulogy" element={<GenericSubcategoryPage />} />,
  <Route key="education-speech-informative" path="/education/speech-informative" element={<GenericSubcategoryPage />} />,
  <Route key="education-speech-motivational" path="/education/speech-motivational" element={<GenericSubcategoryPage />} />,
  <Route key="education-speech-persuasive" path="/education/speech-persuasive" element={<GenericSubcategoryPage />} />,
  <Route key="education-speeches" path="/education/speeches" element={<GenericSubcategoryPage />} />,
  
  /* Courts & Crime Routes */
  <Route key="courts-police-trails" path="/courts-police/trails" element={<GenericSubcategoryPage />} />,
  <Route key="courts-police-sentencing" path="/courts-police/sentencing" element={<GenericSubcategoryPage />} />,
  <Route key="courts-police-supreme-court" path="/courts-police/supreme-court" element={<GenericSubcategoryPage />} />,
  <Route key="courts-police-fraud" path="/courts-police/fraud" element={<GenericSubcategoryPage />} />,
  <Route key="courts-police-gangs" path="/courts-police/gangs" element={<GenericSubcategoryPage />} />,
  <Route key="courts-police-crime" path="/courts-police/crime" element={<GenericSubcategoryPage />} />,
  <Route key="courts-police-enterprises" path="/courts-police/enterprises" element={<GenericSubcategoryPage />} />,

  /* Documents & Media Routes */
  <Route key="documents-word" path="/documents/word" element={<GenericSubcategoryPage />} />,
  <Route key="documents-excel" path="/documents/excel" element={<GenericSubcategoryPage />} />,
  <Route key="documents-writing" path="/documents/writing" element={<GenericSubcategoryPage />} />,
  
  /* Shipping Routes */
  <Route key="shipping-container-ships" path="/shipping/container-ships" element={<GenericSubcategoryPage />} />,
  
  /* Cosmetics Routes */
  <Route key="cosmetics-foundation" path="/cosmetics/foundation" element={<GenericSubcategoryPage />} />,
  <Route key="cosmetics-lipstick" path="/cosmetics/lipstick" element={<GenericSubcategoryPage />} />,
  
  /* Dance Routes */
  <Route key="dance-styles" path="/dance/styles" element={<GenericSubcategoryPage />} />,
  
  /* Drinks Routes */
  <Route key="drinks-alcohol" path="/drinks/alcohol" element={<GenericSubcategoryPage />} />,
  
  /* Drones Routes */
  <Route key="drones-civilian" path="/drones/civilian" element={<GenericSubcategoryPage />} />,
  
  /* Film Routes */
  <Route key="film-romance" path="/film/romance" element={<GenericSubcategoryPage />} />,
  <Route key="film-comedy" path="/film/comedy" element={<GenericSubcategoryPage />} />,
  <Route key="film-action-crime-thriller" path="/film/action-crime-thriller" element={<GenericSubcategoryPage />} />,
  <Route key="film-drama" path="/film/drama" element={<GenericSubcategoryPage />} />,
  <Route key="film-comedy-drama-crime" path="/film/comedy-drama-crime" element={<GenericSubcategoryPage />} />,
  
  /* Film & Animation Routes */
  <Route key="film-animation-comedy" path="/film-animation/comedy" element={<GenericSubcategoryPage />} />,
  <Route key="film-animation-cartoons" path="/film-animation/cartoons" element={<GenericSubcategoryPage />} />,
  
  /* Film & Movies Routes */
  <Route key="film-movies-clips" path="/film-movies/clips" element={<GenericSubcategoryPage />} />,
  
  /* Speeches Routes */
  <Route key="speeches-commencement" path="/speeches/commencement" element={<GenericSubcategoryPage />} />,
  <Route key="speeches-eulogy" path="/speeches/eulogy" element={<GenericSubcategoryPage />} />,
  <Route key="speeches-informative" path="/speeches/informative" element={<GenericSubcategoryPage />} />,
  <Route key="speeches-motivational" path="/speeches/motivational" element={<GenericSubcategoryPage />} />,
  <Route key="speeches-persuasive" path="/speeches/persuasive" element={<GenericSubcategoryPage />} />,
  <Route key="speeches-quotes-poems" path="/speeches/quotes-poems" element={<GenericSubcategoryPage />} />,
];
