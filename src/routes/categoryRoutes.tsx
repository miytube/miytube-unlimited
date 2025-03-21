
import { Route } from "react-router-dom";
import CategoryPage from "@/pages/CategoryPage";
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

export const categoryRoutes = [
  /* Category Pages */
  <Route key="autos-vehicles" path="/autos-vehicles" element={<CategoryPage category="Autos & Vehicles" icon="Car" />} />,
  <Route key="education" path="/education" element={<CategoryPage category="Education" icon="GraduationCap" />} />,
  <Route key="entertainment" path="/entertainment" element={<CategoryPage category="Entertainment" icon="Film" />} />,
  <Route key="how-to-style" path="/how-to-style" element={<CategoryPage category="How To & Style" icon="Scissors" />} />,
  <Route key="nonprofits" path="/nonprofits" element={<CategoryPage category="Nonprofits & Activism" icon="HeartHandshake" />} />,
  <Route key="people-blogs" path="/people-blogs" element={<CategoryPage category="People & Blogs" icon="Users" />} />,
  <Route key="pets-animals" path="/pets-animals" element={<CategoryPage category="Pets & Animals" icon="Dog" />} />,
  <Route key="science-tech" path="/science-tech" element={<CategoryPage category="Science & Technology" icon="Microscope" />} />,
  <Route key="travel-events" path="/travel-events" element={<CategoryPage category="Travel & Events" icon="Plane" />} />,
  <Route key="foods" path="/foods" element={<CategoryPage category="Foods" icon="Pizza" />} />,
  <Route key="restaurants" path="/restaurants" element={<CategoryPage category="Restaurants" icon="Utensils" />} />,
  <Route key="quotes-poems" path="/quotes-poems" element={<CategoryPage category="Quotes, Poems, Statements" icon="Quote" />} />,
  <Route key="film-animation" path="/film-animation" element={<CategoryPage category="Film & Animation Movies" icon="Clapperboard" />} />,
  <Route key="models" path="/models" element={<CategoryPage category="Models" icon="Star" />} />,
  <Route key="courts-police" path="/courts-police" element={<CategoryPage category="Courts & Police, Crime" icon="Gavel" />} />,
  <Route key="boats" path="/boats" element={<CategoryPage category="Boats" icon="Ship" />} />,
  <Route key="relationships" path="/relationships" element={<CategoryPage category="Relationships" icon="UserRound" />} />,
  <Route key="airports" path="/airports" element={<CategoryPage category="Airports" icon="Plane" />} />,
  <Route key="real-estate" path="/real-estate" element={<CategoryPage category="Real Estate" icon="House" />} />,
  <Route key="shipping-ports" path="/shipping-ports" element={<CategoryPage category="Shipping Ports" icon="Anchor" />} />,
  <Route key="shipping" path="/shipping" element={<CategoryPage category="Shipping" icon="Truck" />} />,
  <Route key="fitness" path="/fitness" element={<CategoryPage category="Fitness" icon="Dumbbell" />} />,
  <Route key="cosmetics" path="/cosmetics" element={<CategoryPage category="Cosmetics" icon="Brush" />} />,
  <Route key="dance" path="/dance" element={<CategoryPage category="Dance" icon="Music" />} />,
  <Route key="drinks" path="/drinks" element={<CategoryPage category="Drinks" icon="Wine" />} />,
  <Route key="drones" path="/drones" element={<CategoryPage category="Drones" icon="Plane" />} />,
];
