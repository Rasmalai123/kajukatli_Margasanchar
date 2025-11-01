"use client";

import { useActionState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { destinations } from "@/lib/data";
import { getBestBusSuggestion } from "@/app/actions";
import { Route, Bus } from "lucide-react";

const initialState = {
  suggestion: null,
  error: null,
};

export function TripPlanner() {
  const [state, formAction] = useActionState(getBestBusSuggestion, initialState);

  return (
    <Card className="border-2 border-primary/20 shadow-lg">
      <CardHeader>
        <div className="flex items-center gap-2 mb-2">
           <Route className="h-6 w-6 text-primary" />
           <CardTitle>Trip Planner</CardTitle>
        </div>
        <CardDescription>
          Find the best bus for your trip instantly.
        </CardDescription>
      </CardHeader>
      <form action={formAction}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="from-destination">From</Label>
            <Select name="origin" defaultValue="Main Bazaar" disabled>
              <SelectTrigger id="from-destination">
                <SelectValue placeholder="Select origin" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Main Bazaar">Main Bazaar</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="to-destination">To</Label>
            <Select name="destination" required>
              <SelectTrigger id="to-destination">
                <SelectValue placeholder="Select destination" />
              </SelectTrigger>
              <SelectContent>
                {destinations.map((dest) => (
                  <SelectItem key={dest.name} value={dest.name}>
                    {dest.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
        <CardFooter className="flex-col items-stretch">
          <Button type="submit" className="w-full">
            <Route className="mr-2 h-4 w-4" />
            Find Best Bus
          </Button>

          {state?.suggestion && (
            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg text-center">
              <p className="font-semibold text-green-800">Best Bus Found!</p>
              <p className="text-green-700 flex items-center justify-center gap-2 mt-1">
                <Bus className="h-4 w-4" />
                Bus <span className="font-bold">{state.suggestion.bestBus}</span> (ETA: {state.suggestion.eta})
              </p>
            </div>
          )}

          {state?.error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-center">
                <p className="font-semibold text-destructive">{state.error}</p>
            </div>
          )}
        </CardFooter>
      </form>
    </Card>
  );
}
