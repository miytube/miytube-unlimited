
import React from 'react';
import { Layout } from '@/components/Layout';

const Privacy = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-3xl font-bold mb-6 border-b pb-4">Privacy Policy</h1>
        
        <div className="space-y-6">
          <section>
            <p className="text-muted-foreground mb-4">
              At MiyTube, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our website, mobile application, and services (collectively, the "Service").
            </p>
            <p className="text-muted-foreground">
              Please read this Privacy Policy carefully. By accessing or using the Service, you acknowledge that you have read, understood, and agree to be bound by all the terms of this Privacy Policy.
            </p>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold mb-3">1. Information We Collect</h2>
            <h3 className="text-xl font-medium mb-2">A. Personal Data</h3>
            <p className="text-muted-foreground mb-4">
              We may collect personally identifiable information, such as your name, email address, telephone number, date of birth, and username when you register for an account, subscribe to our newsletter, or otherwise interact with the Service.
            </p>
            <h3 className="text-xl font-medium mb-2">B. Usage Data</h3>
            <p className="text-muted-foreground mb-4">
              We may also collect information about how the Service is accessed and used ("Usage Data"). This Usage Data may include information such as your computer's Internet Protocol address (IP address), browser type, browser version, the pages of our Service that you visit, the time and date of your visit, the time spent on those pages, unique device identifiers, and other diagnostic data.
            </p>
            <h3 className="text-xl font-medium mb-2">C. Cookies and Tracking</h3>
            <p className="text-muted-foreground">
              We use cookies and similar tracking technologies to track activity on our Service and hold certain information. Cookies are files with a small amount of data which may include an anonymous unique identifier. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.
            </p>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold mb-3">2. How We Use Your Information</h2>
            <p className="text-muted-foreground mb-4">
              MiyTube may use the collected data for various purposes:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
              <li>To provide and maintain our Service</li>
              <li>To notify you about changes to our Service</li>
              <li>To allow you to participate in interactive features of our Service when you choose to do so</li>
              <li>To provide customer support</li>
              <li>To gather analysis or valuable information so that we can improve our Service</li>
              <li>To monitor the usage of our Service</li>
              <li>To detect, prevent and address technical issues</li>
              <li>To provide you with news, special offers and general information about other goods, services and events which we offer</li>
            </ul>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold mb-3">3. Disclosure of Your Information</h2>
            <p className="text-muted-foreground mb-4">
              We may disclose your Personal Data in the following situations:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
              <li><span className="font-medium text-foreground">Service Providers</span>: We may share your information with third-party service providers to perform tasks on our behalf and to assist us in providing the Service.</li>
              <li><span className="font-medium text-foreground">Business Transfers</span>: If MiyTube is involved in a merger, acquisition, or sale of assets, your Personal Data may be transferred.</li>
              <li><span className="font-medium text-foreground">Legal Requirements</span>: We may disclose your Personal Data if required to do so by law or in response to valid requests by public authorities.</li>
              <li><span className="font-medium text-foreground">With Your Consent</span>: We may disclose your Personal Data for any other purpose with your consent.</li>
            </ul>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold mb-3">4. Security of Your Information</h2>
            <p className="text-muted-foreground">
              The security of your data is important to us, but remember that no method of transmission over the Internet or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your Personal Data, we cannot guarantee its absolute security.
            </p>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold mb-3">5. Your Data Protection Rights</h2>
            <p className="text-muted-foreground mb-4">
              Depending on your location, you may have certain rights regarding your personal information, including:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
              <li>The right to access, update or delete the information we have on you</li>
              <li>The right of rectification - the right to correct information</li>
              <li>The right to object - the right to object to our processing of your data</li>
              <li>The right of restriction - the right to request that we restrict the processing of your data</li>
              <li>The right to data portability - the right to be provided with a copy of your data in a structured, machine-readable format</li>
              <li>The right to withdraw consent at any time</li>
            </ul>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold mb-3">6. Changes to This Privacy Policy</h2>
            <p className="text-muted-foreground">
              We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date at the bottom of this page.
            </p>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold mb-3">7. Contact Us</h2>
            <p className="text-muted-foreground">
              If you have any questions about this Privacy Policy, please contact us at privacy@miytube.com.
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

export default Privacy;
