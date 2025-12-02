
import { Routes } from "react-router-dom";
import { mainRoutes } from "./mainRoutes";
import { mediaRoutes } from "./mediaRoutes";
import { contentRoutes } from "./contentRoutes";
import { categoryRoutes } from "./categoryRoutes";
import { subcategoryRoutes } from "./subcategoryRoutes";
import { specialSubcategoryRoutes } from "./specialSubcategoryRoutes";
import { newSubcategoryRoutes } from "./newSubcategoryRoutes";
import { allCategoryRoutes } from "./allCategoryRoutes";
import { musicRoutes } from "./musicRoutes";
import { gamingRoutes } from "./gamingRoutes";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Main Routes */}
      {mainRoutes}
      
      {/* Media Type Routes */}
      {mediaRoutes}
      
      {/* Content Category Routes */}
      {contentRoutes}
      
      {/* Category Pages */}
      {categoryRoutes}
      
      {/* Music Routes */}
      {musicRoutes}
      
      {/* Gaming Routes */}
      {gamingRoutes}
      
      {/* Subcategory Routes */}
      {subcategoryRoutes}
      
      {/* Special Subcategory Routes with Custom Components */}
      {specialSubcategoryRoutes}
      
      {/* New Subcategory Routes */}
      {newSubcategoryRoutes}
      
      {/* All Category Routes */}
      {allCategoryRoutes}
    </Routes>
  );
};

export default AppRoutes;
