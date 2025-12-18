import React from 'react';
import GenericCategoryPage from "@/components/GenericCategoryPage";
import { Plane } from "lucide-react";

const MilitaryDrones = () => {
  return (
    <GenericCategoryPage
      title="Weapons Drones"
      description="Military drones and unmanned aerial vehicles"
      Icon={Plane}
    />
  );
};

export default MilitaryDrones;
