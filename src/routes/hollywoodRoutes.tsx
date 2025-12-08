
import { Route } from "react-router-dom";
import Hollywood from "@/pages/Hollywood";
import HollywoodBios from "@/pages/hollywood/HollywoodBios";
import HollywoodNews from "@/pages/hollywood/HollywoodNews";
import HollywoodInterviews from "@/pages/hollywood/HollywoodInterviews";

export const hollywoodRoutes = [
  <Route key="hollywood" path="/hollywood" element={<Hollywood />} />,
  <Route key="hollywood-bios" path="/hollywood/bios" element={<HollywoodBios />} />,
  <Route key="hollywood-news" path="/hollywood/news" element={<HollywoodNews />} />,
  <Route key="hollywood-interviews" path="/hollywood/interviews" element={<HollywoodInterviews />} />,
];
