import { useState, useEffect, useCallback } from 'react';
import { Intersection, TrafficDirection, TrafficLightState } from '@/types/traffic';

const MOCK_INTERSECTIONS: Intersection[] = [
  {
    id: 'int-001',
    name: 'แยกอโศก',
    location: { lat: 13.7380, lng: 100.5603 },
    lanes: {
      north: { direction: 'north', state: 'red', vehicleCount: 12, waitTime: 45 },
      south: { direction: 'south', state: 'red', vehicleCount: 8, waitTime: 45 },
      east: { direction: 'east', state: 'green', vehicleCount: 5, waitTime: 0 },
      west: { direction: 'west', state: 'red', vehicleCount: 15, waitTime: 30 }
    },
    mode: 'ai-auto',
    status: 'online',
    totalVehicles: 40,
    estimatedWaitMinutes: 3
  },
  {
    id: 'int-002',
    name: 'แยกสยาม',
    location: { lat: 13.7461, lng: 100.5347 },
    lanes: {
      north: { direction: 'north', state: 'green', vehicleCount: 20, waitTime: 0 },
      south: { direction: 'south', state: 'red', vehicleCount: 10, waitTime: 60 },
      east: { direction: 'east', state: 'red', vehicleCount: 18, waitTime: 45 },
      west: { direction: 'west', state: 'red', vehicleCount: 7, waitTime: 45 }
    },
    mode: 'manual-with-ai',
    status: 'online',
    totalVehicles: 55,
    estimatedWaitMinutes: 4
  },
  {
    id: 'int-003',
    name: 'แยกราชประสงค์',
    location: { lat: 13.7468, lng: 100.5399 },
    lanes: {
      north: { direction: 'north', state: 'red', vehicleCount: 25, waitTime: 90 },
      south: { direction: 'south', state: 'red', vehicleCount: 22, waitTime: 90 },
      east: { direction: 'east', state: 'green', vehicleCount: 8, waitTime: 0 },
      west: { direction: 'west', state: 'red', vehicleCount: 12, waitTime: 60 }
    },
    mode: 'ai-auto',
    status: 'warning',
    totalVehicles: 67,
    estimatedWaitMinutes: 6
  },
  {
    id: 'int-004',
    name: 'แยกพร้อมพงษ์',
    location: { lat: 13.7308, lng: 100.5695 },
    lanes: {
      north: { direction: 'north', state: 'red', vehicleCount: 5, waitTime: 30 },
      south: { direction: 'south', state: 'green', vehicleCount: 3, waitTime: 0 },
      east: { direction: 'east', state: 'red', vehicleCount: 8, waitTime: 45 },
      west: { direction: 'west', state: 'red', vehicleCount: 6, waitTime: 45 }
    },
    mode: 'ai-auto',
    status: 'online',
    totalVehicles: 22,
    estimatedWaitMinutes: 2
  }
];

export function useTrafficData() {
  const [intersections, setIntersections] = useState<Intersection[]>(MOCK_INTERSECTIONS);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setIntersections(prev => prev.map(intersection => ({
        ...intersection,
        lanes: Object.fromEntries(
          Object.entries(intersection.lanes).map(([dir, lane]) => [
            dir,
            {
              ...lane,
              vehicleCount: Math.max(0, lane.vehicleCount + Math.floor(Math.random() * 5) - 2),
              waitTime: lane.state === 'green' ? 0 : Math.max(0, lane.waitTime + Math.floor(Math.random() * 10) - 5)
            }
          ])
        ) as Intersection['lanes'],
        totalVehicles: Math.max(10, intersection.totalVehicles + Math.floor(Math.random() * 10) - 5)
      })));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const changeLight = useCallback((intersectionId: string, direction: TrafficDirection, newState: TrafficLightState) => {
    setIntersections(prev => prev.map(intersection => {
      if (intersection.id !== intersectionId) return intersection;

      // Logic: Only one direction can be green at a time
      const updatedLanes = { ...intersection.lanes };
      
      if (newState === 'green') {
        // Set all other directions to red first
        Object.keys(updatedLanes).forEach(dir => {
          if (dir !== direction) {
            updatedLanes[dir as TrafficDirection] = {
              ...updatedLanes[dir as TrafficDirection],
              state: 'red'
            };
          }
        });
      }

      updatedLanes[direction] = {
        ...updatedLanes[direction],
        state: newState,
        waitTime: newState === 'green' ? 0 : updatedLanes[direction].waitTime
      };

      return { ...intersection, lanes: updatedLanes };
    }));
  }, []);

  const changeMode = useCallback((intersectionId: string, mode: Intersection['mode']) => {
    setIntersections(prev => prev.map(intersection => 
      intersection.id === intersectionId ? { ...intersection, mode } : intersection
    ));
  }, []);

  const getAIRecommendation = useCallback((intersection: Intersection): TrafficDirection => {
    // Simple AI logic: recommend green for the direction with most vehicles waiting
    const maxWaiting = Object.entries(intersection.lanes).reduce(
      (max, [dir, lane]) => lane.vehicleCount > max.count && lane.state === 'red' 
        ? { dir: dir as TrafficDirection, count: lane.vehicleCount }
        : max,
      { dir: 'north' as TrafficDirection, count: 0 }
    );
    return maxWaiting.dir;
  }, []);

  return {
    intersections,
    selectedId,
    setSelectedId,
    changeLight,
    changeMode,
    getAIRecommendation,
    selectedIntersection: intersections.find(i => i.id === selectedId) || null
  };
}
