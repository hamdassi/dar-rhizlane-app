import React from 'react';

interface ErrorDisplayProps {
  message: string;
  onRetry: () => void;
}

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ message, onRetry }) => {
  return (
    <div className="text-center max-w-2xl mx-auto p-8 bg-red-900/50 backdrop-blur-md rounded-2xl shadow-xl border border-red-700/50">
        <div className="flex justify-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        </div>
        <h2 className="text-xl font-bold text-red-200 mb-2 font-serif">An Error Occurred</h2>
        <p className="text-red-300 mb-6">{message}</p>
        <button
            onClick={onRetry}
            className="bg-red-600 text-white px-6 py-2 rounded-lg shadow-md hover:bg-red-700 transition-colors duration-200 font-semibold"
        >
            Try Again
        </button>
    </div>
  );
};