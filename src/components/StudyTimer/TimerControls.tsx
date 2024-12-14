import React from 'react';
import { Button } from '@/components/ui/button';
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
      <Button
        onClick={onStartStudy}
        disabled={timerState === 'STUDYING'}
        variant={timerState === 'STUDYING' ? 'secondary' : 'outline'}
        className="bg-white hover:bg-gray-50 border-gray-200"
      >
        <Play className="mr-2 h-4 w-4" />
        למידה
      </Button>
      
      <Button
        onClick={onStartBreak}
        disabled={timerState === 'BREAK'}
        variant={timerState === 'BREAK' ? 'secondary' : 'outline'}
        className="bg-white hover:bg-gray-50 border-gray-200"
      >
        <Play className="mr-2 h-4 w-4" />
        הפסקה
      </Button>
      
      <Button
        onClick={onStop}
        disabled={timerState === 'STOPPED'}
        variant="default"
        className="bg-gray-900 hover:bg-gray-800 text-white"
      >
        <StopCircle className="mr-2 h-4 w-4" />
        עצור
      </Button>
    </div>
  );
};