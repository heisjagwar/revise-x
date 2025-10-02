"use client";

import { Lightbulb } from 'lucide-react';
import { useTheme } from '@/components/providers/theme-provider';
import { Button } from '@/components/ui/button';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      aria-label="Toggle theme"
    >
      <Lightbulb className={`h-6 w-6 ${theme === 'light' ? 'text-yellow-400 fill-yellow-400' : 'text-muted-foreground'}`} />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
