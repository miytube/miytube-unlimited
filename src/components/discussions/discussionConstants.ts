
import { Discussion } from './DiscussionCard';

// Modified mock data for discussions about world events and personal impact
export const INITIAL_DISCUSSIONS: Discussion[] = [
  {
    id: 1,
    category: 'Politics',
    title: 'How new privacy laws affect your digital life',
    author: 'PrivacyAdvocate',
    content: 'With the recent privacy legislation changes, I\'ve had to adjust how I use social media. Has anyone else changed their online habits?',
    replies: 15,
    likes: 28,
    timestamp: '2 hours ago',
  },
  {
    id: 2,
    category: 'Economy',
    title: 'Rising inflation and your monthly budget',
    author: 'BudgetPlanner',
    content: 'I\'ve noticed my grocery bills increasing by about 20% this year. What strategies are you using to manage your household expenses?',
    replies: 22,
    likes: 47,
    timestamp: '4 hours ago',
  },
  {
    id: 3,
    category: 'Climate',
    title: 'Local effects of global warming in your area',
    author: 'ClimateWatcher',
    content: 'Our city experienced unusual flooding this spring. Have you noticed climate change affecting your local environment?',
    replies: 43,
    likes: 86,
    timestamp: '8 hours ago',
  },
  {
    id: 4,
    category: 'Technology',
    title: 'How AI is changing your work environment',
    author: 'TechObserver',
    content: 'My company just implemented AI tools for customer service. Has anyone\'s job been significantly altered by new tech?',
    replies: 31,
    likes: 52,
    timestamp: '1 day ago',
  },
  {
    id: 5,
    category: 'Health',
    title: 'Global health trends affecting your community',
    author: 'HealthAdvocate',
    content: 'After the pandemic, our community is much more conscious about public health. What lasting changes have you seen in your area?',
    replies: 48,
    likes: 103,
    timestamp: '2 days ago',
  },
];

// Updated categories to focus on world events and personal impact
export const CATEGORIES = [
  'All Categories',
  'Politics',
  'Economy',
  'Climate',
  'Technology',
  'Health',
  'Culture',
  'Education',
];
