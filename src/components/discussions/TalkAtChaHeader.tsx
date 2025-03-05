
import React from 'react';
import { MessageSquare, Users } from 'lucide-react';

export const TalkAtChaHeader = () => {
  return (
    <div className="mb-8">
      <div className="flex items-center gap-2 mb-2">
        <MessageSquare className="h-6 w-6 text-primary" />
        <h1 className="text-3xl font-bold">Talk At Cha</h1>
      </div>
      
      <div className="flex items-center gap-2 text-muted-foreground mb-4">
        <MessageSquare className="h-4 w-4" />
        <span>Join the conversation about global events</span>
        <Users className="h-4 w-4 ml-4" />
        <span>Connect with others</span>
      </div>
      
      <p className="text-muted-foreground">
        Discuss how global events affect your personal life. Share your experiences, ask questions,
        and connect with others about the impact of politics, economy, climate, technology, and more on your daily life.
      </p>
    </div>
  );
};
