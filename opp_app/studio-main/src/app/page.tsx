"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { DirectionSelectionModal } from '@/components/direction-selection-modal';
import { TripPlanner } from '@/components/trip-planner';
import { BusFront, QrCode, WifiOff } from 'lucide-react';

export default function Home() {
  const [isModalOpen, setModalOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Auto open modal on page load
    const timer = setTimeout(() => setModalOpen(true), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex flex-col h-full">
      <DirectionSelectionModal isOpen={isModalOpen} onOpenChange={setModalOpen} />
      
      <div className="flex flex-col items-center justify-center text-center p-8 pt-16 flex-grow bg-gradient-to-b from-accent/30 to-card">
        <div className="p-4 bg-primary/10 rounded-full mb-6">
          <BusFront className="h-12 w-12 text-primary" />
        </div>
        <h1 className="text-4xl font-bold text-slate-800 font-headline">
          MargaSanchār
        </h1>
        <p className="text-muted-foreground mt-2">
          Inclusive Mobility for Tier-2 & Tier-3 Cities.
        </p>
        <div className="mt-12 w-full max-w-xs space-y-4">
          <Button 
            size="lg" 
            className="w-full" 
            onClick={() => setModalOpen(true)}
          >
            Start →
          </Button>
          <Button 
            size="lg" 
            variant="outline"
            className="w-full" 
            onClick={() => router.push('/qr-scan')}
          >
            <QrCode className="mr-2" />
            Scan QR Code
          </Button>
          <Button 
            size="lg" 
            variant="outline"
            className="w-full"
            onClick={() => router.push('/offline')}
          >
            <WifiOff className="mr-2" />
            Offline Query
          </Button>
        </div>
      </div>

      <div className="p-6 bg-card rounded-t-2xl -mt-4">
        <TripPlanner />
      </div>
    </div>
  );
}
