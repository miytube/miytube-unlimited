import { Route, Navigate } from "react-router-dom";
import { Shield, Flame, Waves, Anchor, Mic, Plane } from 'lucide-react';

import Index from "@/pages/Index";
import Videos from "@/pages/Videos";
import Watch from "@/pages/Watch";
import Search from "@/pages/Search";
import Upload from "@/pages/Upload";
import VideoUpload from "@/pages/VideoUpload";
import MusicUpload from "@/pages/MusicUpload";
import Shorts from "@/pages/Shorts";
import Trending from "@/pages/Trending";
import About from "@/pages/About";
import Contact from "@/pages/Contact";
import Terms from "@/pages/Terms";
import Privacy from "@/pages/Privacy";
import Copyright from "@/pages/Copyright";
import Advertising from "@/pages/Advertising";
import Blog from "@/pages/Blog";
import LongVideos from "@/pages/LongVideos";
import NewsAndPolitics from "@/pages/NewsAndPolitics";
import TalkAtCha from "@/pages/TalkAtCha";
import Educational from "@/pages/Educational";
import Channel from "@/pages/Channel";
import Auth from "@/pages/Auth";
import Account from "@/pages/Account";
import ForgotPassword from "@/pages/ForgotPassword";
import ResetPassword from "@/pages/ResetPassword";
import Admin from "@/pages/Admin";
import Monetization from "@/pages/Monetization";
import Watchlist from "@/pages/Watchlist";
import BreakingNews from "@/pages/BreakingNews";

// New pages to fix 404s
import HowToStyle from "@/pages/HowToStyle";
import Shipping from "@/pages/Shipping";
import AutosVehicles from "@/pages/AutosVehicles";
import Boats from "@/pages/Boats";
import Restaurants from "@/pages/Restaurants";
import RealEstate from "@/pages/RealEstate";
import Airports from "@/pages/Airports";
import TravelEvents from "@/pages/TravelEvents";
import Models from "@/pages/Models";
import PetsAnimals from "@/pages/PetsAnimals";
import Nonprofits from "@/pages/Nonprofits";
import Relationships from "@/pages/Relationships";
import PeopleBlogs from "@/pages/PeopleBlogs";
import QuotesPoems from "@/pages/QuotesPoems";
import PhysicalFitness from "@/pages/PhysicalFitness";
import Plants from "@/pages/Plants";
import TalkShows from "@/pages/TalkShows";
import RealityTV from "@/pages/RealityTV";
import GameShows from "@/pages/GameShows";
import AwardsShows from "@/pages/AwardsShows";
import NewsShows from "@/pages/NewsShows";
import GenericCategoryPage from "@/components/GenericCategoryPage";
import GenericSubcategoryPage from "@/pages/categories/GenericSubcategoryPage";
import Trains from "@/pages/Trains";
import Swimming from "@/pages/Swimming";
import Floods from "@/pages/Floods";
import LakesRivers from "@/pages/LakesRivers";
import Mammals from "@/pages/Mammals";
import NonMammals from "@/pages/NonMammals";
import Speeches from "@/pages/Speeches";
import Family from "@/pages/Family";
import RoyalSecurityGuards from "@/pages/RoyalSecurityGuards";

