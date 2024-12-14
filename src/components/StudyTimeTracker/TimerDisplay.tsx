import React from 'react';
import { formatTime } from '@/utils/timeUtils';
import { TimerState } from './types';

interface TimerDisplayProps {
  time: number;
  timerState: TimerState;
}

export const TimerDisplay: React.FC<TimerDisplayProps> = ({ time, timerState }) => {
  return (
    <div className="relative">
      <div className={`w-full py-8 px-4 rounded-2xl ${
        timerState === TimerState.STUDYING 
          ? 'bg-green-100' 
          : timerState === TimerState.BREAK 
            ? 'bg-yellow-100' 
            : 'bg-gray-100'
      } transition-colors duration-300 ease-in-out shadow-inner`}>
        <div className="relative z-10 text-7xl font-bold text-center tabular-nums" dir="ltr">
          {formatTime(time)}
        </div>
      </div>
    </div>
  );
};