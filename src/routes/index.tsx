
import { Route, Routes } from "react-router-dom";
import { mainRoutes } from "./mainRoutes";
import NotFound from "@/pages/NotFound";

const AppRoutes = () => {
  return (
    <Routes>
      {mainRoutes}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
