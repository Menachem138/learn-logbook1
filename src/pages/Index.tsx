import React from "react";
import Timer from "@/components/Timer";
import MotivationalQuotes from "@/components/MotivationalQuotes";
import CourseContent from "@/components/CourseContent";
import LearningJournal from "@/components/LearningJournal";
import CourseSchedule from "@/components/CourseSchedule";
import Library from "@/components/Library";
import Questions from "@/components/Questions";

const Index = () => {
  return (
    <div className="container mx-auto p-4 min-h-screen" dir="rtl">
      <h1 className="text-4xl font-bold text-center mb-8">תוכנית למידה לקורס קריפטו</h1>
      
      <div className="space-y-12">
        <Timer />
        <MotivationalQuotes />
      </div>

      <div className="mt-12 mb-12">
        <CourseContent />
      </div>

      <div className="mb-6">
        <CourseSchedule />
      </div>

      <div className="mb-6">
        <Library />
      </div>

      <div className="mb-6">
        <Questions />
      </div>

      <div className="mb-6">
        <LearningJournal />
      </div>
    </div>
  );
};

export default Index;