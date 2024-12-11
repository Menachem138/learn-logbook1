import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { WeeklyTopic } from "./types";

export const WeeklyTopicCard = ({ topic }: { topic: WeeklyTopic }) => {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-muted">
        <CardTitle className="text-lg">
          שבוע {topic.week}: {topic.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <ul className="space-y-2">
          {topic.topics.map((topicItem, topicIndex) => (
            <li key={topicIndex} className="flex items-center py-2 border-b last:border-0">
              <Badge variant="outline" className="mr-2">{topicIndex + 1}</Badge>
              <span>{topicItem}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};