import { Route } from "react-router-dom";
import Military from "@/pages/Military";
import MilitaryArmy from "@/pages/military/MilitaryArmy";
import MilitaryAirforce from "@/pages/military/MilitaryAirforce";
import MilitaryNavy from "@/pages/military/MilitaryNavy";
import MilitaryCoastGuard from "@/pages/military/MilitaryCoastGuard";
import MilitaryMarines from "@/pages/military/MilitaryMarines";
import MilitarySpecialForces from "@/pages/military/MilitarySpecialForces";
import MilitaryVeterans from "@/pages/military/MilitaryVeterans";
import MilitaryHistory from "@/pages/military/MilitaryHistory";
import MilitaryEquipment from "@/pages/military/MilitaryEquipment";
import MilitaryTraining from "@/pages/military/MilitaryTraining";

export const militaryRoutes = [
  <Route key="military" path="/military" element={<Military />} />,
  <Route key="military-army" path="/military/army" element={<MilitaryArmy />} />,
  <Route key="military-airforce" path="/military/airforce" element={<MilitaryAirforce />} />,
  <Route key="military-navy" path="/military/navy" element={<MilitaryNavy />} />,
  <Route key="military-coast-guard" path="/military/coast-guard" element={<MilitaryCoastGuard />} />,
  <Route key="military-marines" path="/military/marines" element={<MilitaryMarines />} />,
  <Route key="military-special-forces" path="/military/special-forces" element={<MilitarySpecialForces />} />,
  <Route key="military-veterans" path="/military/veterans" element={<MilitaryVeterans />} />,
  <Route key="military-history" path="/military/history" element={<MilitaryHistory />} />,
  <Route key="military-equipment" path="/military/equipment" element={<MilitaryEquipment />} />,
  <Route key="military-training" path="/military/training" element={<MilitaryTraining />} />,
];
