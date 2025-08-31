import React, { useState, useCallback, useRef } from 'react';
import type { ImageData } from '../types';
import UploadIcon from './icons/UploadIcon';
import XCircleIcon from './icons/XCircleIcon';

interface ImageUploaderProps {
  onImageChange: (image: ImageData | null) => void;
  isDisabled: boolean;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageChange, isDisabled }) => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = useCallback((file: File | null) => {
    if (!file) return;

    // Basic validation
    if (!file.type.startsWith('image/')) {
      setError('Please upload a valid image file (PNG, JPG, etc.).');
      return;
    }
    // 5MB limit
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size should not exceed 5MB.');
      return;
    }
    setError(null);

    const reader = new FileReader();
    reader.onloadend = () => {
      const dataUrl = reader.result as string;
      setImagePreview(dataUrl);

      // Extract base64 data and mime type
      const [header, base64Data] = dataUrl.split(',');
      const mimeTypeMatch = header.match(/:(.*?);/);
      if (mimeTypeMatch && base64Data) {
        onImageChange({
          data: base64Data,
          mimeType: mimeTypeMatch[1],
          preview: dataUrl,
        });
      }
    };
    reader.onerror = () => {
        setError("Failed to read the image file.");
    };
    reader.readAsDataURL(file);
  }, [onImageChange]);

  const onFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFileChange(e.target.files ? e.target.files[0] : null);
  };
  
  const handleRemoveImage = useCallback(() => {
    setImagePreview(null);
    setError(null);
    onImageChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [onImageChange]);
  
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (isDisabled) return;
    const file = e.dataTransfer.files ? e.dataTransfer.files[0] : null;
    handleFileChange(file);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };


  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-300 mb-2">
        Reference Image (Optional)
      </label>
      {imagePreview ? (
        <div className="relative group">
          <img src={imagePreview} alt="Reference preview" className="w-full h-auto max-h-60 object-contain rounded-lg bg-gray-900"/>
          <button
            type="button"
            onClick={handleRemoveImage}
            disabled={isDisabled}
            className="absolute top-2 right-2 p-1 bg-black/50 rounded-full text-white hover:bg-black/80 transition-opacity opacity-0 group-hover:opacity-100 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-white disabled:opacity-50"
            aria-label="Remove image"
          >
            <XCircleIcon className="w-6 h-6"/>
          </button>
        </div>
      ) : (
        <div
          onClick={() => fileInputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          className={`
            flex justify-center items-center w-full px-6 py-10 border-2 border-dashed rounded-lg cursor-pointer transition-colors
            ${isDisabled ? 'border-gray-700 bg-gray-800/50 cursor-not-allowed' : 'border-gray-600 hover:border-indigo-500 hover:bg-gray-800/50'}
          `}
        >
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept="image/png, image/jpeg, image/webp"
            onChange={onFileInputChange}
            disabled={isDisabled}
          />
          <div className="text-center">
            <UploadIcon className="mx-auto h-10 w-10 text-gray-500" />
            <p className="mt-2 text-sm text-gray-400">
              <span className="font-semibold text-indigo-400">Click to upload</span> or drag and drop
            </p>
            <p className="text-xs text-gray-500">PNG, JPG, WEBP up to 5MB</p>
          </div>
        </div>
      )}
      {error && <p className="mt-2 text-sm text-red-400">{error}</p>}
    </div>
  );
};

export default ImageUploader;
