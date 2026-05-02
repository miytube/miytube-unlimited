
import React from 'react';
import { Layout } from '@/components/Layout';
import { VideoCard } from '@/components/VideoCard';
import { Trophy, Upload } from 'lucide-react';
import { Link } from 'react-router-dom';
import { sortByName } from '@/lib/sortByName';

const Sports = () => {
  const sportsCategories = [
    // Main Sports
    { id: 'sports-arenas', name: 'Sports (arenas, stadiums)' },
    { id: 'sports-basketball-football', name: 'Sports (basketball, football...)' },
    { id: 'sports-car-racing', name: 'Sports (Car racing, wrc, etc...)' },
    { id: 'sports-comedy', name: 'Sports (comedy, bloopers)' },
    { id: 'sports-fishing', name: 'Sports (fishing)' },
    { id: 'sports-interviews', name: 'Sports (interviews, athletes...)' },
    { id: 'sports-kickboxing', name: 'Sports (kickboxing)' },
    { id: 'sports-mlb-players', name: 'Sports (mlb players, coaches...)' },
    { id: 'sports-nba-players', name: 'Sports (nba players, coaches...)' },
    { id: 'sports-nfl-players', name: 'Sports (nfl players, coaches...)' },
    { id: 'sports-nhl-players', name: 'Sports (nhl players, coaches...)' },
    { id: 'sports-pga-golf', name: 'Sports (pga, golf players...)' },
    { id: 'sports-race-car', name: 'Sports (race car drivers...)' },
    { id: 'sports-cycling', name: 'Sports (road, mountain, bicycle...)' },
    { id: 'sports-rugby-cricket', name: 'Sports (rugby, cricket, lacrosse...)' },
    { id: 'sports-soccer', name: 'Sports (soccer, american football...)' },
    { id: 'sports-water', name: 'Sports (surfing, kayaking...)' },
    { id: 'sports-tennis-men-finals', name: 'Sports (tennis men final championships...)' },
    { id: 'sports-tennis-men', name: 'Sports (tennis men)' },
    { id: 'sports-tennis-women-finals', name: 'Sports (tennis women final championships...)' },
    { id: 'sports-tennis-women', name: 'Sports (tennis women)' },
    { id: 'sports-track-field-highlights', name: 'Sports (track & field highlights...)' },
    { id: 'sports-track-field', name: 'Sports (track & field...)' },
    { id: 'sports-volleyball', name: 'Sports (volleyball)' },
    { id: 'sports-weightlifting', name: 'Sports (weightlifting Olympics...)' },
    { id: 'sports-wwe', name: 'Sports (wwe sports entertainment...)' },
    
    // Boxing
    { id: 'sports-boxing', name: 'Sports Boxing' },
    { id: 'sports-boxing-interviews', name: 'Sports Boxing (interviews...)' },
    
    // College Sports
    { id: 'sports-college-swimming', name: 'Sports College (swimming, hockey...)' },
    { id: 'sports-college-baseball', name: 'Sports College Baseball' },
    { id: 'sports-college-basketball', name: 'Sports College Basketball' },
    { id: 'sports-college-football', name: 'Sports College Football' },
    { id: 'sports-college-football-bowl', name: 'Sports College Football Bowl Games' },
    { id: 'sports-college-track', name: 'Sports College Track & Field' },
    { id: 'sports-college-women-basketball', name: 'Sports College Women Basketball' },
    { id: 'sports-college-womens-softball', name: 'Sports College (women\'s softball)' },
    
    // Fan Challenges & Games
    { id: 'sports-fans-challenges', name: 'Sports Fans Challenges (prizes...)' },
    { id: 'sports-game-challenges', name: 'Sports Game (fan challenges...)' },
    
    // Football
    { id: 'sports-football-high-school', name: 'Sports Football (high school...)' },
    
    // Racing
    { id: 'sports-formula-one', name: 'Sports Formula One (1) Racing' },
    { id: 'sports-nascar', name: 'Sports Nascar Racing' },
    { id: 'sports-nhra', name: 'Sports NHRA Drag Racing' },
    { id: 'sports-motorcycles', name: 'Sports Motorcycles (superbike...)' },
    { id: 'sports-isle-of-man-tt', name: 'Sports Isle of Man TT (motorcycle racing)' },
    
    // Golf
    { id: 'sports-golf-ryder-cup', name: 'Sports Golf (ryder cup)' },
    { id: 'sports-professional-golf', name: 'Sports Professional Golf' },
    
    // Hockey
    { id: 'sports-hockey-countries', name: 'Sports Hockey (countries hockey...)' },
    { id: 'sports-nhl-allstar-east', name: 'Sports NHL (all-star east team...)' },
    { id: 'sports-nhl-allstar', name: 'Sports NHL (all-star hockey)' },
    { id: 'sports-nhl-allstar-west', name: 'Sports NHL (all-star west team...)' },
    { id: 'sports-nhl-playoffs', name: 'Sports NHL (hockey playoffs)' },
    { id: 'sports-nhl-hockey', name: 'Sports NHL Hockey' },
    
    // Horse Sports
    { id: 'sports-horse-racing', name: 'Sports Horse Racing' },
    { id: 'sports-horses', name: 'Sports Horses (equestrian...)' },
    
    // MLB Baseball
    { id: 'sports-mlb-playoffs-al', name: 'Sports MLB (mlb playoffs AL...)' },
    { id: 'sports-mlb-playoffs-nl', name: 'Sports MLB (mlb playoffs NL...)' },
    { id: 'sports-mlb-baseball', name: 'Sports MLB Baseball' },
    { id: 'sports-mlb-world-series', name: 'Sports MLB World Series' },
    
    // Soccer
    { id: 'sports-mls-fifa', name: 'Sports MLS, FIFA, USL, WSL...' },
    
    // MMA & Fighting
    { id: 'sports-mma-ufc', name: 'Sports MMA, UFC Fighting' },
    { id: 'sports-women-mma', name: 'Sports Women (MMA, UFC, EFC)' },
    
    // NBA Basketball
    { id: 'sports-nba-east-playoffs', name: 'Sports NBA (nba east playoffs...)' },
    { id: 'sports-nba-west-playoffs', name: 'Sports NBA (nba west playoffs...)' },
    { id: 'sports-nba-basketball', name: 'Sports NBA Basketball' },
    
    // News & Podcasts
    { id: 'sports-news-podcasts', name: 'Sports news, podcasts, Info...' },
    
    // NFL Football
    { id: 'sports-nfl-football', name: 'Sports NFL Football' },
    { id: 'sports-nfl-superbowl', name: 'Sports NFL (sports Superbowl...)' },
    
    // Olympics
    { id: 'sports-olympics-track', name: 'Sports Olympics (track & field...)' },
    
    // Personalities
    { id: 'sports-personalities', name: 'Sports Personalities (interviews...)' },
    
    // Track & Field
    { id: 'sports-track-field-main', name: 'Sports Track & Field' },
    { id: 'sports-track-field-college', name: 'Sports Track & Field (college)' },
    
    // Volleyball
    { id: 'sports-volleyball-amateur', name: 'Sports Volleyball (amateur...)' },
    { id: 'sports-volleyball-beach', name: 'Sports Volleyball (beach games...)' },
    { id: 'sports-volleyball-professional', name: 'Sports Volleyball (professional...)' },
    { id: 'sports-volleyball-tournament', name: 'Sports Volleyball (tournaments...)' },
    
    // WNBA
    { id: 'sports-wnba-players', name: 'Sports WNBA (players & coaches...)' },
    { id: 'sports-wnba-champions', name: 'Sports WNBA (wnba champions...)' },
    { id: 'sports-wnba-coaches', name: 'Sports WNBA (wnba players, coaches...)' },
    { id: 'sports-wnba-playoffs', name: 'Sports WNBA (wnba playoffs)' },
    { id: 'sports-wnba-basketball', name: 'Sports WNBA Basketball' },
    
    // Wrestling
    { id: 'sports-wwe-wrestling', name: 'Sports WWE Wrestling' },
    
    // Women's Basketball
    { id: 'sports-women-basketball-ncaa', name: 'Sports (women basketball ncaa)' },
    
    // High School Sports
    { id: 'sports-high-school', name: 'Sports high school' },
    { id: 'sports-high-school-football', name: 'Sports high school (football)' },
    { id: 'sports-high-school-cif-football', name: 'Sports high school (CIF football)' },
    { id: 'sports-high-school-cif-basketball', name: 'Sports high school (CIF basketball)' },
    { id: 'sports-high-school-cif-baseball', name: 'Sports high school (CIF baseball)' },
    { id: 'sports-high-school-basketball', name: 'Sports high school (basketball)' },
    { id: 'sports-high-school-baseball', name: 'Sports high school (baseball)' },
  ];

  // Other Sports (alphabetized)
  const otherSportsCategories = [
    { id: 'sports-all-other', name: 'All other sports' },
    { id: 'sports-arenas-stadiums', name: 'Arenas & stadiums' },
    { id: 'sports-extreme-sky-diving', name: 'Extreme - sky diving' },
    { id: 'sports-extreme', name: 'Extreme sports' },
    { id: 'sports-fan-challenges', name: 'Fan challenges' },
    { id: 'sports-fishing-other', name: 'Fishing' },
    { id: 'sports-horse-equestrian', name: 'Horse & equestrian' },
    { id: 'sports-road-mountain-biking', name: 'Road & mountain biking' },
    { id: 'sports-sky-diving', name: 'Sky diving' },
    { id: 'sports-comedy-bloopers', name: 'Sports comedy & bloopers' },
    { id: 'sports-interviews-other', name: 'Sports interviews' },
    { id: 'sports-news-podcasts-other', name: 'Sports news & podcasts' },
    { id: 'sports-personalities-other', name: 'Sports personalities' },
    { id: 'sports-street-fighting', name: 'Street fighting' },
    { id: 'sports-weightlifting-olympics', name: 'Weightlifting Olympics' },
  ];

  return (
    <Layout>
      <div className="py-6 animate-fade-in w-full max-w-[1400px] mx-auto px-2 sm:px-4">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-sm text-muted-foreground mb-1">MiyTube / Sports</p>
            <div className="flex items-center gap-2">
              <Trophy className="h-8 w-8 text-primary" />
              <h1 className="text-3xl font-bold">Sports</h1>
            </div>
          </div>
          <Link to="/upload/video" className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-colors">
            <Upload size={18} />
            <span>Upload Sports Video</span>
          </Link>
        </div>
        
        {/* Categories Grid */}
        <div className="mb-8">
          <h2 className="text-xl font-medium mb-4">Sports Categories</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {sortByName(sportsCategories).map((category) => (
              <Link 
                key={category.id} 
                to={`/${category.id}`}
                className="bg-card p-3 rounded-lg border border-border hover:border-primary hover:bg-accent/50 transition-all flex items-center gap-3"
              >
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                  <Trophy size={20} />
                </div>
                <span className="font-medium text-sm">{category.name}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Other Sports Grid */}
        <div className="mb-8">
          <h2 className="text-xl font-medium mb-4">Other Sports</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {sortByName(otherSportsCategories).map((category) => (
              <Link
                key={category.id}
                to={`/${category.id}`}
                className="bg-card p-3 rounded-lg border border-border hover:border-primary hover:bg-accent/50 transition-all flex items-center gap-3"
              >
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                  <Trophy size={20} />
                </div>
                <span className="font-medium text-sm">{category.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Sports;
