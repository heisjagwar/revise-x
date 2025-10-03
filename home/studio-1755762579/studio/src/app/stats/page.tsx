"use client";

import { MainHeader } from "@/components/main-header";
import { StatsCharts } from "@/components/stats-charts";
import useLocalStorage from "@/lib/hooks/use-local-storage";
import type { Topic } from "@/lib/types";
import { useEffect, useState } from "react";

export default function StatsPage() {
    const [topics] = useLocalStorage<Topic[]>('revision-topics', []);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
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
                <div className="space-y-8">
                    <div className="space-y-2">
                        <h1 className="text-3xl font-bold tracking-tight">Your Statistics</h1>
                        <p className="text-muted-foreground">A look at your revision progress and habits.</p>
                    </div>
                    <StatsCharts topics={topics} />
                </div>
            </main>
        </div>
    );
}
