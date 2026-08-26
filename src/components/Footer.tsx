
import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Youtube, Linkedin } from 'lucide-react';
import { useSite } from '@/hooks/useSite';
import { NewsletterSignup } from '@/components/NewsletterSignup';


export const Footer = () => {
  const { site } = useSite();
  const social = site.social ?? {};

  return (
    <footer className="bg-card border-t mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <Link to="/" className="flex items-center gap-1 mb-4">
              <span className="text-primary font-bold text-xl">{site.wordmark[0]}</span>
              <span className="font-bold text-xl">{site.wordmark[1]}</span>
            </Link>
            <p className="text-muted-foreground text-sm mb-6">
              {site.tagline}
            </p>
            <div className="flex items-center gap-4">
              {social.facebook && (
                <a href={social.facebook} target="_blank" rel="noopener noreferrer" aria-label={`${site.name} on Facebook`} className="text-muted-foreground hover:text-primary transition-colors">
                  <Facebook size={20} />
                </a>
              )}
              {social.twitter && (
                <a href={social.twitter} target="_blank" rel="noopener noreferrer" aria-label={`${site.name} on X`} className="text-muted-foreground hover:text-primary transition-colors">
                  <Twitter size={20} />
                </a>
              )}
              {social.instagram && (
                <a href={social.instagram} target="_blank" rel="noopener noreferrer" aria-label={`${site.name} on Instagram`} className="text-muted-foreground hover:text-primary transition-colors">
                  <Instagram size={20} />
                </a>
              )}
              {social.youtube && (
                <a href={social.youtube} target="_blank" rel="noopener noreferrer" aria-label={`${site.name} on YouTube`} className="text-muted-foreground hover:text-primary transition-colors">
                  <Youtube size={20} />
                </a>
              )}
              {social.linkedin && (
                <a href={social.linkedin} target="_blank" rel="noopener noreferrer" aria-label={`${site.name} on LinkedIn`} className="text-muted-foreground hover:text-primary transition-colors">
                  <Linkedin size={20} />
                </a>
              )}
            </div>
          </div>
          
          <div>
            <h3 className="font-medium mb-4">Content</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">Videos</Link></li>
              <li><Link to="/long-videos" className="text-muted-foreground hover:text-foreground transition-colors">Long Videos</Link></li>
              <li><Link to="/images" className="text-muted-foreground hover:text-foreground transition-colors">Images</Link></li>
              <li><Link to="/audio" className="text-muted-foreground hover:text-foreground transition-colors">Audio</Link></li>
              <li><Link to="/documents" className="text-muted-foreground hover:text-foreground transition-colors">Documents</Link></li>
              <li><Link to="/blog" className="text-muted-foreground hover:text-foreground transition-colors">Blog</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-medium mb-4">Business</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/monetization" className="text-muted-foreground hover:text-foreground transition-colors">Monetization</Link></li>
              <li><Link to="/advertising" className="text-muted-foreground hover:text-foreground transition-colors">Advertising</Link></li>
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">For Developers</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Partner Program</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Analytics</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-medium mb-4">Resources</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/contact" className="text-muted-foreground hover:text-foreground transition-colors">Help Center</Link></li>
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Community</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Creator Academy</a></li>
              <li><Link to="/copyright" className="text-muted-foreground hover:text-foreground transition-colors">Copyright</Link></li>
              <li><Link to="/about" className="text-muted-foreground hover:text-foreground transition-colors">About Us</Link></li>
              <li><Link to="/about-mark-hayes" className="text-muted-foreground hover:text-foreground transition-colors">About the Founder</Link></li>
            </ul>
          </div>
        </div>

        <NewsletterSignup
          className="mb-8"
          heading={`Subscribe to ${site.name}`}
        />


        
        <div className="border-t pt-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-muted-foreground">
              <Link to="/terms" className="hover:text-foreground transition-colors">Terms of Service</Link>
              <Link to="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</Link>
              <a href="#" className="hover:text-foreground transition-colors">Accessibility</a>
              <a href="#" className="hover:text-foreground transition-colors">Cookie Preferences</a>
              <Link to="/contact" className="hover:text-foreground transition-colors">Contact Us</Link>
            </div>
            <div className="text-xs text-muted-foreground">
              © {new Date().getFullYear()} {site.name}. All rights reserved.
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
