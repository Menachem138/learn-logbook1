import { Button } from "@/components/ui/button";
import { PlayIcon, PauseIcon, StopIcon } from "lucide-react";

interface ControlsProps {
  isRunning: boolean;
  isPaused: boolean;
  timerType: 'study' | 'break';
  onStartStudy: () => void;
  onStartBreak: () => void;
  onPause: () => void;
  onStop: () => void;
}

export function Controls({
  isRunning,
  isPaused,
  timerType,
  onStartStudy,
  onStartBreak,
  onPause,
  onStop,
}: ControlsProps) {
  if (!isRunning) {
    return (
      <div className="flex gap-4">
        <Button
          variant="default"
          onClick={onStartStudy}
          className="flex items-center gap-2"
        >
          <PlayIcon className="w-4 h-4" />
          התחל למידה
        </Button>
        <Button
          variant="secondary"
          onClick={onStartBreak}
          className="flex items-center gap-2"
        >
          <PlayIcon className="w-4 h-4" />
          התחל הפסקה
        </Button>
      </div>
    );
  }

  return (
    <div className="flex gap-4">
      <Button
        variant={isPaused ? "default" : "secondary"}
        onClick={onPause}
        className="flex items-center gap-2"
      >
        {isPaused ? (
          <>
            <PlayIcon className="w-4 h-4" />
            המשך
          </>
        ) : (
          <>
            <PauseIcon className="w-4 h-4" />
            השהה
          </>
        )}
      </Button>
      <Button
        variant="destructive"
        onClick={onStop}
        className="flex items-center gap-2"
      >
        <StopIcon className="w-4 h-4" />
        סיים {timerType === 'study' ? 'למידה' : 'הפסקה'}
      </Button>
    </div>
  );
}