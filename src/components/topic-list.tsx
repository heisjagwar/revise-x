"use client";

import { TopicCard } from '@/components/topic-card';
import type { Topic } from '@/lib/types';
import { Button } from './ui/button';
import { Input } from './ui/input';

interface TopicListProps {
  topics: Topic[];
  setTopics: (topics: Topic[] | ((prev: Topic[]) => Topic[])) => void;
}

export function TopicList({ topics, setTopics }: TopicListProps) {
  if (topics.length === 0) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-semibold text-card-foreground/80">No topics yet!</h2>
        <p className="text-muted-foreground mt-2">Click the "+" button to get started.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
        <div className="flex gap-2">
            <Button variant="secondary" className="bg-primary hover:bg-primary/90 text-primary-foreground">Day Mode</Button>
            <Button variant="secondary">Night Mode</Button>
        </div>
        <Input placeholder="Search topics..." className="bg-card" />
        <div className="space-y-4">
            {topics.map(topic => (
                <TopicCard key={topic.id} topic={topic} setTopics={setTopics} />
            ))}
        </div>
    </div>
  );
}
