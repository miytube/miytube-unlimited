import React from 'react';
import GenericCategoryPage from "@/components/GenericCategoryPage";
import { Anchor } from "lucide-react";

const MilitaryNavy = () => {
  return (
    <GenericCategoryPage
      title="Navy"
      description="Naval operations, ships, and maritime defense"
      Icon={Anchor}
    />
  );
};

export default MilitaryNavy;
