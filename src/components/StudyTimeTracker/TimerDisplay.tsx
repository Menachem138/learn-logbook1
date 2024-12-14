import React from 'react';
import { TimerState } from '@/types/timer';
import { formatTime } from '@/utils/timeUtils';

interface TimerDisplayProps {
  time: number;
  timerState: TimerState;
}

export const TimerDisplay: React.FC<TimerDisplayProps> = ({ time, timerState }) => {
  return (
    <div className="text-center space-y-6">
      <h1 className="text-2xl font-bold">טיימר</h1>
      <div className="text-[96px] font-mono font-bold tracking-[0.2em] tabular-nums" dir="ltr">
        {formatTime(time)}
      </div>
    </div>
  );
};