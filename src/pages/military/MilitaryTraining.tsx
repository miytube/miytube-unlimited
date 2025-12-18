import React from 'react';
import GenericCategoryPage from "@/components/GenericCategoryPage";
import { Dumbbell } from "lucide-react";

const MilitaryTraining = () => {
  return (
    <GenericCategoryPage
      title="Training & Boot Camp"
      description="Military training programs, boot camps, and fitness regimens"
      Icon={Dumbbell}
    />
  );
};

export default MilitaryTraining;