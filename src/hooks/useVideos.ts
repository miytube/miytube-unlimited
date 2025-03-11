
import { useState, useCallback } from 'react';

// Mock data for videos
const mockVideos = [
  {
    id: '1',
    title: 'Getting Started with React',
    description: 'Learn the basics of React and how to build your first component. This tutorial covers the fundamentals of React, including JSX, components, props, and state. Perfect for beginners who want to get started with React development.',
    channelName: 'React Masters',
    channelAvatar: 'https://ui-avatars.com/api/?name=React+Masters&background=random',
    views: '1.2M views',
    timestamp: '2 months ago',
    likes: '24K',
    subscribers: '1.2M',
    thumbnail: 'https://images.unsplash.com/photo-1593720213428-28a5b9e94613?auto=format&fit=crop&w=800&q=80',
    file: 'https://example.com/videos/react-basics.mp4',
    tags: ['React', 'JavaScript', 'Web Development']
  },
  {
    id: '2',
    title: 'Advanced CSS Techniques',
    description: 'Discover advanced CSS techniques to take your web design to the next level. This video covers CSS Grid, Flexbox, animations, and more. Learn how to create responsive layouts and stunning visual effects using modern CSS.',
    channelName: 'CSS Experts',
    channelAvatar: 'https://ui-avatars.com/api/?name=CSS+Experts&background=random',
    views: '857K views',
    timestamp: '3 weeks ago',
    likes: '15K',
    subscribers: '750K',
    thumbnail: 'https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?auto=format&fit=crop&w=800&q=80',
    file: 'https://example.com/videos/advanced-css.mp4',
    tags: ['CSS', 'Web Design', 'Frontend']
  },
  {
    id: '3',
    title: 'JavaScript Async/Await Tutorial',
    description: 'Master asynchronous JavaScript with async/await. This comprehensive tutorial explains promises, async/await syntax, error handling, and best practices. Learn how to write clean, maintainable asynchronous code.',
    channelName: 'JS Wizards',
    channelAvatar: 'https://ui-avatars.com/api/?name=JS+Wizards&background=random',
    views: '645K views',
    timestamp: '1 month ago',
    likes: '18K',
    subscribers: '870K',
    thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80',
    file: 'https://example.com/videos/async-await.mp4',
    tags: ['JavaScript', 'Async', 'Programming']
  },
  {
    id: '4',
    title: 'TypeScript for Beginners',
    description: 'Get started with TypeScript in this beginner-friendly guide. Learn about types, interfaces, generics, and how TypeScript improves your development workflow. Perfect for JavaScript developers looking to add type safety to their projects.',
    channelName: 'TypeScript Tutorials',
    channelAvatar: 'https://ui-avatars.com/api/?name=TypeScript+Tutorials&background=random',
    views: '325K views',
    timestamp: '2 weeks ago',
    likes: '9.5K',
    subscribers: '450K',
    thumbnail: 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?auto=format&fit=crop&w=800&q=80',
    file: 'https://example.com/videos/typescript-basics.mp4',
    tags: ['TypeScript', 'JavaScript', 'Programming']
  },
];

export const useVideos = () => {
  const [videos] = useState(mockVideos);
  
  const getVideoById = useCallback((id: string) => {
    return videos.find(video => video.id === id);
  }, [videos]);
  
  const getVideosByTag = useCallback((tag: string) => {
    return videos.filter(video => video.tags?.includes(tag));
  }, [videos]);
  
  return {
    videos,
    getVideoById,
    getVideosByTag,
  };
};
