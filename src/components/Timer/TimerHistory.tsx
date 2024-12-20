import React from 'react';
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

interface TimerHistoryProps {
  showHistory: boolean;
  timerLog: any[];
  totalStudyTime: number;
  totalBreakTime: number;
  onToggleHistory: () => void;
  formatTime: (seconds: number) => string;
  formatDate: (dateString: string) => string;
}

export const TimerHistory: React.FC<TimerHistoryProps> = ({
  showHistory,
  timerLog,
  totalStudyTime,
  totalBreakTime,
  onToggleHistory,
  formatTime,
  formatDate,
}) => {
  return (
    <div className="space-y-4">
      <Button
        onClick={onToggleHistory}
        variant="outline"
        className="w-full border-[hsl(var(--timer-button-text))] text-[hsl(var(--timer-button-text))] hover:bg-[hsl(var(--timer-button-background))] hover:brightness-90"
      >
        {showHistory ? "הסתר היסטוריה" : "הצג היסטוריה"}
      </Button>

      {showHistory && (
        <div className="space-y-4 bg-[hsl(var(--timer-stats-background))] p-4 rounded-lg">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 rounded-lg bg-green-100 dark:bg-green-900">
              <div className="text-sm text-green-800 dark:text-green-100">זמן למידה כולל</div>
              <div className="text-lg font-bold text-green-900 dark:text-green-50">{formatTime(totalStudyTime)}</div>
            </div>
            <div className="text-center p-3 rounded-lg bg-yellow-100 dark:bg-yellow-900">
              <div className="text-sm text-yellow-800 dark:text-yellow-100">זמן הפסקה כולל</div>
              <div className="text-lg font-bold text-yellow-900 dark:text-yellow-50">{formatTime(totalBreakTime)}</div>
            </div>
          </div>

          <ScrollArea className="h-[200px] rounded-md border border-[hsl(var(--timer-button-background))]">
            <div className="space-y-2 p-4">
              {timerLog.map((session) => (
                <div
                  key={session.id}
                  className="flex justify-between items-center p-2 rounded-lg bg-[hsl(var(--timer-card-background))] text-[hsl(var(--timer-text))]"
                >
                  <div className="text-sm">
                    <span className={session.type === 'study' ? 'text-green-600 dark:text-green-400' : 'text-yellow-600 dark:text-yellow-400'}>
                      {session.type === 'study' ? 'למידה' : 'הפסקה'}
                    </span>
                    <span className="text-[hsl(var(--timer-stats-text))] mr-2">
                      {formatDate(session.started_at)}
                    </span>
                  </div>
                  <div className="font-mono">
                    {formatTime(session.duration)}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      )}
    </div>
  );
};