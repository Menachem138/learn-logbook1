import React from 'react';

interface TimerDisplayProps {
  time: number;
  timerState: 'STOPPED' | 'STUDYING' | 'BREAK';
  formatTime: (time: number) => string;
}

export const TimerDisplay: React.FC<TimerDisplayProps> = ({ time, timerState, formatTime }) => {
  const getBgColor = () => {
    switch (timerState) {
      case 'STUDYING':
        return 'bg-green-50';
      case 'BREAK':
        return 'bg-yellow-50';
      default:
        return 'bg-gray-50';
    }
  };

  return (
    <div className="text-center mb-8">
      <h2 className="text-3xl font-bold mb-6">מעקב זמן למידה</h2>
      <div className={`${getBgColor()} rounded-2xl p-8 transition-colors duration-300`}>
        <div className="text-7xl font-mono tracking-wider" dir="ltr">
          {formatTime(time)}
        </div>
      </div>
    </div>
  );
};