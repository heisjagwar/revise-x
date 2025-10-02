"use client";

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { add } from 'date-fns';
import { formatISO } from 'date-fns/formatISO';
import type { Category, Topic } from '@/lib/types';
import { CATEGORIES, REVISION_DAYS } from '@/lib/types';

interface AddTopicDialogProps {
  children: React.ReactNode;
  setTopics: (topics: Topic[] | ((prev: Topic[]) => Topic[])) => void;
}

export function AddTopicDialog({ children, setTopics }: AddTopicDialogProps) {
  const [open, setOpen] = useState(false);
  const [topicName, setTopicName] = useState('');
  const [category, setCategory] = useState<Category | ''>('');
  const { toast } = useToast();

  const handleSubmit = () => {
    if (!topicName.trim() || !category) {
      toast({
        title: 'Error',
        description: 'Please fill in all fields.',
        variant: 'destructive',
      });
      return;
    }

    const now = new Date();
    const newTopic: Topic = {
      id: crypto.randomUUID(),
      name: topicName.trim(),
      category: category,
      createdAt: formatISO(now),
      revisions: REVISION_DAYS.map(day => ({
        day,
        completed: false,
        dueDate: formatISO(add(now, { days: day })),
      })),
    };

    setTopics(prevTopics => [newTopic, ...prevTopics]);
    toast({
      title: 'Success!',
      description: `Topic "${newTopic.name}" has been added.`,
    });
    
    setOpen(false);
    setTopicName('');
    setCategory('');
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Revision Topic</DialogTitle>
          <DialogDescription>
            Enter the details of the topic you've studied. We'll set up the revision schedule for you.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Topic Name
            </Label>
            <Input
              id="name"
              value={topicName}
              onChange={(e) => setTopicName(e.target.value)}
              className="col-span-3"
              placeholder="e.g., Dynamic Programming"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="category" className="text-right">
              Category
            </Label>
            <Select onValueChange={(value) => setCategory(value as Category)} value={category}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map(cat => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSubmit}>Create Topic</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