export const mainRoutes = [
  <Route key="index" path="/" element={<Index />} />,
  <Route key="videos" path="/videos" element={<Videos />} />,
  <Route key="videos-category" path="/videos/:category" element={<Videos />} />,
  <Route key="watch" path="/watch" element={<Watch />} />,
  <Route key="search" path="/search" element={<Search />} />,
  <Route key="upload" path="/upload" element={<Upload />} />,
  <Route key="upload-video" path="/upload/video" element={<VideoUpload />} />,
  <Route key="upload-music" path="/upload/music" element={<MusicUpload />} />,
  <Route key="shorts" path="/shorts" element={<Shorts />} />,
  <Route key="trending" path="/trending" element={<Trending />} />,
  <Route key="about" path="/about" element={<About />} />,
  <Route key="contact" path="/contact" element={<Contact />} />,
  <Route key="terms" path="/terms" element={<Terms />} />,
  <Route key="privacy" path="/privacy" element={<Privacy />} />,
  <Route key="copyright" path="/copyright" element={<Copyright />} />,
  <Route key="advertising" path="/advertising" element={<Advertising />} />,
  <Route key="blog" path="/blog" element={<Blog />} />,
  <Route key="blog-new" path="/blog/new" element={<Blog />} />,
  <Route key="long-videos" path="/long-videos" element={<LongVideos />} />,
  <Route key="news-politics" path="/news" element={<NewsAndPolitics />} />,
  <Route key="talk-at-cha" path="/talk-at-cha" element={<TalkAtCha />} />,
  <Route key="educational" path="/educational" element={<Educational />} />,
  <Route key="channel" path="/channel" element={<Channel />} />,
  <Route key="channel-id" path="/channel/:id" element={<Channel />} />,
  <Route key="auth" path="/auth" element={<Auth />} />,
  <Route key="forgot-password" path="/forgot-password" element={<ForgotPassword />} />,
  <Route key="reset-password" path="/reset-password" element={<ResetPassword />} />,
  <Route key="account" path="/account" element={<Account />} />,
  <Route key="admin" path="/admin" element={<Admin />} />,
  <Route key="monetization" path="/monetization" element={<Monetization />} />,
  <Route key="watchlist" path="/watchlist" element={<Watchlist />} />,
  <Route key="breaking-news" path="/breaking-news" element={<BreakingNews />} />,
  
  // New routes to fix 404s
  <Route key="how-to-style" path="/how-to-style" element={<HowToStyle />} />,
  <Route key="dance" path="/dance" element={<GenericSubcategoryPage />} />,
  <Route key="shipping" path="/shipping" element={<Shipping />} />,
  <Route key="autos-vehicles" path="/autos-vehicles" element={<AutosVehicles />} />,
  <Route key="boats" path="/boats" element={<Boats />} />,
  <Route key="boats-all" path="/boats/all" element={<Boats />} />,
  <Route key="restaurants" path="/restaurants" element={<Restaurants />} />,
  <Route key="real-estate" path="/real-estate" element={<RealEstate />} />,
  <Route key="airports" path="/airports" element={<Airports />} />,
  <Route key="airports-fails" path="/airports-fails" element={<GenericCategoryPage title="Airports Fails" description="Watch airport fails and incidents" Icon={Plane} />} />,
  <Route key="travel-events" path="/travel-events" element={<TravelEvents />} />,
  <Route key="travel-events-airplanes-airships" path="/travel-events/airplanes-airships" element={<TravelEvents />} />,
  <Route key="travel-events-airplanes-cargo" path="/travel-events/airplanes-cargo" element={<TravelEvents />} />,
  <Route key="travel-events-airplanes-commercial" path="/travel-events/airplanes-commercial" element={<TravelEvents />} />,
  <Route key="travel-events-airplanes-land-water" path="/travel-events/airplanes-land-water" element={<TravelEvents />} />,
  <Route key="travel-events-airplanes-pilots" path="/travel-events/airplanes-pilots" element={<TravelEvents />} />,
  <Route key="travel-events-airplanes-single-engine" path="/travel-events/airplanes-single-engine" element={<TravelEvents />} />,
  <Route key="models" path="/models" element={<Models />} />,
  <Route key="pets-animals" path="/pets-animals" element={<PetsAnimals />} />,
  <Route key="pets-animals-amphibians" path="/pets-animals/amphibians" element={<PetsAnimals />} />,
  <Route key="pets-animals-insects" path="/pets-animals/insects" element={<PetsAnimals />} />,
  <Route key="pets-animals-birds" path="/pets-animals/birds" element={<PetsAnimals />} />,
  <Route key="pets-animals-crustaceans" path="/pets-animals/crustaceans" element={<PetsAnimals />} />,
  <Route key="pets-animals-fish" path="/pets-animals/fish" element={<PetsAnimals />} />,
  <Route key="pets-animals-mammals" path="/pets-animals/mammals" element={<PetsAnimals />} />,
  <Route key="pets-animals-marine-mammals" path="/pets-animals/marine-mammals" element={<PetsAnimals />} />,
  <Route key="pets-animals-reptiles" path="/pets-animals/reptiles" element={<PetsAnimals />} />,
  <Route key="pets-animals-rodents" path="/pets-animals/rodents" element={<PetsAnimals />} />,
  <Route key="pets-animals-cephalopods" path="/pets-animals/cephalopods" element={<PetsAnimals />} />,
  <Route key="nonprofits" path="/nonprofits" element={<Nonprofits />} />,
  <Route key="relationships" path="/relationships" element={<Relationships />} />,
  <Route key="people-blogs" path="/people-blogs" element={<PeopleBlogs />} />,
  <Route key="quotes-poems" path="/quotes-poems" element={<QuotesPoems />} />,
  <Route key="physical-fitness" path="/physical-fitness" element={<PhysicalFitness />} />,
  <Route key="plants" path="/plants" element={<Plants />} />,
  <Route key="talk-shows" path="/talk-shows" element={<TalkShows />} />,
  <Route key="reality-tv" path="/reality-tv" element={<RealityTV />} />,
  <Route key="game-shows" path="/game-shows" element={<GameShows />} />,
  <Route key="awards-shows" path="/awards-shows" element={<AwardsShows />} />,
  <Route key="news-shows" path="/news-shows" element={<NewsShows />} />,
  
  // New landing pages for Trains, Swimming, and Floods
  <Route key="trains" path="/trains" element={<Trains />} />,
  <Route key="swim" path="/swim" element={<Swimming />} />,
  <Route key="floods" path="/floods" element={<Floods />} />,
  <Route key="lakes-rivers" path="/lakes-rivers" element={<LakesRivers />} />,
  
  // Mammals, Non-Mammals, and Speeches categories
  <Route key="mammals" path="/mammals" element={<Mammals />} />,
  <Route key="mammals-primates" path="/mammals/primates" element={<GenericSubcategoryPage />} />,
  <Route key="mammals-carnivores" path="/mammals/carnivores" element={<GenericSubcategoryPage />} />,
  <Route key="mammals-rodents" path="/mammals/rodents" element={<GenericSubcategoryPage />} />,
  <Route key="mammals-marine" path="/mammals/marine-mammals" element={<GenericSubcategoryPage />} />,
  <Route key="mammals-marsupials" path="/mammals/marsupials" element={<GenericSubcategoryPage />} />,
  <Route key="mammals-bats" path="/mammals/bats" element={<GenericSubcategoryPage />} />,
  <Route key="mammals-elephants" path="/mammals/elephants" element={<GenericSubcategoryPage />} />,
  <Route key="mammals-ungulates" path="/mammals/ungulates" element={<GenericSubcategoryPage />} />,
  
  <Route key="non-mammals" path="/non-mammals" element={<NonMammals />} />,
  <Route key="non-mammals-fish" path="/non-mammals/fish" element={<GenericSubcategoryPage />} />,
  <Route key="non-mammals-birds" path="/non-mammals/birds" element={<GenericSubcategoryPage />} />,
  <Route key="non-mammals-reptiles" path="/non-mammals/reptiles" element={<GenericSubcategoryPage />} />,
  <Route key="non-mammals-amphibians" path="/non-mammals/amphibians" element={<GenericSubcategoryPage />} />,
  <Route key="non-mammals-arthropods" path="/non-mammals/arthropods" element={<GenericSubcategoryPage />} />,
  <Route key="non-mammals-mollusks" path="/non-mammals/mollusks" element={<GenericSubcategoryPage />} />,
  <Route key="non-mammals-echinoderms" path="/non-mammals/echinoderms" element={<GenericSubcategoryPage />} />,
  <Route key="non-mammals-invertebrates" path="/non-mammals/invertebrates" element={<GenericSubcategoryPage />} />,
  
  <Route key="speeches" path="/speeches" element={<Speeches />} />,
  <Route key="speeches-commencement" path="/speeches/commencement" element={<GenericSubcategoryPage />} />,
  <Route key="speeches-eulogy" path="/speeches/eulogy" element={<GenericSubcategoryPage />} />,
  <Route key="speeches-informative" path="/speeches/informative" element={<GenericSubcategoryPage />} />,
  <Route key="speeches-motivational" path="/speeches/motivational" element={<GenericSubcategoryPage />} />,
  <Route key="speeches-persuasive" path="/speeches/persuasive" element={<GenericSubcategoryPage />} />,
  <Route key="speeches-quotes-poems" path="/speeches/quotes-poems" element={<GenericSubcategoryPage />} />,
  
  // New category pages with fixed icon imports
  <Route key="military" path="/military" element={<GenericCategoryPage title="Military" description="Explore military content, including personnel, vehicles, and equipment" Icon={Shield} />} />,
  <Route key="fire-department" path="/fire-department" element={<GenericCategoryPage title="Fire Department" description="Explore content about firefighters and fire departments" Icon={Flame} />} />,
  <Route key="beaches" path="/beaches" element={<GenericCategoryPage title="Beaches & Lagoons" description="Explore beautiful beaches and lagoons around the world" Icon={Waves} />} />,
  <Route key="shipping-ports" path="/shipping-ports" element={<GenericCategoryPage title="Shipping Ports" description="Explore content about shipping ports and maritime logistics" Icon={Anchor} />} />,
  <Route key="music-artists" path="/music-artists" element={<GenericCategoryPage title="Music Artists" description="Explore content about music artists, their works and careers" Icon={Mic} />} />,
  
  // Family and Royal Security Guards routes
  <Route key="family" path="/family" element={<Family />} />,
  <Route key="royal-security-guards" path="/royal-security-guards" element={<RoyalSecurityGuards />} />,
  
  <Route key="category-fallback" path="/:category" element={<GenericSubcategoryPage />} />,
  <Route key="subcategory-fallback" path="/:category/:subcategory" element={<GenericSubcategoryPage />} />,
  <Route key="deep-subcategory-fallback" path="/:category/:subcategory/:topic" element={<GenericSubcategoryPage />} />,
  <Route key="deep-route-fallback" path="*" element={<Navigate to="/" replace />} />,
];
