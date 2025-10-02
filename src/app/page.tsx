"use client";

import { useState, useEffect } from 'react';
import { MainHeader } from '@/components/main-header';
import { TopicList } from '@/components/topic-list';
import type { Topic } from '@/lib/types';
import useLocalStorage from '@/lib/hooks/use-local-storage';
import { add, sub, formatISO } from 'date-fns';
import { REVISION_DAYS } from '@/lib/types';
import { AddTopicDialog } from '@/components/add-topic-dialog';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

const createInitialTopics = (): Topic[] => {
    const now = new Date();
    return [
        {
            id: '1',
            name: 'Quantum Mechanics',
            category: 'System Design',
            createdAt: formatISO(sub(now, {days: 25})),
            revisions: REVISION_DAYS.map((day, index) => ({
                day,
                completed: index < 2, 
                dueDate: formatISO(add(sub(now, {days: 25}), { days: day })),
            }))
        },
        {
            id: '2',
            name: 'Revision in: 5 days',
            category: 'DSA',
            createdAt: formatISO(sub(now, {days: 7})),
            revisions: REVISION_DAYS.map((day, index) => ({
                day,
                completed: index < 1,
                dueDate: formatISO(add(sub(now, {days: 7}), { days: day })),
            }))
        },
         {
            id: '3',
            name: 'Machine Learning',
            category: 'DSA',
            createdAt: formatISO(sub(now, { days: 2 })),
            revisions: REVISION_DAYS.map(day => ({
                day,
                completed: false,
                dueDate: formatISO(add(sub(now, { days: 2 }), { days: day })),
            }))
        },
        {
            id: '4',
            name: 'Theromdynamics',
            category: 'OOPs',
            createdAt: formatISO(sub(now, { days: 2 })),
            revisions: REVISION_DAYS.map(day => ({
                day,
                completed: false,
                dueDate: formatISO(add(sub(now, { days: 2 }), { days: day })),
            }))
        },
        {
            id: '5',
            name: 'Calculus',
            category: 'DSA',
            createdAt: formatISO(sub(now, { days: 2 })),
            revisions: REVISION_DAYS.map(day => ({
                day,
                completed: false,
                dueDate: formatISO(add(sub(now, { days: 2 }), { days: day })),
            }))
        },
    ];
};


export default function Home() {
  const [topics, setTopics] = useLocalStorage<Topic[]>('revision-topics', []);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    if (localStorage.getItem('revision-topics') === null) {
      setTopics(createInitialTopics());
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!isClient) {
    return (
        <div className="flex items-center justify-center min-h-screen bg-background">
            <div className="h-16 w-16 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent"></div>
        </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <MainHeader />
      <main className="flex-1 container mx-auto px-4 py-8">
        <TopicList topics={topics} setTopics={setTopics} />
      </main>
       <AddTopicDialog setTopics={setTopics}>
          <Button className="fixed bottom-6 right-6 h-16 w-16 rounded-full shadow-lg" size="icon">
            <Plus className="h-8 w-8" />
          </Button>
      </AddTopicDialog>
    </div>
  );
}
