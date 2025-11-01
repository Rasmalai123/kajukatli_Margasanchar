import Link from "next/link";
import { notFound } from "next/navigation";
import { getBusesByDestination, Bus as BusType } from "@/lib/data";
import { AppHeader } from "@/components/app-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CrowdLevel } from "@/components/crowd-level";
import { Clock, ArrowRight } from "lucide-react";

type BusListPageProps = {
  params: {
    direction: string;
  };
};

function BusCard({ bus }: { bus: BusType }) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span className="text-2xl font-bold">Bus {bus.number}</span>
          <CrowdLevel level={bus.crowd} />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center text-muted-foreground mb-4">
          <Clock className="h-4 w-4 mr-2" />
          <span>ETA: {bus.eta}</span>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline" className="w-full">
            <Link href="#">View Info</Link>
          </Button>
          <Button asChild className="w-full">
            <Link href={`/tracking/${bus.id}`}>
              Live Tracking
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default function BusListPage({ params }: BusListPageProps) {
  const direction = decodeURIComponent(params.direction);
  const buses = getBusesByDestination(direction);

  if (buses.length === 0) {
    // Or show a "No buses found" message
    notFound();
  }

  return (
    <div className="flex flex-col h-full bg-slate-50">
      <AppHeader title={`Buses to ${direction}`} />
      <div className="p-4 space-y-4 flex-grow overflow-y-auto">
        <p className="text-sm text-muted-foreground px-2">
            Showing buses from <span className="font-semibold text-foreground">Main Bazaar</span>
        </p>
        {buses.map((bus) => (
          <BusCard key={bus.id} bus={bus} />
        ))}
      </div>
    </div>
  );
}
