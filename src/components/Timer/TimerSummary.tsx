import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { formatTotalTime } from './TimeUtils';

interface TimerSummaryProps {
  totalStudyTime: number;
  totalBreakTime: number;
  studyPercentage: number;
}

export function TimerSummary({ totalStudyTime, totalBreakTime, studyPercentage }: TimerSummaryProps) {
  return (
    <Tabs defaultValue="summary">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="summary">סיכום</TabsTrigger>
        <TabsTrigger value="details">פירוט</TabsTrigger>
      </TabsList>
      <TabsContent value="summary" className="space-y-4">
        <Progress value={studyPercentage} className="h-2" />
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <div className="text-sm font-medium">זמן למידה</div>
            <div className="text-2xl font-bold">{formatTotalTime(totalStudyTime)}</div>
          </div>
          <div>
            <div className="text-sm font-medium">זמן הפסקה</div>
            <div className="text-2xl font-bold">{formatTotalTime(totalBreakTime)}</div>
          </div>
        </div>
      </TabsContent>
      <TabsContent value="details">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span>אחוז למידה:</span>
            <span className="font-bold">{Math.round(studyPercentage)}%</span>
          </div>
          <div className="flex justify-between items-center">
            <span>סה״כ זמן למידה:</span>
            <span className="font-bold">{formatTotalTime(totalStudyTime)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span>סה״כ זמן הפסקה:</span>
            <span className="font-bold">{formatTotalTime(totalBreakTime)}</span>
          </div>
        </div>
      </TabsContent>
    </Tabs>
  );
}