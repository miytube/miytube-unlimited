import { Layout } from "@/components/Layout";
import { Waves } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";

const subcategories = [
  { id: 'diving', name: 'Diving', path: '/swim/diving', description: 'Diving competitions and techniques' },
  { id: 'plunge', name: 'Plunge', path: '/swim/plunge', description: 'Plunge diving and water entry videos' },
  { id: 'plummet', name: 'Plummet', path: '/swim/plummet', description: 'High diving and extreme water jumps' },
  { id: 'jump', name: 'Jump', path: '/swim/jump', description: 'Water jumping and cliff diving videos' },
  { id: 'freestyle', name: 'Freestyle Swimming', path: '/swim/freestyle', description: 'Freestyle swimming techniques and races' },
];

const Swimming = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-6">
          <Waves className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">Swimming</h1>
            <p className="text-muted-foreground">Swimming and aquatic sports videos</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {subcategories.map((sub) => (
            <Link key={sub.id} to={sub.path}>
              <Card className="hover:bg-accent transition-colors cursor-pointer h-full">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <Waves className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold">{sub.name}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">{sub.description}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Swimming;
