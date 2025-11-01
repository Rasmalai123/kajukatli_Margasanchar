'use client';

import * as React from 'react';
import Image from 'next/image';
import { Bus as BusIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import type { Bus, BusStatus } from '@/types';
import { PlaceHolderImages } from '@/lib/placeholder-images';

interface BusMarkerProps {
  bus: Bus;
  position: { top: string; left: string };
}

const statusColors: Record<BusStatus, string> = {
  'On Time': 'bg-green-500',
  'Delayed': 'bg-red-500',
  'Under Maintenance': 'bg-gray-500',
};

function BusMarker({ bus, position }: BusMarkerProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            className="absolute -translate-x-1/2 -translate-y-1/2 transform transition-all duration-1000 ease-in-out"
            style={{ top: position.top, left: position.left }}
          >
            <div className="relative">
              <BusIcon className="h-8 w-8 text-white" fill="black" strokeWidth={1.5} />
              <span
                className={cn(
                  'absolute -right-1 -top-1 block h-3 w-3 rounded-full border-2 border-white',
                  statusColors[bus.status]
                )}
              />
            </div>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p className="font-bold">{bus.id} ({bus.route})</p>
          <p>Status: {bus.status}</p>
          <p>Speed: {bus.speed} km/h</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export default function BusMap({ buses }: { buses: Bus[] }) {
  const [positions, setPositions] = React.useState<Record<string, { top: string; left: string }>>({});
  const mapImage = PlaceHolderImages.find(img => img.id === 'map-background');

  React.useEffect(() => {
    const newPositions: Record<string, { top: string; left: string }> = {};
    buses.forEach(bus => {
      newPositions[bus.id] = {
        top: `${Math.random() * 80 + 10}%`,
        left: `${Math.random() * 90 + 5}%`,
      };
    });
    setPositions(newPositions);
  }, []); // Run once on mount

  if (!mapImage) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Live Bus Map</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative w-full overflow-hidden rounded-lg">
          <Image
            src={mapImage.imageUrl}
            alt={mapImage.description}
            data-ai-hint={mapImage.imageHint}
            width={1200}
            height={400}
            className="w-full object-cover"
          />
          <div className="absolute inset-0 bg-black/10"></div>
          {buses.map(bus => 
            positions[bus.id] && <BusMarker key={bus.id} bus={bus} position={positions[bus.id]} />
          )}
        </div>
      </CardContent>
    </Card>
  );
}
