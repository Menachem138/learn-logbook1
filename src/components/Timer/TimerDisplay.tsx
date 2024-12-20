import React from 'react';

interface TimerDisplayProps {
  time: number;
  formatTime: (seconds: number) => string;
}

export const TimerDisplay: React.FC<TimerDisplayProps> = ({ time, formatTime }) => {
  return (
    <div className="text-center">
      <h2 className="text-2xl font-bold mb-4">טיימר</h2>
      <div className="text-4xl font-mono mb-6 bg-[hsl(var(--timer-card-background))] text-[hsl(var(--timer-text))] p-8 rounded-lg shadow-lg transition-colors duration-300">
        {formatTime(time)}
      </div>
    </div>
  );
};