import React, { useState, useCallback } from 'react';
import { darRhizlaneLogo } from '../assets/logo';

interface FileUploadProps {
  onFileProcess: (files: File[]) => void;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onFileProcess }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (files: FileList | null) => {
    if (files && files.length > 0) {
      const pdfFiles = Array.from(files).filter(file => file.type === "application/pdf");
      if (pdfFiles.length > 0) {
        onFileProcess(pdfFiles);
      } else {
        alert("Please upload at least one valid PDF file.");
      }
    }
  };

  const onDragEnter = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const onDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);
  
  const onDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);
  
  const onDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    handleFileChange(e.dataTransfer.files);
  }, [handleFileChange]);

  return (
    <div className="text-center max-w-2xl mx-auto p-8 bg-white rounded-2xl shadow-lg border border-gray-200">
        <img src={darRhizlaneLogo} alt="Dar Rhizlane Logo" className="h-24 mx-auto mb-6" />
        <h2 className="text-3xl font-bold font-serif text-gray-900 mb-2">Welcome to Your Performance Dashboard</h2>
        <p className="text-gray-600 mb-8">
            Simply upload your PDF statistics reports. Our AI will automatically extract the data and visualize it for you.
        </p>
      <div
        onDragEnter={onDragEnter}
        onDragLeave={onDragLeave}
        onDragOver={onDragOver}
        onDrop={onDrop}
        className={`border-2 border-dashed rounded-lg p-12 transition-colors duration-300 ${isDragging ? 'border-amber-500 bg-amber-50' : 'border-gray-300 bg-gray-50'}`}
      >
        <div className="flex flex-col items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <p className="text-gray-700 font-semibold mb-2">
                Drag & Drop your PDF files here
            </p>
            <p className="text-gray-500 text-sm mb-4">or</p>
            <input
                type="file"
                id="file-upload"
                className="hidden"
                accept="application/pdf"
                multiple
                onChange={(e) => handleFileChange(e.target.files)}
            />
            <label
                htmlFor="file-upload"
                className="cursor-pointer bg-amber-500 text-white px-6 py-2 rounded-lg shadow-md hover:bg-amber-600 transition-all duration-200 font-bold"
            >
                Browse Files
            </label>
        </div>
      </div>
    </div>
  );
};