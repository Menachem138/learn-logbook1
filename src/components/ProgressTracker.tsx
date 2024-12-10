import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const ProgressTracker = () => {
  const [progress, setProgress] = React.useState(0);
  const [currentWeek, setCurrentWeek] = React.useState(1);

  return (
    <Card>
      <CardHeader>
        <CardTitle>התקדמות כללית</CardTitle>
      </CardHeader>
      <CardContent>
        <Progress value={progress} className="w-full" />
        <p className="text-center mt-2">{progress.toFixed(2)}% הושלמו</p>
        <p className="text-center">שבוע נוכחי: {currentWeek}</p>
      </CardContent>
    </Card>
  );
};

export default ProgressTracker;