import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/auth/AuthProvider';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { MessageCircle, Plus } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface Question {
  id: string;
  content: string;
  answer: string | null;
  is_answered: boolean;
  created_at: string;
}

const Questions = () => {
  const { session } = useAuth();
  const { toast } = useToast();
  const [newQuestion, setNewQuestion] = React.useState('');
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const queryClient = useQueryClient();

  const { data: questions, isLoading } = useQuery({
    queryKey: ['questions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('questions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Question[];
    },
  });

  const addQuestionMutation = useMutation({
    mutationFn: async (content: string) => {
      const { error } = await supabase.from('questions').insert([
        {
          content,
          user_id: session?.user.id,
        },
      ]);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['questions'] });
      setNewQuestion('');
      setIsDialogOpen(false);
      toast({
        title: "השאלה נשמרה בהצלחה",
        description: "נענה בהקדם האפשרי",
      });
    },
    onError: () => {
      toast({
        title: "שגיאה בשמירת השאלה",
        description: "אנא נסה שוב מאוחר יותר",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestion.trim()) return;
    addQuestionMutation.mutate(newQuestion);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <MessageCircle className="h-6 w-6" />
          שאלות
        </h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              שאלה חדשה
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>הוספת שאלה חדשה</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Textarea
                value={newQuestion}
                onChange={(e) => setNewQuestion(e.target.value)}
                placeholder="מה תרצה לשאול?"
                className="min-h-[100px]"
              />
              <Button type="submit" disabled={!newQuestion.trim()}>
                שלח שאלה
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="text-center py-4">טוען...</div>
      ) : questions?.length === 0 ? (
        <div className="text-center py-4 text-gray-500">
          עדיין אין שאלות. אתה מוזמן להוסיף את השאלה הראשונה!
        </div>
      ) : (
        <div className="space-y-4">
          {questions?.map((question) => (
            <div
              key={question.id}
              className="border rounded-lg p-4 bg-gray-50"
            >
              <p className="mb-2">{question.content}</p>
              {question.answer && (
                <div className="mt-2 border-t pt-2">
                  <p className="text-sm font-semibold">תשובה:</p>
                  <p className="text-sm">{question.answer}</p>
                </div>
              )}
              <div className="mt-2 text-xs text-gray-500">
                {new Date(question.created_at).toLocaleDateString('he-IL')}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Questions;