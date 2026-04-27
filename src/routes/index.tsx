import { Routes } from "react-router-dom";
import { mainRoutes } from "./mainRoutes";
import { categoryRoutes } from "./categoryRoutes";
import { contentRoutes } from "./contentRoutes";
import { mediaRoutes } from "./mediaRoutes";
import { audioRoutes } from "./audioRoutes";
import { musicRoutes } from "./musicRoutes";
import { filmRoutes } from "./filmRoutes";
import { gamingRoutes } from "./gamingRoutes";
import { hollywoodRoutes } from "./hollywoodRoutes";
import { militaryRoutes } from "./militaryRoutes";
import { newsRoutes } from "./newsRoutes";
import { podcastRoutes } from "./podcastRoutes";
import { subcategoryRoutes } from "./subcategoryRoutes";
import { newSubcategoryRoutes } from "./newSubcategoryRoutes";
import { sidebarSubcategoryRoutes } from "./sidebarSubcategoryRoutes";
import { specialSubcategoryRoutes } from "./specialSubcategoryRoutes";
import { comprehensiveSubcategoryRoutes } from "./comprehensiveSubcategoryRoutes";
import { allCategoryRoutes } from "./allCategoryRoutes";

const AppRoutes = () => {
  return (
    <Routes>
      {categoryRoutes}
      {contentRoutes}
      {mediaRoutes}
      {audioRoutes}
      {musicRoutes}
      {filmRoutes}
      {gamingRoutes}
      {hollywoodRoutes}
      {militaryRoutes}
      {newsRoutes}
      {podcastRoutes}
      {allCategoryRoutes}
      {subcategoryRoutes}
      {newSubcategoryRoutes}
      {sidebarSubcategoryRoutes}
      {specialSubcategoryRoutes}
      {comprehensiveSubcategoryRoutes}
      {mainRoutes}
    </Routes>
  );
};

export default AppRoutes;
