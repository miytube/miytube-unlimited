
import React from 'react';
import { Music, Mic, Headphones, Guitar, Radio, Piano, Disc } from 'lucide-react';
import { SidebarCategoryLinks } from './SidebarCategoryLinks';

export const MusicFullLinks: React.FC = () => {
  const musicFullLinks = [
    { 
      id: 'music', 
      icon: Music, 
      label: 'Music', 
      path: '/music',
      subItems: [
        { id: 'music-rock', label: 'Rock, Soul, Pop, R&B', path: '/music/rock' },
        { id: 'music-alternative', label: 'Alternative & Others', path: '/music/alternative' },
        { id: 'music-blues', label: 'Blues', path: '/music/blues' },
        { id: 'music-christmas', label: 'Christmas Jingles', path: '/music/christmas' },
        { id: 'music-classical', label: 'Classical, Opera, Symphony', path: '/music/classical' },
        { id: 'music-country', label: 'Country & Western', path: '/music/country' },
        { id: 'music-folk', label: 'Folk (Ballads, Chorus)', path: '/music/folk' },
        { id: 'music-funk', label: 'Funk & Hard Rock', path: '/music/funk' },
        { id: 'music-hiphop', label: 'Hip Hop, Rap, Funk', path: '/music/hiphop' },
        { id: 'music-heavy-metal', label: 'Heavy Metal', path: '/music/heavy-metal' },
        { id: 'music-rap', label: 'Rap & Reggaeton', path: '/music/rap' },
        { id: 'music-rnb', label: 'R&B & Soul', path: '/music/rnb' },
        { id: 'music-relaxation', label: 'Relaxation & Meditation', path: '/music/relaxation' },
        { id: 'music-salsa', label: 'Salsa', path: '/music/salsa' },
        { id: 'music-soul-train', label: 'Soul Train', path: '/music/soul-train' },
        { id: 'music-christian', label: 'Christian (Pop, Rap, Rock)', path: '/music/christian' },
        { id: 'music-parody', label: 'Parody & Satire', path: '/music/parody' },
        { id: 'music-pop', label: 'Pop & Soft Rock', path: '/music/pop' },
        { id: 'music-soundtracks', label: 'Soundtracks & Movie Music', path: '/music/soundtracks' },
        { id: 'music-history', label: 'Music History', path: '/music/history' }
      ]
    },
    { 
      id: 'music-international', 
      icon: Disc, 
      label: 'International Music', 
      path: '/music/international',
      subItems: [
        { id: 'music-mandopop', label: 'Mandopop (Mandarin)', path: '/music/mandopop' },
        { id: 'music-spanish', label: 'Spanish & Mexican', path: '/music/spanish' },
        { id: 'music-mariachi', label: 'Mariachi', path: '/music/mariachi' },
        { id: 'music-latin', label: 'Latin Music', path: '/music/latin' }
      ]
    },
    { 
      id: 'music-lyrics', 
      icon: Headphones, 
      label: 'Music Lyrics', 
      path: '/music/lyrics',
      subItems: [
        { id: 'music-lyrics-main', label: 'Lyrics', path: '/music/lyrics' },
        { id: 'music-lyrics-mandopop', label: 'Mandopop Lyrics', path: '/music/lyrics/mandopop' },
        { id: 'music-lyrics-spanish', label: 'Spanish & Mexican Lyrics', path: '/music/lyrics/spanish' }
      ]
    },
    { 
      id: 'music-artists', 
      icon: Mic, 
      label: 'Music Artists', 
      path: '/music-artists',
      subItems: [
        { id: 'music-artists-works', label: 'Works & Interviews', path: '/music-artists/works' },
        { id: 'music-artists-interviews', label: 'Interviews', path: '/music-artists/interviews' },
        { id: 'music-artists-news', label: 'News & Gossip', path: '/music-artists/news' },
        { id: 'music-challenges', label: 'Music Challenges', path: '/music-artists/challenges' }
      ]
    },
    { 
      id: 'music-instruments', 
      icon: Guitar, 
      label: 'Instruments', 
      path: '/music/instruments',
      subItems: [
        { id: 'music-instrument-players', label: 'Instrument Players', path: '/music/instruments/players' }
      ]
    },
  ];

  return <SidebarCategoryLinks title="MUSIC" links={musicFullLinks} />;
};
