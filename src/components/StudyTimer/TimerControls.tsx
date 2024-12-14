import React from 'react';
import { Play, StopCircle } from 'lucide-react';

interface TimerControlsProps {
  timerState: 'STOPPED' | 'STUDYING' | 'BREAK';
  onStartStudy: () => void;
  onStartBreak: () => void;
  onStop: () => void;
}

export const TimerControls: React.FC<TimerControlsProps> = ({
  timerState,
  onStartStudy,
  onStartBreak,
  onStop,
}) => {
  return (
    <div className="flex justify-center gap-4 mb-8">
      <button
        onClick={onStartStudy}
        disabled={timerState === 'STUDYING'}
        className={`flex items-center gap-2 px-6 py-2 rounded-lg border transition-colors
          ${timerState === 'STUDYING' 
            ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed' 
            : 'bg-white border-gray-200 hover:bg-gray-50'}`}
      >
        <Play size={16} />
        למידה
      </button>
      
      <button
        onClick={onStartBreak}
        disabled={timerState === 'BREAK'}
        className={`flex items-center gap-2 px-6 py-2 rounded-lg border transition-colors
          ${timerState === 'BREAK'
            ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
            : 'bg-white border-gray-200 hover:bg-gray-50'}`}
      >
        <Play size={16} />
        הפסקה
      </button>
      
      <button
        onClick={onStop}
        disabled={timerState === 'STOPPED'}
        className={`flex items-center gap-2 px-6 py-2 rounded-lg transition-colors
          ${timerState === 'STOPPED'
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
            : 'bg-red-100 text-red-600 hover:bg-red-200'}`}
      >
        <StopCircle size={16} />
        עצור
      </button>
    </div>
  );
};