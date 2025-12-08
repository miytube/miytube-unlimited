
import { Route } from "react-router-dom";
import GenericSubcategoryPage from "@/pages/categories/GenericSubcategoryPage";

export const specialSubcategoryRoutes = [
  /* Entertainment Routes */
  <Route key="entertainment-acting" path="/entertainment/acting" element={<GenericSubcategoryPage />} />,
  <Route key="entertainment-actors-actress" path="/entertainment/actors-actress" element={<GenericSubcategoryPage />} />,
  <Route key="entertainment-actors-info" path="/entertainment/actors-info" element={<GenericSubcategoryPage />} />,
  <Route key="entertainment-auditions" path="/entertainment/auditions" element={<GenericSubcategoryPage />} />,
  
  /* Film & Animation Routes */
  <Route key="film-animation-military" path="/film-animation/military" element={<GenericSubcategoryPage />} />,
  <Route key="film-animation-classics" path="/film-animation/classics" element={<GenericSubcategoryPage />} />,
  <Route key="film-animation-bloopers" path="/film-animation/bloopers" element={<GenericSubcategoryPage />} />,
  
  /* Airports Routes */
  <Route key="airports-fails" path="/airports/fails" element={<GenericSubcategoryPage />} />,
  
  /* Airplanes Routes */
  <Route key="travel-events-airplanes-airships" path="/travel-events/airplanes-airships" element={<GenericSubcategoryPage />} />,
  <Route key="travel-events-airplanes-cargo" path="/travel-events/airplanes-cargo" element={<GenericSubcategoryPage />} />,
  <Route key="travel-events-airplanes-commercial" path="/travel-events/airplanes-commercial" element={<GenericSubcategoryPage />} />,
  <Route key="travel-events-airplanes-land-water" path="/travel-events/airplanes-land-water" element={<GenericSubcategoryPage />} />,
  <Route key="travel-events-airplanes-pilots" path="/travel-events/airplanes-pilots" element={<GenericSubcategoryPage />} />,
  <Route key="travel-events-airplanes-single-engine" path="/travel-events/airplanes-single-engine" element={<GenericSubcategoryPage />} />,
  
  /* Animal Routes */
  <Route key="pets-animals-amphibians" path="/pets-animals/amphibians" element={<GenericSubcategoryPage />} />,
  <Route key="pets-animals-insects" path="/pets-animals/insects" element={<GenericSubcategoryPage />} />,
  <Route key="pets-animals-birds" path="/pets-animals/birds" element={<GenericSubcategoryPage />} />,
  <Route key="pets-animals-crustaceans" path="/pets-animals/crustaceans" element={<GenericSubcategoryPage />} />,
  <Route key="pets-animals-fish" path="/pets-animals/fish" element={<GenericSubcategoryPage />} />,
  <Route key="pets-animals-mammals" path="/pets-animals/mammals" element={<GenericSubcategoryPage />} />,
  <Route key="pets-animals-marine-mammals" path="/pets-animals/marine-mammals" element={<GenericSubcategoryPage />} />,
  <Route key="pets-animals-reptiles" path="/pets-animals/reptiles" element={<GenericSubcategoryPage />} />,
  <Route key="pets-animals-rodents" path="/pets-animals/rodents" element={<GenericSubcategoryPage />} />,
  <Route key="pets-animals-cephalopods" path="/pets-animals/cephalopods" element={<GenericSubcategoryPage />} />,
  
  /* History Routes */
  <Route key="education-american-history" path="/education/american-history" element={<GenericSubcategoryPage />} />,
  <Route key="education-biblical-history" path="/education/biblical-history" element={<GenericSubcategoryPage />} />,
  <Route key="education-bible-quotes" path="/education/bible-quotes" element={<GenericSubcategoryPage />} />,
  
  /* Science & Technology Routes */
  <Route key="science-tech-artifacts" path="/science-tech/artifacts" element={<GenericSubcategoryPage />} />,
  <Route key="science-tech-ai" path="/science-tech/ai" element={<GenericSubcategoryPage />} />,
  <Route key="science-tech-humanoid-robots" path="/science-tech/humanoid-robots" element={<GenericSubcategoryPage />} />,
  <Route key="science-tech-robots" path="/science-tech/robots" element={<GenericSubcategoryPage />} />,
  
  /* Boats Routes */
  <Route key="boats-all" path="/boats/all" element={<GenericSubcategoryPage />} />,
];
