import React from "react";
import { Card } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const courseContent = [
  {
    title: "מבוא לקריפטו",
    sections: [
      "היסטוריה של מטבעות דיגיטליים",
      "מהו בלוקצ'יין",
      "סוגי מטבעות קריפטוגרפיים",
    ],
  },
  {
    title: "ביטקוין",
    sections: [
      "מהו ביטקוין",
      "כריית ביטקוין",
      "ארנקים דיגיטליים",
      "אבטחה וגיבוי",
    ],
  },
  {
    title: "אתריום וחוזים חכמים",
    sections: [
      "פלטפורמת אתריום",
      "חוזים חכמים",
      "טוקנים מבוססי ERC-20",
      "DeFi ואפליקציות מבוזרות",
    ],
  },
  {
    title: "מסחר והשקעות",
    sections: [
      "בורסות קריפטו",
      "אסטרטגיות מסחר",
      "ניהול סיכונים",
      "ניתוח טכני בסיסי",
    ],
  },
  {
    title: "רגולציה ומיסוי",
    sections: [
      "רגולציה עולמית",
      "מיסוי קריפטו",
      "חוקים ותקנות",
      "דיווח על רווחים",
    ],
  },
  // ... Add all 29 sections here
];

export default function CourseContent() {
  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-4">תוכן הקורס</h2>
      <Accordion type="single" collapsible className="w-full">
        {courseContent.map((module, index) => (
          <AccordionItem key={index} value={`item-${index}`}>
            <AccordionTrigger className="text-right">
              {module.title}
            </AccordionTrigger>
            <AccordionContent>
              <ul className="list-disc list-inside space-y-2">
                {module.sections.map((section, sectionIndex) => (
                  <li key={sectionIndex} className="text-right">
                    {section}
                  </li>
                ))}
              </ul>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </Card>
  );
}