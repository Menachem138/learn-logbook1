import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Edit2, Save, X } from "lucide-react";

interface ScheduleItem {
  time: string;
  activity: string;
}

interface DayScheduleProps {
  day: string;
  schedule: ScheduleItem[];
  onUpdateSchedule: (schedule: ScheduleItem[]) => void;
}

export function DaySchedule({ day, schedule, onUpdateSchedule }: DayScheduleProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedSchedule, setEditedSchedule] = useState<ScheduleItem[]>(schedule);

  const handleTimeChange = (index: number, value: string) => {
    const newSchedule = [...editedSchedule];
    newSchedule[index] = { ...newSchedule[index], time: value };
    setEditedSchedule(newSchedule);
  };

  const handleActivityChange = (index: number, value: string) => {
    const newSchedule = [...editedSchedule];
    newSchedule[index] = { ...newSchedule[index], activity: value };
    setEditedSchedule(newSchedule);
  };

  const handleSave = () => {
    onUpdateSchedule(editedSchedule);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedSchedule(schedule);
    setIsEditing(false);
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-muted flex flex-row items-center justify-between">
        <CardTitle className="text-lg">{day}</CardTitle>
        {isEditing ? (
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" onClick={handleSave}>
              <Save className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={handleCancel}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <Button variant="ghost" size="sm" onClick={() => setIsEditing(true)}>
            <Edit2 className="h-4 w-4" />
          </Button>
        )}
      </CardHeader>
      <CardContent className="pt-4">
        <ul className="space-y-2">
          {(isEditing ? editedSchedule : schedule).map((item, itemIndex) => (
            <li key={itemIndex} className="flex justify-between items-center py-2 border-b last:border-0">
              {isEditing ? (
                <>
                  <Input
                    value={item.time}
                    onChange={(e) => handleTimeChange(itemIndex, e.target.value)}
                    className="w-32 ml-2"
                  />
                  <Input
                    value={item.activity}
                    onChange={(e) => handleActivityChange(itemIndex, e.target.value)}
                    className="flex-1 mx-2"
                  />
                </>
              ) : (
                <>
                  <Badge variant="outline">{item.time}</Badge>
                  <span>{item.activity}</span>
                </>
              )}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}