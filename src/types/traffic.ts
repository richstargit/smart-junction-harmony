export type TrafficLightState = 'red' | 'yellow' | 'green';

export type TrafficDirection = 'north' | 'south' | 'east' | 'west';

export interface TrafficLane {
  direction: TrafficDirection;
  state: TrafficLightState;
  vehicleCount: number;
  waitTime: number; // seconds
  aiRecommendation?: TrafficLightState;
}

export interface Intersection {
  id: string;
  name: string;
  location: {
    lat: number;
    lng: number;
  };
  lanes: Record<TrafficDirection, TrafficLane>;
  mode: 'ai-auto' | 'manual-with-ai' | 'full-manual';
  status: 'online' | 'offline' | 'warning';
  totalVehicles: number;
  estimatedWaitMinutes: number;
}

export interface TrafficData {
  intersections: Intersection[];
  selectedIntersection: string | null;
}

export const DIRECTION_LABELS: Record<TrafficDirection, string> = {
  north: 'ทิศเหนือ',
  south: 'ทิศใต้',
  east: 'ทิศตะวันออก',
  west: 'ทิศตะวันตก'
};

export const MODE_LABELS = {
  'ai-auto': 'AI ควบคุมอัตโนมัติ',
  'manual-with-ai': 'Manual + AI แนะนำ',
  'full-manual': 'ควบคุมเอง'
};
