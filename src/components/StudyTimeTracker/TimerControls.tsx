import React from 'react';
import { Button } from '@/components/ui/button';
import { Play, Pause, StopCircle } from 'lucide-react';
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
    <div className="flex justify-center gap-2 rtl">
      <Button 
        onClick={onStartStudy} 
        disabled={timerState === TimerState.STUDYING}
        variant={timerState === TimerState.STUDYING ? "secondary" : "outline"}
        className="flex items-center gap-2"
      >
        {timerState === TimerState.STUDYING ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
        למידה
      </Button>
      <Button 
        onClick={onStartBreak} 
        disabled={timerState === TimerState.BREAK}
        variant={timerState === TimerState.BREAK ? "secondary" : "outline"}
        className="flex items-center gap-2"
      >
        {timerState === TimerState.BREAK ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
        הפסקה
      </Button>
      <Button 
        onClick={onStop} 
        disabled={timerState === TimerState.STOPPED}
        variant="destructive"
        className="flex items-center gap-2"
      >
        <StopCircle className="h-4 w-4" />
        עצור
      </Button>
    </div>
  );
};