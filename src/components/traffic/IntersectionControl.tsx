import { Intersection, TrafficDirection, TrafficLightState, DIRECTION_LABELS } from '@/types/traffic';
import { TrafficLight } from './TrafficLight';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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

const DIRECTION_SHORT: Record<TrafficDirection, string> = {
  north: 'เหนือ',
  south: 'ใต้',
  east: 'ตอ.',
  west: 'ตก.'
};

export function IntersectionControl({ intersection, onChangeLight, aiRecommendation }: IntersectionControlProps) {
  const isManualMode = intersection.mode === 'manual-with-ai' || intersection.mode === 'full-manual';
  const showAIHints = intersection.mode === 'manual-with-ai';

  const directions: TrafficDirection[] = ['north', 'south', 'east', 'west'];

  return (
    <div className="space-y-3">
      {/* Compact lane list */}
      {directions.map((dir) => {
        const lane = intersection.lanes[dir];
        const Icon = DIRECTION_ICONS[dir];
        const isAIRecommended = showAIHints && aiRecommendation === dir && lane.state !== 'green';
        const isGreen = lane.state === 'green';

        return (
          <div
            key={dir}
            className={cn(
              'flex items-center gap-3 p-3 rounded-xl border-2 transition-all',
              isGreen ? 'border-traffic-green bg-traffic-green/5' : 'border-border',
              isAIRecommended && 'border-status-ai bg-status-ai/5'
            )}
          >
            {/* Direction indicator */}
            <div className={cn(
              'flex items-center justify-center w-10 h-10 rounded-lg shrink-0',
              isGreen ? 'bg-traffic-green/20' : 'bg-muted'
            )}>
              <Icon className="w-5 h-5" />
            </div>

            {/* Direction name + vehicle count */}
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-sm">{DIRECTION_SHORT[dir]}</div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Car className="w-3 h-3" />
                <span className="font-bold text-foreground">{lane.vehicleCount}</span> คัน
                {lane.state === 'red' && lane.waitTime > 0 && (
                  <span className="ml-1">
                    · รอ {Math.ceil(lane.waitTime / 60)}:{(lane.waitTime % 60).toString().padStart(2, '0')}
                  </span>
                )}
              </div>
            </div>

            {/* Traffic light status indicator */}
            <div className={cn(
              'w-4 h-4 rounded-full shrink-0',
              lane.state === 'green' && 'bg-traffic-green shadow-[0_0_8px_hsl(var(--traffic-green-glow))]',
              lane.state === 'yellow' && 'bg-traffic-yellow',
              lane.state === 'red' && 'bg-traffic-red'
            )} />

            {/* Action button for manual mode */}
            {isManualMode && lane.state !== 'green' && (
              <Button
                size="sm"
                variant={isAIRecommended ? 'default' : 'outline'}
                className={cn(
                  'shrink-0 min-w-[60px] h-10',
                  isAIRecommended && 'bg-status-ai hover:bg-status-ai/90 text-primary-foreground'
                )}
                onClick={() => onChangeLight(dir, 'green')}
              >
                {isAIRecommended && <Sparkles className="w-3 h-3 mr-1" />}
                เปิด
              </Button>
            )}

            {isManualMode && lane.state === 'green' && (
              <Badge className="bg-traffic-green text-primary-foreground shrink-0">
                กำลังเปิด
              </Badge>
            )}

            {!isManualMode && (
              <Badge variant={isGreen ? 'default' : 'secondary'} className="shrink-0">
                {isGreen ? 'เขียว' : lane.state === 'yellow' ? 'เหลือง' : 'แดง'}
              </Badge>
            )}
          </div>
        );
      })}

      {/* Total summary */}
      <div className="flex items-center justify-between pt-2 border-t border-border">
        <span className="text-sm text-muted-foreground">รถทั้งหมด</span>
        <span className="text-xl font-bold text-primary">{intersection.totalVehicles} คัน</span>
      </div>
    </div>
  );
}
