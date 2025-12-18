import React from 'react';
import GenericCategoryPage from "@/components/GenericCategoryPage";
import { Users } from "lucide-react";

const MilitaryPersonnel = () => {
  return (
    <GenericCategoryPage
      title="Personnel"
      description="Military personnel, soldiers, and service members"
      Icon={Users}
    />
  );
};

export default MilitaryPersonnel;
