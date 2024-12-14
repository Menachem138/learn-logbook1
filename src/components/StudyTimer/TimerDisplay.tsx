import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface TimerDisplayProps {
  time: number;
  timerState: 'STOPPED' | 'STUDYING' | 'BREAK';
  formatTime: (time: number) => string;
}

export const TimerDisplay: React.FC<TimerDisplayProps> = ({ time, timerState, formatTime }) => {
  const getTimerBackground = () => {
    switch (timerState) {
      case 'STUDYING':
        return 'bg-green-100';
      case 'BREAK':
        return 'bg-yellow-100';
      default:
        return 'bg-gray-100';
    }
  };

  return (
    <div className={`rounded-2xl p-8 ${getTimerBackground()} transition-colors duration-300`}>
      <div className="text-7xl font-mono text-center" dir="ltr">
        {formatTime(time)}
      </div>
    </div>
  );
};