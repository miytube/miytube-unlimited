import React from 'react';
import GenericCategoryPage from "@/components/GenericCategoryPage";
import { Crosshair } from "lucide-react";

const MilitaryEquipment = () => {
  return (
    <GenericCategoryPage
      title="Equipment & Weapons"
      description="Military equipment, weapons systems, and defense technology"
      Icon={Crosshair}
    />
  );
};

export default MilitaryEquipment;