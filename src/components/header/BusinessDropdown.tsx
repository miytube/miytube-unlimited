
import React from 'react';
import { Link } from 'react-router-dom';
import { DollarSign, ShoppingCart, BarChart } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const BusinessDropdown: React.FC = () => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="text-foreground hover:text-primary transition-colors">Business</DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem>
          <Link to="/business" className="flex items-center gap-2 w-full">
            <BarChart size={16} />
            <span>Business</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Link to="/monetization" className="flex items-center gap-2 w-full">
            <DollarSign size={16} />
            <span>Monetization</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Link to="/advertising" className="flex items-center gap-2 w-full">
            <ShoppingCart size={16} />
            <span>Advertising</span>
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
