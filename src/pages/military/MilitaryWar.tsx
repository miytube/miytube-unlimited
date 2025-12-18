import React from 'react';
import GenericCategoryPage from "@/components/GenericCategoryPage";
import { Shield } from "lucide-react";

const MilitaryWar = () => {
  return (
    <GenericCategoryPage
      title="Military War"
      description="Combat footage, war coverage, and military operations"
      Icon={Shield}
    />
  );
};

export default MilitaryWar;
