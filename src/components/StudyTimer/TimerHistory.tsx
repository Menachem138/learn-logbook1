import React from 'react';
import { Coffee, Book } from 'lucide-react';
import { formatTime } from '@/utils/timeUtils';

interface TimerSession {
  id: string;
  type: string;
  duration: number;
  started_at: string;
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
  totalBreakTime,
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
      <div className="grid grid-cols-3 text-sm font-medium text-gray-500 pb-2 border-b">
        <div>סיכום</div>
        <div>פירוט</div>
        <div className="text-left">יומן</div>
      </div>

      <div className="space-y-2 max-h-[300px] overflow-y-auto">
        {sessions.map((session) => (
          <div
            key={session.id}
            className={`grid grid-cols-3 items-center p-3 rounded-lg ${
              session.type === 'study' ? 'bg-green-50' : 'bg-yellow-50'
            }`}
          >
            <div className="flex items-center gap-2">
              {session.type === 'study' ? (
                <Book className="w-4 h-4 text-green-600" />
              ) : (
                <Coffee className="w-4 h-4 text-yellow-600" />
              )}
            </div>
            <div>{formatDate(session.started_at)}</div>
            <div className="text-left tabular-nums">{formatTime(session.duration || 0)}</div>
          </div>
        ))}
      </div>

      <button
        onClick={onCalculateSummary}
        className="w-full py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
      >
        הסתר סיכום
      </button>

      {(totalStudyTime > 0 || totalBreakTime > 0) && (
        <div className="space-y-2 pt-4">
          <div className="flex justify-between p-3 bg-green-50 rounded-lg">
            <span>סה"כ זמן למידה:</span>
            <span className="tabular-nums">{formatTime(totalStudyTime)}</span>
          </div>
          <div className="flex justify-between p-3 bg-yellow-50 rounded-lg">
            <span>סה"כ זמן הפסקה:</span>
            <span className="tabular-nums">{formatTime(totalBreakTime)}</span>
          </div>
        </div>
      )}
    </div>
  );
};