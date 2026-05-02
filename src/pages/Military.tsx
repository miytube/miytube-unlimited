import React from 'react';
import { Layout } from "@/components/Layout";
import { Shield, Users, Plane, Anchor, Ship, Target, Medal, BookOpen, Crosshair, Dumbbell, FileText, Film } from "lucide-react";
import { Link } from "react-router-dom";
import { sortByName } from '@/lib/sortByName';

const militarySubcategories = [
  { 
    name: 'Army', 
    path: '/military/army', 
    icon: Shield, 
    description: 'Ground forces and infantry operations' 
  },
  { 
    name: 'Coast Guard', 
    path: '/military/coast-guard', 
    icon: Ship, 
    description: 'Coastal defense and maritime security' 
  },
  { 
    name: 'Conduct & Policy', 
    path: '/military/conduct', 
    icon: FileText, 
    description: 'Military conduct, policies, and regulations' 
  },
  { 
    name: 'Marines', 
    path: '/military/marines', 
    icon: Users, 
    description: 'Amphibious operations and rapid response' 
  },
  { 
    name: 'Navy', 
    path: '/military/navy', 
    icon: Anchor, 
    description: 'Naval operations and maritime defense' 
  },
  { 
    name: 'Pilots', 
    path: '/military/pilots', 
    icon: Plane, 
    description: 'Military pilots and aviation personnel' 
  },
  { 
    name: 'Reserves', 
    path: '/military/reserves', 
    icon: Users, 
    description: 'Military reserve forces and personnel' 
  },
  { 
    name: 'Weapons & Guns', 
    path: '/military/weapons', 
    icon: Target, 
    description: 'Military weapons, firearms, and ammunition' 
  },
  { 
    name: 'Military Aircrafts', 
    path: '/military/aircrafts', 
    icon: Plane, 
    description: 'Fighter jets, bombers, and military aircraft' 
  },
  { 
    name: 'Military Documentary', 
    path: '/military/documentary', 
    icon: Film, 
    description: 'War documentaries and military history films' 
  },
  { 
    name: 'Military Ships', 
    path: '/military/ships', 
    icon: Ship, 
    description: 'Aircraft carriers, destroyers, and naval vessels' 
  },
  { 
    name: 'Submarines', 
    path: '/military/submarines', 
    icon: Anchor, 
    description: 'Military submarines and underwater operations' 
  },
  { 
    name: 'Military War', 
    path: '/military/war', 
    icon: Shield, 
    description: 'Combat footage, war coverage, and military operations' 
  },
  { 
    name: 'Weapons Drones', 
    path: '/military/drones', 
    icon: Plane, 
    description: 'Military drones and unmanned aerial vehicles' 
  },
  { 
    name: 'Personnel', 
    path: '/military/personnel', 
    icon: Users, 
    description: 'Military personnel, soldiers, and service members' 
  }
];

const Military = () => {
  return (
    <Layout>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground">MiyTube / Military</h1>
          <p className="text-muted-foreground mt-2">Explore military branches and their operations</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortByName(militarySubcategories).map((subcategory) => (
            <Link
              key={subcategory.path}
              to={subcategory.path}
              className="group p-6 bg-card border border-border rounded-lg hover:border-primary transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                  <subcategory.icon className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                    {subcategory.name}
                  </h2>
                  <p className="text-sm text-muted-foreground">{subcategory.description}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Military;
