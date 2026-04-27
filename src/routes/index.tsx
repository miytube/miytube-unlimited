
import { Route, Routes } from "react-router-dom";
import Index from "@/pages/Index";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="*" element={<Index />} />
    </Routes>
  );
};

export default AppRoutes;
