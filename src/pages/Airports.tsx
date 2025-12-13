import { Link } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { Plane, Users, Briefcase, PlaneTakeoff, CheckSquare } from 'lucide-react';

const Airports = () => {
  const subcategories = [
    { name: 'Passenger', path: '/airports/passenger', icon: Users, description: 'Airport passenger experiences' },
    { name: 'Bag Checks', path: '/airports/bag-checks', icon: Briefcase, description: 'Security and baggage screening' },
    { name: 'Flights', path: '/airports/flights', icon: PlaneTakeoff, description: 'Flight departures and arrivals' },
    { name: 'Check In Lines', path: '/airports/check-in-lines', icon: CheckSquare, description: 'Check-in processes and queues' }
  ];

  return (
    <Layout>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Plane className="h-6 w-6" />
            MiyTube / Airports
          </h1>
          <p className="text-muted-foreground mt-2">Airport travel, aviation, and terminal experiences</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {subcategories.map((sub) => (
            <Link
              key={sub.path}
              to={sub.path}
              className="p-4 rounded-lg border border-border bg-card hover:bg-accent transition-colors"
            >
              <div className="flex items-center gap-3 mb-2">
                <sub.icon className="h-5 w-5 text-primary" />
                <h3 className="font-medium text-foreground">{sub.name}</h3>
              </div>
              <p className="text-sm text-muted-foreground">{sub.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Airports;
