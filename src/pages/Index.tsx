import React from "react";
import { StudyTimer } from "@/components/StudyTimer";
import MotivationalQuotes from "@/components/MotivationalQuotes";
import CourseContent from "@/components/CourseContent";
import LearningJournal from "@/components/LearningJournal";
import Library from "@/components/Library";
import Questions from "@/components/Questions";
import ChatAssistant from "@/components/ChatAssistant";
import CourseSchedule from "@/components/CourseSchedule";

export default function Index() {
  return (
    <div className="container py-6 space-y-6">
      {/* Timer and Chat Assistant in a row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <StudyTimer />
        <ChatAssistant />
      </div>

      {/* Other components in full width */}
      <div className="space-y-6">
        <MotivationalQuotes />
        <CourseContent />
        <LearningJournal />
        <Library />
        <Questions />
        <CourseSchedule />
      </div>
    </div>
  );
}
