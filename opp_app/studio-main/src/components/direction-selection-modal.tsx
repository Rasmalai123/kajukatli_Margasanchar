"use client";

import { useRouter } from 'next/navigation';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { destinations } from '@/lib/data';

type DirectionSelectionModalProps = {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
};

export function DirectionSelectionModal({ isOpen, onOpenChange }: DirectionSelectionModalProps) {
  const router = useRouter();

  const handleSelection = (direction: string) => {
    router.push(`/buses/${encodeURIComponent(direction)}`);
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Select where you are going</DialogTitle>
          <DialogDescription>
            Choose your destination to see available buses.
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4 py-4">
          {destinations.map((dest) => (
            <Button
              key={dest.name}
              variant="outline"
              className="h-24 flex-col gap-2"
              onClick={() => handleSelection(dest.name)}
            >
              <dest.icon className="h-8 w-8 text-primary" />
              <span className="text-center">{dest.name}</span>
            </Button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
