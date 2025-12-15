import React from 'react';
import { Activity } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="bg-medical-500 p-2 rounded-lg text-white">
              <Activity size={24} />
            </div>
            <div className="ml-3">
              <h1 className="text-xl font-bold text-gray-900">ScriptScan</h1>
              <p className="text-xs text-gray-500">AI Medical Prescription Parser</p>
            </div>
          </div>
          <div className="hidden md:block">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
              Gemini Powered
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;