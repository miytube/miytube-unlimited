
import React from 'react';
import { Link } from 'react-router-dom';
import { Upload } from 'lucide-react';

interface AboutSectionProps {
  title: string;
}

const AboutSection: React.FC<AboutSectionProps> = ({ title }) => {
  return (
    <div className="bg-card p-6 rounded-lg shadow-sm mb-8">
      <h2 className="text-xl font-semibold mb-4">About {title}</h2>
      <p className="text-muted-foreground">
        This category features content related to {title.toLowerCase()}.
        Explore videos, shorts, and more from creators specializing in this area.
        If you're a content creator in this space, consider uploading your own content.
      </p>
      <div className="mt-4">
        <Link to="/upload" className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors">
          <Upload size={18} />
          <span>Upload {title} Content</span>
        </Link>
      </div>
    </div>
  );
};

export default AboutSection;
