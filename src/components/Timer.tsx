import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";

interface TimerEntry {
  type: "study" | "break";
  duration: number;
  timestamp: Date;
}

export default function Timer() {
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [time, setTime] = useState(0);
  const [timerType, setTimerType] = useState<"study" | "break">("study");
  const [timerLog, setTimerLog] = useState<TimerEntry[]>([]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning && !isPaused) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, isPaused]);

  const startTimer = (type: "study" | "break") => {
    if (isRunning) {
      // Log the previous session
      setTimerLog((prev) => [
        ...prev,
        {
          type: timerType,
          duration: time,
          timestamp: new Date(),
        },
      ]);
      setTime(0);
    }
    setTimerType(type);
    setIsRunning(true);
    setIsPaused(false);
    toast.success(
      type === "study" ? "התחלת זמן למידה!" : "התחלת זמן הפסקה!"
    );
  };

  const stopTimer = () => {
    setIsRunning(false);
    setIsPaused(false);
    setTimerLog((prev) => [
      ...prev,
      {
        type: timerType,
        duration: time,
        timestamp: new Date(),
      },
    ]);
    setTime(0);
    toast.info("הטיימר נעצר!");
  };

  const pauseTimer = () => {
    setIsPaused(!isPaused);
    toast.info(isPaused ? "הטיימר ממשיך!" : "הטיימר מושהה!");
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  return (
    <Card className="p-6 space-y-4 w-full">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">טיימר</h2>
        <div className="text-4xl font-mono mb-6">{formatTime(time)}</div>
        <div className="flex gap-4 justify-center flex-wrap">
          <Button
            onClick={() => startTimer("study")}
            variant={timerType === "study" && isRunning ? "secondary" : "default"}
          >
            זמן למידה
          </Button>
          <Button
            onClick={() => startTimer("break")}
            variant={timerType === "break" && isRunning ? "secondary" : "default"}
          >
            זמן הפסקה
          </Button>
          {isRunning && (
            <Button onClick={pauseTimer} variant="outline">
              {isPaused ? "המשך" : "השהה"}
            </Button>
          )}
          <Button onClick={stopTimer} variant="destructive">
            עצור
          </Button>
        </div>
      </div>
      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-2">היסטוריית זמנים</h3>
        <div className="space-y-2 max-h-40 overflow-y-auto">
          {timerLog.map((entry, index) => (
            <div
              key={index}
              className="flex justify-between items-center p-2 bg-muted rounded"
            >
              <span>
                {entry.type === "study" ? "למידה" : "הפסקה"} -{" "}
                {formatTime(entry.duration)}
              </span>
              <span className="text-sm text-muted-foreground">
                {entry.timestamp.toLocaleTimeString()}
              </span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}