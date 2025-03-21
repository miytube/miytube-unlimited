
import { Routes } from "react-router-dom";
import { mainRoutes } from "./mainRoutes";
import { mediaRoutes } from "./mediaRoutes";
import { contentRoutes } from "./contentRoutes";
import { categoryRoutes } from "./categoryRoutes";
import { subcategoryRoutes } from "./subcategoryRoutes";
import { specialSubcategoryRoutes } from "./specialSubcategoryRoutes";
import { newSubcategoryRoutes } from "./newSubcategoryRoutes";

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
      
      {/* Subcategory Routes */}
      {subcategoryRoutes}
      
      {/* Special Subcategory Routes with Custom Components */}
      {specialSubcategoryRoutes}
      
      {/* New Subcategory Routes */}
      {newSubcategoryRoutes}
    </Routes>
  );
};

export default AppRoutes;
