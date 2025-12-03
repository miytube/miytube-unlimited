
import { Route } from "react-router-dom";
import SoundEffects from "@/pages/SoundEffects";
import ASMR from "@/pages/ASMR";

export const audioRoutes = [
  <Route key="sound-effects" path="/sound-effects" element={<SoundEffects />} />,
  <Route key="asmr" path="/asmr" element={<ASMR />} />,
];
