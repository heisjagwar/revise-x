"use client";

import { BrainCircuit, LineChart } from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';
import Link from 'next/link';
import { Button } from './ui/button';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

export function MainHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/95 backdrop-blur-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-3">
            <BrainCircuit className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Recall
            </h1>
        </Link>
        <div className="flex items-center gap-2">
            <nav className="hidden sm:flex items-center gap-2">
                 <Button asChild variant={pathname === '/stats' ? 'secondary' : 'ghost'} size="sm">
                    <Link href="/stats">
                        <LineChart className="h-4 w-4 mr-2" />
                        Stats
                    </Link>
                </Button>
            </nav>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
