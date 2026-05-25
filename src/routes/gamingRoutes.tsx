
import { Route } from "react-router-dom";
import Gaming from "@/pages/Gaming";
import GenericSubcategoryPage from "@/pages/categories/GenericSubcategoryPage";

const gamingSubcategories = [
  'game-challenges', 'game-toys', 'arcade-games', 'casino-slots', 'dominos',
  'lottery', 'xbox-playstation', 'xbox-playstation-nintendo', 'gaming-cards', 'magic-tricks', 'fps', 'moba', 'esports'
];

export const gamingRoutes = [
  <Route key="gaming-main" path="/gaming" element={<Gaming />} />,
  ...gamingSubcategories.map(sub => (
    <Route key={`gaming-${sub}`} path={`/gaming/${sub}`} element={<GenericSubcategoryPage />} />
  )),
];
