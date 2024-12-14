import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { BookOpen, Coffee } from 'lucide-react';
import { formatTotalTime } from '@/utils/timeUtils';
import { TimerState } from '@/types/timer';

interface TimerTabsProps {
  totalStudyTime: number;
  totalBreakTime: number;
  studyPercentage: number;
  currentTime: number;
  timerState: TimerState;
}

export const TimerTabs: React.FC<TimerTabsProps> = ({
  totalStudyTime,
  totalBreakTime,
  studyPercentage,
  currentTime,
  timerState,
}) => {
  return (
    <Tabs defaultValue="summary" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="summary">סיכום</TabsTrigger>
        <TabsTrigger value="details">פירוט</TabsTrigger>
      </TabsList>
      <TabsContent value="summary" className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span>זמן למידה</span>
            <span className="font-semibold">{formatTotalTime(totalStudyTime + (timerState === TimerState.STUDYING ? currentTime : 0))}</span>
          </div>
          <Progress value={studyPercentage} className="w-full h-2" />
          <div className="flex justify-between items-center text-sm text-gray-500">
            <span>0%</span>
            <span>50%</span>
            <span>100%</span>
          </div>
        </div>
      </TabsContent>
      <TabsContent value="details" className="space-y-4">
        <div className="space-y-3">
          <div className="flex justify-between items-center bg-green-50 p-3 rounded-lg">
            <span className="flex items-center text-green-800">
              <BookOpen className="ml-2 h-5 w-5" /> זמן למידה
            </span>
            <span className="font-semibold">
              {formatTotalTime(totalStudyTime + (timerState === TimerState.STUDYING ? currentTime : 0))}
            </span>
          </div>
          <div className="flex justify-between items-center bg-yellow-50 p-3 rounded-lg">
            <span className="flex items-center text-yellow-800">
              <Coffee className="ml-2 h-5 w-5" /> זמן הפסקה
            </span>
            <span className="font-semibold">
              {formatTotalTime(totalBreakTime + (timerState === TimerState.BREAK ? currentTime : 0))}
            </span>
          </div>
        </div>
      </TabsContent>
    </Tabs>
  );
};