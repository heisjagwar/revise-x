"use client"

import { Bar, BarChart, CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import type { Topic } from "@/lib/types"
import { eachDayOfInterval, format, parseISO, startOfWeek, endOfWeek, isWithinInterval, subDays } from "date-fns"
import { useTheme } from "next-themes"
import { useMemo } from "react"
import { ChartConfig, ChartContainer, ChartTooltipContent } from "./ui/chart"

interface StatsChartsProps {
    topics: Topic[];
}

const chartConfigCategory = {
  topics: {
    label: "Topics",
  },
  DSA: {
    label: "DSA",
    color: "hsl(var(--chart-1))",
  },
  "System Design": {
    label: "System Design",
    color: "hsl(var(--chart-2))",
  },
  OOPs: {
    label: "OOPs",
    color: "hsl(var(--chart-3))",
  },
} satisfies ChartConfig

const chartConfigRevisions = {
  revisions: {
    label: "Revisions",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig

export function StatsCharts({ topics }: StatsChartsProps) {
    const { theme } = useTheme()

    const categoryData = useMemo(() => {
        const counts = topics.reduce((acc, topic) => {
            acc[topic.category] = (acc[topic.category] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        return [{
            name: "Categories",
            ...counts
        }];
    }, [topics]);

    const revisionData = useMemo(() => {
        const today = new Date();
        const last7Days = eachDayOfInterval({
            start: subDays(today, 6),
            end: today,
        });

        const revisionCounts = last7Days.map(day => {
            const dayString = format(day, 'yyyy-MM-dd');
            const revisionsOnDay = topics.reduce((acc, topic) => {
                return acc + topic.revisions.filter(rev => rev.completed && format(parseISO(rev.dueDate), 'yyyy-MM-dd') === dayString).length;
            }, 0);
            return {
                date: format(day, 'MMM d'),
                revisions: revisionsOnDay,
            };
        });

        return revisionCounts;
    }, [topics]);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
                <CardHeader>
                    <CardTitle>Topics by Category</CardTitle>
                    <CardDescription>Distribution of your study topics across different categories.</CardDescription>
                </CardHeader>
                <CardContent>
                   <ChartContainer config={chartConfigCategory} className="min-h-[200px] w-full">
                        <BarChart accessibilityLayer data={categoryData} margin={{ top: 20 }}>
                            <CartesianGrid vertical={false} />
                            <XAxis
                                dataKey="name"
                                tickLine={false}
                                tickMargin={10}
                                axisLine={false}
                            />
                            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                            <Legend />
                            <Bar dataKey="DSA" stackId="a" fill="var(--color-DSA)" radius={[4, 4, 0, 0]} />
                            <Bar dataKey="System Design" stackId="a" fill="var(--color-System Design)" radius={[4, 4, 0, 0]} />
                            <Bar dataKey="OOPs" stackId="a" fill="var(--color-OOPs)" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ChartContainer>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Revisions This Week</CardTitle>
                    <CardDescription>Number of revisions completed over the last 7 days.</CardDescription>
                </CardHeader>
                <CardContent>
                    <ChartContainer config={chartConfigRevisions} className="min-h-[200px] w-full">
                         <LineChart accessibilityLayer data={revisionData} margin={{ left: 12, right: 12 }}>
                            <CartesianGrid vertical={false} />
                             <XAxis
                                dataKey="date"
                                tickLine={false}
                                axisLine={false}
                                tickMargin={8}
                            />
                            <ChartTooltip content={<ChartTooltipContent indicator="dot" />} />
                            <Line
                                dataKey="revisions"
                                type="monotone"
                                stroke="var(--color-revisions)"
                                strokeWidth={2}
                                dot={{
                                    fill: "var(--color-revisions)",
                                }}
                                activeDot={{
                                    r: 6,
                                }}
                            />
                        </LineChart>
                    </ChartContainer>
                </CardContent>
            </Card>
        </div>
    );
}
