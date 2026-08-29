import React from 'react';
import { Loader2 } from 'lucide-react';

/**
 * Reusable Loader Component
 * @param {string} size - 'sm' | 'md' | 'lg' | 'xl'
 * @param {string} message - Optional text to display
 * @param {boolean} fullScreen - If true, centers in a full screen backdrop
 */
const Loader = ({ size = 'md', message = 'Loading...', fullScreen = false }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  };

  const content = (
    <div className="flex flex-col items-center justify-center gap-3 p-4">
      <Loader2 className={`${sizeClasses[size] || sizeClasses.md} text-teal-600 animate-spin`} />
      {message && <p className="text-xs font-medium text-slate-600 animate-pulse">{message}</p>}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/20 backdrop-blur-xs">
        <div className="p-6 bg-white rounded-2xl shadow-xl border border-slate-200">
          {content}
        </div>
      </div>
    );
  }

  return content;
};

export default Loader;
