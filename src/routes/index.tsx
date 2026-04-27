import { Routes } from "react-router-dom";
import { mainRoutes } from "./mainRoutes";
import { categoryRoutes } from "./categoryRoutes";
import { contentRoutes } from "./contentRoutes";
import { mediaRoutes } from "./mediaRoutes";
import { subcategoryRoutes } from "./subcategoryRoutes";
import { allCategoryRoutes } from "./allCategoryRoutes";
import { audioRoutes } from "./audioRoutes";
import { filmRoutes } from "./filmRoutes";
import { gamingRoutes } from "./gamingRoutes";
import { hollywoodRoutes } from "./hollywoodRoutes";
import { militaryRoutes } from "./militaryRoutes";
import { musicRoutes } from "./musicRoutes";
import { newsRoutes } from "./newsRoutes";
import { podcastRoutes } from "./podcastRoutes";
import { sidebarSubcategoryRoutes } from "./sidebarSubcategoryRoutes";
import { specialSubcategoryRoutes } from "./specialSubcategoryRoutes";
import { newSubcategoryRoutes } from "./newSubcategoryRoutes";
import { comprehensiveSubcategoryRoutes } from "./comprehensiveSubcategoryRoutes";

const AppRoutes = () => {
  return (
    <Routes>
      {mainRoutes}
      {categoryRoutes}
      {contentRoutes}
      {mediaRoutes}
      {subcategoryRoutes}
      {allCategoryRoutes}
      {audioRoutes}
      {filmRoutes}
      {gamingRoutes}
      {hollywoodRoutes}
      {militaryRoutes}
      {musicRoutes}
      {newsRoutes}
      {podcastRoutes}
      {sidebarSubcategoryRoutes}
      {specialSubcategoryRoutes}
      {newSubcategoryRoutes}
      {comprehensiveSubcategoryRoutes}
    </Routes>
  );
};

export default AppRoutes;
