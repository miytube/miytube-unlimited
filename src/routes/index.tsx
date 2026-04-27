import { Route, Routes } from "react-router-dom";
import Index from "@/pages/Index";
import Watch from "@/pages/Watch";
import Upload from "@/pages/Upload";
import ShortsWatch from "@/pages/ShortsWatch";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/watch" element={<Watch />} />
      <Route path="/shorts/watch" element={<ShortsWatch />} />
      <Route path="/upload" element={<Upload />} />
      <Route path="*" element={<Index />} />
    </Routes>
  );
};

export default AppRoutes;
