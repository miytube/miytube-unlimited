import React from 'react';
import { Layout } from '@/components/Layout';
import { usePageSEO } from '@/hooks/usePageSEO';
import { Mail, Globe, MapPin } from 'lucide-react';

const AboutMarkHayes = () => {
  usePageSEO({
    title: 'About Mark Hayes — Founder of MiyTube',
    description: 'Meet Mark Hayes, the founder of MiyTube. Learn about his mission to build an independent, fast, and creator-friendly video platform.',
    path: '/about-mark-hayes',
  });

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-3xl md:text-4xl font-bold mb-8 border-b pb-4">
          About Mark Hayes — Founder of MiyTube
        </h1>

        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-semibold mb-3">Who I Am</h2>
            <p className="text-muted-foreground leading-relaxed">
              I’m Mark Hayes, the creator and founder of MiyTube, an independent video platform built for simplicity, speed, and creator freedom. MiyTube is my personal project — designed, developed, and maintained by me — with a focus on giving users a clean, distraction-free space to watch and share videos.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">Why I Created MiyTube</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              I built MiyTube because modern video platforms have become bloated, complicated, and filled with noise. My goal is to create a space where:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
              <li>Creators can upload without friction</li>
              <li>Viewers can watch without clutter</li>
              <li>The platform stays fast and simple</li>
              <li>The experience feels personal and independent</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">My Mission</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              My mission with MiyTube is to:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
              <li>Keep the platform lightweight and fast</li>
              <li>Give creators more control</li>
              <li>Maintain a clean, minimal interface</li>
              <li>Build a community around independent content</li>
              <li>Expand features without sacrificing simplicity</li>
              <li>Connect creators and viewers directly</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">Connect With Me</h2>
            <div className="bg-card p-5 rounded-lg border space-y-3">
              <div className="flex items-center gap-3 text-muted-foreground">
                <Mail size={18} className="text-primary" />
                <span>Email: miytube@aol.com</span>
              </div>
              <div className="flex items-center gap-3 text-muted-foreground">
                <Globe size={18} className="text-primary" />
                <a
                  href="https://miytube.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-foreground transition-colors"
                >
                  Website: https://miytube.com
                </a>
              </div>
              <div className="flex items-center gap-3 text-muted-foreground">
                <MapPin size={18} className="text-primary" />
                <span>Location: Murrieta, California</span>
              </div>
            </div>
          </section>

          <section className="border-t pt-6">
            <p className="text-sm text-muted-foreground">
              © 2026 Mark Hayes<br />
              Founder of MiyTube
            </p>
          </section>
        </div>
      </div>
    </Layout>
  );
};

export default AboutMarkHayes;
