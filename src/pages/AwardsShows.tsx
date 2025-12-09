import { Link } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { Award, Music, Film, Tv } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const subcategories = [
  {
    title: 'Music Awards',
    description: 'Grammy Awards, MTV VMAs, and music award ceremonies',
    icon: Music,
    path: '/awards-shows/music'
  },
  {
    title: 'Film Awards',
    description: 'Oscars, Golden Globes, and film award ceremonies',
    icon: Film,
    path: '/awards-shows/film'
  },
  {
    title: 'TV Awards',
    description: 'Emmy Awards and television award ceremonies',
    icon: Tv,
    path: '/awards-shows/tv'
  }
];

const AwardsShows = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-8">
          <Award className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">MiyTube / Awards Shows</h1>
            <p className="text-muted-foreground">Award ceremonies for music, film, and television</p>
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

export default AwardsShows;
