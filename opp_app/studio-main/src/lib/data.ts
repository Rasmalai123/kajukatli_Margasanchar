import type { LucideIcon } from "lucide-react";
import { Train, GraduationCap, ShoppingCart, BusFront, Building } from "lucide-react";

export type Destination = {
  name: "Station Rd" | "College" | "Market" | "Bus Depot" | "Mall Circle";
  icon: LucideIcon;
};

export const destinations: Destination[] = [
  { name: "Station Rd", icon: Train },
  { name: "College", icon: GraduationCap },
  { name: "Market", icon: ShoppingCart },
  { name: "Bus Depot", icon: BusFront },
  { name: "Mall Circle", icon: Building },
];

export type CrowdLevel = "Low" | "Medium" | "High";

export type Bus = {
  id: string;
  number: number;
  eta: string;
  crowd: CrowdLevel;
  destination: Destination["name"];
};

export const buses: Bus[] = [
  { id: "12-sr", number: 12, eta: "3 min", crowd: "Medium", destination: "Station Rd" },
  { id: "45-sr", number: 45, eta: "9 min", crowd: "Low", destination: "Station Rd" },
  { id: "22-sr", number: 22, eta: "17 min", crowd: "High", destination: "Station Rd" },

  { id: "101-c", number: 101, eta: "5 min", crowd: "Low", destination: "College" },
  { id: "102-c", number: 102, eta: "12 min", crowd: "High", destination: "College" },
  { id: "103-c", number: 103, eta: "20 min", crowd: "Medium", destination: "College" },

  { id: "20-m", number: 20, eta: "2 min", crowd: "High", destination: "Market" },
  { id: "25-m", number: 25, eta: "8 min", crowd: "Medium", destination: "Market" },
  { id: "30-m", number: 30, eta: "15 min", crowd: "Low", destination: "Market" },

  { id: "1-bd", number: 1, eta: "6 min", crowd: "Low", destination: "Bus Depot" },
  { id: "2-bd", number: 2, eta: "14 min", crowd: "Medium", destination: "Bus Depot" },

  { id: "501-mc", number: 501, eta: "11 min", crowd: "Medium", destination: "Mall Circle" },
  { id: "505-mc", number: 505, eta: "25 min", crowd: "High", destination: "Mall Circle" },
];

export const getBusesByDestination = (destination: string): Bus[] => {
  return buses.filter(bus => bus.destination === destination);
};

export const getBusById = (id: string): Bus | undefined => {
  return buses.find(bus => bus.id === id);
};
