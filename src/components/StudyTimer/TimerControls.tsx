import React from 'react';
import { Button } from '@/components/ui/button';
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
    <div className="flex justify-center gap-4 mb-8">
      <Button
        onClick={onStartStudy}
        disabled={timerState === 'STUDYING'}
        variant="outline"
        className="bg-white hover:bg-gray-50"
      >
        {timerState === 'STUDYING' ? <Pause className="ml-2 h-4 w-4" /> : <Play className="ml-2 h-4 w-4" />}
        למידה
      </Button>
      
      <Button
        onClick={onStartBreak}
        disabled={timerState === 'BREAK'}
        variant="outline"
        className="bg-white hover:bg-gray-50"
      >
        {timerState === 'BREAK' ? <Pause className="ml-2 h-4 w-4" /> : <Play className="ml-2 h-4 w-4" />}
        הפסקה
      </Button>
      
      <Button
        onClick={onStop}
        disabled={timerState === 'STOPPED'}
        className="bg-red-100 hover:bg-red-200 text-red-600 border-red-200"
      >
        <StopCircle className="ml-2 h-4 w-4" />
        עצור
      </Button>
    </div>
  );
};