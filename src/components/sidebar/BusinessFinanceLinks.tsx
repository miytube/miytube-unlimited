
import React from 'react';
import { Briefcase, DollarSign, TrendingUp, Building2, Landmark, Tractor } from 'lucide-react';
import { SidebarCategoryLinks } from './SidebarCategoryLinks';

export const BusinessFinanceLinks: React.FC = () => {
  const businessFinanceLinks = [
    { 
      id: 'business', 
      icon: Briefcase, 
      label: 'Business', 
      path: '/business',
      subItems: [
        { id: 'business-crypto', label: 'Bitcoins & Cryptocurrency', path: '/business/crypto' },
        { id: 'business-developments', label: 'Developments & Economy', path: '/business/developments' },
        { id: 'business-leaders', label: 'Leaders & Advice', path: '/business/leaders' },
        { id: 'business-money', label: 'Money, Taxes & Interest', path: '/business/money' },
        { id: 'business-services', label: 'Services & Drones', path: '/business/services' },
        { id: 'business-farming', label: 'Farmers & Farming', path: '/business/farming' }
      ]
    },
    { 
      id: 'stocks', 
      icon: TrendingUp, 
      label: 'Stocks & Money', 
      path: '/stocks',
      subItems: [
        { id: 'stocks-commodity', label: 'Commodity Trading', path: '/stocks/commodity' },
        { id: 'stocks-cash', label: 'Money & Cash Currency', path: '/stocks/cash' },
        { id: 'stocks-corporate', label: 'Corporate Stocks', path: '/stocks/corporate' }
      ]
    },
    { 
      id: 'real-estate', 
      icon: Building2, 
      label: 'Real Estate', 
      path: '/real-estate',
      subItems: [
        { id: 'real-estate-residential', label: 'Residential Property', path: '/real-estate/residential' },
        { id: 'real-estate-commercial', label: 'Commercial Property', path: '/real-estate/commercial' },
        { id: 'real-estate-luxury', label: 'Luxury & Million Dollar', path: '/real-estate/luxury' },
        { id: 'real-estate-land', label: 'Property & Land', path: '/real-estate/land' }
      ]
    },
    { 
      id: 'advertising', 
      icon: DollarSign, 
      label: 'Advertising', 
      path: '/advertising',
      subItems: [
        { id: 'advertising-tips', label: 'Advertising Tips', path: '/advertising/tips' },
        { id: 'advertising-campaigns', label: 'Ad Campaigns', path: '/advertising/campaigns' }
      ]
    },
    { 
      id: 'food-products', 
      icon: Tractor, 
      label: 'Food Products', 
      path: '/food-products',
      subItems: [
        { id: 'food-products-business', label: 'Food Business & Creation', path: '/food-products/business' }
      ]
    },
  ];

  return <SidebarCategoryLinks title="BUSINESS & FINANCE" links={businessFinanceLinks} />;
};
