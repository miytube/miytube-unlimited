import React from 'react';
import { Layout } from '@/components/Layout';
import { CreatorSignup } from '@/components/channel/CreatorSignup';
import { CreatorDashboard } from '@/components/channel/CreatorDashboard';
import { ChannelHeader } from '@/components/channel/ChannelHeader';
import { useAuth } from '@/hooks/useAuth';

const Channel: React.FC = () => {
  const { user } = useAuth();
  const isLoggedIn = !!user;

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <ChannelHeader creatorId={user?.id} />
        
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
