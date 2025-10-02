"use client";

import { useState, useEffect } from 'react';
import { MainHeader } from '@/components/main-header';
import { TopicList } from '@/components/topic-list';
import type { Topic } from '@/lib/types';
import useLocalStorage from '@/lib/hooks/use-local-storage';
import { add } from 'date-fns';
import { formatISO } from 'date-fns/formatISO';
import { REVISION_DAYS } from '@/lib/types';

const createInitialTopics = (): Topic[] => {
    const now = new Date();
    return [
        {
            id: '1',
            name: 'Binary Search',
            category: 'DSA',
            createdAt: formatISO(now),
            revisions: REVISION_DAYS.map(day => ({
                day,
                completed: day < 12,
                dueDate: formatISO(add(now, { days: day })),
            }))
        },
        {
            id: '2',
            name: 'Singleton Pattern',
            category: 'OOPs',
            createdAt: formatISO(add(now, { days: -10 })),
            revisions: REVISION_DAYS.map(day => ({
                day,
                completed: false,
                dueDate: formatISO(add(add(now, { days: -10 }), { days: day })),
            }))
        },
         {
            id: '3',
            name: 'Load Balancers',
            category: 'System Design',
            createdAt: formatISO(add(now, { days: -30 })),
            revisions: REVISION_DAYS.map(day => ({
                day,
                completed: true,
                dueDate: formatISO(add(add(now, { days: -30 }), { days: day })),
            }))
        }
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
    <div className="flex flex-col min-h-screen bg-background">
      <MainHeader setTopics={setTopics} />
      <main className="flex-1 container mx-auto px-4 py-8">
        <TopicList topics={topics} setTopics={setTopics} />
      </main>
    </div>
  );
}
