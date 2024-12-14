import React from 'react';
import { TimerState } from '@/types/timer';
import { formatTime } from '@/utils/timeUtils';

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
      } transition-colors duration-300 ease-in-out`}>
        <div className="text-[96px] font-bold text-center tabular-nums tracking-wider" dir="ltr">
          {formatTime(time)}
        </div>
      </div>
    </div>
  );
};