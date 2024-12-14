import React from 'react';
import { ChevronDown } from 'lucide-react';

interface HistoryToggleProps {
  isOpen: boolean;
  onToggle: () => void;
}

export const HistoryToggle: React.FC<HistoryToggleProps> = ({ isOpen, onToggle }) => {
  return (
    <div className="text-right">
      <button
        onClick={onToggle}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
      >
        היסטוריית זמנים
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
    </div>
  );
};