import React from "react";
import Timer from "@/components/Timer";
import ProgressTracker from "@/components/ProgressTracker";
import MotivationalQuotes from "@/components/MotivationalQuotes";
import CourseContent from "@/components/CourseContent";
import ContentLibrary from "@/components/ContentLibrary";
import LearningJournal from "@/components/LearningJournal";

const Index = () => {
  return (
    <div className="container mx-auto p-4 min-h-screen" dir="rtl">
      <h1 className="text-4xl font-bold text-center mb-8">תוכנית למידה לקורס קריפטו</h1>
      
      <div className="space-y-6">
        <Timer />
        <ProgressTracker />
      </div>

      <div className="mb-6">
        <MotivationalQuotes />
      </div>

      <div className="mb-6">
        <CourseContent />
      </div>

      <div className="mb-6">
        <ContentLibrary />
      </div>

      <div className="mb-6">
        <LearningJournal />
      </div>
    </div>
  );
};

export default Index;