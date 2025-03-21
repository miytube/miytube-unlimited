
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { UploadedVideosProvider } from "./context/UploadedVideosContext";
import Index from "./pages/Index";
import Watch from "./pages/Watch";
import Search from "./pages/Search";
import NotFound from "./pages/NotFound";
import Monetization from "./pages/Monetization";
import Advertising from "./pages/Advertising";
import Images from "./pages/Images";
import Audio from "./pages/Audio";
import Documents from "./pages/Documents";
import Blog from "./pages/Blog";
import LongVideos from "./pages/LongVideos";
import TalkAtCha from "./pages/TalkAtCha";
import Shorts from "./pages/Shorts";
import VideoUpload from "./pages/VideoUpload";
import Upload from "./pages/Upload"; 
import Videos from "./pages/Videos";
import Music from "./pages/Music";
import MusicUpload from "./pages/MusicUpload";
import Sports from "./pages/Sports";
import Gaming from "./pages/Gaming";
// Import new pages
import Podcasts from "./pages/Podcasts";
import Audiobooks from "./pages/Audiobooks";
import Meditation from "./pages/Meditation";
import Educational from "./pages/Educational";
import NatureSounds from "./pages/NatureSounds";
import Comedy from "./pages/Comedy";
import NewsAndPolitics from "./pages/NewsAndPolitics";
import Weather from "./pages/Weather";
import Oceans from "./pages/Oceans";
import Disasters from "./pages/Disasters";
import Trending from "./pages/Trending";
import Channel from "./pages/Channel";
// Import pages for about, copyright, contact, terms, and privacy
import About from "./pages/About";
import Copyright from "./pages/Copyright";
import Contact from "./pages/Contact";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";

// Import placeholder component for new category pages
import CategoryPage from "./pages/CategoryPage";
import SubcategoryPage from "./components/SubcategoryPage";

