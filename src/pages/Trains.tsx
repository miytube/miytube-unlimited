import { Layout } from "@/components/Layout";
import { Train } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";

const subcategories = [
  { id: 'railroad', name: 'Railroad', path: '/trains/railroad', description: 'Railroad trains and track footage' },
  { id: 'railway', name: 'Railway', path: '/trains/railway', description: 'Railway systems and train journeys' },
  { id: 'steam', name: 'Steam Trains', path: '/trains/steam', description: 'Classic steam locomotive footage and history' },
  { id: 'freight', name: 'Freight Trains', path: '/trains/freight', description: 'Cargo and freight train operations' },
  { id: 'passenger', name: 'Passenger Trains', path: '/trains/passenger', description: 'Passenger rail and commuter trains' },
];

const Trains = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-6">
          <Train className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">Trains</h1>
            <p className="text-muted-foreground">Railroad and railway train videos</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {subcategories.map((sub) => (
            <Link key={sub.id} to={sub.path}>
              <Card className="hover:bg-accent transition-colors cursor-pointer h-full">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <Train className="h-5 w-5 text-primary" />
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

export default Trains;
