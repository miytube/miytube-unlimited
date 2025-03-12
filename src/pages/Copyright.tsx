
import React from 'react';
import { Layout } from '@/components/Layout';

const Copyright = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-3xl font-bold mb-6 border-b pb-4">Copyright Policy</h1>
        
        <div className="space-y-6">
          <section>
            <h2 className="text-2xl font-semibold mb-3">Respecting Intellectual Property</h2>
            <p className="text-muted-foreground">
              MiyTube respects the intellectual property rights of others and expects our users to do the same. We're committed to helping content owners protect their intellectual property rights and addressing copyright infringement claims in accordance with applicable laws.
            </p>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold mb-3">Copyright Infringement Notification</h2>
            <p className="text-muted-foreground mb-4">
              If you believe that your copyrighted work has been copied in a way that constitutes copyright infringement and is accessible on MiyTube, please notify our copyright agent as set forth in the Digital Millennium Copyright Act of 1998 (DMCA).
            </p>
            <p className="text-muted-foreground">
              For your complaint to be valid under the DMCA, you must provide the following information when providing notice of the claimed copyright infringement:
            </p>
            <ul className="list-disc pl-5 space-y-2 mt-4 text-muted-foreground">
              <li>A physical or electronic signature of a person authorized to act on behalf of the copyright owner.</li>
              <li>Identification of the copyrighted work claimed to have been infringed.</li>
              <li>Identification of the material that is claimed to be infringing or to be the subject of the infringing activity and that is to be removed.</li>
              <li>Information reasonably sufficient to permit the service provider to contact the complaining party, such as an address, telephone number, and, if available, an electronic mail address.</li>
              <li>A statement that the complaining party "in good faith believes that use of the material in the manner complained of is not authorized by the copyright owner, its agent, or law."</li>
              <li>A statement that the information in the notification is accurate, and under penalty of perjury, that the complaining party is authorized to act on behalf of the copyright owner.</li>
            </ul>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold mb-3">Counter-Notification</h2>
            <p className="text-muted-foreground">
              If you believe that your content was removed by mistake or misidentification, you may submit a counter-notification to our copyright agent containing the following:
            </p>
            <ul className="list-disc pl-5 space-y-2 mt-4 text-muted-foreground">
              <li>Your physical or electronic signature.</li>
              <li>Identification of the content that has been removed or to which access has been disabled and the location at which the content appeared before it was removed or disabled.</li>
              <li>A statement under penalty of perjury that you have a good faith belief that the content was removed or disabled as a result of mistake or misidentification.</li>
              <li>Your name, address, telephone number, and email address, and a statement that you consent to the jurisdiction of the federal court in [Jurisdiction] and that you will accept service of process from the person who provided notification of the alleged infringement.</li>
            </ul>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold mb-3">Contact Our Copyright Agent</h2>
            <p className="text-muted-foreground">
              Please send copyright infringement notifications to:
            </p>
            <div className="bg-card p-4 rounded-lg border mt-4">
              <p className="text-muted-foreground">Copyright Agent</p>
              <p className="text-muted-foreground">MiyTube, Inc.</p>
              <p className="text-muted-foreground">123 Tech Lane</p>
              <p className="text-muted-foreground">San Francisco, CA 94107</p>
              <p className="text-muted-foreground">Email: copyright@miytube.com</p>
            </div>
          </section>
        </div>
      </div>
    </Layout>
  );
};

export default Copyright;
