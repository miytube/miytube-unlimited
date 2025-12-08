import React from 'react';
import GenericCategoryPage from "@/components/GenericCategoryPage";
import { Ship } from "lucide-react";

const MilitaryCoastGuard = () => {
  return (
    <GenericCategoryPage
      title="Coast Guard"
      description="Coastal defense, search and rescue, and maritime security"
      Icon={Ship}
    />
  );
};

export default MilitaryCoastGuard;
