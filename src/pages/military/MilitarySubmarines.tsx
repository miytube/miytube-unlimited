import React from 'react';
import GenericCategoryPage from "@/components/GenericCategoryPage";
import { Anchor } from "lucide-react";

const MilitarySubmarines = () => {
  return (
    <GenericCategoryPage
      title="Submarines"
      description="Military submarines and underwater operations"
      Icon={Anchor}
    />
  );
};

export default MilitarySubmarines;
