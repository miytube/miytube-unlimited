
import React from 'react';
import { Layout } from '@/components/Layout';

const Terms = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-3xl font-bold mb-6 border-b pb-4">Terms of Service</h1>
        
        <div className="space-y-6">
          <section>
            <p className="text-muted-foreground mb-4">
              These Terms of Service ("Terms") govern your access to and use of MiyTube's website, services, and applications (the "Service"). Please read these Terms carefully, and contact us if you have any questions.
            </p>
            <p className="text-muted-foreground">
              By accessing or using the Service, you agree to be bound by these Terms and our Privacy Policy.
            </p>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold mb-3">1. Using MiyTube</h2>
            <h3 className="text-xl font-medium mb-2">A. Account Registration</h3>
            <p className="text-muted-foreground mb-4">
              To access certain features of the Service, you may be required to register for an account. When you register, you agree to provide accurate, current, and complete information about yourself and to keep this information updated.
            </p>
            <h3 className="text-xl font-medium mb-2">B. Account Security</h3>
            <p className="text-muted-foreground mb-4">
              You are responsible for safeguarding your password and for all activities that occur under your account. You should notify MiyTube immediately if you become aware of any breach of security or unauthorized use of your account.
            </p>
            <h3 className="text-xl font-medium mb-2">C. Age Requirements</h3>
            <p className="text-muted-foreground">
              You must be at least 13 years old to use the Service. If you are under the age of 18, you must have the consent of a parent or legal guardian to use the Service.
            </p>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold mb-3">2. User Content</h2>
            <h3 className="text-xl font-medium mb-2">A. Content Responsibility</h3>
            <p className="text-muted-foreground mb-4">
              You retain ownership of any intellectual property rights that you hold in content that you post to the Service. When you upload or post content to the Service, you grant MiyTube a worldwide, non-exclusive, royalty-free license to use, reproduce, modify, adapt, publish, translate, create derivative works from, distribute, and display such content.
            </p>
            <h3 className="text-xl font-medium mb-2">B. Content Guidelines</h3>
            <p className="text-muted-foreground">
              You are solely responsible for your conduct and any content that you submit, post, or display on or through the Service. You agree not to post content that is illegal, obscene, threatening, defamatory, invasive of privacy, infringing of intellectual property rights, or otherwise injurious to third parties.
            </p>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold mb-3">3. Prohibited Uses</h2>
            <p className="text-muted-foreground mb-4">
              You agree not to use the Service:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
              <li>In any way that violates any applicable federal, state, local, or international law or regulation.</li>
              <li>To transmit, or procure the sending of, any advertising or promotional material, including any "junk mail," "chain letter," "spam," or any other similar solicitation.</li>
              <li>To impersonate or attempt to impersonate MiyTube, a MiyTube employee, another user, or any other person or entity.</li>
              <li>To engage in any other conduct that restricts or inhibits anyone's use or enjoyment of the Service, or which may harm MiyTube or users of the Service.</li>
            </ul>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold mb-3">4. Termination</h2>
            <p className="text-muted-foreground">
              MiyTube may terminate or suspend your account and bar access to the Service immediately, without prior notice or liability, under our sole discretion, for any reason whatsoever and without limitation, including but not limited to a breach of the Terms.
            </p>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold mb-3">5. Changes to Terms</h2>
            <p className="text-muted-foreground">
              MiyTube reserves the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, we will provide at least 30 days' notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.
            </p>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold mb-3">6. Contact Us</h2>
            <p className="text-muted-foreground">
              If you have any questions about these Terms, please contact us at legal@miytube.com.
            </p>
          </section>
          
          <div className="border-t pt-4 mt-8">
            <p className="text-sm text-muted-foreground">
              Last updated: July 1, 2023
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Terms;
