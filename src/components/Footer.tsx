
import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Youtube, Linkedin } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-card border-t mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <Link to="/" className="flex items-center gap-1 mb-4">
              <span className="text-primary font-bold text-xl">Miy</span>
              <span className="font-bold text-xl">Tube</span>
            </Link>
            <p className="text-muted-foreground text-sm mb-6">
              Your platform for unlimited video content. Upload, share, and discover with no restrictions.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Youtube size={20} />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Linkedin size={20} />
              </a>
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
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Help Center</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Community</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Creator Academy</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Safety Center</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Copyright</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t pt-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-muted-foreground">
              <a href="#" className="hover:text-foreground transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-foreground transition-colors">Accessibility</a>
              <a href="#" className="hover:text-foreground transition-colors">Cookie Preferences</a>
              <a href="#" className="hover:text-foreground transition-colors">Contact Us</a>
            </div>
            <div className="text-xs text-muted-foreground">
              © 2023 MiyTube. All rights reserved.
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
