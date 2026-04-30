import React from 'react';
import { Layout } from '@/components/Layout';
import { CloudLightning, Wind, CloudSnow, CloudRain, Upload } from 'lucide-react';
import { Link } from 'react-router-dom';

const subs = [
  { path: '/bad-weather/hurricanes', label: 'Hurricanes', Icon: Wind },
  { path: '/bad-weather/snow-storms', label: 'Snow Storms', Icon: CloudSnow },
  { path: '/bad-weather/tornados', label: 'Tornados', Icon: Wind },
  { path: '/bad-weather/tsunami', label: 'Tsunami', Icon: CloudRain },
  { path: '/bad-weather/avalanches', label: 'Avalanches', Icon: CloudSnow },
  { path: '/bad-weather/mudslides', label: 'Mudslides', Icon: CloudRain },
  { path: '/bad-weather/black-ice', label: 'Black Ice', Icon: CloudSnow },
];

const BadWeather = () => {
  return (
    <Layout>
      <div className="py-6 animate-fade-in w-full max-w-[1400px] mx-auto px-4">
        <div className="flex items-center justify-between gap-3 mb-8">
          <div className="flex items-center gap-3">
            <CloudLightning className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">Bad Weather</h1>
            <p className="text-muted-foreground ml-2">
              Severe and dangerous weather events
            </p>
          </div>
          <Link
            to="/upload"
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-colors"
          >
            <Upload size={18} />
            <span>Upload Bad Weather Content</span>
          </Link>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-4">Bad Weather Categories</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {subs.map(({ path, label, Icon }) => (
              <Link key={path} to={path} className="block">
                <div className="aspect-square rounded-lg overflow-hidden relative group bg-card flex items-center justify-center hover:bg-accent transition-colors">
                  <div className="text-center">
                    <Icon size={32} className="mx-auto mb-2 text-primary" />
                    <div className="font-medium">{label}</div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default BadWeather;
