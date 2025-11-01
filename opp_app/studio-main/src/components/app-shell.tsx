import { cn } from "@/lib/utils";
import type { ReactNode } from "react";
import { AppFooter } from "./app-footer";

export function AppShell({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className="bg-background">
      <div
        className={cn(
          "mx-auto flex min-h-dvh w-full max-w-md flex-col bg-card font-body shadow-2xl",
          className
        )}
      >
        <div className="flex-grow flex flex-col">
          {children}
        </div>
        <AppFooter />
      </div>
    </div>
  );
}
