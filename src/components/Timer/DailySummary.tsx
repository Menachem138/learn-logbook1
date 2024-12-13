import { Card } from "@/components/ui/card";
import { formatTime } from "./utils";

interface DailySummaryProps {
  studyTime: number;
  breakTime: number;
}

export function DailySummary({ studyTime, breakTime }: DailySummaryProps) {
  return (
    <Card className="p-4 mt-4 bg-muted">
      <h3 className="text-lg font-semibold mb-2">סיכום יומי</h3>
      <div className="space-y-2">
        <div className="flex justify-between">
          <span>זמן למידה:</span>
          <span className="font-mono">{formatTime(studyTime)}</span>
        </div>
        <div className="flex justify-between">
          <span>זמן הפסקה:</span>
          <span className="font-mono">{formatTime(breakTime)}</span>
        </div>
      </div>
    </Card>
  );
}