import React from 'react';
import { Button } from '@/components/ui/button';
import { Pause, Play, StopCircle } from 'lucide-react';
import { TimerState } from './types';

interface TimerControlsProps {
  timerState: TimerState;
  onStart: (state: TimerState) => void;
  onStop: () => void;
}

export const TimerControls: React.FC<TimerControlsProps> = ({ timerState, onStart, onStop }) => {
  return (
    <div className="flex justify-center space-x-2">
      <Button 
        onClick={() => onStart(TimerState.STUDYING)} 
        disabled={timerState === TimerState.STUDYING}
        variant={timerState === TimerState.STUDYING ? "default" : "outline"}
        className="transition-all duration-300 ease-in-out hover:shadow-md"
      >
        {timerState === TimerState.STUDYING ? <Pause className="mr-2 h-4 w-4" /> : <Play className="mr-2 h-4 w-4" />}
        למידה
      </Button>
      <Button 
        onClick={() => onStart(TimerState.BREAK)} 
        disabled={timerState === TimerState.BREAK}
        variant={timerState === TimerState.BREAK ? "default" : "outline"}
        className="transition-all duration-300 ease-in-out hover:shadow-md"
      >
        {timerState === TimerState.BREAK ? <Pause className="mr-2 h-4 w-4" /> : <Play className="mr-2 h-4 w-4" />}
        הפסקה
      </Button>
      <Button 
        onClick={onStop} 
        disabled={timerState === TimerState.STOPPED} 
        variant="destructive"
        className="transition-all duration-300 ease-in-out hover:shadow-md"
      >
        <StopCircle className="mr-2 h-4 w-4" />
        עצור
      </Button>
    </div>
  );
};