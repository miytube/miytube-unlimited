import React from 'react';
import GenericCategoryPage from "@/components/GenericCategoryPage";
import { Users } from "lucide-react";

const MilitaryMarines = () => {
  return (
    <GenericCategoryPage
      title="Marines"
      description="Amphibious operations, rapid response, and marine corps"
      Icon={Users}
    />
  );
};

export default MilitaryMarines;
