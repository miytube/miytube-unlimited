
import React from 'react';
import { Bot, Cpu, Smartphone, Globe, Rocket, Satellite } from 'lucide-react';
import { SidebarCategoryLinks } from './SidebarCategoryLinks';

export const AITechnologyLinks: React.FC = () => {
  const aiTechnologyLinks = [
    { 
      id: 'ai', 
      icon: Bot, 
      label: 'AI & Technology', 
      path: '/ai',
      subItems: [
        { id: 'ai-chatgpt', label: 'ChatGPT, Gemini, Microsoft', path: '/ai/chatbots' },
        { id: 'ai-agents', label: 'AI Agents & Software', path: '/ai/agents' },
        { id: 'ai-humanoid', label: 'AI Humanoid Robots', path: '/ai/humanoid' },
        { id: 'ai-hr', label: 'AI Human Resources', path: '/ai/hr' },
        { id: 'ai-robots', label: 'AI Robots', path: '/ai/robots' },
        { id: 'ai-bots', label: 'AI Bots & Automation', path: '/ai/bots' }
      ]
    },
    { 
      id: 'science-tech', 
      icon: Cpu, 
      label: 'Science & Tech', 
      path: '/science-tech',
      subItems: [
        { id: 'science-knowledge', label: 'Knowledge & Know How', path: '/science-tech/knowledge' },
        { id: 'science-inventions', label: 'Inventions', path: '/science-tech/inventions' },
        { id: 'science-gadgets', label: 'Gadgets & Devices', path: '/science-tech/gadgets' },
        { id: 'science-experiments', label: 'Experiments', path: '/science-tech/experiments' }
      ]
    },
    { 
      id: 'cell-phone', 
      icon: Smartphone, 
      label: 'Cell Phone', 
      path: '/cell-phone',
      subItems: [
        { id: 'cell-tricks', label: 'Tricks & Hacks', path: '/cell-phone/tricks' },
        { id: 'cell-tips', label: 'Tips & Guides', path: '/cell-phone/tips' }
      ]
    },
    { 
      id: 'internet', 
      icon: Globe, 
      label: 'Internet & Programming', 
      path: '/internet',
      subItems: [
        { id: 'internet-programming', label: 'Programming & Coding', path: '/internet/programming' },
        { id: 'internet-web', label: 'Web Development', path: '/internet/web' }
      ]
    },
    { 
      id: 'space', 
      icon: Rocket, 
      label: 'Space', 
      path: '/space',
      subItems: [
        { id: 'space-craft', label: 'Spacecraft & Shuttles', path: '/space/craft' },
        { id: 'space-universe', label: 'Universe & Earth', path: '/space/universe' },
        { id: 'space-ufo', label: 'UFOs & Strange Sightings', path: '/space/ufo' }
      ]
    },
  ];

  return <SidebarCategoryLinks title="AI & TECHNOLOGY" links={aiTechnologyLinks} />;
};
