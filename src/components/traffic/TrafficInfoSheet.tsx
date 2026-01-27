import { Intersection, DIRECTION_LABELS } from '@/types/traffic';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Car, Clock, TrendingUp, Sparkles, MapPin } from 'lucide-react';
import { TrafficLight } from './TrafficLight';

interface TrafficInfoSheetProps {
  intersection: Intersection | null;
  isOpen: boolean;
  onClose: () => void;
}

export function TrafficInfoSheet({ intersection, isOpen, onClose }: TrafficInfoSheetProps) {
  if (!intersection) return null;

  const getTrafficLevel = () => {
    if (intersection.estimatedWaitMinutes <= 2) return { label: 'คล่องตัว', color: 'bg-traffic-green' };
    if (intersection.estimatedWaitMinutes <= 5) return { label: 'หนาแน่นปานกลาง', color: 'bg-traffic-yellow' };
    return { label: 'หนาแน่นมาก', color: 'bg-traffic-red' };
  };

  const trafficLevel = getTrafficLevel();
  const congestionPercent = Math.min(100, (intersection.totalVehicles / 80) * 100);

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="bottom" className="h-[70vh] rounded-t-3xl">
        <SheetHeader className="pb-4">
          <div className="flex items-center justify-between">
            <SheetTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-primary" />
              {intersection.name}
            </SheetTitle>
            <Badge className={`${trafficLevel.color} text-background`}>
              {trafficLevel.label}
            </Badge>
          </div>
        </SheetHeader>

        <div className="space-y-6 overflow-y-auto">
          {/* AI Analysis */}
          <div className="bg-status-ai/10 p-4 rounded-xl border border-status-ai/30">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-5 h-5 text-status-ai" />
              <span className="font-semibold">การวิเคราะห์จาก AI</span>
            </div>
            <p className="text-sm text-muted-foreground">
              ขณะนี้มีรถ <strong>{intersection.totalVehicles} คัน</strong> ในบริเวณสี่แยก 
              คาดว่าจะใช้เวลารอประมาณ <strong>{intersection.estimatedWaitMinutes} นาที</strong>
              {intersection.estimatedWaitMinutes > 4 && 
                ' แนะนำให้ใช้เส้นทางอื่นหากเป็นไปได้'}
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-card p-4 rounded-xl border">
              <div className="flex items-center gap-2 text-muted-foreground mb-2">
                <Car className="w-4 h-4" />
                <span className="text-sm">จำนวนรถ</span>
              </div>
              <div className="text-3xl font-bold text-primary">
                {intersection.totalVehicles}
              </div>
            </div>
            <div className="bg-card p-4 rounded-xl border">
              <div className="flex items-center gap-2 text-muted-foreground mb-2">
                <Clock className="w-4 h-4" />
                <span className="text-sm">เวลารอโดยประมาณ</span>
              </div>
              <div className="text-3xl font-bold text-primary">
                {intersection.estimatedWaitMinutes} <span className="text-base font-normal">นาที</span>
              </div>
            </div>
          </div>

          {/* Congestion meter */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">ความหนาแน่น</span>
              <span className="text-sm text-muted-foreground">{Math.round(congestionPercent)}%</span>
            </div>
            <Progress value={congestionPercent} className="h-3" />
          </div>

          <Separator />

          {/* Lane status */}
          <div>
            <h4 className="font-medium mb-3 flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              สถานะแต่ละเลน
            </h4>
            <div className="space-y-3">
              {Object.entries(intersection.lanes).map(([dir, lane]) => (
                <div key={dir} className="flex items-center justify-between bg-muted/50 p-3 rounded-lg">
                  <div className="flex items-center gap-3">
                    <TrafficLight state={lane.state} size="sm" showGlow={false} />
                    <div>
                      <div className="font-medium">{DIRECTION_LABELS[dir as keyof typeof DIRECTION_LABELS]}</div>
                      <div className="text-xs text-muted-foreground">
                        {lane.vehicleCount} คัน รอ
                      </div>
                    </div>
                  </div>
                  <Badge variant={lane.state === 'green' ? 'default' : 'secondary'}>
                    {lane.state === 'green' ? 'เปิด' : 'ปิด'}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
