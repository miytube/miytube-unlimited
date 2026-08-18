import React from 'react';
import { Link } from 'react-router-dom';
import { Users } from 'lucide-react';
import { Layout } from '@/components/Layout';
import { ChaChat } from '@/components/cha/ChaChat';
import { Button } from '@/components/ui/button';
import { usePageSEO } from '@/hooks/usePageSEO';
import chaLogo from '@/assets/cha-logo.png';

const MiytubeAtCha: React.FC = () => {
  usePageSEO({
    title: 'MiyTube At Cha — Cha talks back',
    description:
      'Chat with Cha, MiyTube\u2019s AI. Cha listens to how you talk and answers in your own voice. Jump into a live group room and bring friends.',
    path: '/talk-at-cha',
  });

  return (
    <Layout>
      <div className="mx-auto w-full max-w-3xl py-10 sm:py-16">
        <header className="flex flex-col items-center text-center">
          <img
            src={chaLogo}
            alt="Cha, the MiyTube AI"
            width={72}
            height={72}
            className="h-16 w-16 sm:h-[72px] sm:w-[72px]"
          />
          <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
            MiyTube At Cha.
            <span className="block text-primary">Cha talks back.</span>
          </h1>
          <p className="mt-4 max-w-xl text-base text-muted-foreground sm:text-lg">
            Cha is MiyTube&apos;s AI. It listens to how you actually talk — your words, your slang, your
            rhythm — and hands it right back to you. Say anything.
          </p>
          <Button asChild variant="outline" className="mt-6 gap-2 rounded-full">
            <Link to="/cha-rooms">
              <Users className="h-4 w-4" />
              Try the group chat
            </Link>
          </Button>
        </header>

        <section className="mt-10">
          <ChaChat />
        </section>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          Cha is an AI. It can get things wrong — don&apos;t treat it as medical, legal or financial advice.
        </p>
      </div>
    </Layout>
  );
};

export default MiytubeAtCha;
