import React from 'react';

export default function VsBadge({ tradResult, ngbbResult, frame }) {
  const bothDone = tradResult && ngbbResult &&
    frame >= Math.max(tradResult.events.length, ngbbResult.events.length) - 1;

  return (
    <div className="flex flex-col items-center justify-center px-3">
      <div className={`w-12 h-12 rounded-full flex items-center justify-center font-extrabold text-sm shadow-lg transition-all duration-300 ${
        bothDone
          ? 'bg-gradient-to-br from-teal to-navy text-white scale-110'
          : 'bg-gradient-to-br from-gray-600 to-gray-800 text-gray-300 animate-pulse'
      }`}>
        VS
      </div>
    </div>
  );
}
