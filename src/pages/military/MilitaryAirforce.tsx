import React from 'react';
import GenericCategoryPage from "@/components/GenericCategoryPage";
import { Plane } from "lucide-react";

const MilitaryAirforce = () => {
  return (
    <GenericCategoryPage
      title="Air Force"
      description="Aerial warfare, air defense, and aviation operations"
      Icon={Plane}
    />
  );
};

export default MilitaryAirforce;
