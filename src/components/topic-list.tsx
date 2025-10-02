"use client";

import { TopicCard } from '@/components/topic-card';
import type { Topic } from '@/lib/types';

interface TopicListProps {
  topics: Topic[];
  setTopics: (topics: Topic[] | ((prev: Topic[]) => Topic[])) => void;
}

export function TopicList({ topics, setTopics }: TopicListProps) {
  if (topics.length === 0) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-semibold text-card-foreground/80">No topics yet!</h2>
        <p className="text-muted-foreground mt-2">Click "Add Topic" to get started.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {topics.map(topic => (
        <TopicCard key={topic.id} topic={topic} setTopics={setTopics} />
      ))}
    </div>
  );
}
