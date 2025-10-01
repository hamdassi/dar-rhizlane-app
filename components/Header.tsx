import React from 'react';
import { darRhizlaneLogo } from '../assets/logo';

interface HeaderProps {
    onReset: () => void;
    showReset: boolean;
}

export const Header: React.FC<HeaderProps> = ({ onReset, showReset }) => {
  return (
    <header className="bg-white/80 backdrop-blur-md sticky top-0 z-10 border-b border-gray-200">
      <div className="container mx-auto p-4 flex justify-between items-center">
        <img src={darRhizlaneLogo} alt="Dar Rhizlane Logo" className="h-12" />
        {showReset && (
             <button
                onClick={onReset}
                className="bg-amber-500 text-slate-900 px-4 py-2 rounded-lg shadow hover:bg-amber-600 transition-colors duration-200 text-sm font-bold"
            >
                Upload New Report
            </button>
        )}
      </div>
    </header>
  );
};