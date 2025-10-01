import React from 'react';

interface KpiCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  isText?: boolean;
  iconBgClass?: string;
}

export const KpiCard: React.FC<KpiCardProps> = ({ title, value, icon, isText = false, iconBgClass }) => {
  return (
    <div className="bg-white p-5 rounded-2xl shadow-lg border border-gray-200 transform hover:-translate-y-1 transition-transform duration-300 flex items-center space-x-4">
      <div className={`p-3 rounded-full flex-shrink-0 ${iconBgClass || 'bg-gray-100'}`}>
        {icon}
      </div>
      <div>
        <h4 className="text-gray-500 text-sm font-medium truncate">{title}</h4>
        <p className={`font-bold ${isText ? 'text-lg text-gray-800' : 'text-2xl text-gray-900'}`}>
          {value}
        </p>
      </div>
    </div>
  );
};