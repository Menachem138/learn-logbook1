import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

interface JournalEntry {
  id: number;
  content: string;
  date: Date;
}

export default function LearningJournal() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [newEntry, setNewEntry] = useState("");

  const addEntry = () => {
    if (!newEntry.trim()) {
      toast.error("אנא הכנס תוכן ליומן");
      return;
    }

    const entry: JournalEntry = {
      id: Date.now(),
      content: newEntry,
      date: new Date(),
    };

    setEntries([entry, ...entries]);
    setNewEntry("");
    toast.success("הרשומה נוספה בהצלחה!");
  };

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-4">יומן למידה</h2>
      <div className="space-y-4">
        <Textarea
          placeholder="מה למדת היום?"
          value={newEntry}
          onChange={(e) => setNewEntry(e.target.value)}
          className="min-h-[100px]"
        />
        <Button onClick={addEntry} className="w-full">
          הוסף רשומה
        </Button>
      </div>
      <div className="mt-6 space-y-4">
        {entries.map((entry) => (
          <Card key={entry.id} className="p-4">
            <p className="whitespace-pre-wrap">{entry.content}</p>
            <p className="text-sm text-muted-foreground mt-2">
              {entry.date.toLocaleDateString()} {entry.date.toLocaleTimeString()}
            </p>
          </Card>
        ))}
      </div>
    </Card>
  );
}