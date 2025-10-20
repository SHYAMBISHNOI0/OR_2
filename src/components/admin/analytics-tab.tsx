'use client';
import {
  Car,
  Clock,
  Users,
  CheckCircle,
} from 'lucide-react';
import { StatCard } from '@/components/shared/stat-card';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartConfig,
} from '@/components/ui/chart';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import { summarizeRideHistory } from '@/ai/flows/summarize-ride-history';
import { rideHistoryForSummary, MOCK_RIDES } from '@/lib/data';
import { useEffect, useState } from 'react';
import type { SummarizeRideHistoryOutput } from '@/ai/flows/summarize-ride-history';
import { Button } from '../ui/button';

const chartData = [
  { month: 'January', rides: 186 },
  { month: 'February', rides: 305 },
  { month: 'March', rides: 237 },
  { month: 'April', rides: 273 },
  { month: 'May', rides: 209 },
  { month: 'June', rides: 214 },
];

const chartConfig = {
  rides: {
    label: 'Rides',
    color: 'hsl(var(--primary))',
  },
} satisfies ChartConfig;

export default function AnalyticsTab() {
  const [summary, setSummary] = useState<SummarizeRideHistoryOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerateSummary = async () => {
    setIsLoading(true);
    try {
      const result = await summarizeRideHistory({ rideHistory: rideHistoryForSummary });
      setSummary(result);
    } catch (error) {
      console.error("Failed to generate summary", error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Rides"
          value={MOCK_RIDES.length.toString()}
          description="Total rides completed and scheduled"
          icon={Car}
        />
        <StatCard
          title="Active Drivers"
          value="2"
          description="Drivers currently available"
          icon={Users}
        />
        <StatCard
          title="Avg. Wait Time"
          value="12m"
          description="Average patient wait time"
          icon={Clock}
        />
        <StatCard
          title="Completion Rate"
          value="98.2%"
          description="Percentage of completed rides"
          icon={CheckCircle}
        />
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Rides Overview</CardTitle>
            <CardDescription>Monthly ride volume over the last 6 months.</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <ChartContainer config={chartConfig} className="min-h-[350px] w-full">
              <BarChart data={chartData}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                />
                <YAxis />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent indicator="dot" />}
                />
                <Bar dataKey="rides" fill="var(--color-rides)" radius={4} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
        <Card className="col-span-4 lg:col-span-3">
          <CardHeader>
            <CardTitle>AI-Powered Ride Analysis</CardTitle>
            <CardDescription>
              Generate an AI summary of ride history to find patterns.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {summary ? (
              <div className="space-y-4 text-sm">
                <div>
                  <h4 className="font-semibold">Summary</h4>
                  <p className="text-muted-foreground">{summary.summary}</p>
                </div>
                <div>
                  <h4 className="font-semibold">Common Destinations</h4>
                  <p className="text-muted-foreground">{summary.commonDestinations}</p>
                </div>
                <div>
                  <h4 className="font-semibold">Potential Savings</h4>
                  <p className="text-muted-foreground">{summary.potentialSavings}</p>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-48 border-2 border-dashed rounded-lg">
                <p className="text-muted-foreground">Click below to generate summary.</p>
              </div>
            )}
            <Button onClick={handleGenerateSummary} disabled={isLoading} className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/80">
              {isLoading ? 'Generating...' : 'Generate Ride Summary'}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
