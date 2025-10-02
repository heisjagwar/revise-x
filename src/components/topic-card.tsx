"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Topic } from '@/lib/types';
import { format, parseISO, differenceInDays, isPast, isToday } from 'date-fns';
import { History, Trash2, Calendar, Tags } from 'lucide-react';
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
  
  const handleToggleRevision = () => {
    if (!nextRevision) return;

    setTopics(prevTopics => 
      prevTopics.map(t => {
        if (t.id === topic.id) {
          return {
            ...t,
            revisions: t.revisions.map(rev => 
              rev.day === nextRevision.day ? { ...rev, completed: !rev.completed } : rev
            ),
          };
        }
        return t;
      })
    );
  };
  
  const completedRevisionsCount = topic.revisions.filter(r => r.completed).length;

  return (
    <Card className={`flex flex-col transition-all duration-300 hover:shadow-xl bg-card border-border`}>
        <CardHeader className="p-4">
            <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-bold">{topic.name}</CardTitle>
                 <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive flex-shrink-0">
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
            <div className="flex items-center text-sm text-muted-foreground pt-1">
                <Tags className="h-4 w-4 mr-2" />
                <Badge variant="secondary">{topic.category}</Badge>
            </div>
        </CardHeader>
        <CardContent className="p-4 pt-0 flex flex-col gap-4">
            <div className="flex items-center text-sm text-muted-foreground">
                <History className="h-4 w-4 mr-2" />
                <span>Added on: {format(parseISO(topic.createdAt), 'MMM d, yyyy')}</span>
            </div>
            
            <div className="flex items-center justify-between p-3 rounded-md bg-background/50">
              <div className="flex items-center gap-3">
                  <Checkbox 
                    id={`check-${topic.id}`} 
                    disabled={!isDue}
                    checked={nextRevision ? nextRevision.completed : true}
                    onCheckedChange={handleToggleRevision}
                  />
                  <div className='flex flex-col'>
                    <label
                      htmlFor={`check-${topic.id}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {nextRevision ? 'Next Revision' : 'All Revisions Done!'}
                    </label>
                    {nextRevision ? (
                      <p className="text-sm text-muted-foreground flex items-center mt-1">
                        <Calendar className="h-4 w-4 mr-2" />
                        {format(parseISO(nextRevision.dueDate), 'MMM d, yyyy')}
                        {isDue && <span className="ml-2 text-primary font-semibold">(Due)</span>}
                        {!isDue && revisionDaysLeft !== null && ` (in ${revisionDaysLeft} days)`}
                      </p>
                    ) : (
                      <p className="text-sm text-muted-foreground mt-1">You've mastered this topic!</p>
                    )}
                  </div>
              </div>
               <Button variant={isDue ? 'default' : 'secondary'} size="sm" disabled={!isDue} onClick={handleToggleRevision}>
                  Mark as Done
               </Button>
            </div>

            <div>
              <p className="text-sm font-medium text-muted-foreground mb-2">Revision Progress</p>
              <div className="flex items-center gap-1">
                {topic.revisions.map((rev, index) => (
                  <div 
                    key={index} 
                    className={`h-2 flex-1 rounded-full ${rev.completed ? 'bg-primary' : 'bg-muted'}`}
                    title={`Day ${rev.day}: ${rev.completed ? 'Completed' : 'Pending'}`}
                  />
                ))}
              </div>
            </div>
        </CardContent>
    </Card>
  );
}
