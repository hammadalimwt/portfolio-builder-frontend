import React, { useRef, useState } from 'react';
import { UploadCloud, Image as ImageIcon, X } from 'lucide-react';

export default function FileUpload({
  onFile,
  accept = 'image/*',
  maxSize = 5242880, // 5MB
  preview = true,
  label = 'Upload file',
  className = '',
}) {
  const fileInputRef = useRef(null);
  const [dragActive, setDragActive] = useState(false);
  const [filePreview, setFilePreview] = useState(null);
  const [fileName, setFileName] = useState('');

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = (file) => {
    if (file.size > maxSize) {
      alert(`File size exceeds limit of ${maxSize / (1024 * 1024)}MB.`);
      return;
    }
    setFileName(file.name);
    if (preview && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = () => {
        setFilePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
    onFile(file);
  };

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const clearFile = (e) => {
    e.stopPropagation();
    setFilePreview(null);
    setFileName('');
    onFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className={`pb-file-upload-wrapper ${className}`}>
      <style>{`
        .pb-file-upload-wrapper {
          width: 100%;
          font-family: var(--font-family);
        }
        .pb-file-upload-zone {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: var(--space-6) var(--space-4);
          background-color: var(--bg-input);
          border: 2px dashed var(--border);
          border-radius: var(--radius-md);
          cursor: pointer;
          transition: var(--transition-base);
          position: relative;
        }
        .pb-file-upload-zone-active,
        .pb-file-upload-zone:hover {
          border-color: var(--primary);
          background-color: var(--bg-card);
        }
        .pb-upload-icon {
          color: var(--text-muted);
          margin-bottom: var(--space-2);
        }
        .pb-upload-text {
          font-size: var(--font-size-sm);
          color: var(--text-secondary);
          text-align: center;
          margin-bottom: var(--space-1);
        }
        .pb-upload-subtext {
          font-size: var(--font-size-xs);
          color: var(--text-muted);
        }
        .pb-file-preview-card {
          display: flex;
          align-items: center;
          gap: var(--space-3);
          padding: var(--space-3) var(--space-4);
          background-color: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: var(--radius-md);
          position: relative;
        }
        .pb-file-preview-img {
          width: 48px;
          height: 48px;
          object-fit: cover;
          border-radius: var(--radius-sm);
          border: 1px solid var(--border);
        }
        .pb-file-info {
          flex-grow: 1;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }
        .pb-file-name {
          font-size: var(--font-size-sm);
          font-weight: var(--fw-medium);
          color: var(--text-primary);
        }
        .pb-clear-btn {
          color: var(--text-muted);
          cursor: pointer;
          transition: var(--transition-fast);
          padding: 4px;
          border-radius: var(--radius-full);
          background: var(--border);
        }
        .pb-clear-btn:hover {
          color: var(--error);
          background: rgba(239,68,68,0.15);
        }
      `}</style>
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        style={{ display: 'none' }}
        onChange={handleChange}
      />
      {filePreview || fileName ? (
        <div className="pb-file-preview-card">
          {filePreview ? (
            <img src={filePreview} alt="Preview" className="pb-file-preview-img" />
          ) : (
            <ImageIcon className="pb-upload-icon" size={24} />
          )}
          <div className="pb-file-info">
            <span className="pb-file-name truncate">{fileName || 'Uploaded file'}</span>
          </div>
          <button type="button" className="pb-clear-btn" onClick={clearFile} aria-label="Clear file">
            <X size={16} />
          </button>
        </div>
      ) : (
        <div
          className={`pb-file-upload-zone ${dragActive ? 'pb-file-upload-zone-active' : ''}`}
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          onClick={handleButtonClick}
        >
          <UploadCloud className="pb-upload-icon" size={32} />
          <span className="pb-upload-text">Drag & drop your files here, or <span style={{ color: 'var(--primary)', fontWeight: 'bold' }}>Browse</span></span>
          <span className="pb-upload-subtext">Max size: {maxSize / (1024 * 1024)}MB</span>
        </div>
      )}
    </div>
  );
}