// Import icons
import { 
  Film, GraduationCap, Car, Scissors, HeartHandshake, Users, Dog, 
  Microscope, Plane, Pizza, Utensils, Quote, Clapperboard, Star, 
  Gavel, Ship, UserRound, House, Anchor, Truck, Globe
} from 'lucide-react';

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <UploadedVideosProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/watch" element={<Watch />} />
            <Route path="/search" element={<Search />} />
            <Route path="/monetization" element={<Monetization />} />
            <Route path="/advertising" element={<Advertising />} />
            <Route path="/images" element={<Images />} />
            <Route path="/audio" element={<Audio />} />
            <Route path="/documents" element={<Documents />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/long-videos" element={<LongVideos />} />
            <Route path="/talk-at-cha" element={<TalkAtCha />} />
            <Route path="/shorts" element={<Shorts />} />
            <Route path="/shorts/:id" element={<Shorts />} />
            <Route path="/upload/video" element={<VideoUpload />} />
            <Route path="/upload" element={<Upload />} />
            <Route path="/upload/music" element={<MusicUpload />} />
            <Route path="/videos" element={<Videos />} />
            <Route path="/videos/:category" element={<Videos />} />
            <Route path="/music" element={<Music />} />
            <Route path="/music/:category" element={<Music />} />
            <Route path="/sports" element={<Sports />} />
            <Route path="/sports/:category" element={<Sports />} />
            <Route path="/gaming" element={<Gaming />} />
            <Route path="/gaming/:category" element={<Gaming />} />
            
            {/* New routes for the newly created pages */}
            <Route path="/podcasts" element={<Podcasts />} />
            <Route path="/podcasts/:category" element={<Podcasts />} />
            <Route path="/audiobooks" element={<Audiobooks />} />
            <Route path="/audiobooks/:category" element={<Audiobooks />} />
            <Route path="/meditation" element={<Meditation />} />
            <Route path="/meditation/:category" element={<Meditation />} />
            <Route path="/educational" element={<Educational />} />
            <Route path="/educational/:category" element={<Educational />} />
            <Route path="/nature-sounds" element={<NatureSounds />} />
            <Route path="/nature-sounds/:category" element={<NatureSounds />} />
            <Route path="/comedy" element={<Comedy />} />
            <Route path="/comedy/:category" element={<Comedy />} />
            <Route path="/news" element={<NewsAndPolitics />} />
            <Route path="/news/:category" element={<NewsAndPolitics />} />
            <Route path="/weather" element={<Weather />} />
            <Route path="/weather/:category" element={<Weather />} />
            <Route path="/oceans" element={<Oceans />} />
            <Route path="/oceans/:category" element={<Oceans />} />
            <Route path="/disasters" element={<Disasters />} />
            <Route path="/disasters/:category" element={<Disasters />} />
            <Route path="/trending" element={<Trending />} />
            <Route path="/channel" element={<Channel />} />
            
            {/* Routes for about, copyright, contact, terms, and privacy pages */}
            <Route path="/about" element={<About />} />
            <Route path="/copyright" element={<Copyright />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy" element={<Privacy />} />
            
            {/* Routes for new category pages */}
            <Route path="/autos-vehicles" element={<CategoryPage category="Autos & Vehicles" icon="Car" />} />
            <Route path="/education" element={<CategoryPage category="Education" icon="GraduationCap" />} />
            <Route path="/entertainment" element={<CategoryPage category="Entertainment" icon="Film" />} />
            <Route path="/how-to-style" element={<CategoryPage category="How To & Style" icon="Scissors" />} />
            <Route path="/nonprofits" element={<CategoryPage category="Nonprofits & Activism" icon="HeartHandshake" />} />
            <Route path="/people-blogs" element={<CategoryPage category="People & Blogs" icon="Users" />} />
            <Route path="/pets-animals" element={<CategoryPage category="Pets & Animals" icon="Dog" />} />
            <Route path="/science-tech" element={<CategoryPage category="Science & Technology" icon="Microscope" />} />
            <Route path="/travel-events" element={<CategoryPage category="Travel & Events" icon="Plane" />} />
            <Route path="/foods" element={<CategoryPage category="Foods" icon="Pizza" />} />
            <Route path="/restaurants" element={<CategoryPage category="Restaurants" icon="Utensils" />} />
            <Route path="/quotes-poems" element={<CategoryPage category="Quotes, Poems, Statements" icon="Quote" />} />
            <Route path="/film-animation" element={<CategoryPage category="Film & Animation Movies" icon="Clapperboard" />} />
            <Route path="/models" element={<CategoryPage category="Models" icon="Star" />} />
            <Route path="/courts-police" element={<CategoryPage category="Courts & Police, Crime" icon="Gavel" />} />
            <Route path="/boats" element={<CategoryPage category="Boats" icon="Ship" />} />
            <Route path="/relationships" element={<CategoryPage category="Relationships" icon="UserRound" />} />
            <Route path="/airports" element={<CategoryPage category="Airports" icon="Plane" />} />
            <Route path="/real-estate" element={<CategoryPage category="Real Estate" icon="House" />} />
            <Route path="/shipping-ports" element={<CategoryPage category="Shipping Ports" icon="Anchor" />} />
            <Route path="/shipping" element={<CategoryPage category="Shipping" icon="Truck" />} />

            {/* NEW SUBCATEGORY ROUTES */}
            
            {/* Entertainment Subcategories */}
            <Route path="/entertainment/acting" element={<SubcategoryPage category="Entertainment" subcategory="Acting (Off Script, Unscripted)" parentCategory="Entertainment" icon={Film} />} />
            <Route path="/entertainment/actors-actress" element={<SubcategoryPage category="Entertainment" subcategory="Actors & Actresses (Bios)" parentCategory="Entertainment" icon={Film} />} />
            <Route path="/entertainment/actors-info" element={<SubcategoryPage category="Entertainment" subcategory="Actors, Actresses Information" parentCategory="Entertainment" icon={Film} />} />
            <Route path="/entertainment/auditions" element={<SubcategoryPage category="Entertainment" subcategory="Auditions & Contests" parentCategory="Entertainment" icon={Film} />} />
            
            {/* Film & Animation Subcategories */}
            <Route path="/film-animation/military" element={<SubcategoryPage category="Film & Animation" subcategory="Military Animation & Film" parentCategory="Film & Animation Movies" icon={Clapperboard} />} />
            <Route path="/film-animation/classics" element={<SubcategoryPage category="Film & Animation" subcategory="Classics Animation, Film, Movies" parentCategory="Film & Animation Movies" icon={Clapperboard} />} />
            <Route path="/film-animation/bloopers" element={<SubcategoryPage category="Film & Animation" subcategory="Bloopers (Screwups, Blunders)" parentCategory="Film & Animation Movies" icon={Clapperboard} />} />
            
            {/* Airports Subcategories */}
            <Route path="/airports/fails" element={<SubcategoryPage category="Airports" subcategory="Airport Fails" parentCategory="Airports" icon={Plane} />} />
            
            {/* Airplanes Subcategories */}
            <Route path="/travel-events/airplanes-airships" element={<SubcategoryPage category="Travel & Events" subcategory="Airplanes (Airships, Blimps)" parentCategory="Travel & Events" icon={Plane} />} />
            <Route path="/travel-events/airplanes-cargo" element={<SubcategoryPage category="Travel & Events" subcategory="Airplanes (Cargo Planes)" parentCategory="Travel & Events" icon={Plane} />} />
            <Route path="/travel-events/airplanes-commercial" element={<SubcategoryPage category="Travel & Events" subcategory="Airplanes (Commercial, Jumbo)" parentCategory="Travel & Events" icon={Plane} />} />
            <Route path="/travel-events/airplanes-land-water" element={<SubcategoryPage category="Travel & Events" subcategory="Airplanes (Land, Water)" parentCategory="Travel & Events" icon={Plane} />} />
            <Route path="/travel-events/airplanes-pilots" element={<SubcategoryPage category="Travel & Events" subcategory="Airplanes (Pilots, Captains)" parentCategory="Travel & Events" icon={Plane} />} />
            <Route path="/travel-events/airplanes-single-engine" element={<SubcategoryPage category="Travel & Events" subcategory="Airplanes (Single Engine)" parentCategory="Travel & Events" icon={Plane} />} />
            
            {/* Animal Subcategories */}
            <Route path="/pets-animals/amphibians" element={<SubcategoryPage category="Pets & Animals" subcategory="Amphibians (Frogs, Salamanders)" parentCategory="Pets & Animals" icon={Dog} />} />
            <Route path="/pets-animals/insects" element={<SubcategoryPage category="Pets & Animals" subcategory="Insects & Spiders" parentCategory="Pets & Animals" icon={Dog} />} />
            <Route path="/pets-animals/birds" element={<SubcategoryPage category="Pets & Animals" subcategory="Birds & Raptors" parentCategory="Pets & Animals" icon={Dog} />} />
            <Route path="/pets-animals/crustaceans" element={<SubcategoryPage category="Pets & Animals" subcategory="Crabs, Lobsters & Crustaceans" parentCategory="Pets & Animals" icon={Dog} />} />
            <Route path="/pets-animals/fish" element={<SubcategoryPage category="Pets & Animals" subcategory="Fish & Fishes" parentCategory="Pets & Animals" icon={Dog} />} />
            <Route path="/pets-animals/mammals" element={<SubcategoryPage category="Pets & Animals" subcategory="Mammals, Birds & Reptiles" parentCategory="Pets & Animals" icon={Dog} />} />
            <Route path="/pets-animals/marine-mammals" element={<SubcategoryPage category="Pets & Animals" subcategory="Orcas, Dolphins & Marine Mammals" parentCategory="Pets & Animals" icon={Dog} />} />
            <Route path="/pets-animals/reptiles" element={<SubcategoryPage category="Pets & Animals" subcategory="Reptiles & Snakes" parentCategory="Pets & Animals" icon={Dog} />} />
            <Route path="/pets-animals/rodents" element={<SubcategoryPage category="Pets & Animals" subcategory="Rodents, Rats & Beavers" parentCategory="Pets & Animals" icon={Dog} />} />
            <Route path="/pets-animals/cephalopods" element={<SubcategoryPage category="Pets & Animals" subcategory="Octopus, Squid & Cephalopods" parentCategory="Pets & Animals" icon={Dog} />} />
            
            {/* History Subcategories */}
            <Route path="/education/american-history" element={<SubcategoryPage category="Education" subcategory="American History" parentCategory="Education" icon={GraduationCap} />} />
            <Route path="/education/biblical-history" element={<SubcategoryPage category="Education" subcategory="Biblical History" parentCategory="Education" icon={GraduationCap} />} />
            <Route path="/education/bible-quotes" element={<SubcategoryPage category="Education" subcategory="Bible Quotes & Scriptures" parentCategory="Education" icon={GraduationCap} />} />
            
            {/* Science & Technology Subcategories */}
            <Route path="/science-tech/artifacts" element={<SubcategoryPage category="Science & Technology" subcategory="Artifacts, Antiques & Antiquities" parentCategory="Science & Technology" icon={Microscope} />} />
            <Route path="/science-tech/ai" element={<SubcategoryPage category="Science & Technology" subcategory="Artificial Intelligence" parentCategory="Science & Technology" icon={Microscope} />} />
            <Route path="/science-tech/humanoid-robots" element={<SubcategoryPage category="Science & Technology" subcategory="Humanoid Robots" parentCategory="Science & Technology" icon={Microscope} />} />
            <Route path="/science-tech/robots" element={<SubcategoryPage category="Science & Technology" subcategory="Robots" parentCategory="Science & Technology" icon={Microscope} />} />
            
            {/* Disaster Subcategories */}
            <Route path="/disasters/avalanche" element={<SubcategoryPage category="Disasters" subcategory="Avalanche" parentCategory="Disasters" icon={Globe} />} />
            
            {/* Boats Subcategory */}
            <Route path="/boats/all" element={<SubcategoryPage category="Boats" subcategory="All Boats" parentCategory="Boats" icon={Ship} />} />
            
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </UploadedVideosProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
