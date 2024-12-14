import React from 'react';

interface TimerDisplayProps {
  time: number;
  timerState: 'STOPPED' | 'STUDYING' | 'BREAK';
  formatTime: (time: number) => string;
}

export const TimerDisplay: React.FC<TimerDisplayProps> = ({ time, timerState, formatTime }) => {
  return (
    <div className="text-center mb-8">
      <h2 className="text-3xl font-bold mb-6">מעקב זמן למידה</h2>
      <div className="bg-gray-50 rounded-xl p-6">
        <div className="text-7xl font-mono tracking-wider" dir="ltr">
          {formatTime(time)}
        </div>
      </div>
    </div>
  );
};