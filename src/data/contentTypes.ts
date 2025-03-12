
import { Film, Video, Music, Image, FileText, Mic, Book, CloudSun, Waves, AlertTriangle } from 'lucide-react';
import { ContentType } from '@/types/upload';

export const contentTypes: Record<string, ContentType> = {
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
        { id: 'fps', name: 'FPS Games' },
        { id: 'rpg', name: 'RPG Games' },
        { id: 'strategy', name: 'Strategy Games' },
      ]},
      { id: 'education', name: 'Education', subcategories: [
        { id: 'science', name: 'Science' },
        { id: 'math', name: 'Mathematics' },
        { id: 'history', name: 'History' },
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
  music: {
    id: "music",
    name: "Music",
    icon: Music,
    description: "Upload your music tracks, covers, remixes, and audio content.",
    acceptedTypes: "video/*,.mp4,.mov,.webm,.avi,.flv,.mkv",
    supportedFormats: ['MP4', 'MOV', 'WebM', 'AVI', 'FLV', 'MKV'],
    maxSize: "10GB",
    categories: [
      { id: 'pop', name: 'Pop', subcategories: [
        { id: 'dance-pop', name: 'Dance Pop' },
        { id: 'indie-pop', name: 'Indie Pop' },
      ]},
      { id: 'rock', name: 'Rock', subcategories: [
        { id: 'alt-rock', name: 'Alternative Rock' },
        { id: 'classic-rock', name: 'Classic Rock' },
      ]},
      { id: 'hiphop', name: 'Hip Hop', subcategories: [
        { id: 'trap', name: 'Trap' },
        { id: 'lofi', name: 'Lo-Fi' },
      ]},
      { id: 'electronic', name: 'Electronic', subcategories: [
        { id: 'house', name: 'House' },
        { id: 'techno', name: 'Techno' },
        { id: 'ambient', name: 'Ambient' },
      ]},
    ],
    destination: "Music Page and Player"
  },
  podcasts: {
    id: "podcasts",
    name: "Podcasts",
    icon: Mic,
    description: "Upload your podcast episodes, interviews, and talk shows.",
    acceptedTypes: "audio/*,.mp3,.wav,.ogg,.aac",
    supportedFormats: ['MP3', 'WAV', 'OGG', 'AAC', 'M4A'],
    maxSize: "500MB",
    categories: [
      { id: 'news', name: 'News & Politics', subcategories: [
        { id: 'daily-news', name: 'Daily News' },
        { id: 'political-commentary', name: 'Political Commentary' },
      ]},
      { id: 'comedy', name: 'Comedy', subcategories: [
        { id: 'standup', name: 'Stand-up' },
        { id: 'panel', name: 'Panel Shows' },
      ]},
      { id: 'education', name: 'Educational', subcategories: [
        { id: 'science', name: 'Science' },
        { id: 'history', name: 'History' },
      ]},
      { id: 'interviews', name: 'Interviews', subcategories: [
        { id: 'celebrity', name: 'Celebrity' },
        { id: 'expert', name: 'Expert' },
      ]},
      { id: 'true-crime', name: 'True Crime', subcategories: [
        { id: 'investigative', name: 'Investigative' },
        { id: 'documentary', name: 'Documentary' },
      ]},
      { id: 'business', name: 'Business', subcategories: [
        { id: 'startup', name: 'Startup' },
        { id: 'finance', name: 'Finance' },
      ]},
    ],
    destination: "Podcasts Page"
  },
  audiobooks: {
    id: "audiobooks",
    name: "Audiobooks",
    icon: Book,
    description: "Upload audiobooks, narrations, and spoken word content.",
    acceptedTypes: "audio/*,.mp3,.wav,.ogg,.aac",
    supportedFormats: ['MP3', 'WAV', 'OGG', 'AAC', 'M4A'],
    maxSize: "1GB",
    categories: [
      { id: 'fiction', name: 'Fiction', subcategories: [
        { id: 'fantasy', name: 'Fantasy' },
        { id: 'mystery', name: 'Mystery' },
        { id: 'sci-fi', name: 'Science Fiction' },
      ]},
      { id: 'non-fiction', name: 'Non-Fiction', subcategories: [
        { id: 'self-help', name: 'Self-Help' },
        { id: 'biography', name: 'Biography' },
        { id: 'history', name: 'History' },
      ]},
      { id: 'children', name: 'Children', subcategories: [
        { id: 'picture-books', name: 'Picture Books' },
        { id: 'middle-grade', name: 'Middle Grade' },
      ]},
      { id: 'poetry', name: 'Poetry', subcategories: [
        { id: 'classical', name: 'Classical' },
        { id: 'modern', name: 'Modern' },
      ]},
    ],
    destination: "Audiobooks Page"
  },
  meditation: {
    id: "meditation",
    name: "Meditation",
    icon: Music,
    description: "Upload meditation guides, mindfulness sessions, and relaxation audio.",
    acceptedTypes: "audio/*,.mp3,.wav,.ogg,.aac",
    supportedFormats: ['MP3', 'WAV', 'OGG', 'AAC', 'M4A'],
    maxSize: "500MB",
    categories: [
      { id: 'guided', name: 'Guided Meditation', subcategories: [
        { id: 'sleep', name: 'Sleep' },
        { id: 'stress', name: 'Stress Relief' },
        { id: 'mindfulness', name: 'Mindfulness' },
      ]},
      { id: 'music', name: 'Meditation Music', subcategories: [
        { id: 'ambient', name: 'Ambient' },
        { id: 'binaural', name: 'Binaural Beats' },
      ]},
      { id: 'nature', name: 'Nature Sounds', subcategories: [
        { id: 'rain', name: 'Rain' },
        { id: 'forest', name: 'Forest' },
      ]},
      { id: 'breathing', name: 'Breathing Exercises', subcategories: [
        { id: 'deep', name: 'Deep Breathing' },
        { id: 'box', name: 'Box Breathing' },
      ]},
    ],
    destination: "Meditation Page"
  },
  educational: {
    id: "educational",
    name: "Educational",
    icon: Book,
    description: "Upload lectures, tutorials, and educational content.",
    acceptedTypes: "video/*,audio/*,.mp4,.mov,.webm,.mp3,.wav",
    supportedFormats: ['MP4', 'MOV', 'WebM', 'MP3', 'WAV'],
    maxSize: "2GB",
    categories: [
      { id: 'academic', name: 'Academic', subcategories: [
        { id: 'math', name: 'Mathematics' },
        { id: 'science', name: 'Science' },
        { id: 'history', name: 'History' },
        { id: 'literature', name: 'Literature' },
      ]},
      { id: 'professional', name: 'Professional Skills', subcategories: [
        { id: 'programming', name: 'Programming' },
        { id: 'business', name: 'Business' },
        { id: 'design', name: 'Design' },
      ]},
      { id: 'languages', name: 'Languages', subcategories: [
        { id: 'english', name: 'English' },
        { id: 'spanish', name: 'Spanish' },
        { id: 'mandarin', name: 'Mandarin' },
      ]},
      { id: 'how-to', name: 'How-to Guides', subcategories: [
        { id: 'crafts', name: 'Crafts' },
        { id: 'cooking', name: 'Cooking' },
        { id: 'diy', name: 'DIY' },
      ]},
    ],
    destination: "Educational Page"
  },
  nature: {
    id: "nature",
    name: "Nature Sounds",
    icon: Music,
    description: "Upload recordings of nature sounds, ambient environments, and natural phenomena.",
    acceptedTypes: "audio/*,.mp3,.wav,.ogg,.aac",
    supportedFormats: ['MP3', 'WAV', 'OGG', 'AAC', 'M4A'],
    maxSize: "500MB",
    categories: [
      { id: 'forests', name: 'Forests', subcategories: [
        { id: 'rainforest', name: 'Rainforest' },
        { id: 'pine', name: 'Pine Forest' },
      ]},
      { id: 'water', name: 'Water', subcategories: [
        { id: 'ocean-waves', name: 'Ocean Waves' },
        { id: 'rivers', name: 'Rivers' },
        { id: 'rain', name: 'Rain' },
      ]},
      { id: 'animals', name: 'Animals', subcategories: [
        { id: 'birds', name: 'Birds' },
        { id: 'insects', name: 'Insects' },
      ]},
      { id: 'seasons', name: 'Seasons', subcategories: [
        { id: 'summer', name: 'Summer' },
        { id: 'winter', name: 'Winter' },
      ]},
    ],
    destination: "Nature Sounds Page"
  },
  comedy: {
    id: "comedy",
    name: "Comedy",
    icon: Video,
    description: "Upload stand-up, sketches, and other comedy content.",
    acceptedTypes: "video/*,audio/*,.mp4,.mov,.webm,.mp3,.wav",
    supportedFormats: ['MP4', 'MOV', 'WebM', 'MP3', 'WAV'],
    maxSize: "2GB",
    categories: [
      { id: 'standup', name: 'Stand-up', subcategories: [
        { id: 'specials', name: 'Specials' },
        { id: 'open-mic', name: 'Open Mic' },
      ]},
      { id: 'sketches', name: 'Sketches', subcategories: [
        { id: 'short-form', name: 'Short Form' },
        { id: 'character', name: 'Character Comedy' },
      ]},
      { id: 'improv', name: 'Improv', subcategories: [
        { id: 'games', name: 'Games' },
        { id: 'scenes', name: 'Scenes' },
      ]},
      { id: 'satire', name: 'Satire', subcategories: [
        { id: 'political', name: 'Political' },
        { id: 'social', name: 'Social' },
      ]},
      { id: 'parody', name: 'Parody', subcategories: [
        { id: 'music', name: 'Music Parody' },
        { id: 'movie', name: 'Movie Parody' },
      ]},
    ],
    destination: "Comedy Page"
  },
  news: {
    id: "news",
    name: "News & Politics",
    icon: Video,
    description: "Upload news segments, political discussions, and current events analysis.",
    acceptedTypes: "video/*,audio/*,.mp4,.mov,.webm,.mp3,.wav",
    supportedFormats: ['MP4', 'MOV', 'WebM', 'MP3', 'WAV'],
    maxSize: "2GB",
    categories: [
      { id: 'daily', name: 'Daily News', subcategories: [
        { id: 'morning', name: 'Morning Briefing' },
        { id: 'evening', name: 'Evening Recap' },
      ]},
      { id: 'politics', name: 'Politics', subcategories: [
        { id: 'domestic', name: 'Domestic' },
        { id: 'international', name: 'International' },
      ]},
      { id: 'business', name: 'Business News', subcategories: [
        { id: 'market', name: 'Market Updates' },
        { id: 'economy', name: 'Economy' },
      ]},
      { id: 'analysis', name: 'Analysis', subcategories: [
        { id: 'commentary', name: 'Commentary' },
        { id: 'interviews', name: 'Interviews' },
      ]},
    ],
    destination: "News & Politics Page"
  },
  weather: {
    id: "weather",
    name: "Weather",
    icon: CloudSun,
    description: "Upload weather forecasts, storm tracking, and weather phenomena footage.",
    acceptedTypes: "video/*,audio/*,.mp4,.mov,.webm,.mp3,.wav",
    supportedFormats: ['MP4', 'MOV', 'WebM', 'MP3', 'WAV'],
    maxSize: "2GB",
    categories: [
      { id: 'forecasts', name: 'Forecasts', subcategories: [
        { id: 'daily', name: 'Daily' },
        { id: 'weekly', name: 'Weekly' },
        { id: 'seasonal', name: 'Seasonal' },
      ]},
      { id: 'storms', name: 'Storms', subcategories: [
        { id: 'hurricanes', name: 'Hurricanes' },
        { id: 'tornadoes', name: 'Tornadoes' },
        { id: 'thunderstorms', name: 'Thunderstorms' },
      ]},
      { id: 'phenomena', name: 'Phenomena', subcategories: [
        { id: 'aurora', name: 'Aurora' },
        { id: 'rainbows', name: 'Rainbows' },
        { id: 'fog', name: 'Fog' },
      ]},
      { id: 'climate', name: 'Climate', subcategories: [
        { id: 'change', name: 'Climate Change' },
        { id: 'patterns', name: 'Weather Patterns' },
      ]},
    ],
    destination: "Weather Page"
  },
  oceans: {
    id: "oceans",
    name: "Oceans",
    icon: Waves,
    description: "Upload ocean sounds, marine life footage, and underwater content.",
    acceptedTypes: "video/*,audio/*,.mp4,.mov,.webm,.mp3,.wav",
    supportedFormats: ['MP4', 'MOV', 'WebM', 'MP3', 'WAV'],
    maxSize: "2GB",
    categories: [
      { id: 'waves', name: 'Waves', subcategories: [
        { id: 'beach', name: 'Beach' },
        { id: 'reef', name: 'Reef' },
        { id: 'coast', name: 'Coastline' },
      ]},
      { id: 'marine-life', name: 'Marine Life', subcategories: [
        { id: 'fish', name: 'Fish' },
        { id: 'mammals', name: 'Marine Mammals' },
        { id: 'coral', name: 'Coral Reefs' },
      ]},
      { id: 'underwater', name: 'Underwater', subcategories: [
        { id: 'diving', name: 'Diving' },
        { id: 'exploration', name: 'Exploration' },
      ]},
      { id: 'boats', name: 'Boating', subcategories: [
        { id: 'sailing', name: 'Sailing' },
        { id: 'cruising', name: 'Cruising' },
      ]},
    ],
    destination: "Oceans Page"
  },
  disasters: {
    id: "disasters",
    name: "Disasters",
    icon: AlertTriangle,
    description: "Upload footage of natural disasters, emergency response, and safety information.",
    acceptedTypes: "video/*,audio/*,.mp4,.mov,.webm,.mp3,.wav",
    supportedFormats: ['MP4', 'MOV', 'WebM', 'MP3', 'WAV'],
    maxSize: "2GB",
    categories: [
      { id: 'natural', name: 'Natural Disasters', subcategories: [
        { id: 'earthquakes', name: 'Earthquakes' },
        { id: 'floods', name: 'Floods' },
        { id: 'wildfires', name: 'Wildfires' },
        { id: 'volcanic', name: 'Volcanic Eruptions' },
      ]},
      { id: 'response', name: 'Emergency Response', subcategories: [
        { id: 'rescue', name: 'Rescue Operations' },
        { id: 'relief', name: 'Relief Efforts' },
      ]},
      { id: 'preparation', name: 'Preparation', subcategories: [
        { id: 'drills', name: 'Drills' },
        { id: 'planning', name: 'Planning' },
      ]},
      { id: 'recovery', name: 'Recovery', subcategories: [
        { id: 'rebuilding', name: 'Rebuilding' },
        { id: 'community', name: 'Community Support' },
      ]},
    ],
    destination: "Disasters Page"
  },
  image: {
    id: "image",
    name: "Image",
    icon: Image,
    description: "Upload your photos, illustrations, graphics, and visual content.",
    acceptedTypes: "image/*",
    supportedFormats: ['JPG', 'PNG', 'GIF', 'SVG', 'WebP'],
    maxSize: "50MB",
    categories: [
      { id: 'photography', name: 'Photography', subcategories: [
        { id: 'portrait', name: 'Portrait' },
        { id: 'landscape', name: 'Landscape' },
        { id: 'street', name: 'Street' },
      ]},
      { id: 'graphic', name: 'Graphic Design', subcategories: [
        { id: 'illustration', name: 'Illustration' },
        { id: 'typography', name: 'Typography' },
      ]},
    ],
    destination: "Images Gallery"
  },
  document: {
    id: "document",
    name: "Document",
    icon: FileText,
    description: "Upload your documents, articles, presentations, and written content.",
    acceptedTypes: ".pdf,.doc,.docx,.txt,.ppt,.pptx,.odt",
    supportedFormats: ['PDF', 'DOC', 'DOCX', 'TXT', 'PPT', 'PPTX'],
    maxSize: "500MB",
    categories: [
      { id: 'academic', name: 'Academic', subcategories: [
        { id: 'research', name: 'Research Paper' },
        { id: 'thesis', name: 'Thesis' },
      ]},
      { id: 'business', name: 'Business', subcategories: [
        { id: 'presentation', name: 'Presentation' },
        { id: 'report', name: 'Report' },
      ]},
    ],
    destination: "Documents Library"
  },
};
