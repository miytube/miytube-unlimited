import React from 'react';
import GenericCategoryPage from "@/components/GenericCategoryPage";
import { Film } from "lucide-react";

const MilitaryDocumentary = () => {
  return (
    <GenericCategoryPage
      title="Military Documentary"
      description="War documentaries and military history films"
      Icon={Film}
    />
  );
};

export default MilitaryDocumentary;
