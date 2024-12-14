import React from 'react';
import { Play, Pause, StopCircle } from 'lucide-react';

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
    <div className="flex justify-center gap-4" dir="rtl">
      <button
        onClick={onStartStudy}
        disabled={timerState === 'STUDYING'}
        className={`flex items-center gap-2 px-6 py-2 rounded-xl transition-colors
          ${timerState === 'STUDYING' 
            ? 'bg-gray-200 text-gray-600' 
            : 'bg-white border border-gray-200 hover:bg-gray-50'}`}
      >
        {timerState === 'STUDYING' ? <Pause size={16} /> : <Play size={16} />}
        למידה
      </button>
      
      <button
        onClick={onStartBreak}
        disabled={timerState === 'BREAK'}
        className={`flex items-center gap-2 px-6 py-2 rounded-xl transition-colors
          ${timerState === 'BREAK' 
            ? 'bg-gray-200 text-gray-600' 
            : 'bg-white border border-gray-200 hover:bg-gray-50'}`}
      >
        {timerState === 'BREAK' ? <Pause size={16} /> : <Play size={16} />}
        הפסקה
      </button>
      
      <button
        onClick={onStop}
        disabled={timerState === 'STOPPED'}
        className="flex items-center gap-2 px-6 py-2 rounded-xl bg-red-500 text-white hover:bg-red-600 transition-colors"
      >
        <StopCircle size={16} />
        עצור
      </button>
    </div>
  );
};