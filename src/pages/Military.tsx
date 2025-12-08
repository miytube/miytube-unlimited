import React from 'react';
import { Layout } from "@/components/Layout";
import { Shield, Users, Plane, Anchor, Ship } from "lucide-react";
import { Link } from "react-router-dom";

const militaryBranches = [
  { 
    name: 'Army', 
    path: '/military/army', 
    icon: Shield, 
    description: 'Ground forces and infantry operations' 
  },
  { 
    name: 'Air Force', 
    path: '/military/airforce', 
    icon: Plane, 
    description: 'Aerial warfare and air defense' 
  },
  { 
    name: 'Navy', 
    path: '/military/navy', 
    icon: Anchor, 
    description: 'Naval operations and maritime defense' 
  },
  { 
    name: 'Coast Guard', 
    path: '/military/coast-guard', 
    icon: Ship, 
    description: 'Coastal defense and maritime security' 
  },
  { 
    name: 'Marines', 
    path: '/military/marines', 
    icon: Users, 
    description: 'Amphibious operations and rapid response' 
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
          {militaryBranches.map((branch) => (
            <Link
              key={branch.path}
              to={branch.path}
              className="group p-6 bg-card border border-border rounded-lg hover:border-primary transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                  <branch.icon className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                    {branch.name}
                  </h2>
                  <p className="text-sm text-muted-foreground">{branch.description}</p>
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
