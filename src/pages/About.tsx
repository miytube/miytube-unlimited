
import React from 'react';
import { Layout } from '@/components/Layout';

const About = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-3xl font-bold mb-6 border-b pb-4">About MiyTube</h1>
        
        <div className="space-y-6">
          <section>
            <h2 className="text-2xl font-semibold mb-3">Our Mission</h2>
            <p className="text-muted-foreground">
              MiyTube is dedicated to creating an open platform where creators and viewers can connect, share ideas, and discover content without limitations. We believe in fostering creativity, supporting diverse voices, and building a community where everyone has the opportunity to be heard.
            </p>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold mb-3">Our Story</h2>
            <p className="text-muted-foreground mb-4">
              Founded in 2023, MiyTube emerged from a simple idea: content sharing should be accessible to everyone. What started as a small project quickly grew into a platform used by millions around the world.
            </p>
            <p className="text-muted-foreground">
              Our team is comprised of passionate individuals who believe in the power of digital content to educate, entertain, and inspire. We're constantly working to improve our platform, add new features, and ensure MiyTube remains a place where creativity thrives.
            </p>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold mb-3">Our Values</h2>
            <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
              <li><span className="font-medium text-foreground">Freedom of Expression</span> - We support creators' rights to share their perspectives and ideas.</li>
              <li><span className="font-medium text-foreground">Inclusivity</span> - We're building a platform that welcomes diverse voices and perspectives.</li>
              <li><span className="font-medium text-foreground">Innovation</span> - We're constantly evolving to provide the best experience for our users.</li>
              <li><span className="font-medium text-foreground">Quality</span> - We strive to deliver a reliable, high-performance platform.</li>
              <li><span className="font-medium text-foreground">Community</span> - We foster connections between creators and viewers.</li>
            </ul>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold mb-3">Leadership Team</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
              <div className="bg-card p-4 rounded-lg border">
                <h3 className="font-medium">Mark Hayes</h3>
                <p className="text-sm text-muted-foreground">Owner & Chief Executive Officer</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </Layout>
  );
};

export default About;
