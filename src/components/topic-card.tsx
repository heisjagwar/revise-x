"use client";

import { Card, CardContent } from '@/components/ui/card';
import type { Topic } from '@/lib/types';
import { format, parseISO, differenceInDays, isPast, isToday } from 'date-fns';
import { Calendar, History, Trash2 } from 'lucide-react';
import { Button } from './ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from './ui/alert-dialog';

interface TopicCardProps {
  topic: Topic;
  setTopics: (topics: Topic[] | ((prev: Topic[]) => Topic[])) => void;
}

export function TopicCard({ topic, setTopics }: TopicCardProps) {
  
  const handleDelete = () => {
    setTopics(prevTopics => prevTopics.filter(t => t.id !== topic.id));
  };
  
  const nextRevision = topic.revisions.find(r => !r.completed);
  const lastRevision = [...topic.revisions].reverse().find(r => r.completed);

  let lastRevisedDate = parseISO(topic.createdAt);
  if (lastRevision) {
      const lastCompletedDueDate = subDays(parseISO(lastRevision.dueDate), lastRevision.day);
      lastRevisedDate = addDays(lastCompletedDueDate, lastRevision.day);
  } else {
    // If no revision is completed, last revised is created date
    lastRevisedDate = parseISO(topic.createdAt);
  }

  let revisionDaysLeft: number | null = null;
  let isDue = false;

  if (nextRevision) {
    const dueDate = parseISO(nextRevision.dueDate);
    revisionDaysLeft = differenceInDays(dueDate, new Date());
    isDue = isPast(dueDate) || isToday(dueDate);
  }

  const isRevisionSoon = revisionDaysLeft !== null && revisionDaysLeft <= 7;
  
  // Functions to add/sub days to properly calculate last revised date
  function addDays(date: Date, days: number): Date {
      const result = new Date(date);
      result.setDate(result.getDate() + days);
      return result;
  }
  function subDays(date: Date, days: number): Date {
      const result = new Date(date);
      result.setDate(result.getDate() - days);
      return result;
  }


  return (
    <Card className={`flex flex-col transition-all duration-300 hover:shadow-xl ${isRevisionSoon ? 'bg-accent/20' : 'bg-card'}`}>
        <CardContent className="p-4 flex items-center justify-between">
            <div className="flex-grow">
                <h3 className="font-bold text-lg">{topic.name}</h3>
                <div className="flex items-center text-sm text-muted-foreground mt-1">
                    <History className="h-4 w-4 mr-2" />
                    <span>Last Revised: {format(lastRevisedDate, 'MMM d')}</span>
                </div>
            </div>
            <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon">
                    <Calendar className="h-5 w-5" />
                </Button>
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive">
                            <History className="h-5 w-5" />
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the topic "{topic.name}"
                            and all its revision progress.
                        </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                            Delete
                        </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </CardContent>
    </Card>
  );
}
