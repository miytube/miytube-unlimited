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
import MilitaryPilots from "@/pages/military/MilitaryPilots";
import MilitaryReserves from "@/pages/military/MilitaryReserves";
import MilitaryConduct from "@/pages/military/MilitaryConduct";
import MilitaryAircrafts from "@/pages/military/MilitaryAircrafts";
import MilitaryDocumentary from "@/pages/military/MilitaryDocumentary";
import MilitaryShips from "@/pages/military/MilitaryShips";
import MilitarySubmarines from "@/pages/military/MilitarySubmarines";
import MilitaryWar from "@/pages/military/MilitaryWar";
import MilitaryDrones from "@/pages/military/MilitaryDrones";
import MilitaryPersonnel from "@/pages/military/MilitaryPersonnel";

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
  <Route key="military-pilots" path="/military/pilots" element={<MilitaryPilots />} />,
  <Route key="military-reserves" path="/military/reserves" element={<MilitaryReserves />} />,
  <Route key="military-conduct" path="/military/conduct" element={<MilitaryConduct />} />,
  <Route key="military-aircrafts" path="/military/aircrafts" element={<MilitaryAircrafts />} />,
  <Route key="military-documentary" path="/military/documentary" element={<MilitaryDocumentary />} />,
  <Route key="military-ships" path="/military/ships" element={<MilitaryShips />} />,
  <Route key="military-submarines" path="/military/submarines" element={<MilitarySubmarines />} />,
  <Route key="military-war" path="/military/war" element={<MilitaryWar />} />,
  <Route key="military-drones" path="/military/drones" element={<MilitaryDrones />} />,
  <Route key="military-personnel" path="/military/personnel" element={<MilitaryPersonnel />} />,
];
