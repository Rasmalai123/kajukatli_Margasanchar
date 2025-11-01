"use client";

import { useState, useRef, useEffect } from 'react';
import { AppHeader } from '@/components/app-header';
import { Button } from '@/components/ui/button';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { DirectionSelectionModal } from '@/components/direction-selection-modal';
import { useToast } from '@/hooks/use-toast';
import { Camera } from 'lucide-react';

export default function QrScanPage() {
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    const getCameraPermission = async () => {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        console.error('Camera API not supported in this browser.');
        setHasCameraPermission(false);
        toast({
          variant: 'destructive',
          title: 'Unsupported Browser',
          description: 'Your browser does not support camera access.',
        });
        return;
      }

      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        setHasCameraPermission(true);

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error('Error accessing camera:', error);
        setHasCameraPermission(false);
        toast({
          variant: 'destructive',
          title: 'Camera Access Denied',
          description: 'Please enable camera permissions in your browser settings to use this app.',
        });
      }
    };

    getCameraPermission();
    
    return () => {
      // Stop camera stream when component unmounts
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    }
  }, [toast]);

  const handleScan = () => {
    setModalOpen(true);
  };

  return (
    <div className="flex flex-col h-full bg-slate-900">
      <AppHeader title="Scan QR Code" />
      <DirectionSelectionModal isOpen={isModalOpen} onOpenChange={setModalOpen} />

      <div className="flex-grow flex flex-col items-center justify-center p-4 text-white">
        <div className="w-full max-w-sm aspect-square bg-gray-800/50 rounded-2xl overflow-hidden relative border-4 border-gray-600 shadow-2xl">
          <video ref={videoRef} className="w-full h-full object-cover" autoPlay muted playsInline />
          
          {hasCameraPermission === false && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 p-4">
              <Camera className="h-16 w-16 text-red-500 mb-4" />
              <Alert variant="destructive">
                <AlertTitle>Camera Access Required</AlertTitle>
                <AlertDescription>
                  Please allow camera access to use this feature. Check your browser settings.
                </AlertDescription>
              </Alert>
            </div>
          )}

           {hasCameraPermission === null && (
             <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70">
                <p>Requesting Camera Access...</p>
             </div>
           )}
        </div>
        
        <p className="mt-4 text-center text-muted-foreground">Position the QR code inside the frame.</p>
      </div>

      <div className="p-4 border-t border-gray-800 bg-slate-900">
        <Button
          size="lg"
          className="w-full"
          onClick={handleScan}
          disabled={!hasCameraPermission}
        >
          Simulate Scan
        </Button>
      </div>
    </div>
  );
}
