
import React, { useEffect, useRef } from 'react';
import { ContentType } from '@/types/upload';

interface ContentTypeSelectorProps {
  contentTypes: Record<string, ContentType>;
  selectedContentType: string;
  setSelectedContentType: (type: string) => void;
  onContentTypeChange?: (contentType: ContentType) => void;
}

export const ContentTypeSelector: React.FC<ContentTypeSelectorProps> = ({
  contentTypes,
  selectedContentType,
  setSelectedContentType,
  onContentTypeChange
}) => {
  const prevContentTypeRef = useRef<string>(selectedContentType);

  useEffect(() => {
    // If content type changed, call the callback
    if (prevContentTypeRef.current !== selectedContentType && onContentTypeChange) {
      onContentTypeChange(contentTypes[selectedContentType]);
      prevContentTypeRef.current = selectedContentType;
    }
  }, [selectedContentType, contentTypes, onContentTypeChange]);

  const handleContentTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedContentType(e.target.value);
  };

  const handleTypeClick = (typeId: string) => {
    setSelectedContentType(typeId);
  };

  return (
    <div className="bg-card p-6 rounded-lg shadow-md mb-8">
      <div className="flex items-center gap-4 mb-6">
        <h2 className="text-xl font-semibold">Select Content Type</h2>
        <select 
          className="p-2 rounded-md border bg-background flex-grow max-w-xs"
          value={selectedContentType}
          onChange={handleContentTypeChange}
        >
          {Object.values(contentTypes).map(type => (
            <option key={type.id} value={type.id}>{type.name}</option>
          ))}
        </select>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {Object.values(contentTypes).map(type => (
          <div 
            key={type.id} 
            className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
              selectedContentType === type.id 
                ? 'border-primary bg-primary/5' 
                : 'border-transparent hover:border-muted-foreground/30'
            }`}
            onClick={() => handleTypeClick(type.id)}
          >
            <div className="flex items-center gap-3 mb-2">
              <type.icon size={24} className={selectedContentType === type.id ? 'text-primary' : 'text-muted-foreground'} />
              <h3 className="font-medium">{type.name}</h3>
            </div>
            <p className="text-sm text-muted-foreground">{type.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
