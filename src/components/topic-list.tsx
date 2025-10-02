"use client";

import { TopicCard } from '@/components/topic-card';
import type { Topic } from '@/lib/types';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { useState } from 'react';
import { CATEGORIES } from '@/lib/types';
import { Search, SlidersHorizontal } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuSeparator, DropdownMenuTrigger } from './ui/dropdown-menu';

interface TopicListProps {
  topics: Topic[];
  setTopics: (topics: Topic[] | ((prev: Topic[]) => Topic[])) => void;
}

export function TopicList({ topics, setTopics }: TopicListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('All');
  const [sort, setSort] = useState('date-desc');


  const filteredAndSortedTopics = topics
    .filter(topic => 
      topic.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (filter === 'All' || topic.category === filter)
    )
    .sort((a, b) => {
        if (sort === 'date-asc') return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        if (sort === 'date-desc') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        if (sort === 'name-asc') return a.name.localeCompare(b.name);
        if (sort === 'name-desc') return b.name.localeCompare(a.name);
        return 0;
    });

  if (topics.length === 0 && searchTerm === '' && filter === 'All') {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-semibold text-card-foreground/80">No topics yet!</h2>
        <p className="text-muted-foreground mt-2">Click the "+" button to get started.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
        <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input 
                    placeholder="Search topics..." 
                    className="bg-card pl-10" 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <div className='flex gap-2'>
                 <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="w-full sm:w-auto">
                            <SlidersHorizontal className="mr-2 h-4 w-4" />
                            Filter / Sort
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56">
                        <DropdownMenuLabel>Filter by Category</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuRadioGroup value={filter} onValueChange={setFilter}>
                            <DropdownMenuRadioItem value="All">All</DropdownMenuRadioItem>
                            {CATEGORIES.map(cat => (
                                <DropdownMenuRadioItem key={cat} value={cat}>{cat}</DropdownMenuRadioItem>
                            ))}
                        </DropdownMenuRadioGroup>
                        <DropdownMenuSeparator />
                        <DropdownMenuLabel>Sort by</DropdownMenuLabel>
                        <DropdownMenuRadioGroup value={sort} onValueChange={setSort}>
                            <DropdownMenuRadioItem value="date-desc">Date (Newest)</DropdownMenuRadioItem>
                            <DropdownMenuRadioItem value="date-asc">Date (Oldest)</DropdownMenuRadioItem>
                            <DropdownMenuRadioItem value="name-asc">Name (A-Z)</DropdownMenuRadioItem>
                            <DropdownMenuRadioItem value="name-desc">Name (Z-A)</DropdownMenuRadioItem>
                        </DropdownMenuRadioGroup>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
        {filteredAndSortedTopics.length > 0 ? (
            <div className="space-y-4">
                {filteredAndSortedTopics.map(topic => (
                    <TopicCard key={topic.id} topic={topic} setTopics={setTopics} />
                ))}
            </div>
        ) : (
            <div className="text-center py-20">
                <h2 className="text-2xl font-semibold text-card-foreground/80">No results found</h2>
                <p className="text-muted-foreground mt-2">Try adjusting your search or filters.</p>
            </div>
        )}
    </div>
  );
}
