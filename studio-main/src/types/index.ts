export type BusStatus = 'On Time' | 'Delayed' | 'Under Maintenance';
export type CrowdLevel = 'Low' | 'Medium' | 'High';

export interface Bus {
  id: string;
  route: string;
  lat: number;
  lon: number;
  eta: string;
  crowd: CrowdLevel;
  status: BusStatus;
  speed: number;
  lastSeen: string;
}

export interface Station {
  id: string;
  name: string;
}

export interface Alert {
  id: string;
  route: string;
  message: string;
  time: Date;
}
