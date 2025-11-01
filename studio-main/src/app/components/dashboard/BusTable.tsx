'use client';

import * as React from 'react';
import type { Bus, BusStatus, CrowdLevel } from '@/types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

const statusVariants: Record<BusStatus, string> = {
  'On Time': 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300 border-green-200 dark:border-green-800',
  'Delayed': 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300 border-red-200 dark:border-red-800',
  'Under Maintenance': 'bg-gray-100 text-gray-800 dark:bg-gray-800/50 dark:text-gray-300 border-gray-200 dark:border-gray-700',
};

const crowdVariants: Record<CrowdLevel, string> = {
  'Low': 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300 border-blue-200 dark:border-blue-800',
  'Medium': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800',
  'High': 'bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-300 border-orange-200 dark:border-orange-800',
};

interface BusTableProps {
  buses: Bus[];
  setBuses: React.Dispatch<React.SetStateAction<Bus[]>>;
}

export default function BusTable({ buses, setBuses }: BusTableProps) {
  const handleStatusChange = (busId: string, newStatus: BusStatus) => {
    setBuses(currentBuses =>
      currentBuses.map(bus =>
        bus.id === busId ? { ...bus, status: newStatus } : bus
      )
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Fleet Status</CardTitle>
        <CardDescription>
          Live overview of all buses in operation.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Bus No.</TableHead>
              <TableHead>Route</TableHead>
              <TableHead>Occupancy</TableHead>
              <TableHead>Speed</TableHead>
              <TableHead>Last Seen</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {buses.map(bus => (
              <TableRow key={bus.id}>
                <TableCell className="font-medium">{bus.id}</TableCell>
                <TableCell>{bus.route}</TableCell>
                <TableCell>
                   <Badge variant="outline" className={cn('font-normal', crowdVariants[bus.crowd])}>
                    {bus.crowd}
                  </Badge>
                </TableCell>
                <TableCell>{bus.speed} km/h</TableCell>
                <TableCell>{bus.lastSeen}</TableCell>
                <TableCell>
                  <Select
                    value={bus.status}
                    onValueChange={(value: BusStatus) => handleStatusChange(bus.id, value)}
                  >
                    <SelectTrigger className={cn('h-8 w-[150px]', statusVariants[bus.status])}>
                      <SelectValue placeholder="Set Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="On Time">On Time</SelectItem>
                      <SelectItem value="Delayed">Delayed</SelectItem>
                      <SelectItem value="Under Maintenance">Under Maintenance</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
