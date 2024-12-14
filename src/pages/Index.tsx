import React from "react";
import { StudyTimeTracker } from "@/components/StudyTimeTracker";
import MotivationalQuotes from "@/components/MotivationalQuotes";
import CourseContent from "@/components/CourseContent";
import LearningJournal from "@/components/LearningJournal";
import CourseSchedule from "@/components/CourseSchedule";
import Library from "@/components/Library";
import Questions from "@/components/Questions";
import ChatAssistant from "@/components/ChatAssistant";

const Index = () => {
  return (
    <div className="container mx-auto p-4 min-h-screen" dir="rtl">
      <h1 className="text-4xl font-bold text-center mb-8">תוכנית למידה לקורס קריפטו</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-6">
          <StudyTimeTracker />
          <MotivationalQuotes />
          <ChatAssistant />
        </div>
        
        <div className="space-y-6">
          <CourseContent />
          <CourseSchedule />
          <Library />
          <Questions />
          <LearningJournal />
        </div>
      </div>
    </div>
  );
};

export default Index;