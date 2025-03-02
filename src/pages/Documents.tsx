
import React from 'react';
import { Layout } from '@/components/Layout';
import { FileText, Upload, Download, Search, Filter, Eye, MoreHorizontal } from 'lucide-react';

const Documents = () => {
  const documentSamples = [
    {
      id: 'doc1',
      title: 'Business Proposal Template',
      type: 'PDF',
      size: '2.4 MB',
      author: 'Business Pro',
      views: '124K',
      date: '3 days ago',
    },
    {
      id: 'doc2',
      title: 'Research Paper on AI Development',
      type: 'PDF',
      size: '3.8 MB',
      author: 'Tech Research',
      views: '87K',
      date: '1 week ago',
    },
    {
      id: 'doc3',
      title: 'Monthly Budget Spreadsheet',
      type: 'XLSX',
      size: '1.2 MB',
      author: 'Finance Helper',
      views: '245K',
      date: '2 weeks ago',
    },
    {
      id: 'doc4',
      title: 'Project Management Guide',
      type: 'PDF',
      size: '5.1 MB',
      author: 'PM Experts',
      views: '156K',
      date: '1 month ago',
    },
    {
      id: 'doc5',
      title: 'Creative Writing Examples',
      type: 'DOCX',
      size: '850 KB',
      author: 'Writers Guild',
      views: '63K',
      date: '5 days ago',
    },
    {
      id: 'doc6',
      title: 'Presentation on Market Trends',
      type: 'PPTX',
      size: '4.2 MB',
      author: 'Market Analysis',
      views: '92K',
      date: '2 days ago',
    },
  ];

  return (
    <Layout>
      <div className="py-6 animate-fade-in">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">MiyTube Documents</h1>
          <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-full hover:bg-primary/90 transition-colors">
            <Upload size={18} />
            <span>Upload Document</span>
          </button>
        </div>
        
        <div className="bg-card p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-xl font-semibold mb-4">Upload and Share Documents</h2>
          <p className="text-muted-foreground mb-4">
            Share your documents, presentations, spreadsheets, and more with the MiyTube community. Upload various file formats with no size restrictions.
          </p>
          <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
            <FileText size={48} className="mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground mb-2">Drag and drop documents here, or click to browse</p>
            <p className="text-xs text-muted-foreground mb-4">Supports PDF, DOCX, XLSX, PPTX, and more</p>
            <button className="px-4 py-2 bg-secondary text-foreground rounded-md hover:bg-secondary/80 transition-colors">
              Select Files
            </button>
          </div>
        </div>
        
        <div className="flex items-center justify-between mb-6">
          <div className="relative flex-grow max-w-md">
            <input
              type="text"
              placeholder="Search documents..."
              className="w-full pl-10 pr-4 py-2 rounded-md bg-secondary"
            />
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          </div>
          
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 px-3 py-2 rounded-md bg-secondary text-foreground hover:bg-secondary/80 transition-colors">
              <Filter size={16} />
              <span>Filters</span>
            </button>
            <select className="bg-secondary px-3 py-2 rounded-md text-sm">
              <option>Most Popular</option>
              <option>Newest</option>
              <option>Oldest</option>
            </select>
          </div>
        </div>
        
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-6">Popular Documents</h2>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px] border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Name</th>
                  <th className="text-left py-3 px-4">Type</th>
                  <th className="text-left py-3 px-4">Size</th>
                  <th className="text-left py-3 px-4">Uploaded by</th>
                  <th className="text-left py-3 px-4">Views</th>
                  <th className="text-left py-3 px-4">Date</th>
                  <th className="text-left py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {documentSamples.map((doc) => (
                  <tr key={doc.id} className="border-b hover:bg-secondary/20 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <FileText size={20} className="text-primary" />
                        <span className="font-medium">{doc.title}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">{doc.type}</td>
                    <td className="py-3 px-4">{doc.size}</td>
                    <td className="py-3 px-4">{doc.author}</td>
                    <td className="py-3 px-4">{doc.views}</td>
                    <td className="py-3 px-4">{doc.date}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <button className="p-1 text-muted-foreground hover:text-foreground transition-colors" title="View">
                          <Eye size={18} />
                        </button>
                        <button className="p-1 text-muted-foreground hover:text-foreground transition-colors" title="Download">
                          <Download size={18} />
                        </button>
                        <button className="p-1 text-muted-foreground hover:text-foreground transition-colors" title="More">
                          <MoreHorizontal size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        <div>
          <h2 className="text-2xl font-semibold mb-4">Document Categories</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {['Business', 'Education', 'Creative', 'Technical', 'Legal', 'Financial', 'Medical', 'Research', 'Templates', 'Guides', 'Reports', 'Presentations'].map((category) => (
              <div key={category} className="rounded-lg overflow-hidden bg-card shadow-sm hover:shadow-md transition-shadow p-4 text-center">
                <FileText size={32} className="mx-auto mb-2 text-primary" />
                <div className="font-medium">{category}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Documents;
