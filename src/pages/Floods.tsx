import { Layout } from "@/components/Layout";
import { Droplets } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";

const subcategories = [
  { id: 'flash-flood', name: 'Flash Floods', path: '/floods/flash-flood', description: 'Flash flood events and sudden water surges' },
  { id: 'deluge', name: 'Deluge', path: '/floods/deluge', description: 'Major flooding and water deluge events' },
  { id: 'downpour', name: 'Downpour', path: '/floods/downpour', description: 'Heavy rain and downpour causing floods' },
  { id: 'drown', name: 'Drowning Hazards', path: '/floods/drown', description: 'Water safety and drowning awareness' },
  { id: 'engulf', name: 'Engulfing Waters', path: '/floods/engulf', description: 'Rising waters and engulfing flood footage' },
  { id: 'stream', name: 'Stream Flooding', path: '/floods/stream', description: 'Stream and river overflow events' },
];

const Floods = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-6">
          <Droplets className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">Floods</h1>
            <p className="text-muted-foreground">Flood events, disasters and water damage footage</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {subcategories.map((sub) => (
            <Link key={sub.id} to={sub.path}>
              <Card className="hover:bg-accent transition-colors cursor-pointer h-full">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <Droplets className="h-5 w-5 text-primary" />
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

export default Floods;
