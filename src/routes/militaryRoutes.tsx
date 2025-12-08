import { Route } from "react-router-dom";
import Military from "@/pages/Military";
import MilitaryArmy from "@/pages/military/MilitaryArmy";
import MilitaryAirforce from "@/pages/military/MilitaryAirforce";
import MilitaryNavy from "@/pages/military/MilitaryNavy";
import MilitaryCoastGuard from "@/pages/military/MilitaryCoastGuard";
import MilitaryMarines from "@/pages/military/MilitaryMarines";

export const militaryRoutes = [
  <Route key="military" path="/military" element={<Military />} />,
  <Route key="military-army" path="/military/army" element={<MilitaryArmy />} />,
  <Route key="military-airforce" path="/military/airforce" element={<MilitaryAirforce />} />,
  <Route key="military-navy" path="/military/navy" element={<MilitaryNavy />} />,
  <Route key="military-coast-guard" path="/military/coast-guard" element={<MilitaryCoastGuard />} />,
  <Route key="military-marines" path="/military/marines" element={<MilitaryMarines />} />,
];
