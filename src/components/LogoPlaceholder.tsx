
import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ImagePlus } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { useFileUpload } from "@/hooks/useFileUpload";

export const LogoPlaceholder = () => {
  const [logoImage, setLogoImage] = useState<string | null>(null);
  const { toast } = useToast();
  
  // Set up file upload hook with image formats
  const {
    fileInputRef,
    handleFileSelect,
    uploadError,
    uploading
  } = useFileUpload({
    supportedFormats: ['jpg', 'jpeg', 'png', 'svg', 'webp'],
    maxSize: '5', // 5MB
    onUpload: (files) => {
      if (files.length > 0) {
        const file = files[0];
        const imageUrl = URL.createObjectURL(file);
        setLogoImage(imageUrl);
        toast({
          title: "Logo uploaded successfully",
          description: `File "${file.name}" has been set as the logo`,
        });
      }
    },
    id: 'logo-upload'
  });

  const handleLogoClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="w-full bg-muted py-4">
      <div className="container mx-auto px-4 flex justify-start items-center">
        <Link 
          to="/" 
          className="flex items-center gap-2 hover:opacity-80 transition-opacity"
        >
          <button
            onClick={handleLogoClick}
            className="w-12 h-12 bg-card border-2 border-dashed border-muted-foreground/30 rounded-lg flex items-center justify-center hover:bg-muted cursor-pointer relative overflow-hidden"
            type="button"
            aria-label="Upload logo"
            disabled={uploading}
          >
            {logoImage ? (
              <img 
                src={logoImage} 
                alt="MiyTube Logo" 
                className="w-full h-full object-cover"
              />
            ) : (
              <ImagePlus className="w-6 h-6 text-muted-foreground" />
            )}
            
            {uploading && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
              </div>
            )}
          </button>
          <div className="flex items-baseline">
            <span className="text-primary font-bold text-2xl">Miy</span>
            <span className="font-bold text-2xl">Tube</span>
          </div>
        </Link>
        
        <input 
          type="file" 
          className="hidden" 
          accept=".jpg,.jpeg,.png,.svg,.webp" 
          onChange={handleFileSelect}
          ref={fileInputRef}
          id="logo-upload"
        />
      </div>
      
      {uploadError && (
        <div className="text-xs text-destructive mt-1 text-center">
          {uploadError}
        </div>
      )}
    </div>
  );
};
