
import React from 'react';
import { ASPECT_RATIOS } from '../constants';
import type { AspectRatio } from '../types';

interface AspectRatioSelectorProps {
  selectedRatio: AspectRatio;
  onRatioChange: (ratio: AspectRatio) => void;
  isDisabled: boolean;
}

const AspectRatioSelector: React.FC<AspectRatioSelectorProps> = ({ selectedRatio, onRatioChange, isDisabled }) => {
  return (
    <div className="w-full">
      <h3 className="text-sm font-medium text-gray-300 mb-2">Aspect Ratio</h3>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {ASPECT_RATIOS.map(({ value, label }) => (
          <button
            key={value}
            type="button"
            onClick={() => onRatioChange(value)}
            disabled={isDisabled}
            className={`
              px-4 py-3 rounded-lg text-sm font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-indigo-500
              ${selectedRatio === value 
                ? 'bg-indigo-600 text-white shadow-lg' 
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}
              disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-gray-700
            `}
          >
            <div className="font-bold">{value}</div>
            <div className="text-xs">{label}</div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default AspectRatioSelector;
