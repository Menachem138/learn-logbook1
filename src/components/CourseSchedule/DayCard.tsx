import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DaySchedule } from "./types";

export const DayCard = ({ day }: { day: DaySchedule }) => {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-muted">
        <CardTitle className="text-lg">{day.day}</CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <ul className="space-y-2">
          {day.schedule.map((item, itemIndex) => (
            <li key={itemIndex} className="flex justify-between items-center py-2 border-b last:border-0">
              <Badge variant="outline">{item.time}</Badge>
              <span>{item.activity}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};