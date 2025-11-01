"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export function AppHeader({ title }: { title: string }) {
  const router = useRouter();

  return (
    <header className="flex items-center p-4 border-b sticky top-0 bg-card/80 backdrop-blur-sm z-10">
      <Button variant="ghost" size="icon" onClick={() => router.back()} className="mr-2 shrink-0">
        <ArrowLeft className="h-5 w-5" />
      </Button>
      <h1 className="text-lg font-bold truncate">{title}</h1>
    </header>
  );
}
