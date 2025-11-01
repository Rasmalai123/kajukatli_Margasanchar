"use client";

import * as React from 'react';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartConfig,
} from '@/components/ui/chart';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { predictPassengerDemand, PredictPassengerDemandOutput } from '@/ai/flows/predict-passenger-demand';
import type { Station } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';
import { TrendingUp, Users } from 'lucide-react';

const chartConfig = {
  passengers: {
    label: 'Passengers',
    color: 'hsl(var(--primary))',
  },
} satisfies ChartConfig;

interface PredictionChartProps {
  stations: Station[];
}

export default function PredictionChart({ stations }: PredictionChartProps) {
  const [selectedStation, setSelectedStation] = React.useState<string>(stations[0].name);
  const [prediction, setPrediction] = React.useState<PredictPassengerDemandOutput | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function fetchPrediction() {
      if (selectedStation) {
        setLoading(true);
        try {
          const result = await predictPassengerDemand({ station: selectedStation });
          setPrediction(result);
        } catch (error) {
          console.error("Failed to fetch prediction:", error);
          setPrediction(null);
        } finally {
          setLoading(false);
        }
      }
    }
    fetchPrediction();
  }, [selectedStation]);

  const chartData = prediction
    ? [
        { interval: '15 min', passengers: prediction.predicted_passengers_15min },
        { interval: '60 min', passengers: prediction.predicted_passengers_60min },
      ]
    : [];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Passenger Demand Prediction</CardTitle>
        <CardDescription>Forecasted passenger volume for selected stations.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Select value={selectedStation} onValueChange={setSelectedStation}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a station" />
          </SelectTrigger>
          <SelectContent>
            {stations.map(station => (
              <SelectItem key={station.id} value={station.name}>
                {station.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {loading ? (
          <div className="space-y-2">
            <Skeleton className="h-48 w-full" />
            <div className="flex justify-between">
              <Skeleton className="h-8 w-1/3" />
              <Skeleton className="h-8 w-1/3" />
            </div>
          </div>
        ) : prediction ? (
          <ChartContainer config={chartConfig} className="h-48 w-full">
            <BarChart accessibilityLayer data={chartData}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="interval"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
              />
              <YAxis hide />
              <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
              <Bar dataKey="passengers" fill="var(--color-passengers)" radius={8} />
            </BarChart>
          </ChartContainer>
        ) : (
          <div className="flex h-48 items-center justify-center text-muted-foreground">
            Could not load prediction data.
          </div>
        )}
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
         {loading ? (
           <Skeleton className="h-6 w-4/5" />
         ) : prediction ? (
           <div className="flex gap-2 font-medium leading-none">
             <TrendingUp className="h-4 w-4 text-accent" />
             Peak Probability: {Math.round(prediction.peak_probability * 100)}%
           </div>
         ) : null}
      </CardFooter>
    </Card>
  );
}
