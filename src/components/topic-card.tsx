"use client";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import type { Topic } from '@/lib/types';
import { format, parseISO, isPast, isToday } from 'date-fns';
import { AlarmClock, Calendar, Tag, Trash2 } from 'lucide-react';
import { Button } from './ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from './ui/alert-dialog';

interface TopicCardProps {
  topic: Topic;
  setTopics: (topics: Topic[] | ((prev: Topic[]) => Topic[])) => void;
}

const getCategoryBadgeVariant = (category: Topic['category']) => {
  switch (category) {
    case 'DSA':
      return 'default';
    case 'System Design':
      return 'secondary';
    case 'OOPs':
      return 'outline';
    default:
      return 'default';
  }
};

export function TopicCard({ topic, setTopics }: TopicCardProps) {
  const handleRevisionToggle = (day: number) => {
    setTopics(prevTopics =>
      prevTopics.map(t =>
        t.id === topic.id
          ? {
              ...t,
              revisions: t.revisions.map(r =>
                r.day === day ? { ...r, completed: !r.completed } : r
              ),
            }
          : t
      )
    );
  };

  const handleDelete = () => {
    setTopics(prevTopics => prevTopics.filter(t => t.id !== topic.id));
  };
  
  const isAnyRevisionDue = topic.revisions.some(
    (revision) => !revision.completed && (isPast(parseISO(revision.dueDate)) || isToday(parseISO(revision.dueDate)))
  );

  return (
    <Card className={`flex flex-col transition-all duration-300 hover:shadow-xl dark:hover:shadow-primary/20 ${isAnyRevisionDue ? 'border-primary ring-2 ring-primary/50' : 'border-card'}`}>
      <CardHeader>
        <div className="flex justify-between items-start gap-2">
            <div>
                <CardTitle className="text-xl mb-1 text-card-foreground">{topic.name}</CardTitle>
                <div className="flex flex-col sm:flex-row sm:items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                        <Tag className="h-3 w-3" />
                        <Badge variant={getCategoryBadgeVariant(topic.category)} className="text-xs">{topic.category}</Badge>
                    </div>
                    <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>Studied on {format(parseISO(topic.createdAt), 'MMM d, yyyy')}</span>
                    </div>
                </div>
            </div>
             <AlertDialog>
                <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive h-8 w-8 flex-shrink-0">
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
      <CardContent className="flex-grow">
        <p className="text-sm font-medium text-card-foreground mb-3">Revision Cycle:</p>
        <div className="space-y-4">
          {topic.revisions.map((revision) => {
            const dueDate = parseISO(revision.dueDate);
            const isDue = !revision.completed && (isPast(dueDate) || isToday(dueDate));
            return (
              <div key={revision.day} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Checkbox
                    id={`${topic.id}-${revision.day}`}
                    checked={revision.completed}
                    onCheckedChange={() => handleRevisionToggle(revision.day)}
                    className="transition-all data-[state=checked]:bg-accent data-[state=checked]:border-accent-foreground"
                    aria-label={`Mark day ${revision.day} revision as complete`}
                  />
                  <Label
                    htmlFor={`${topic.id}-${revision.day}`}
                    className={`text-sm cursor-pointer ${revision.completed ? 'line-through text-muted-foreground' : 'text-card-foreground'} ${isDue ? 'font-bold text-primary' : ''}`}
                  >
                    Day {revision.day} Revision
                  </Label>
                  {isDue && <AlarmClock className="h-4 w-4 text-primary animate-pulse" />}
                </div>
                <span className={`text-xs ${isDue ? 'text-primary' : 'text-muted-foreground'}`}>
                  {format(dueDate, 'MMM d')}
                </span>
              </div>
            );
          })}
        </div>
      </CardContent>
      {isAnyRevisionDue && (
        <CardFooter className="bg-primary/10 dark:bg-primary/20 p-3 mt-4">
            <p className="text-xs text-primary font-semibold text-center w-full">Hey Jagwar! It's time to revise "{topic.name}", Come on, let's go!</p>
        </CardFooter>
      )}
    </Card>
  );
}
