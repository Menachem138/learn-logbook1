import React from "react";
import { DaySchedule } from "./DaySchedule";

interface ScheduleItem {
  time: string;
  activity: string;
}

interface DaySchedule {
  day: string;
  schedule: ScheduleItem[];
}

interface WeeklyScheduleProps {
  schedule: DaySchedule[];
  onUpdateDay: (dayIndex: number, newSchedule: ScheduleItem[]) => void;
}

export function WeeklySchedule({ schedule, onUpdateDay }: WeeklyScheduleProps) {
  return (
    <div className="space-y-6">
      {schedule.map((day, index) => (
        <DaySchedule
          key={index}
          day={day.day}
          schedule={day.schedule}
          onUpdateSchedule={(newSchedule) => onUpdateDay(index, newSchedule)}
        />
      ))}
    </div>
  );
}