import React from 'react';
import GenericCategoryPage from "@/components/GenericCategoryPage";
import { Medal } from "lucide-react";

const MilitaryVeterans = () => {
  return (
    <GenericCategoryPage
      title="Veterans"
      description="Stories, support, and recognition of military veterans"
      Icon={Medal}
    />
  );
};

export default MilitaryVeterans;