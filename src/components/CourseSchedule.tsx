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

const backupBlocks = [
  {
    title: "בלוק גיבוי",
    sessions: [
      "שלישי בערב (20:30–21:30): זמן להשלמות",
      'שישי אחה"צ (14:00–15:00): סשן חירום להשלמת חומר'
    ]
  }
];

const importantRules = [
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

export default function CourseSchedule() {
  return (
    <Card className="mt-6">
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
            <div className="space-y-6">
              {weeklySchedule.map((day, index) => (
                <Card key={index} className="overflow-hidden">
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
              ))}
              
              {backupBlocks.map((block, index) => (
                <Card key={index} className="bg-muted/50">
                  <CardHeader>
                    <CardTitle className="text-lg">{block.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {block.sessions.map((session, sessionIndex) => (
                        <li key={sessionIndex} className="flex items-center py-2">
                          <Badge variant="secondary" className="mr-2">גיבוי</Badge>
                          <span>{session}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}

              {importantRules.map((block, index) => (
                <Card key={index} className="border-2 border-primary/20">
                  <CardHeader>
                    <CardTitle className="text-lg">{block.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 list-disc list-inside">
                      {block.rules.map((rule, ruleIndex) => (
                        <li key={ruleIndex} className="text-muted-foreground">
                          {rule}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="topics">
            <div className="grid gap-6">
              {weeklyTopics.map((week) => (
                <Card key={week.week} className="overflow-hidden">
                  <CardHeader className="bg-muted">
                    <CardTitle className="text-lg">
                      שבוע {week.week}: {week.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <ul className="space-y-2">
                      {week.topics.map((topic, topicIndex) => (
                        <li key={topicIndex} className="flex items-center py-2 border-b last:border-0">
                          <Badge variant="outline" className="mr-2">{topicIndex + 1}</Badge>
                          <span>{topic}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
