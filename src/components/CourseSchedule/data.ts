import { DaySchedule, WeeklyTopic, BackupBlock, ImportantRule } from "./types";

export const weeklySchedule: DaySchedule[] = [
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

export const weeklyTopics = [
  {
    week: 1,
    title: "יסודות הקריפטו",
    topics: [
      "יסודות הקריפטו",
      "מסחר בסיסי",
      "ניתוח טכני ראשוני"
    ]
  },
  {
    week: 2,
    title: "פלטפורמות ואינדיקטורים",
    topics: [
      "תפעול פלטפורמות",
      "עבודה עם ארנקים",
      "אינדיקטורים",
      "יישום בסיסי בשוק"
    ]
  },
  {
    week: 3,
    title: "אסטרטגיות מתקדמות",
    topics: [
      "אסטרטגיות מתקדמות",
      "וייקוף",
      "מבנה שוק",
      "המשקפיים של חי טל",
      "תוכנית עבודה וניהול סיכונים"
    ]
  },
  {
    week: 4,
    title: "מסחר מעשי",
    topics: [
      "נזילות",
      "היצע/ביקוש",
      "מסחר בספוט",
      "כלים מנטליים",
      "סקירות שוק מעשיות"
    ]
  }
];

export const backupBlocks = [
  {
    title: "בלוק גיבוי",
    sessions: [
      "שלישי בערב (20:30–21:30): זמן להשלמות",
      'שישי אחה"צ (14:00–15:00): סשן חירום להשלמת חומר'
    ]
  }
];

export const importantRules = [
  {
    title: "כללים חשובים",
    rules: [
      "שגרת הכנה: סידור המקום והכנה מנטלית בכל תחילת סשן",
      "הפסקות מובנות: כל 50 דקות לימוד, 10 דקות הפסקה",
      "מעקב יומי: רשום במחברת מה למדת ומה דורש העמקה",
      "תגמולים ועונשים: תגמל את עצמך על התמדה, הענש את עצמך בעדינות במקרה של התחמקות ללא סיבה"
    ]
  }
];