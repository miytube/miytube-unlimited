import React from 'react';
import GenericCategoryPage from "@/components/GenericCategoryPage";
import { Plane } from "lucide-react";

const MilitaryPilots = () => {
  return (
    <GenericCategoryPage
      title="Pilots"
      description="Military pilots and aviation personnel"
      Icon={Plane}
    />
  );
};

export default MilitaryPilots;
