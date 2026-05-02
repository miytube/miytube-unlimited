import { Layout } from "@/components/Layout";
import { Link } from "react-router-dom";
import { Tv, Sun, Moon, Zap } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { sortByName } from '@/lib/sortByName';

const NewsShows = () => {
  const subcategories = [
    {
      title: "Morning News",
      description: "Morning news broadcasts and early day updates",
      path: "/news-shows/morning-news",
      icon: Sun
    },
    {
      title: "Evening News",
      description: "Evening news broadcasts and nightly updates",
      path: "/news-shows/evening-news",
      icon: Moon
    },
    {
      title: "Breaking News",
      description: "Breaking news coverage and live updates",
      path: "/news-shows/breaking-news",
      icon: Zap
    }
  ];

  return (
    <Layout>
      <div className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <Tv className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">MiyTube / News Shows</h1>
            <p className="text-muted-foreground">News broadcasts and coverage</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortByName(subcategories).map((subcategory) => (
            <Link key={subcategory.path} to={subcategory.path}>
              <Card className="hover:bg-accent transition-colors cursor-pointer h-full">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <subcategory.icon className="h-5 w-5" />
                    {subcategory.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{subcategory.description}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default NewsShows;
