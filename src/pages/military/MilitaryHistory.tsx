import React from 'react';
import GenericCategoryPage from "@/components/GenericCategoryPage";
import { BookOpen } from "lucide-react";

const MilitaryHistory = () => {
  return (
    <GenericCategoryPage
      title="Military History"
      description="Historical battles, wars, and military campaigns throughout history"
      Icon={BookOpen}
    />
  );
};

export default MilitaryHistory;