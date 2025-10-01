import React, { useState, useEffect } from 'react';

const messages = [
  "Our AI is extracting the key metrics...",
  "Visualizing revenue streams...",
  "Analyzing occupancy trends...",
  "Compiling the final report...",
  "Just a few more moments...",
];

export const Loader: React.FC = () => {
  const [message, setMessage] = useState(messages[0]);

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      index = (index + 1) % messages.length;
      setMessage(messages[index]);
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center text-center p-10 bg-white rounded-2xl shadow-lg border border-gray-200 max-w-md mx-auto">
      <div className="w-12 h-12 border-4 border-t-amber-500 border-gray-200 rounded-full animate-spin mb-6"></div>
      <h3 className="text-xl font-bold text-gray-900 mb-2 font-serif">Analyzing Your Report</h3>
      <p className="text-gray-600 transition-opacity duration-500 h-5">
        {message}
      </p>
    </div>
  );
};