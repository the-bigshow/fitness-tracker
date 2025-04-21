import React, { useRef, useState } from 'react';
import { Upload } from 'lucide-react';

interface ImageUploadProps {
  onImageSelect: (file: File) => void;
  className?: string;
  children?: React.ReactNode;
}

export default function ImageUpload({ onImageSelect, className = '', children }: ImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      validateAndUploadFile(file);
    }
  };

  const validateAndUploadFile = (file: File) => {
    if (file.type.startsWith('image/')) {
      onImageSelect(file);
    } else {
      alert('Please select an image file');
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      validateAndUploadFile(file);
    }
  };

  return (
    <div
      onClick={handleClick}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      className={`cursor-pointer ${className}`}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        accept="image/*"
        className="hidden"
      />
      {children || (
        <div
          className={`flex items-center justify-center p-4 border-2 ${
            isDragging
              ? 'border-indigo-500 bg-indigo-50'
              : 'border-dashed border-gray-300 hover:border-indigo-500'
          } rounded-lg transition-colors`}
        >
          <div className="text-center">
            <Upload className={`mx-auto h-12 w-12 ${isDragging ? 'text-indigo-500' : 'text-gray-400'}`} />
            <p className={`mt-1 text-sm ${isDragging ? 'text-indigo-600' : 'text-gray-600'}`}>
              {isDragging ? 'Drop image here' : 'Drag and drop or click to upload'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}