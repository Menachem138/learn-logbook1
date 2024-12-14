import React from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { formatTime } from '@/utils/timeUtils';

interface TimerSession {
  id: string;
  type: string;
  duration: number;
  started_at: string;
  ended_at: string | null;
}

interface TimerHistoryProps {
  sessions: TimerSession[];
  onCalculateSummary: () => void;
  totalStudyTime: number;
  totalBreakTime: number;
}

export const TimerHistory: React.FC<TimerHistoryProps> = ({
  sessions,
  onCalculateSummary,
  totalStudyTime,
  totalBreakTime
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('he-IL', {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">היסטוריית טיימרים</h3>
        <Button onClick={onCalculateSummary} variant="outline">
          חשב סיכום
        </Button>
      </div>

      <ScrollArea className="h-[300px] rounded-md border p-4">
        <div className="space-y-4">
          {sessions.map((session) => (
            <div
              key={session.id}
              className={`p-3 rounded-lg ${
                session.type === 'study' ? 'bg-green-50' : 'bg-yellow-50'
              }`}
            >
              <div className="flex justify-between items-center">
                <span className="font-medium">
                  {session.type === 'study' ? 'למידה' : 'הפסקה'}
                </span>
                <span className="text-sm text-gray-600">
                  {formatTime(session.duration || 0)}
                </span>
              </div>
              <div className="text-sm text-gray-500 mt-1">
                {formatDate(session.started_at)}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      {(totalStudyTime > 0 || totalBreakTime > 0) && (
        <div className="p-4 bg-gray-50 rounded-lg space-y-2">
          <h4 className="font-semibold">סיכום זמנים</h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-green-100 p-3 rounded">
              <div className="text-sm text-gray-600">זמן למידה</div>
              <div className="font-semibold">{formatTime(totalStudyTime)}</div>
            </div>
            <div className="bg-yellow-100 p-3 rounded">
              <div className="text-sm text-gray-600">זמן הפסקה</div>
              <div className="font-semibold">{formatTime(totalBreakTime)}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};