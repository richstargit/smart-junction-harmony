import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrafficDirection, DIRECTION_LABELS } from '@/types/traffic';
import { Video, Car, Sparkles } from 'lucide-react';
import intersectionHero from '@/assets/intersection-hero.jpg';

interface DetectedVehicle {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  type: 'car' | 'truck' | 'motorcycle';
  confidence: number;
}

interface CameraFeedProps {
  direction: TrafficDirection;
  vehicleCount: number;
  isActive: boolean;
}

export function CameraFeed({ direction, vehicleCount, isActive }: CameraFeedProps) {
  const [detectedVehicles, setDetectedVehicles] = useState<DetectedVehicle[]>([]);

  // Simulate AI detection with bounding boxes
  useEffect(() => {
    const generateVehicles = () => {
      const count = Math.min(vehicleCount, 8);
      const vehicles: DetectedVehicle[] = [];
      
      for (let i = 0; i < count; i++) {
        vehicles.push({
          id: `vehicle-${i}`,
          x: 10 + Math.random() * 60,
          y: 20 + Math.random() * 50,
          width: 8 + Math.random() * 6,
          height: 6 + Math.random() * 4,
          type: Math.random() > 0.7 ? 'truck' : Math.random() > 0.3 ? 'car' : 'motorcycle',
          confidence: 0.85 + Math.random() * 0.14
        });
      }
      
      setDetectedVehicles(vehicles);
    };

    generateVehicles();
    const interval = setInterval(generateVehicles, 2000);
    return () => clearInterval(interval);
  }, [vehicleCount]);

  return (
    <Card className="overflow-hidden">
      <div className="relative aspect-video bg-foreground/5">
        {/* Camera feed image */}
        <img 
          src={intersectionHero}
          alt={`Camera ${direction}`}
          className="absolute inset-0 w-full h-full object-cover opacity-90"
        />
        
        {/* AI Detection overlay */}
        <div className="absolute inset-0">
          {detectedVehicles.map((vehicle) => (
            <div
              key={vehicle.id}
              className="absolute border-2 border-traffic-green rounded transition-all duration-300"
              style={{
                left: `${vehicle.x}%`,
                top: `${vehicle.y}%`,
                width: `${vehicle.width}%`,
                height: `${vehicle.height}%`,
                boxShadow: '0 0 10px hsl(var(--traffic-green-glow))'
              }}
            >
              <span className="absolute -top-5 left-0 text-[10px] bg-traffic-green text-background px-1 rounded">
                {vehicle.type} {(vehicle.confidence * 100).toFixed(0)}%
              </span>
            </div>
          ))}
        </div>
        
        {/* Status overlay */}
        <div className="absolute top-2 left-2 flex items-center gap-2">
          <Badge variant={isActive ? "default" : "secondary"} className="flex items-center gap-1">
            <Video className="w-3 h-3" />
            {DIRECTION_LABELS[direction]}
          </Badge>
          {isActive && (
            <Badge className="bg-traffic-green text-background animate-pulse">
              LIVE
            </Badge>
          )}
        </div>
        
        {/* Vehicle count */}
        <div className="absolute bottom-2 left-2 flex items-center gap-2">
          <Badge variant="secondary" className="flex items-center gap-1">
            <Car className="w-3 h-3" />
            <span className="font-bold">{vehicleCount}</span> คัน
          </Badge>
          <Badge className="bg-status-ai/90 text-background flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            AI Detection
          </Badge>
        </div>
        
        {/* Timestamp */}
        <div className="absolute bottom-2 right-2">
          <Badge variant="outline" className="bg-background/80 text-xs font-mono">
            {new Date().toLocaleTimeString('th-TH')}
          </Badge>
        </div>
      </div>
    </Card>
  );
}
