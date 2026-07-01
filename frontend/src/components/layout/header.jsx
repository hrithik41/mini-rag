import { useRef } from 'react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { UploadIcon } from '../icons/icons';

export const Header = ({ isDocumentReady, isUploading, onFileUpload }) => {
  const fileInputRef = useRef(null);

  return (
    <header className="header">
      <h1>Mini-RAG</h1>
      <div className="upload-section">
        <Badge text="Document Active" active={isDocumentReady} />
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={onFileUpload} 
          className="file-input" 
          accept=".pdf,.txt"
        />
        <Button 
          onClick={() => fileInputRef.current.click()}
          disabled={isUploading}
        >
          <UploadIcon />
          {isUploading ? 'Processing...' : 'Upload Document'}
        </Button>
      </div>
    </header>
  );
};
