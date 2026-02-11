import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Bot, ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from 'lucide-react';
import { TrafficDirection } from '@/types/traffic';

interface AIAction {
  id: string;
  direction: TrafficDirection;
  action: string;
  reason: string;
  timestamp: Date;
}

const DIRECTION_ICONS: Record<TrafficDirection, typeof ArrowUp> = {
  north: ArrowUp,
  south: ArrowDown,
  east: ArrowRight,
  west: ArrowLeft,
};

const DIRECTION_NAMES: Record<TrafficDirection, string> = {
  north: 'เหนือ',
  south: 'ใต้',
  east: 'ตอ.',
  west: 'ตก.',
};

export function AINotificationLog() {
  const [actions, setActions] = useState<AIAction[]>([]);

  // Simulate AI actions
  useEffect(() => {
    const directions: TrafficDirection[] = ['north', 'south', 'east', 'west'];
    const reasons = [
      'รถสะสมเกิน 15 คัน',
      'เวลารอเกิน 90 วินาที',
      'ตรวจจับรถฉุกเฉิน',
      'ปรับรอบตามจังหวะจราจร',
    ];

    // Add initial log
    setActions([
      {
        id: '1',
        direction: 'east',
        action: 'เปิดไฟเขียว',
        reason: 'รถสะสมเกิน 15 คัน',
        timestamp: new Date(Date.now() - 30000),
      },
      {
        id: '2',
        direction: 'north',
        action: 'เปิดไฟเขียว',
        reason: 'เวลารอเกิน 90 วินาที',
        timestamp: new Date(Date.now() - 90000),
      },
    ]);

    const interval = setInterval(() => {
      const dir = directions[Math.floor(Math.random() * directions.length)];
      const reason = reasons[Math.floor(Math.random() * reasons.length)];
      
      setActions((prev) => [
        {
          id: Date.now().toString(),
          direction: dir,
          action: 'เปิดไฟเขียว',
          reason,
          timestamp: new Date(),
        },
        ...prev.slice(0, 9), // Keep max 10
      ]);
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  return (
    <Card className="p-4">
      <div className="flex items-center gap-2 mb-3">
        <Bot className="w-4 h-4 text-status-ai" />
        <h3 className="font-semibold text-sm">AI Activity Log</h3>
        <Badge variant="secondary" className="text-xs ml-auto">{actions.length} รายการ</Badge>
      </div>
      <ScrollArea className="h-48">
        <div className="space-y-2">
          {actions.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">ยังไม่มีกิจกรรม</p>
          ) : (
            actions.map((action) => {
              const Icon = DIRECTION_ICONS[action.direction];
              return (
                <div key={action.id} className="flex items-start gap-2 p-2 rounded-lg bg-muted/50 text-sm">
                  <div className="w-6 h-6 rounded bg-status-ai/20 flex items-center justify-center shrink-0 mt-0.5">
                    <Icon className="w-3 h-3 text-status-ai" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium">
                      {action.action} ทิศ{DIRECTION_NAMES[action.direction]}
                    </div>
                    <div className="text-xs text-muted-foreground">{action.reason}</div>
                  </div>
                  <span className="text-xs text-muted-foreground shrink-0">
                    {formatTime(action.timestamp)}
                  </span>
                </div>
              );
            })
          )}
        </div>
      </ScrollArea>
    </Card>
  );
}
