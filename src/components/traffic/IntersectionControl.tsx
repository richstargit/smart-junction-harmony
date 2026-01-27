import { Intersection, TrafficDirection, TrafficLightState, DIRECTION_LABELS } from '@/types/traffic';
import { TrafficLight } from './TrafficLight';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Car, Sparkles, ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from 'lucide-react';

interface IntersectionControlProps {
  intersection: Intersection;
  onChangeLight: (direction: TrafficDirection, state: TrafficLightState) => void;
  aiRecommendation: TrafficDirection;
}

const DIRECTION_ICONS = {
  north: ArrowUp,
  south: ArrowDown,
  east: ArrowRight,
  west: ArrowLeft
};

const DIRECTION_POSITIONS = {
  north: 'top-2 left-1/2 -translate-x-1/2',
  south: 'bottom-2 left-1/2 -translate-x-1/2',
  east: 'right-2 top-1/2 -translate-y-1/2',
  west: 'left-2 top-1/2 -translate-y-1/2'
};

export function IntersectionControl({ intersection, onChangeLight, aiRecommendation }: IntersectionControlProps) {
  const isManualMode = intersection.mode === 'manual-with-ai' || intersection.mode === 'full-manual';
  const showAIHints = intersection.mode === 'manual-with-ai';

  return (
    <div className="relative w-full max-w-lg aspect-square mx-auto">
      {/* Intersection background */}
      <div className="absolute inset-0 bg-muted rounded-3xl" />
      
      {/* Road markings */}
      <div className="absolute inset-[35%] bg-secondary/30 rounded-lg" />
      <div className="absolute top-0 bottom-0 left-[40%] right-[40%] bg-secondary/30" />
      <div className="absolute left-0 right-0 top-[40%] bottom-[40%] bg-secondary/30" />
      
      {/* Lane controls */}
      {(Object.entries(intersection.lanes) as [TrafficDirection, typeof intersection.lanes.north][]).map(([dir, lane]) => {
        const Icon = DIRECTION_ICONS[dir];
        const isAIRecommended = showAIHints && aiRecommendation === dir && lane.state !== 'green';

        return (
          <div
            key={dir}
            className={cn(
              'absolute flex flex-col items-center gap-2',
              DIRECTION_POSITIONS[dir]
            )}
          >
            <Card className={cn(
              'p-3 flex flex-col items-center gap-2 transition-all',
              isAIRecommended && 'ring-2 ring-status-ai animate-pulse'
            )}>
              <div className="flex items-center gap-2 text-xs font-medium">
                <Icon className="w-4 h-4" />
                <span>{DIRECTION_LABELS[dir]}</span>
              </div>
              
              <TrafficLight
                state={lane.state}
                size="sm"
                interactive={isManualMode}
                onClick={(newState) => onChangeLight(dir, newState)}
              />
              
              <div className="flex items-center gap-1 text-sm">
                <Car className="w-4 h-4 text-primary" />
                <span className="font-bold">{lane.vehicleCount}</span>
              </div>
              
              {lane.state === 'red' && lane.waitTime > 0 && (
                <Badge variant="secondary" className="text-xs">
                  รอ {Math.ceil(lane.waitTime / 60)}:{(lane.waitTime % 60).toString().padStart(2, '0')}
                </Badge>
              )}
              
              {isAIRecommended && (
                <Badge className="bg-status-ai text-background text-xs flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  AI แนะนำ
                </Badge>
              )}
            </Card>
          </div>
        );
      })}

      {/* Center info */}
      <div className="absolute inset-[35%] flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl font-bold text-primary">{intersection.totalVehicles}</div>
          <div className="text-xs text-muted-foreground">คันทั้งหมด</div>
        </div>
      </div>
    </div>
  );
}
