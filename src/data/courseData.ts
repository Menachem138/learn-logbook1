import { Section } from '../components/CourseContent/types';

export const sections: Section[] = [
  {
    id: "section-1",
    title: "ברוכים הבאים",
    order: 0,
    lessons: [
      { id: "1", title: "ברוכים הבאים - פז", description: "", duration: 852, type: "video", order: 0 },
      { id: "2", title: "קניין רוחני", description: "", duration: 164, type: "video", order: 1 },
      { id: "3", title: "הסרת אחריות", description: "", duration: 121, type: "video", order: 2 },
      { id: "4", title: "ברוכים הבאים - חי טל", description: "", duration: 797, type: "video", order: 3 }
    ]
  },
  {
    id: "section-2",
    title: "מבוא לתחום הקריפטו",
    order: 1,
    lessons: [
      { id: "5", title: "מה זה כסף", description: "", duration: 673, type: "video", order: 0 },
      { id: "6", title: "מה זה ביטקוין", description: "", duration: 533, type: "video", order: 1 },
      { id: "7", title: "ביטקוין מאסטר פלאן", description: "", duration: 414, type: "video", order: 2 },
      { id: "8", title: "מה זה בלוקציין חלק א׳", description: "", duration: 299, type: "video", order: 3 },
      { id: "9", title: "מה זה בלוקציין חלק ב׳", description: "", duration: 440, type: "video", order: 4 },
      { id: "10", title: "פתיחת ארנק מטאמאסק יחד עם פז", description: "", duration: 721, type: "video", order: 5 }
    ]
  }
];

// Export initialCourseData to match the web app's import
export const initialCourseData = sections;

export const getTotalLessons = () => {
  return sections.reduce((total, section) => total + section.lessons.length, 0);
};

export const getSectionTitle = (index: number) => {
  return `${index + 1}. ${sections[index].title}`;
};
