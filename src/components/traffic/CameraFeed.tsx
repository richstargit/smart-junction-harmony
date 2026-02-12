import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { DIRECTION_LABELS, TrafficDirection } from '@/types/traffic';
import { Car, Eye, EyeOff, Sparkles, Video } from 'lucide-react';
import { useEffect, useState } from 'react';

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
  const [showBoundingBoxes, setShowBoundingBoxes] = useState(true);
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

  // รูปพื้นหลัง CCTV จำลองแต่ละทิศ (จาก Unsplash - traffic/road images)
  const cctvBackgrounds: Record<TrafficDirection, string> = {
    north: 'https://images.unsplash.com/photo-1542744173-05336fcc7ad4?w=800&q=80&auto=format',
    south: 'https://images.unsplash.com/photo-1517420704952-d9f39e95b43e?w=800&q=80&auto=format',
    east: 'https://images.unsplash.com/photo-1494783367193-149034c05e8f?w=800&q=80&auto=format',
    west: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=800&q=80&auto=format',
  };

  const [videoLoaded, setVideoLoaded] = useState(false);
  const [videoError, setVideoError] = useState(false);

  return (
    <Card className="overflow-hidden">
      <div className="relative aspect-video bg-neutral-900">
        {/* Background CCTV image (always visible as fallback) */}
        <img
          src={cctvBackgrounds[direction]}
          alt={`CCTV ${DIRECTION_LABELS[direction]}`}
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Camera feed video (layered on top if loaded) */}
        {!videoError && (
          <video
            src="/traffic_1.mp4"
            autoPlay
            loop
            muted
            playsInline
            poster={cctvBackgrounds[direction]}
            onLoadedData={() => setVideoLoaded(true)}
            onError={() => setVideoError(true)}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${videoLoaded ? 'opacity-90' : 'opacity-0'}`}
          />
        )}

        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-black/20" />

        {/* AI Detection overlay */}
        {showBoundingBoxes && (
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
                <span className="absolute -top-5 left-0 text-[10px] bg-traffic-green text-primary-foreground px-1 rounded">
                  {vehicle.type} {(vehicle.confidence * 100).toFixed(0)}%
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Status overlay */}
        <div className="absolute top-2 left-2 flex items-center gap-2">
          <Badge variant={isActive ? "default" : "secondary"} className="flex items-center gap-1">
            <Video className="w-3 h-3" />
            {DIRECTION_LABELS[direction]}
          </Badge>
          {isActive && (
            <Badge className="bg-traffic-green text-primary-foreground animate-pulse">
              LIVE
            </Badge>
          )}
        </div>

        {/* Bounding box toggle */}
        <div className="absolute top-2 right-2">
          <Button
            variant="secondary"
            size="sm"
            className="h-8 gap-1 bg-background/80 hover:bg-background/95 backdrop-blur-sm"
            onClick={() => setShowBoundingBoxes(!showBoundingBoxes)}
          >
            {showBoundingBoxes ? (
              <><EyeOff className="w-3 h-3" /> ซ่อน AI</>
            ) : (
              <><Eye className="w-3 h-3" /> แสดง AI</>
            )}
          </Button>
        </div>

        {/* Vehicle count */}
        <div className="absolute bottom-2 left-2 flex items-center gap-2">
          <Badge variant="secondary" className="flex items-center gap-1">
            <Car className="w-3 h-3" />
            <span className="font-bold">{vehicleCount}</span> คัน
          </Badge>
          {showBoundingBoxes && (
            <Badge className="bg-status-ai/90 text-primary-foreground flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              AI Detection
            </Badge>
          )}
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
