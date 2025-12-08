import React from 'react';
import GenericCategoryPage from "@/components/GenericCategoryPage";
import { Shield } from "lucide-react";

const MilitaryArmy = () => {
  return (
    <GenericCategoryPage
      title="Army"
      description="Ground forces, infantry operations, and army personnel"
      Icon={Shield}
    />
  );
};

export default MilitaryArmy;
