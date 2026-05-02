import React from 'react';
import { Music, Disc, Mic, Guitar, Radio, Piano, Headphones } from 'lucide-react';
import { SidebarCategoryLinks } from './SidebarCategoryLinks';

export const AudioMusicVideosLinks: React.FC = () => {
  const links = [
    {
      id: 'audio-music-videos',
      icon: Music,
      label: 'Audio Music Videos',
      path: '/audio-music-videos',
      subItems: [
        { id: 'amv-audio', label: 'Audio', path: '/audio' },
        { id: 'amv-blues', label: 'Blues', path: '/audio-music-videos?genre=Blues' },
        { id: 'amv-christian', label: 'Christian', path: '/audio-music-videos?genre=Christian' },
        { id: 'amv-classical', label: 'Classical', path: '/audio-music-videos?genre=Classical' },
        { id: 'amv-country', label: 'Country', path: '/audio-music-videos?genre=Country' },
        { id: 'amv-electronic', label: 'Electronic', path: '/audio-music-videos?genre=Electronic' },
        { id: 'amv-folk', label: 'Folk', path: '/audio-music-videos?genre=Folk' },
        { id: 'amv-funk', label: 'Funk', path: '/audio-music-videos?genre=Funk' },
        { id: 'amv-hiphop', label: 'Hip Hop', path: '/audio-music-videos?genre=Hip%20Hop' },
        { id: 'amv-indie', label: 'Indie', path: '/audio-music-videos?genre=Indie' },
        { id: 'amv-jazz', label: 'Jazz', path: '/audio-music-videos?genre=Jazz' },
        { id: 'amv-latin', label: 'Latin', path: '/audio-music-videos?genre=Latin' },
        { id: 'amv-mandopop', label: 'Mandopop', path: '/audio-music-videos?genre=Mandopop' },
        { id: 'amv-mariachi', label: 'Mariachi', path: '/audio-music-videos?genre=Mariachi' },
        { id: 'amv-metal', label: 'Metal', path: '/audio-music-videos?genre=Metal' },
        { id: 'amv-parody', label: 'Parody', path: '/audio-music-videos?genre=Parody' },
        { id: 'amv-pop', label: 'Pop', path: '/audio-music-videos?genre=Pop' },
        { id: 'amv-punk', label: 'Punk', path: '/audio-music-videos?genre=Punk' },
        { id: 'amv-rnb', label: 'R&B', path: '/audio-music-videos?genre=R%26B' },
        { id: 'amv-rap', label: 'Rap', path: '/audio-music-videos?genre=Rap' },
        { id: 'amv-reggae', label: 'Reggae', path: '/audio-music-videos?genre=Reggae' },
        { id: 'amv-rock', label: 'Rock', path: '/audio-music-videos?genre=Rock' },
        { id: 'amv-salsa', label: 'Salsa', path: '/audio-music-videos?genre=Salsa' },
        { id: 'amv-soul', label: 'Soul', path: '/audio-music-videos?genre=Soul' },
        { id: 'amv-soundtracks', label: 'Soundtracks', path: '/audio-music-videos?genre=Soundtracks' },
        { id: 'amv-spanish', label: 'Spanish', path: '/audio-music-videos?genre=Spanish' },
      ],
    },
  ];

  return <SidebarCategoryLinks title="AUDIO MUSIC VIDEOS" links={links} />;
};
