import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"

const weeklySchedule = [
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
  },
  {
    day: "יום שישי",
    schedule: [
      { time: "16:00–16:15", activity: "הכנה מנטלית ופיזית" },
      { time: "16:15–17:00", activity: "צפייה בפרק מהקורס וסיכומים" },
      { time: "17:00–17:10", activity: "הפסקת ריענון קצרה" },
      { time: "17:10–18:00", activity: "תרגול מעשי" },
      { time: "18:00–18:10", activity: "הפסקה קצרה נוספת" },
      { time: "18:10–19:00", activity: "חזרה על החומר וכתיבת שאלות פתוחות" },
    ]
  },
];

const weeklyTopics = [
  {
    week: 1,
    topics: [
      "היכרות עם עולם הקריפטו",
      "פתיחת ארנק דיגיטלי",
      "היכרות בסיסית עם בורסות מסחר",
    ]
  },
  {
    week: 2,
    topics: [
      "הבנת טכנולוגיית הבלוקצ'יין",
      "הכרת סוגי מטבעות דיגיטליים",
      "הבנת מסחר במטבעות דיגיטליים",
    ]
  },
  {
    week: 3,
    topics: [
      "הבנת ניהול סיכונים",
      "אסטרטגיות מסחר",
      "הכנת תיק השקעות",
    ]
  },
  {
    week: 4,
    topics: [
      "הבנת רגולציה בתחום הקריפטו",
      "הכרת פלטפורמות מסחר",
      "הבנת ניתוח טכני",
    ]
  },
];

export default function CourseSchedule() {
  const [activeDay, setActiveDay] = useState(weeklySchedule[0].day);

  return (
    <Card className="mt-6 max-w-6xl mx-auto">
      <CardHeader>
        <CardTitle>לוח זמנים לקורס הקריפטו</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="schedule" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="schedule">לוח זמנים שבועי</TabsTrigger>
            <TabsTrigger value="topics">נושאים שבועיים</TabsTrigger>
          </TabsList>
          <TabsContent value="schedule">
            {weeklySchedule.map((day) => (
              <div key={day.day} className="mb-4">
                <h3 className="text-lg font-semibold">{day.day}</h3>
                <ul>
                  {day.schedule.map((item, index) => (
                    <li key={index} className="flex justify-between">
                      <span>{item.time}</span>
                      <span>{item.activity}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </TabsContent>
          <TabsContent value="topics">
            {weeklyTopics.map((week) => (
              <div key={week.week} className="mb-4">
                <h3 className="text-lg font-semibold">שבוע {week.week}</h3>
                <ul>
                  {week.topics.map((topic, index) => (
                    <li key={index} className="flex justify-between">
                      <span>{topic}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
