import React from 'react';
import { Button } from '@/components/ui/button';
import { TimerState } from '@/types/timer';

interface TimerControlsProps {
  timerState: TimerState;
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
    <div className="flex gap-4 justify-center" dir="rtl">
      <Button 
        onClick={onStop} 
        disabled={timerState === TimerState.STOPPED}
        className="bg-red-500 hover:bg-red-600 text-white px-8 py-2 rounded-xl"
        variant="destructive"
      >
        עצור
      </Button>
      <Button
        onClick={onStartBreak}
        disabled={timerState === TimerState.BREAK}
        className="bg-navy-800 hover:bg-navy-900 text-white px-8 py-2 rounded-xl"
        variant="default"
      >
        זמן הפסקה
      </Button>
      <Button
        onClick={onStartStudy}
        disabled={timerState === TimerState.STUDYING}
        className="bg-navy-800 hover:bg-navy-900 text-white px-8 py-2 rounded-xl"
        variant="default"
      >
        זמן למידה
      </Button>
    </div>
  );
};