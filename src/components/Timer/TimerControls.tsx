import React from 'react';
import { Button } from "@/components/ui/button";

interface TimerControlsProps {
  isRunning: boolean;
  isPaused: boolean;
  timerType: "study" | "break";
  onStartStudy: () => void;
  onStartBreak: () => void;
  onPause: () => void;
  onStop: () => void;
}

export const TimerControls: React.FC<TimerControlsProps> = ({
  isRunning,
  isPaused,
  timerType,
  onStartStudy,
  onStartBreak,
  onPause,
  onStop,
}) => {
  return (
    <div className="flex gap-4 justify-center flex-wrap">
      <Button
        onClick={onStartStudy}
        variant={timerType === "study" && isRunning ? "secondary" : "default"}
        className="bg-[hsl(var(--timer-button-background))] text-[hsl(var(--timer-button-text))] hover:bg-[hsl(var(--timer-button-background))] hover:brightness-90 transition-all"
      >
        זמן למידה
      </Button>
      <Button
        onClick={onStartBreak}
        variant={timerType === "break" && isRunning ? "secondary" : "default"}
        className="bg-[hsl(var(--timer-button-background))] text-[hsl(var(--timer-button-text))] hover:bg-[hsl(var(--timer-button-background))] hover:brightness-90 transition-all"
      >
        זמן הפסקה
      </Button>
      {isRunning && (
        <Button 
          onClick={onPause} 
          variant="outline"
          className="border-[hsl(var(--timer-button-text))] text-[hsl(var(--timer-button-text))] hover:bg-[hsl(var(--timer-button-background))] hover:brightness-90"
        >
          {isPaused ? "המשך" : "השהה"}
        </Button>
      )}
      <Button 
        onClick={onStop} 
        variant="destructive"
        className="hover:brightness-90"
      >
        עצור
      </Button>
    </div>
  );
};