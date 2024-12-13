import { Button } from "@/components/ui/button";

interface ControlsProps {
  isRunning: boolean;
  isPaused: boolean;
  onStartStudy: () => void;
  onStartBreak: () => void;
  onPause: () => void;
  onStop: () => void;
  timerType: "study" | "break";
}

export function Controls({
  isRunning,
  isPaused,
  onStartStudy,
  onStartBreak,
  onPause,
  onStop,
  timerType,
}: ControlsProps) {
  return (
    <div className="flex gap-4 justify-center flex-wrap">
      <Button
        onClick={onStartStudy}
        variant={timerType === "study" && isRunning ? "secondary" : "default"}
      >
        זמן למידה
      </Button>
      <Button
        onClick={onStartBreak}
        variant={timerType === "break" && isRunning ? "secondary" : "default"}
      >
        זמן הפסקה
      </Button>
      {isRunning && (
        <Button onClick={onPause} variant="outline">
          {isPaused ? "המשך" : "השהה"}
        </Button>
      )}
      <Button onClick={onStop} variant="destructive">
        עצור
      </Button>
    </div>
  );
}