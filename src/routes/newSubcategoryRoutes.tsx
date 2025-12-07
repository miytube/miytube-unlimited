
import React from 'react';
import { Route } from "react-router-dom";
import GenericSubcategoryPage from "@/pages/categories/GenericSubcategoryPage";

export const newSubcategoryRoutes = [
  // Boats routes
  <Route key="boats-yachts" path="/boats/yachts" element={<GenericSubcategoryPage />} />,
  
  // Shipping routes
  <Route key="shipping-cargo-ships" path="/shipping/cargo-ships" element={<GenericSubcategoryPage />} />,
  <Route key="shipping-oil-tankers" path="/shipping/oil-tankers" element={<GenericSubcategoryPage />} />,
  
  // Sports routes
  <Route key="sports-basketball" path="/sports/basketball" element={<GenericSubcategoryPage />} />,
  <Route key="sports-baseball" path="/sports/baseball" element={<GenericSubcategoryPage />} />,
  <Route key="sports-football" path="/sports/football" element={<GenericSubcategoryPage />} />,
  <Route key="sports-soccer" path="/sports/soccer" element={<GenericSubcategoryPage />} />,
  <Route key="sports-hockey" path="/sports/hockey" element={<GenericSubcategoryPage />} />,
  <Route key="sports-swimming" path="/sports/swimming" element={<GenericSubcategoryPage />} />,
  <Route key="sports-nascar" path="/sports/nascar" element={<GenericSubcategoryPage />} />,
  <Route key="sports-drag-racing" path="/sports/drag-racing" element={<GenericSubcategoryPage />} />,
  <Route key="sports-dirt-racing" path="/sports/dirt-racing" element={<GenericSubcategoryPage />} />,
  <Route key="sports-motorcycle-racing" path="/sports/motorcycle-racing" element={<GenericSubcategoryPage />} />,
  <Route key="sports-motorcycle-drag" path="/sports/motorcycle-drag" element={<GenericSubcategoryPage />} />,
  <Route key="sports-olympics" path="/sports/olympics" element={<GenericSubcategoryPage />} />,
  <Route key="sports-horse-racing" path="/sports/horse-racing" element={<GenericSubcategoryPage />} />,

  // Autos & Vehicles routes
  <Route key="autos-vehicles-supercars" path="/autos-vehicles/supercars" element={<GenericSubcategoryPage />} />,
  <Route key="autos-vehicles-expensive-cars" path="/autos-vehicles/expensive-cars" element={<GenericSubcategoryPage />} />,
  <Route key="autos-vehicles-car-repairs" path="/autos-vehicles/car-repairs" element={<GenericSubcategoryPage />} />,
  <Route key="autos-vehicles-car-hacks" path="/autos-vehicles/car-hacks" element={<GenericSubcategoryPage />} />,

  // Music routes
  <Route key="music-spanish" path="/music/spanish" element={<GenericSubcategoryPage />} />,
  <Route key="music-folk" path="/music/folk" element={<GenericSubcategoryPage />} />,
  <Route key="music-chinese" path="/music/chinese" element={<GenericSubcategoryPage />} />,
  <Route key="music-r-and-b" path="/music/r-and-b" element={<GenericSubcategoryPage />} />,
  <Route key="music-soul" path="/music/soul" element={<GenericSubcategoryPage />} />,
  <Route key="music-jazz" path="/music/jazz" element={<GenericSubcategoryPage />} />,
  <Route key="music-country" path="/music/country" element={<GenericSubcategoryPage />} />,

  // Music Artists routes
  <Route key="music-artists" path="/music-artists" element={<GenericSubcategoryPage />} />,
  <Route key="music-artists-info" path="/music-artists/info" element={<GenericSubcategoryPage />} />,
  <Route key="music-artists-works" path="/music-artists/works" element={<GenericSubcategoryPage />} />,

  // Education routes
  <Route key="education-math" path="/education/math" element={<GenericSubcategoryPage />} />,
  <Route key="education-science" path="/education/science" element={<GenericSubcategoryPage />} />,
  <Route key="education-music" path="/education/music-education" element={<GenericSubcategoryPage />} />,

  // Military routes
  <Route key="military" path="/military" element={<GenericSubcategoryPage />} />,
  <Route key="military-personnel" path="/military/personnel" element={<GenericSubcategoryPage />} />,
  <Route key="military-airplanes" path="/military/airplanes" element={<GenericSubcategoryPage />} />,
  <Route key="military-ships" path="/military/ships" element={<GenericSubcategoryPage />} />,
  <Route key="military-boats" path="/military/boats" element={<GenericSubcategoryPage />} />,
  <Route key="military-aircraft-carriers" path="/military/aircraft-carriers" element={<GenericSubcategoryPage />} />,
  <Route key="military-submarines" path="/military/submarines" element={<GenericSubcategoryPage />} />,
  <Route key="military-weapons" path="/military/weapons" element={<GenericSubcategoryPage />} />,
  <Route key="military-heavy-weapons" path="/military/heavy-weapons" element={<GenericSubcategoryPage />} />,

  // Law & Justice routes
  <Route key="courts-police-sheriffs" path="/courts-police/police-sheriffs" element={<GenericSubcategoryPage />} />,
  <Route key="courts-police-fbi-atf" path="/courts-police/fbi-atf" element={<GenericSubcategoryPage />} />,
  <Route key="courts-police-car-chases" path="/courts-police/car-chases" element={<GenericSubcategoryPage />} />,
  <Route key="courts-police-shootings" path="/courts-police/shootings" element={<GenericSubcategoryPage />} />,

  // Travel & Events routes
  <Route key="travel-events-cities-towns" path="/travel-events/cities-towns" element={<GenericSubcategoryPage />} />,
  <Route key="travel-events-hotels" path="/travel-events/hotels" element={<GenericSubcategoryPage />} />,
  <Route key="travel-events-expensive-hotels" path="/travel-events/expensive-hotels" element={<GenericSubcategoryPage />} />,
  <Route key="travel-events-night-clubs" path="/travel-events/night-clubs" element={<GenericSubcategoryPage />} />,
  <Route key="travel-events-street-foods" path="/travel-events/street-foods" element={<GenericSubcategoryPage />} />,
  <Route key="travel-events-travel-hacks" path="/travel-events/travel-hacks" element={<GenericSubcategoryPage />} />,
  <Route key="travel-events-beaches" path="/travel-events/beaches" element={<GenericSubcategoryPage />} />,
  <Route key="travel-events-lagoons" path="/travel-events/lagoons" element={<GenericSubcategoryPage />} />,
  <Route key="travel-events-airplanes-business" path="/travel-events/airplanes-business" element={<GenericSubcategoryPage />} />,

  // Places & Locations routes
  <Route key="beaches" path="/beaches" element={<GenericSubcategoryPage />} />,

  // Entertainment routes
  <Route key="entertainment-actors-works" path="/entertainment/actors-works" element={<GenericSubcategoryPage />} />,

  // Physical Fitness routes
  <Route key="fitness-weight-lifting" path="/physical-fitness/weight-lifting" element={<GenericSubcategoryPage />} />,
  <Route key="fitness-weightlifting-female" path="/physical-fitness/weightlifting-female" element={<GenericSubcategoryPage />} />,
  <Route key="fitness-weightlifting-male" path="/physical-fitness/weightlifting-male" element={<GenericSubcategoryPage />} />,
  <Route key="fitness-workers" path="/physical-fitness/workers" element={<GenericSubcategoryPage />} />,
  <Route key="fitness-workout" path="/physical-fitness/workout" element={<GenericSubcategoryPage />} />,
  <Route key="fitness-workout-female" path="/physical-fitness/workout-female" element={<GenericSubcategoryPage />} />,
  <Route key="fitness-workout-fitness" path="/physical-fitness/workout-fitness" element={<GenericSubcategoryPage />} />,
  <Route key="fitness-workout-male" path="/physical-fitness/workout-male" element={<GenericSubcategoryPage />} />,
  <Route key="fitness-yoga-workout" path="/physical-fitness/yoga-workout" element={<GenericSubcategoryPage />} />,
  <Route key="fitness-calisthenics" path="/physical-fitness/calisthenics" element={<GenericSubcategoryPage />} />,
];
