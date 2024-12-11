import React from "react";
import { DaySchedule } from "./DaySchedule";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { DaySchedule as DayScheduleType } from "./scheduleData";

interface WeeklyScheduleProps {
  schedule: DayScheduleType[];
  onUpdateDay: (dayIndex: number, newSchedule: any[]) => void;
  onUpdateDayName: (dayIndex: number, newName: string) => void;
  onAddDay: () => void;
  onDeleteDay: (dayIndex: number) => void;
}

export function WeeklySchedule({ 
  schedule, 
  onUpdateDay, 
  onUpdateDayName,
  onAddDay, 
  onDeleteDay 
}: WeeklyScheduleProps) {
  return (
    <div className="space-y-6">
      {schedule.map((day, index) => (
        <DaySchedule
          key={index}
          day={day.day}
          schedule={day.schedule}
          onUpdateSchedule={(newSchedule) => onUpdateDay(index, newSchedule)}
          onUpdateDayName={(newName) => onUpdateDayName(index, newName)}
          onDeleteDay={() => onDeleteDay(index)}
        />
      ))}
      <Button 
        onClick={onAddDay}
        variant="outline" 
        className="w-full py-6 border-dashed hover:border-primary hover:bg-primary/5"
      >
        <Plus className="h-4 w-4 mr-2" />
        הוסף יום חדש
      </Button>
    </div>
  );
}