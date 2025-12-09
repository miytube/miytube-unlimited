
import { SubcategoryMapping } from './types';
import { sportsSubcategories } from './sports';
import { businessSubcategories } from './business';
import { carsSubcategories } from './cars';
import { fitnessSubcategories } from './fitness';
import { comedySubcategories } from './comedy';
import { relationshipsSubcategories } from './relationships';
import { disastersSubcategories } from './disasters';
import { educationSubcategories } from './education';
import { courtsSubcategories } from './courts';
import { documentsSubcategories } from './documents';
import { shippingSubcategories } from './shipping';
import { cosmeticsSubcategories } from './cosmetics';
import { danceSubcategories } from './dance';
import { drinksSubcategories } from './drinks';
import { dronesSubcategories } from './drones';
import { entertainmentSubcategories } from './entertainment';
import { experimentsSubcategories } from './experiments';
import { extremeSubcategories } from './extreme';
import { filmSubcategories } from './film';
import { foodsSubcategories } from './foods';
import { fungiSubcategories } from './fungi';
import { funnySubcategories } from './funny';
import { boatsSubcategories } from './boats';
import { hollywoodSubcategories } from './hollywood';
import { realEstateSubcategories } from './realEstate';
import { sidebarSubcategories } from './sidebar';
import { newCategorySubcategories } from './newCategories';
import { animalsSubcategories } from './animals';
import { lakesRiversSubcategories } from './lakesRivers';
import { plantsSubcategories } from './plants';
import { talkShowsSubcategories } from './talkShows';
import { realityTVSubcategories } from './realityTV';
import { gameShowsSubcategories } from './gameShows';

// Merge all subcategory mappings
export const subcategoryMappings: SubcategoryMapping = {
  ...sportsSubcategories,
  ...businessSubcategories,
  ...carsSubcategories,
  ...fitnessSubcategories,
  ...comedySubcategories,
  ...relationshipsSubcategories,
  ...disastersSubcategories,
  ...educationSubcategories,
  ...courtsSubcategories,
  ...documentsSubcategories,
  ...shippingSubcategories,
  ...cosmeticsSubcategories,
  ...danceSubcategories,
  ...drinksSubcategories,
  ...dronesSubcategories,
  ...entertainmentSubcategories,
  ...experimentsSubcategories,
  ...extremeSubcategories,
  ...filmSubcategories,
  ...foodsSubcategories,
  ...fungiSubcategories,
  ...funnySubcategories,
  ...boatsSubcategories,
  ...hollywoodSubcategories,
  ...realEstateSubcategories,
  ...sidebarSubcategories,
  ...newCategorySubcategories,
  ...animalsSubcategories,
  ...lakesRiversSubcategories,
  ...plantsSubcategories,
  ...talkShowsSubcategories,
  ...realityTVSubcategories,
  ...gameShowsSubcategories,
};

// Re-export types
export type { SubcategoryInfo, SubcategoryMapping } from './types';

// Re-export individual subcategory groups
export {
  sportsSubcategories,
  businessSubcategories,
  carsSubcategories,
  fitnessSubcategories,
  comedySubcategories,
  relationshipsSubcategories,
  disastersSubcategories,
  educationSubcategories,
  courtsSubcategories,
  documentsSubcategories,
  shippingSubcategories,
  cosmeticsSubcategories,
  danceSubcategories,
  drinksSubcategories,
  dronesSubcategories,
  entertainmentSubcategories,
  experimentsSubcategories,
  extremeSubcategories,
  filmSubcategories,
  foodsSubcategories,
  fungiSubcategories,
  funnySubcategories,
  boatsSubcategories,
  hollywoodSubcategories,
  realEstateSubcategories,
  sidebarSubcategories
};
