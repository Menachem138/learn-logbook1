import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { DayCard } from "./DayCard";
import { WeeklyTopicCard } from "./WeeklyTopicCard";
import { weeklySchedule, weeklyTopics, backupBlocks, importantRules } from "./data";

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
                <DayCard key={index} day={day} />
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
              {weeklyTopics.map((topic) => (
                <WeeklyTopicCard key={topic.week} topic={topic} />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}