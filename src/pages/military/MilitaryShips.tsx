import React from 'react';
import GenericCategoryPage from "@/components/GenericCategoryPage";
import { Ship } from "lucide-react";

const MilitaryShips = () => {
  return (
    <GenericCategoryPage
      title="Military Ships"
      description="Aircraft carriers, destroyers, and naval vessels"
      Icon={Ship}
    />
  );
};

export default MilitaryShips;
