import { Route } from 'react-router-dom';
import CustomCategoryPage from '@/pages/CustomCategoryPage';

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
];
