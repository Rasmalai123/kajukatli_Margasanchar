"use client";

import * as React from 'react';
import type { Bus } from '@/types';
import { initialBuses, stations } from '@/data/mock-data';
import Header from '@/app/components/dashboard/Header';
import BusMap from '@/app/components/dashboard/BusMap';
import BusTable from '@/app/components/dashboard/BusTable';
import PredictionChart from '@/app/components/dashboard/PredictionChart';
import BroadcastAlert from '@/app/components/dashboard/BroadcastAlert';

export default function DashboardPage() {
  const [buses, setBuses] = React.useState<Bus[]>(initialBuses);

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <Header />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <BusMap buses={buses} />
        <div className="grid gap-4 md:gap-8 lg:grid-cols-5">
          <div className="lg:col-span-3">
            <BusTable buses={buses} setBuses={setBuses} />
          </div>
          <div className="lg:col-span-2 flex flex-col gap-4 md:gap-8">
            <PredictionChart stations={stations} />
            <BroadcastAlert />
          </div>
        </div>
      </main>
    </div>
  );
}
