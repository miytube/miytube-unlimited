
import React from 'react';
import { Info } from 'lucide-react';

interface DocumentUploadRequirementsProps {
  documentFormats: string[];
}

export const DocumentUploadRequirements: React.FC<DocumentUploadRequirementsProps> = ({ 
  documentFormats 
}) => {
  return (
    <div className="bg-card p-6 rounded-lg shadow-md mb-8">
      <div className="flex items-center gap-2 mb-4">
        <Info size={20} className="text-primary" />
        <h2 className="text-xl font-semibold">Document Upload Requirements</h2>
      </div>
      <div className="grid md:grid-cols-3 gap-6">
        <div className="border rounded-lg p-4">
          <h3 className="font-medium mb-2">Document Formats Only</h3>
          <p className="text-sm text-muted-foreground">
            {documentFormats.join(', ')}
          </p>
        </div>
        <div className="border rounded-lg p-4">
          <h3 className="font-medium mb-2">File Size</h3>
          <p className="text-sm text-muted-foreground">
            Up to 500MB per document
          </p>
        </div>
        <div className="border rounded-lg p-4">
          <h3 className="font-medium mb-2">Quality</h3>
          <p className="text-sm text-muted-foreground">
            Legible text and clear formatting
          </p>
        </div>
        <div className="border rounded-lg p-4">
          <h3 className="font-medium mb-2">Copyright</h3>
          <p className="text-sm text-muted-foreground">
            You must own rights or have permission
          </p>
        </div>
        <div className="border rounded-lg p-4">
          <h3 className="font-medium mb-2">Organization</h3>
          <p className="text-sm text-muted-foreground">
            Properly structured documents with clear headings
          </p>
        </div>
        <div className="border rounded-lg p-4">
          <h3 className="font-medium mb-2">Metadata</h3>
          <p className="text-sm text-muted-foreground">
            Include title, description and category
          </p>
        </div>
      </div>
    </div>
  );
};
