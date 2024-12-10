import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const ProgressTracker = () => {
  const totalWeeks = 4;
  const currentWeek = 1;
  const progress = (currentWeek / totalWeeks) * 100;

  return (
    <Card>
      <CardHeader>
        <CardTitle>התקדמות כללית</CardTitle>
      </CardHeader>
      <CardContent>
        <Progress value={progress} className="w-full" />
        <p className="text-center mt-2">{progress}% הושלמו</p>
        <p className="text-center">שבוע נוכחי: {currentWeek} מתוך {totalWeeks}</p>
      </CardContent>
    </Card>
  );
};

export default ProgressTracker;