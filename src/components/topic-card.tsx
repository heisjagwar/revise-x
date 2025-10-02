"use client";

import { Card, CardContent } from '@/components/ui/card';
import type { Topic } from '@/lib/types';
import { format, parseISO, differenceInDays, isPast, isToday } from 'date-fns';
import { Calendar, History, Trash2 } from 'lucide-react';
import { Button } from './ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from './ui/alert-dialog';
import { Checkbox } from './ui/checkbox';
import { Separator } from './ui/separator';

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
      // This logic seems a bit off, let's correct it.
      // The last revision date isn't the due date, it's when it was *marked* complete.
      // For now, we'll stick to the existing logic of using due dates as a proxy.
      const dateOfLastRevisionAction = parseISO(topic.createdAt); // start with created date
      const completedRevisions = topic.revisions.filter(r => r.completed);
      if (completedRevisions.length > 0) {
        const lastCompleted = completedRevisions[completedRevisions.length - 1];
        lastRevisedDate = parseISO(lastCompleted.dueDate);
      }
  }

  let revisionDaysLeft: number | null = null;
  let isDue = false;

  if (nextRevision) {
    const dueDate = parseISO(nextRevision.dueDate);
    revisionDaysLeft = differenceInDays(dueDate, new Date());
    isDue = isPast(dueDate) || isToday(dueDate);
  }

  const isRevisionSoon = revisionDaysLeft !== null && revisionDaysLeft <= 7;

  return (
    <Card className={`flex flex-col transition-all duration-300 hover:shadow-xl bg-card`}>
        <CardContent className="p-4 flex flex-col gap-4">
            <div className="flex items-center justify-between">
                <div className="flex-grow">
                    <h3 className="font-bold text-lg">{topic.name}</h3>
                    <div className="flex items-center text-sm text-muted-foreground mt-1">
                        <History className="h-4 w-4 mr-2" />
                        <span>Last Revised: {format(lastRevisedDate, 'MMM d, yyyy')}</span>
                    </div>
                </div>
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive">
                            <Trash2 className="h-5 w-5" />
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
            
            <Separator />

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                  <Checkbox id={`check-${topic.id}`} disabled={!isDue} />
                  <div className='flex flex-col'>
                    <label
                      htmlFor={`check-${topic.id}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Next Revision
                    </label>
                    {nextRevision ? (
                      <p className="text-sm text-muted-foreground">
                        {format(parseISO(nextRevision.dueDate), 'MMM d, yyyy')}
                        {isDue && " (Due)"}
                        {!isDue && revisionDaysLeft !== null && ` (in ${revisionDaysLeft} days)`}
                      </p>
                    ) : (
                      <p className="text-sm text-muted-foreground">All done!</p>
                    )}
                  </div>
              </div>
               <Button variant={isDue ? 'default' : 'secondary'} size="sm" disabled={!isDue}>
                  Mark as Done
               </Button>
            </div>
        </CardContent>
    </Card>
  );
}
