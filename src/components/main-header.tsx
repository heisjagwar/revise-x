"use client";

import { PlusCircle } from 'lucide-react';
import { AddTopicDialog } from '@/components/add-topic-dialog';
import { ThemeToggle } from '@/components/theme-toggle';
import type { Topic } from '@/lib/types';
import { Button } from '@/components/ui/button';

interface MainHeaderProps {
  setTopics: (topics: Topic[] | ((prev: Topic[]) => Topic[])) => void;
}

export function MainHeader({ setTopics }: MainHeaderProps) {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <h1 className="text-2xl font-bold text-primary">
          Revision Reminder
        </h1>
        <div className="flex items-center gap-2">
          <AddTopicDialog setTopics={setTopics}>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Topic
            </Button>
          </AddTopicDialog>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
