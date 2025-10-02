"use client";

import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import type { Topic } from '@/lib/types';
import { format, parseISO, differenceInDays, isPast, isToday } from 'date-fns';
import { History, Trash2, Calendar, Tags, CheckCircle2 } from 'lucide-react';
import { Button } from './ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from './ui/alert-dialog';
import { Checkbox } from './ui/checkbox';
import { Badge } from './ui/badge';

interface TopicCardProps {
  topic: Topic;
  setTopics: (topics: Topic[] | ((prev: Topic[]) => Topic[])) => void;
}

export function TopicCard({ topic, setTopics }: TopicCardProps) {
  
  const handleDelete = () => {
    setTopics(prevTopics => prevTopics.filter(t => t.id !== topic.id));
  };
  
  const nextRevision = topic.revisions.find(r => !r.completed);
  
  let revisionDaysLeft: number | null = null;
  let isDue = false;

  if (nextRevision) {
    const dueDate = parseISO(nextRevision.dueDate);
    revisionDaysLeft = differenceInDays(dueDate, new Date());
    isDue = isPast(dueDate) || isToday(dueDate);
  }
  
  const handleToggleRevision = (checked: boolean) => {
    if (!nextRevision) return;

    setTopics(prevTopics => 
      prevTopics.map(t => {
        if (t.id === topic.id) {
          const newRevisions = t.revisions.map(rev => 
            rev.day === nextRevision.day ? { ...rev, completed: checked } : rev
          );
          return { ...t, revisions: newRevisions };
        }
        return t;
      })
    );
  };
  
  const completedRevisionsCount = topic.revisions.filter(r => r.completed).length;

  return (
    <Card className={`flex flex-col transition-all duration-300 hover:shadow-xl hover:border-primary/50 bg-card border-border`}>
        <CardHeader className="p-4">
            <div className="flex items-start justify-between gap-2">
                <div className="flex flex-col gap-2">
                    <CardTitle className="text-lg font-bold">{topic.name}</CardTitle>
                    <div className="flex items-center text-sm text-muted-foreground">
                        <Tags className="h-4 w-4 mr-2" />
                        <Badge variant="secondary">{topic.category}</Badge>
                    </div>
                </div>
                 <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive flex-shrink-0 h-8 w-8">
                            <Trash2 className="h-4 w-4" />
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
        </CardHeader>
        <CardContent className="p-4 pt-0 flex flex-col gap-4">
            <div className="flex items-center text-xs text-muted-foreground">
                <History className="h-3 w-3 mr-2" />
                <span>Added on: {format(parseISO(topic.createdAt), 'do MMM, yyyy')}</span>
            </div>
            
            <div className="flex flex-col gap-2 p-3 rounded-md bg-secondary/30">
                <div className="flex items-center gap-3">
                    <Checkbox
                        id={`check-${topic.id}`}
                        disabled={!isDue}
                        checked={nextRevision ? nextRevision.completed : true}
                        onCheckedChange={handleToggleRevision}
                    />
                     <label
                        htmlFor={`check-${topic.id}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-50"
                    >
                        {nextRevision ? 'Mark as Revised' : 'All Revisions Done!'}
                    </label>
                </div>
                {nextRevision ? (
                      <div className="pl-7 text-sm text-muted-foreground flex items-center mt-1">
                        <Calendar className="h-4 w-4 mr-2" />
                        <span className="font-medium">Next: {format(parseISO(nextRevision.dueDate), 'do MMM, yyyy')}</span>
                        {isDue ? 
                            <span className="ml-2 text-primary font-semibold">(Due Today)</span>
                            : (revisionDaysLeft !== null && ` (in ${revisionDaysLeft + 1} days)`)
                        }
                      </div>
                    ) : (
                      <div className="pl-7 text-sm text-green-400 flex items-center mt-1">
                        <CheckCircle2 className="h-4 w-4 mr-2" />
                        <p className="font-semibold">You've mastered this topic!</p>
                      </div>
                    )}
            </div>
        </CardContent>
         <CardFooter className="p-4 pt-0">
             <div>
              <p className="text-xs font-medium text-muted-foreground mb-2">Revision Progress</p>
              <div className="flex items-center gap-1.5 w-full">
                {topic.revisions.map((rev, index) => (
                  <div 
                    key={index} 
                    className={`h-2 flex-1 rounded-full ${rev.completed ? 'bg-primary' : 'bg-muted'}`}
                    title={`Day ${rev.day}: ${rev.completed ? 'Completed' : 'Pending'}`}
                  />
                ))}
              </div>
            </div>
        </CardFooter>
    </Card>
  );
}
