import React from 'react';
import GenericCategoryPage from "@/components/GenericCategoryPage";
import { Plane } from "lucide-react";

const MilitaryAircrafts = () => {
  return (
    <GenericCategoryPage
      title="Military Aircrafts"
      description="Fighter jets, bombers, and military aircraft"
      Icon={Plane}
    />
  );
};

export default MilitaryAircrafts;
