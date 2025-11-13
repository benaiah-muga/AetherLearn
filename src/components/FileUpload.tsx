
import React from 'react';
import { DocumentIcon } from './icons/DocumentIcon';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  selectedFile: File | null;
  disabled: boolean;
  error: string | null;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect, selectedFile, disabled, error }) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onFileSelect(e.target.files[0]);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <label htmlFor="file-upload" className={`relative block w-full p-6 sm:p-8 border-2 border-dashed rounded-lg cursor-pointer transition-colors duration-300 ${disabled ? 'bg-slate-800 cursor-not-allowed' : 'border-slate-600 hover:border-purple-500 bg-slate-800/50'}`}>
        <div className="flex flex-col items-center justify-center space-y-3">
          <DocumentIcon className="w-10 h-10 text-slate-400" />
          <p className="text-lg font-semibold text-slate-200">
            {selectedFile ? 'File Selected' : 'Upload a PDF Document'}
          </p>
          <p className="text-sm text-slate-400">
            {selectedFile ? selectedFile.name : 'Drag & drop or click to choose a file'}
          </p>
        </div>
        <input 
          id="file-upload" 
          name="file-upload" 
          type="file" 
          className="sr-only" 
          accept=".pdf" 
          onChange={handleFileChange}
          disabled={disabled}
        />
      </label>
      {error && <p className="mt-2 text-sm text-red-400 text-center">{error}</p>}
    </div>
  );
};