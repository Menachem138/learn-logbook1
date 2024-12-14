import React from 'react';
import { Button } from '@/components/ui/button';
import { formatTime } from '@/utils/timeUtils';
import { Book, Coffee } from 'lucide-react';

interface TimerSession {
  id: string;
  type: string;
  duration: number;
  started_at: string;
}

interface TimerHistoryProps {
  sessions: TimerSession[];
  totalStudyTime: number;
  totalBreakTime: number;
  onCalculateSummary: () => void;
}

export const TimerHistory: React.FC<TimerHistoryProps> = ({
  sessions,
  onCalculateSummary,
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('he-IL', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2 max-h-[300px] overflow-y-auto">
        {sessions.map((session) => (
          <div
            key={session.id}
            className={`flex justify-between items-center p-3 rounded-lg ${
              session.type === 'study' ? 'bg-green-50' : 'bg-yellow-50'
            }`}
          >
            <div className="flex items-center gap-2">
              {session.type === 'study' ? (
                <Book className="h-4 w-4 text-green-600" />
              ) : (
                <Coffee className="h-4 w-4 text-yellow-600" />
              )}
              <span>{formatDate(session.started_at)}</span>
            </div>
            <div className="text-left tabular-nums">{formatTime(session.duration || 0)}</div>
          </div>
        ))}
      </div>

      <Button
        onClick={onCalculateSummary}
        className="w-full bg-gray-900 text-white hover:bg-gray-800"
      >
        הסתר היסטוריה
      </Button>
    </div>
  );
};