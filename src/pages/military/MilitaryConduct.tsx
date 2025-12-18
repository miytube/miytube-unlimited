import React from 'react';
import GenericCategoryPage from "@/components/GenericCategoryPage";
import { FileText } from "lucide-react";

const MilitaryConduct = () => {
  return (
    <GenericCategoryPage
      title="Conduct & Policy"
      description="Military conduct, policies, and regulations"
      Icon={FileText}
    />
  );
};

export default MilitaryConduct;
