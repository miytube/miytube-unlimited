
import { Film, Video } from 'lucide-react';
import { ContentType } from '@/types/upload';

export const videoContentTypes: Record<string, ContentType> = {
  video: {
    id: "video",
    name: "Regular Video",
    icon: Video,
    description: "Upload your full-length videos, tutorials, and other video content.",
    acceptedTypes: "video/*",
    supportedFormats: ['MP4', 'MOV', 'WebM', 'AVI', 'FLV', 'MKV'],
    maxSize: "128GB",
    categories: [
      { id: 'music', name: 'Music', subcategories: [
        { id: 'pop', name: 'Pop' },
        { id: 'rock', name: 'Rock' },
        { id: 'hiphop', name: 'Hip Hop' },
      ]},
      { id: 'gaming', name: 'Gaming', subcategories: [
        { id: 'arcade-games', name: 'Arcade Games' },
        { id: 'casino-slots', name: 'Casino Slots' },
        { id: 'dominos', name: 'Dominoes & Domino Fails' },
        { id: 'lottery', name: 'Lottery & Prize & Raffle' },
        { id: 'xbox-playstation', name: 'Xbox & PlayStation' },
        { id: 'gaming-cards', name: 'Gaming Cards' },
        { id: 'fps', name: 'FPS Games' },
        { id: 'rpg', name: 'RPG Games' },
        { id: 'strategy', name: 'Strategy Games' },
      ]},
      { id: 'education', name: 'Education', subcategories: [
        { id: 'science', name: 'Science' },
        { id: 'math', name: 'Mathematics' },
        { id: 'history', name: 'History' },
      ]},
      { id: 'film', name: 'Film & Movies', subcategories: [
        { id: 'westerns', name: 'Westerns' },
        { id: 'spaghetti-westerns', name: 'Spaghetti Westerns' },
        { id: 'modern-westerns', name: 'Modern Westerns' },
        { id: 'western-comedies', name: 'Western Comedies' },
        { id: 'neo-westerns', name: 'Neo-Westerns' },
        { id: 'acid-westerns', name: 'Acid Westerns' },
        { id: 'action', name: 'Action' },
        { id: 'drama', name: 'Drama' },
        { id: 'comedy', name: 'Comedy' },
        { id: 'romance', name: 'Romance' },
        { id: 'horror', name: 'Horror' },
      ]},
      { id: 'royal-security-guards', name: 'Royal Security Guards', subcategories: [
        { id: 'british', name: 'British' },
        { id: 'elite-military', name: 'Elite Military' },
        { id: 'palace-guards', name: 'Palace Guards' },
        { id: 'honor-guards', name: 'Honor Guards' },
        { id: 'ceremonial-units', name: 'Ceremonial Units' },
      ]},
      { id: 'airports', name: 'Airports', subcategories: [
        { id: 'passenger', name: 'Passenger' },
        { id: 'bag-checks', name: 'Bag Checks' },
        { id: 'flights', name: 'Flights' },
        { id: 'check-in-lines', name: 'Check In Lines' },
        { id: 'lounges', name: 'Lounges' },
        { id: 'security', name: 'Security' },
        { id: 'baggage-claim', name: 'Baggage Claim' },
        { id: 'customs', name: 'Customs' },
        { id: 'immigration', name: 'Immigration' },
        { id: 'terminals', name: 'Terminals' },
      ]},
      { id: 'military', name: 'Military', subcategories: [
        { id: 'army', name: 'Army' },
        { id: 'coast-guard', name: 'Coast Guard' },
        { id: 'conduct', name: 'Conduct & Policy' },
        { id: 'marines', name: 'Marines' },
        { id: 'navy', name: 'Navy' },
        { id: 'pilots', name: 'Pilots' },
        { id: 'reserves', name: 'Reserves' },
        { id: 'weapons', name: 'Weapons & Guns' },
        { id: 'aircrafts', name: 'Military Aircrafts' },
        { id: 'documentary', name: 'Military Documentary' },
        { id: 'ships', name: 'Military Ships' },
        { id: 'submarines', name: 'Submarines' },
        { id: 'war', name: 'Military War' },
        { id: 'drones', name: 'Weapons Drones' },
        { id: 'personnel', name: 'Personnel' },
      ]},
    ],
    destination: "Your Videos on Home Page and Selected Category"
  },
  shorts: {
    id: "shorts",
    name: "Shorts",
    icon: Film,
    description: "Upload short-form vertical videos. Perfect for quick, engaging content under 60 seconds.",
    acceptedTypes: "video/*",
    supportedFormats: ['MP4', 'MOV', 'WebM'],
    maxSize: "10GB",
    categories: [
      { id: 'trending', name: 'Trending', subcategories: [
        { id: 'challenge', name: 'Challenge' },
        { id: 'dance', name: 'Dance' },
      ]},
      { id: 'comedy', name: 'Comedy', subcategories: [
        { id: 'prank', name: 'Prank' },
        { id: 'skit', name: 'Skit' },
      ]},
    ],
    destination: "Shorts Feed"
  },
};
