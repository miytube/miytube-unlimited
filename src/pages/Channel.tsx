
import React from 'react';
import { Layout } from '@/components/Layout';
import { CreatorSignup } from '@/components/channel/CreatorSignup';
import { CreatorDashboard } from '@/components/channel/CreatorDashboard';
import { ChannelHeader } from '@/components/channel/ChannelHeader';

const Channel: React.FC = () => {
  // In a real app, we would check if the user is logged in
  const isLoggedIn = false;

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <ChannelHeader />
        
        {isLoggedIn ? (
          <CreatorDashboard />
        ) : (
          <CreatorSignup />
        )}
      </div>
    </Layout>
  );
};

export default Channel;
