import React from "react";
import Timer from "@/components/Timer";
import MotivationalQuotes from "@/components/MotivationalQuotes";
import LearningJournal from "@/components/LearningJournal";
import CourseContent from "@/components/CourseContent";

const Index = () => {
  return (
    <div className="container mx-auto p-4 min-h-screen" dir="rtl">
      <h1 className="text-4xl font-bold text-center mb-8">מערכת ניהול למידה</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Timer />
        <MotivationalQuotes />
      </div>
      <div className="grid grid-cols-1 gap-6">
        <LearningJournal />
        <CourseContent />
      </div>
    </div>
  );
};

export default Index;