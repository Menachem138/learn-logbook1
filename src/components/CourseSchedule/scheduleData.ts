export interface ScheduleItem {
  time: string;
  activity: string;
}

export interface DaySchedule {
  day: string;
  schedule: ScheduleItem[];
}

export const initialWeeklySchedule: DaySchedule[] = [
  {
    day: "יום שני",
    schedule: [
      { time: "16:00–16:15", activity: "הכנה מנטלית ופיזית" },
      { time: "16:15–17:00", activity: "צפייה בפרק מהקורס וסיכומים" },
      { time: "17:00–17:10", activity: "הפסקת ריענון קצרה" },
      { time: "17:10–18:00", activity: "תרגול מעשי" },
      { time: "18:00–18:10", activity: "הפסקה קצרה נוספת" },
      { time: "18:10–19:00", activity: "חזרה על החומר וכתיבת שאלות פתוחות" },
    ]
  },
  {
    day: "יום שלישי",
    schedule: [
      { time: "16:00–16:15", activity: "הכנה מנטלית ופיזית" },
      { time: "16:15–17:00", activity: "צפייה בפרק מהקורס וסיכומים" },
      { time: "17:00–17:10", activity: "הפסקת ריענון קצרה" },
      { time: "17:10–18:00", activity: "תרגול מעשי" },
      { time: "18:00–18:10", activity: "הפסקה קצרה נוספת" },
      { time: "18:10–19:00", activity: "חזרה על החומר וכתיבת שאלות פתוחות" },
    ]
  },
  {
    day: "יום רביעי",
    schedule: [
      { time: "16:00–16:15", activity: "הכנה מנטלית ופיזית" },
      { time: "16:15–17:00", activity: "צפייה בפרק מהקורס וסיכומים" },
      { time: "17:00–17:10", activity: "הפסקת ריענון קצרה" },
      { time: "17:10–18:00", activity: "תרגול מעשי" },
      { time: "18:00–18:10", activity: "הפסקה קצרה נוספת" },
      { time: "18:10–19:00", activity: "חזרה על החומר וכתיבת שאלות פתוחות" },
    ]
  },
  {
    day: "יום חמישי",
    schedule: [
      { time: "16:00–16:15", activity: "הכנה מנטלית ופיזית" },
      { time: "16:15–17:00", activity: "צפייה בפרק מהקורס וסיכומים" },
      { time: "17:00–17:10", activity: "הפסקת ריענון קצרה" },
      { time: "17:10–18:00", activity: "תרגול מעשי" },
      { time: "18:00–18:10", activity: "הפסקה קצרה נוספת" },
      { time: "18:10–19:00", activity: "חזרה על החומר וכתיבת שאלות פתוחות" },
    ]
  }
];