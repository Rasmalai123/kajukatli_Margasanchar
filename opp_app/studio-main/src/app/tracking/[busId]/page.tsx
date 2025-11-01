"use client";

import { useState, useEffect } from "react";
import { notFound } from "next/navigation";
import { getBusById } from "@/lib/data";
import { AppHeader } from "@/components/app-header";
import { BusFront, MapPin } from "lucide-react";

type TrackingPageProps = {
  params: {
    busId: string;
  };
};

export default function TrackingPage({ params }: TrackingPageProps) {
  const bus = getBusById(params.busId);
  const [position, setPosition] = useState(20); // Starting position as percentage

  useEffect(() => {
    const interval = setInterval(() => {
      setPosition((prev) => (prev >= 80 ? 20 : prev + 5));
    }, 2000); // Update every 2 seconds

    return () => clearInterval(interval);
  }, []);

  if (!bus) {
    notFound();
  }

  const stations = [10, 30, 50, 70, 90]; // Example station positions

  return (
    <div className="flex flex-col h-full">
      <AppHeader title={`Tracking Bus ${bus.number}`} />
      <div className="flex-grow p-6 flex flex-col justify-center">
        <div className="relative w-full bg-gray-200 rounded-lg p-4 h-80 flex flex-col justify-between">
          {/* Map background */}
          <div className="absolute inset-0 bg-slate-200 rounded-lg overflow-hidden">
             <div className="absolute inset-0 bg-[linear-gradient(to_right,theme(colors.slate.300)_1px,transparent_1px),linear-gradient(to_bottom,theme(colors.slate.300)_1px,transparent_1px)] bg-[size:20px_20px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>
          </div>
          
          {/* Route Line */}
          <div className="relative h-full flex items-center">
            <div className="w-full h-1 bg-gray-400/80 rounded-full" />

            {/* Stations */}
            {stations.map((pos) => (
              <div
                key={pos}
                className="absolute w-3 h-3 bg-white border-2 border-gray-500 rounded-full top-1/2 -translate-y-1/2 -translate-x-1/2"
                style={{ left: `${pos}%` }}
              />
            ))}
            
            {/* User Location */}
            <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2" style={{ left: '10%' }}>
                <MapPin className="h-8 w-8 text-blue-600 fill-blue-400" />
                <span className="absolute -bottom-6 -translate-x-1/2 left-1/2 text-xs font-bold whitespace-nowrap">You are here</span>
            </div>

            {/* Bus Icon */}
            <div
              className="absolute top-1/2 -translate-y-1/2 transition-all duration-1000 ease-linear"
              style={{ left: `${position}%` }}
            >
              <div className="relative">
                <div className="bg-primary text-primary-foreground rounded-full p-2 shadow-lg">
                    <BusFront className="h-6 w-6" />
                </div>
                <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-card p-1.5 rounded-md shadow-md text-xs whitespace-nowrap font-semibold">
                  Bus {bus.number} → {bus.eta} away
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
