import { Button } from "@/components/ui/button";
import { TimerState } from './types';

interface TimerControlsProps {
  timerState: TimerState;
  onStartStudy: () => void;
  onStartBreak: () => void;
  onStop: () => void;
}

export function TimerControls({ timerState, onStartStudy, onStartBreak, onStop }: TimerControlsProps) {
  return (
    <div className="flex justify-center space-x-2">
      <Button 
        onClick={onStartStudy} 
        disabled={timerState === TimerState.STUDYING}
      >
        למידה
      </Button>
      <Button 
        onClick={onStartBreak} 
        disabled={timerState === TimerState.BREAK}
      >
        הפסקה
      </Button>
      <Button 
        onClick={onStop} 
        disabled={timerState === TimerState.STOPPED}
      >
        עצור
      </Button>
    </div>
  );
}