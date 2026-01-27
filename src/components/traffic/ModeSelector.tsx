import { Intersection, MODE_LABELS } from '@/types/traffic';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';
import { Bot, Hand, Sparkles } from 'lucide-react';

interface ModeSelectorProps {
  mode: Intersection['mode'];
  onChange: (mode: Intersection['mode']) => void;
}

const modes: { value: Intersection['mode']; icon: typeof Bot; description: string }[] = [
  {
    value: 'ai-auto',
    icon: Bot,
    description: 'AI ตัดสินใจเปิดปิดไฟอัตโนมัติตามจำนวนรถ'
  },
  {
    value: 'manual-with-ai',
    icon: Sparkles,
    description: 'คุณควบคุมเอง AI จะแนะนำให้'
  },
  {
    value: 'full-manual',
    icon: Hand,
    description: 'คุณควบคุมเองทั้งหมด'
  }
];

export function ModeSelector({ mode, onChange }: ModeSelectorProps) {
  return (
    <Card className="p-4">
      <Label className="text-sm font-medium mb-4 block">โหมดควบคุม</Label>
      <div className="space-y-2">
        {modes.map((m) => {
          const Icon = m.icon;
          const isActive = mode === m.value;
          
          return (
            <button
              key={m.value}
              onClick={() => onChange(m.value)}
              className={cn(
                'w-full p-3 rounded-lg border-2 text-left transition-all flex items-start gap-3',
                isActive 
                  ? 'border-primary bg-primary/5' 
                  : 'border-border hover:border-primary/50'
              )}
            >
              <div className={cn(
                'p-2 rounded-lg',
                isActive ? 'bg-primary text-primary-foreground' : 'bg-muted'
              )}>
                <Icon className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <div className="font-medium">{MODE_LABELS[m.value]}</div>
                <div className="text-xs text-muted-foreground">{m.description}</div>
              </div>
              <Switch checked={isActive} onCheckedChange={() => onChange(m.value)} />
            </button>
          );
        })}
      </div>
    </Card>
  );
}
