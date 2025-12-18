import React from 'react';
import GenericCategoryPage from "@/components/GenericCategoryPage";
import { Users } from "lucide-react";

const MilitaryReserves = () => {
  return (
    <GenericCategoryPage
      title="Reserves"
      description="Military reserve forces and personnel"
      Icon={Users}
    />
  );
};

export default MilitaryReserves;
