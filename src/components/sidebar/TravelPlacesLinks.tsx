
import React from 'react';
import { Map, Hotel, Palmtree, Building, Utensils, Plane, PartyPopper } from 'lucide-react';
import { SidebarCategoryLinks } from './SidebarCategoryLinks';

export const TravelPlacesLinks: React.FC = () => {
  const travelPlacesLinks = [
    { 
      id: 'travel', 
      icon: Map, 
      label: 'Travel & Events', 
      path: '/travel-events',
      subItems: [
        { id: 'travel-beaches', label: 'Beaches', path: '/travel/beaches' },
        { id: 'travel-cities', label: 'Cities & Towns', path: '/travel/cities' },
        { id: 'travel-country-foods', label: 'Country Foods', path: '/travel/country-foods' },
        { id: 'travel-hotels-expensive', label: 'Most Expensive Hotels', path: '/travel/hotels-expensive' },
        { id: 'travel-hotels', label: 'Hotels & Motels', path: '/travel/hotels' },
        { id: 'travel-hotels-unique', label: 'Unique & Weird Hotels', path: '/travel/hotels-unique' },
        { id: 'travel-nightclubs', label: 'Night Clubs', path: '/travel/nightclubs' },
        { id: 'travel-restaurants', label: 'Restaurants', path: '/travel/restaurants' },
        { id: 'travel-street-food', label: 'Street Food', path: '/travel/street-food' },
        { id: 'travel-nightlife', label: 'Streets & Night Life', path: '/travel/nightlife' },
        { id: 'travel-new-year', label: 'World New Year Celebrations', path: '/travel/new-year' },
        { id: 'travel-tips', label: 'Travel Tips (Overseas)', path: '/travel/tips' }
      ]
    },
    { 
      id: 'beaches', 
      icon: Palmtree, 
      label: 'Beaches & Lagoons', 
      path: '/beaches',
      subItems: [
        { id: 'beaches-tropical', label: 'Tropical Beaches', path: '/beaches/tropical' },
        { id: 'beaches-surfing', label: 'Surfing Spots', path: '/beaches/surfing' },
        { id: 'beaches-resorts', label: 'Beach Resorts', path: '/beaches/resorts' }
      ]
    },
    { 
      id: 'airports', 
      icon: Plane, 
      label: 'Airports', 
      path: '/airports',
      subItems: [
        { id: 'airports-improvements', label: 'Improvements & Construction', path: '/airports/improvements' },
        { id: 'airports-fails', label: 'Airport Fails', path: '/airports/fails' },
        { id: 'airports-security', label: 'Airport Security', path: '/airports/security' },
        { id: 'airports-lounges', label: 'Airport Lounges', path: '/airports/lounges' }
      ]
    },
    { 
      id: 'restaurants', 
      icon: Utensils, 
      label: 'Restaurants', 
      path: '/restaurants',
      subItems: [
        { id: 'restaurants-fine-dining', label: 'Fine Dining', path: '/restaurants/fine-dining' },
        { id: 'restaurants-fast-food', label: 'Fast Food', path: '/restaurants/fast-food' },
        { id: 'restaurants-reviews', label: 'Restaurant Reviews', path: '/restaurants/reviews' },
        { id: 'restaurants-celebrity-chefs', label: 'Celebrity Chefs', path: '/restaurants/celebrity-chefs' }
      ]
    },
  ];

  return <SidebarCategoryLinks title="TRAVEL & PLACES" links={travelPlacesLinks} />;
};
