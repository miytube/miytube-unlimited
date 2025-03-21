
import { Route } from "react-router-dom";
import SubcategoryPage from "@/components/SubcategoryPage";
import GenericSubcategoryPage from "@/pages/categories/GenericSubcategoryPage";

import { 
  Film, GraduationCap, Car, Scissors, HeartHandshake, Users, Dog, 
  Microscope, Plane, Pizza, Utensils, Quote, Clapperboard, Star, 
  Gavel, Ship, UserRound, House, Anchor, Truck
} from 'lucide-react';

export const specialSubcategoryRoutes = [
  /* Entertainment Routes */
  <Route key="entertainment-acting" path="/entertainment/acting" element={<SubcategoryPage category="Entertainment" subcategory="Acting (Off Script, Unscripted)" parentCategory="Entertainment" icon={Film} />} />,
  <Route key="entertainment-actors-actress" path="/entertainment/actors-actress" element={<SubcategoryPage category="Entertainment" subcategory="Actors & Actresses (Bios)" parentCategory="Entertainment" icon={Film} />} />,
  <Route key="entertainment-actors-info" path="/entertainment/actors-info" element={<SubcategoryPage category="Entertainment" subcategory="Actors, Actresses Information" parentCategory="Entertainment" icon={Film} />} />,
  <Route key="entertainment-auditions" path="/entertainment/auditions" element={<SubcategoryPage category="Entertainment" subcategory="Auditions & Contests" parentCategory="Entertainment" icon={Film} />} />,
  
  /* Film & Animation Routes */
  <Route key="film-animation-military" path="/film-animation/military" element={<SubcategoryPage category="Film & Animation" subcategory="Military Animation & Film" parentCategory="Film & Animation Movies" icon={Clapperboard} />} />,
  <Route key="film-animation-classics" path="/film-animation/classics" element={<SubcategoryPage category="Film & Animation" subcategory="Classics Animation, Film, Movies" parentCategory="Film & Animation Movies" icon={Clapperboard} />} />,
  <Route key="film-animation-bloopers" path="/film-animation/bloopers" element={<SubcategoryPage category="Film & Animation" subcategory="Bloopers (Screwups, Blunders)" parentCategory="Film & Animation Movies" icon={Clapperboard} />} />,
  
  /* Airports Routes */
  <Route key="airports-fails" path="/airports/fails" element={<SubcategoryPage category="Airports" subcategory="Airport Fails" parentCategory="Airports" icon={Plane} />} />,
  
  /* Airplanes Routes */
  <Route key="travel-events-airplanes-airships" path="/travel-events/airplanes-airships" element={<SubcategoryPage category="Travel & Events" subcategory="Airplanes (Airships, Blimps)" parentCategory="Travel & Events" icon={Plane} />} />,
  <Route key="travel-events-airplanes-cargo" path="/travel-events/airplanes-cargo" element={<SubcategoryPage category="Travel & Events" subcategory="Airplanes (Cargo Planes)" parentCategory="Travel & Events" icon={Plane} />} />,
  <Route key="travel-events-airplanes-commercial" path="/travel-events/airplanes-commercial" element={<SubcategoryPage category="Travel & Events" subcategory="Airplanes (Commercial, Jumbo)" parentCategory="Travel & Events" icon={Plane} />} />,
  <Route key="travel-events-airplanes-land-water" path="/travel-events/airplanes-land-water" element={<SubcategoryPage category="Travel & Events" subcategory="Airplanes (Land, Water)" parentCategory="Travel & Events" icon={Plane} />} />,
  <Route key="travel-events-airplanes-pilots" path="/travel-events/airplanes-pilots" element={<SubcategoryPage category="Travel & Events" subcategory="Airplanes (Pilots, Captains)" parentCategory="Travel & Events" icon={Plane} />} />,
  <Route key="travel-events-airplanes-single-engine" path="/travel-events/airplanes-single-engine" element={<SubcategoryPage category="Travel & Events" subcategory="Airplanes (Single Engine)" parentCategory="Travel & Events" icon={Plane} />} />,
  
  /* Animal Routes */
  <Route key="pets-animals-amphibians" path="/pets-animals/amphibians" element={<SubcategoryPage category="Pets & Animals" subcategory="Amphibians (Frogs, Salamanders)" parentCategory="Pets & Animals" icon={Dog} />} />,
  <Route key="pets-animals-insects" path="/pets-animals/insects" element={<SubcategoryPage category="Pets & Animals" subcategory="Insects & Spiders" parentCategory="Pets & Animals" icon={Dog} />} />,
  <Route key="pets-animals-birds" path="/pets-animals/birds" element={<SubcategoryPage category="Pets & Animals" subcategory="Birds & Raptors" parentCategory="Pets & Animals" icon={Dog} />} />,
  <Route key="pets-animals-crustaceans" path="/pets-animals/crustaceans" element={<SubcategoryPage category="Pets & Animals" subcategory="Crabs, Lobsters & Crustaceans" parentCategory="Pets & Animals" icon={Dog} />} />,
  <Route key="pets-animals-fish" path="/pets-animals/fish" element={<SubcategoryPage category="Pets & Animals" subcategory="Fish & Fishes" parentCategory="Pets & Animals" icon={Dog} />} />,
  <Route key="pets-animals-mammals" path="/pets-animals/mammals" element={<SubcategoryPage category="Pets & Animals" subcategory="Mammals, Birds & Reptiles" parentCategory="Pets & Animals" icon={Dog} />} />,
  <Route key="pets-animals-marine-mammals" path="/pets-animals/marine-mammals" element={<SubcategoryPage category="Pets & Animals" subcategory="Orcas, Dolphins & Marine Mammals" parentCategory="Pets & Animals" icon={Dog} />} />,
  <Route key="pets-animals-reptiles" path="/pets-animals/reptiles" element={<SubcategoryPage category="Pets & Animals" subcategory="Reptiles & Snakes" parentCategory="Pets & Animals" icon={Dog} />} />,
  <Route key="pets-animals-rodents" path="/pets-animals/rodents" element={<SubcategoryPage category="Pets & Animals" subcategory="Rodents, Rats & Beavers" parentCategory="Pets & Animals" icon={Dog} />} />,
  <Route key="pets-animals-cephalopods" path="/pets-animals/cephalopods" element={<SubcategoryPage category="Pets & Animals" subcategory="Octopus, Squid & Cephalopods" parentCategory="Pets & Animals" icon={Dog} />} />,
  
  /* History Routes */
  <Route key="education-american-history" path="/education/american-history" element={<SubcategoryPage category="Education" subcategory="American History" parentCategory="Education" icon={GraduationCap} />} />,
  <Route key="education-biblical-history" path="/education/biblical-history" element={<SubcategoryPage category="Education" subcategory="Biblical History" parentCategory="Education" icon={GraduationCap} />} />,
  <Route key="education-bible-quotes" path="/education/bible-quotes" element={<SubcategoryPage category="Education" subcategory="Bible Quotes & Scriptures" parentCategory="Education" icon={GraduationCap} />} />,
  
  /* Science & Technology Routes */
  <Route key="science-tech-artifacts" path="/science-tech/artifacts" element={<SubcategoryPage category="Science & Technology" subcategory="Artifacts, Antiques & Antiquities" parentCategory="Science & Technology" icon={Microscope} />} />,
  <Route key="science-tech-ai" path="/science-tech/ai" element={<SubcategoryPage category="Science & Technology" subcategory="Artificial Intelligence" parentCategory="Science & Technology" icon={Microscope} />} />,
  <Route key="science-tech-humanoid-robots" path="/science-tech/humanoid-robots" element={<SubcategoryPage category="Science & Technology" subcategory="Humanoid Robots" parentCategory="Science & Technology" icon={Microscope} />} />,
  <Route key="science-tech-robots" path="/science-tech/robots" element={<SubcategoryPage category="Science & Technology" subcategory="Robots" parentCategory="Science & Technology" icon={Microscope} />} />,
  
  /* Boats Routes */
  <Route key="boats-all" path="/boats/all" element={<SubcategoryPage category="Boats" subcategory="All Boats" parentCategory="Boats" icon={Ship} />} />,
];
