import { Link } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { Gamepad2, Brain, Dumbbell, Type } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const subcategories = [
  {
    title: 'Trivia Shows',
    description: 'Quiz and trivia game shows testing knowledge',
    icon: Brain,
    path: '/game-shows/trivia'
  },
  {
    title: 'Physical Challenges',
    description: 'Game shows featuring physical competitions and obstacles',
    icon: Dumbbell,
    path: '/game-shows/physical-challenges'
  },
  {
    title: 'Word Games',
    description: 'Game shows featuring word puzzles and vocabulary challenges',
    icon: Type,
    path: '/game-shows/word-games'
  }
];

const GameShows = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-8">
          <Gamepad2 className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">MiyTube / Game Shows</h1>
            <p className="text-muted-foreground">Quiz shows, competitions, and entertainment games</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {subcategories.map((sub) => (
            <Link key={sub.path} to={sub.path}>
              <Card className="hover:bg-accent/50 transition-colors cursor-pointer h-full">
                <CardContent className="p-6 flex flex-col items-center text-center gap-4">
                  <sub.icon className="h-12 w-12 text-primary" />
                  <div>
                    <h3 className="font-semibold text-lg">{sub.title}</h3>
                    <p className="text-sm text-muted-foreground">{sub.description}</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default GameShows;
