import React from 'react';
import GenericCategoryPage from "@/components/GenericCategoryPage";
import { Target } from "lucide-react";

const MilitarySpecialForces = () => {
  return (
    <GenericCategoryPage
      title="Special Forces"
      description="Elite military units, special operations, and tactical missions"
      Icon={Target}
    />
  );
};

export default MilitarySpecialForces;