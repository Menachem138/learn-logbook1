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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-6">
          <div className="w-full max-w-md mx-auto">
            <StudyTimer />
          </div>
          <MotivationalQuotes />
          <ChatAssistant />
        </div>
        <div className="space-y-6">
          <CourseContent />
          <LearningJournal />
          <Library />
          <Questions />
          <CourseSchedule />
        </div>
      </div>
    </div>
  );
}