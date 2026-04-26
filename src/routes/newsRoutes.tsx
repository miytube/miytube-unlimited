import { Route } from "react-router-dom";
import BreakingNewsCategory from "@/pages/news/BreakingNewsCategory";
import PoliticsCategory from "@/pages/news/PoliticsCategory";
import WorldNewsCategory from "@/pages/news/WorldNewsCategory";
import LocalNewsCategory from "@/pages/news/LocalNewsCategory";

export const newsRoutes = [
  <Route key="news-breaking-page" path="/news/breaking" element={<BreakingNewsCategory />} />,
  <Route key="news-politics-page" path="/news/politics" element={<PoliticsCategory />} />,
  <Route key="news-world-page" path="/news/world" element={<WorldNewsCategory />} />,
  <Route key="news-local-page" path="/news/local" element={<LocalNewsCategory />} />,
];
