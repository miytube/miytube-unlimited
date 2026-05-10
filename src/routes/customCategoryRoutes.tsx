import { Route } from 'react-router-dom';
import CustomCategoryPage from '@/pages/CustomCategoryPage';
import GenericSubcategoryPage from '@/pages/categories/GenericSubcategoryPage';

export const customCategoryRoutes = [
  <Route key="cc-cat" path="/c/:categorySlug" element={<CustomCategoryPage mode="category" />} />,
  <Route
    key="cc-sub"
    path="/c/:categorySlug/:subSlug"
    element={<CustomCategoryPage mode="subcategory" />}
  />,
  <Route
    key="cc-watch"
    path="/c/:categorySlug/:subSlug/:watchSlug"
    element={<CustomCategoryPage mode="watch" />}
  />,
  <Route key="cc-native-sub" path="/:categorySlug/:subSlug" element={<GenericSubcategoryPage />} />,
  <Route key="cc-native-watch" path="/:categorySlug/:subSlug/:watchSlug" element={<GenericSubcategoryPage />} />,
  <Route key="cc-native-nested-sub" path="/:categorySlug/:sectionSlug/:subSlug" element={<GenericSubcategoryPage />} />,
  <Route key="cc-native-nested-watch" path="/:categorySlug/:sectionSlug/:subSlug/:watchSlug" element={<GenericSubcategoryPage />} />,
];
