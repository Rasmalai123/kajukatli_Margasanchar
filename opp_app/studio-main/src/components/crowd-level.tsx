import { Users, User, Smile } from "lucide-react";
import { cn } from "@/lib/utils";
import type { CrowdLevel as CrowdLevelType } from "@/lib/data";

const crowdConfig: Record<CrowdLevelType, { icon: React.ReactNode; className: string }> = {
  Low: { icon: <Smile className="h-5 w-5"/>, className: "text-green-600" },
  Medium: { icon: <User className="h-5 w-5"/>, className: "text-orange-500" },
  High: { icon: <Users className="h-5 w-5"/>, className: "text-red-600" },
};

export function CrowdLevel({ level }: { level: CrowdLevelType }) {
  const config = crowdConfig[level];
  if (!config) return null;

  return (
    <div className={cn("flex items-center gap-1.5 text-sm font-medium", config.className)}>
      {config.icon}
      <span className="hidden sm:inline">{level}</span>
    </div>
  );
}
