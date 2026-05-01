
import React from 'react';
import { Trophy, Bike, Dumbbell, Target, Medal, Timer, Waves } from 'lucide-react';
import { SidebarCategoryLinks } from './SidebarCategoryLinks';

export const SportsExtendedLinks: React.FC = () => {
  const sportsExtendedLinks = [
    { 
      id: 'sports-nba', 
      icon: Trophy, 
      label: 'NBA Basketball', 
      path: '/sports/nba',
      subItems: [
        { id: 'sports-nba-east', label: 'NBA East Playoffs', path: '/sports/nba/east-playoffs' },
        { id: 'sports-nba-west', label: 'NBA West Playoffs', path: '/sports/nba/west-playoffs' },
        { id: 'sports-nba-season', label: 'NBA Basketball Season', path: '/sports/nba/season' },
        { id: 'sports-nba-players', label: 'NBA Players & Coaches', path: '/sports/nba/players' }
      ]
    },
    { 
      id: 'sports-nfl', 
      icon: Trophy, 
      label: 'NFL', 
      path: '/sports/nfl',
      subItems: [
        { id: 'sports-nfl-games', label: 'NFL Games', path: '/sports/nfl/games' },
        { id: 'sports-nfl-east-playoffs', label: 'AFL East Playoffs', path: '/sports/nfl/east-playoffs' },
        { id: 'sports-nfl-west-playoffs', label: 'NFL West Playoffs', path: '/sports/nfl/west-playoffs' },
        { id: 'sports-nfl-superbowl', label: 'Superbowl Game', path: '/sports/nfl/superbowl' },
        { id: 'sports-nfl-afl-players', label: 'AFL Players & Coaches', path: '/sports/nfl/afl-players' },
        { id: 'sports-nfl-players', label: 'NFL Players & Coaches', path: '/sports/nfl/players' }
      ]
    },
    { 
      id: 'sports-mlb', 
      icon: Trophy, 
      label: 'MLB Baseball', 
      path: '/sports/mlb',
      subItems: [
        { id: 'sports-mlb-al', label: 'MLB AL Playoffs', path: '/sports/mlb/al-playoffs' },
        { id: 'sports-mlb-nl', label: 'MLB NL Playoffs', path: '/sports/mlb/nl-playoffs' },
        { id: 'sports-mlb-world-series', label: 'World Series', path: '/sports/mlb/world-series' },
        { id: 'sports-mlb-players', label: 'MLB Players & Coaches', path: '/sports/mlb/players' }
      ]
    },
    { 
      id: 'sports-nhl', 
      icon: Trophy, 
      label: 'NHL Hockey', 
      path: '/sports/nhl',
      subItems: [
        { id: 'sports-nhl-allstar', label: 'NHL All-Star', path: '/sports/nhl/allstar' },
        { id: 'sports-nhl-east', label: 'All-Star East Team', path: '/sports/nhl/east' },
        { id: 'sports-nhl-west', label: 'All-Star West Team', path: '/sports/nhl/west' },
        { id: 'sports-nhl-playoffs', label: 'NHL Playoffs', path: '/sports/nhl/playoffs' },
        { id: 'sports-nhl-players', label: 'NHL Players & Coaches', path: '/sports/nhl/players' }
      ]
    },
    { 
      id: 'sports-wnba', 
      icon: Trophy, 
      label: 'WNBA Basketball', 
      path: '/sports/wnba',
      subItems: [
        { id: 'sports-wnba-players', label: 'WNBA Players & Coaches', path: '/sports/wnba/players' },
        { id: 'sports-wnba-playoffs', label: 'WNBA Playoffs', path: '/sports/wnba/playoffs' },
        { id: 'sports-wnba-championship', label: 'WNBA Championship', path: '/sports/wnba/championship' }
      ]
    },
    { 
      id: 'sports-college', 
      icon: Medal, 
      label: 'College Sports', 
      path: '/sports/college',
      subItems: [
        { id: 'sports-college-football', label: 'College Football', path: '/sports/college/football' },
        { id: 'sports-college-basketball', label: 'College Basketball', path: '/sports/college/basketball' },
        { id: 'sports-college-baseball', label: 'College Baseball', path: '/sports/college/baseball' },
        { id: 'sports-college-women', label: 'Women Basketball', path: '/sports/college/women-basketball' },
        { id: 'sports-college-swimming', label: 'Swimming & Hockey', path: '/sports/college/swimming' },
        { id: 'sports-college-track', label: 'Track & Field', path: '/sports/college/track' },
        { id: 'sports-college-bowl', label: 'Football Bowl Games', path: '/sports/college/bowl' }
      ]
    },
    { 
      id: 'sports-mma', 
      icon: Dumbbell, 
      label: 'MMA & Fighting', 
      path: '/sports/mma',
      subItems: [
        { id: 'sports-mma-ufc', label: 'UFC Fighting', path: '/sports/mma/ufc' },
        { id: 'sports-mma-women', label: 'Women MMA & UFC', path: '/sports/mma/women' },
        { id: 'sports-boxing', label: 'Boxing', path: '/sports/boxing' },
        { id: 'sports-boxing-interviews', label: 'Boxing Interviews', path: '/sports/boxing/interviews' },
        { id: 'sports-kickboxing', label: 'Kickboxing', path: '/sports/kickboxing' },
        { id: 'sports-wrestling', label: 'WWE Wrestling', path: '/sports/wrestling' }
      ]
    },
    { 
      id: 'sports-racing', 
      icon: Timer, 
      label: 'Racing Sports', 
      path: '/sports/racing',
      subItems: [
        { id: 'sports-nascar', label: 'NASCAR Racing', path: '/sports/nascar' },
        { id: 'sports-formula-one', label: 'Formula One (F1)', path: '/sports/formula-one' },
        { id: 'sports-nhra', label: 'NHRA Drag Racing', path: '/sports/nhra' },
        { id: 'sports-motorcycle-racing', label: 'Motorcycle Superbike', path: '/sports/motorcycle-racing' },
        { id: 'sports-horse-racing', label: 'Horse Racing', path: '/sports/horse-racing' },
        { id: 'sports-racing-track', label: 'Racing Track Accidents', path: '/sports/racing-track' },
        { id: 'sports-isle-of-man-tt', label: 'Isle of Man TT', path: '/sports/isle-of-man-tt' }
      ]
    },
    { 
      id: 'sports-soccer', 
      icon: Trophy, 
      label: 'Soccer & Football', 
      path: '/sports/soccer',
      subItems: [
        { id: 'sports-mls', label: 'MLS, FIFA, USL, WSL', path: '/sports/mls' },
        { id: 'sports-rugby', label: 'Rugby, Cricket, Lacrosse', path: '/sports/rugby' }
      ]
    },
    { 
      id: 'sports-tennis', 
      icon: Target, 
      label: 'Tennis', 
      path: '/sports/tennis',
      subItems: [
        { id: 'sports-tennis-men', label: 'Tennis Men', path: '/sports/tennis/men' },
        { id: 'sports-tennis-women', label: 'Tennis Women', path: '/sports/tennis/women' },
        { id: 'sports-tennis-men-finals', label: 'Men Final Championship', path: '/sports/tennis/men-finals' },
        { id: 'sports-tennis-women-finals', label: 'Women Final Championship', path: '/sports/tennis/women-finals' }
      ]
    },
    { 
      id: 'sports-golf', 
      icon: Target, 
      label: 'Golf', 
      path: '/sports/golf',
      subItems: [
        { id: 'sports-pga', label: 'PGA Golf Players', path: '/sports/pga' },
        { id: 'sports-ryder', label: 'Ryder Cup', path: '/sports/ryder-cup' }
      ]
    },
    { 
      id: 'sports-olympics', 
      icon: Medal, 
      label: 'Olympics', 
      path: '/sports/olympics',
      subItems: [
        { id: 'sports-olympics-track', label: 'Track & Field', path: '/sports/olympics/track' },
        { id: 'sports-track-field', label: 'Track & Field (Highlights)', path: '/sports/track-field' }
      ]
    },
    { 
      id: 'sports-volleyball', 
      icon: Trophy, 
      label: 'Volleyball', 
      path: '/sports/volleyball',
      subItems: [
        { id: 'sports-volleyball-amateur', label: 'Amateur Volleyball', path: '/sports/volleyball/amateur' },
        { id: 'sports-volleyball-beach', label: 'Beach Volleyball', path: '/sports/volleyball/beach' },
        { id: 'sports-volleyball-pro', label: 'Professional Volleyball', path: '/sports/volleyball/pro' },
        { id: 'sports-volleyball-tournament', label: 'Tournament', path: '/sports/volleyball/tournament' }
      ]
    },
    { 
      id: 'sports-water', 
      icon: Waves, 
      label: 'Water Sports', 
      path: '/sports/water',
      subItems: [
        { id: 'sports-surfing', label: 'Surfing & Kayaking', path: '/sports/surfing' },
        { id: 'sports-swimming-main', label: 'Swimming', path: '/sports/swimming' },
        { id: 'sports-diving', label: 'Diving', path: '/sports/diving' }
      ]
    },
    { 
      id: 'swim', 
      icon: Waves, 
      label: 'Swim', 
      path: '/swim',
      subItems: [
        { id: 'swim-diving', label: 'Diving', path: '/swim/diving' },
        { id: 'swim-plunge', label: 'Plunge', path: '/swim/plunge' },
        { id: 'swim-plummet', label: 'Plummet', path: '/swim/plummet' },
        { id: 'swim-jump', label: 'Jump', path: '/swim/jump' },
        { id: 'swim-freestyle', label: 'Freestyle Swimming', path: '/swim/freestyle' }
      ]
    },
    { 
      id: 'sports-misc', 
      icon: Trophy, 
      label: 'Other Sports', 
      path: '/sports/other',
      subItems: [
        { id: 'sports-fishing', label: 'Fishing', path: '/sports/fishing' },
        { id: 'sports-cycling', label: 'Road & Mountain Biking', path: '/sports/cycling' },
        { id: 'sports-horses', label: 'Horses & Equestrian', path: '/sports/horses' },
        { id: 'sports-arenas', label: 'Arenas & Stadiums', path: '/sports/arenas' },
        { id: 'sports-comedy', label: 'Sports Comedy & Bloopers', path: '/sports/comedy' },
        { id: 'sports-interviews', label: 'Sports Interviews', path: '/sports/interviews' },
        { id: 'sports-weightlifting', label: 'Weightlifting Olympics', path: '/sports/weightlifting' },
        { id: 'sports-news', label: 'Sports News & Podcasts', path: '/sports/news' },
        { id: 'sports-personalities', label: 'Sports Personalities', path: '/sports/personalities' },
        { id: 'sports-fans', label: 'Fan Challenges', path: '/sports/fans' },
        { id: 'sports-street-fighting', label: 'Street Fighting', path: '/sports/street-fighting' }
      ]
    },
  ];

  return <SidebarCategoryLinks title="SPORTS" links={sportsExtendedLinks} />;
};
