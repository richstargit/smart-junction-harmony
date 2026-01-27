import { Intersection } from '@/types/traffic';
import { cn } from '@/lib/utils';
import { MapPin, Car, Clock } from 'lucide-react';

interface TrafficMapMarkerProps {
  intersection: Intersection;
  isSelected: boolean;
  onClick: () => void;
}

export function TrafficMapMarker({ intersection, isSelected, onClick }: TrafficMapMarkerProps) {
  const getTrafficColor = () => {
    if (intersection.estimatedWaitMinutes <= 2) return 'bg-traffic-green';
    if (intersection.estimatedWaitMinutes <= 5) return 'bg-traffic-yellow';
    return 'bg-traffic-red';
  };

  return (
    <button
      onClick={onClick}
      className={cn(
        'relative flex flex-col items-center transition-all duration-300',
        isSelected && 'scale-125 z-10'
      )}
    >
      {/* Marker pin */}
      <div className={cn(
        'w-10 h-10 rounded-full flex items-center justify-center transition-all',
        getTrafficColor(),
        'shadow-lg',
        isSelected && 'ring-4 ring-primary'
      )}>
        <MapPin className="w-5 h-5 text-background" />
      </div>
      
      {/* Pulse effect */}
      <div className={cn(
        'absolute inset-0 rounded-full animate-ping',
        getTrafficColor(),
        'opacity-30'
      )} />
      
      {/* Label */}
      <div className={cn(
        'mt-2 px-2 py-1 rounded-lg bg-card shadow-md text-xs font-medium whitespace-nowrap transition-all',
        isSelected ? 'opacity-100' : 'opacity-80'
      )}>
        {intersection.name}
      </div>
      
      {/* Stats badge */}
      <div className="flex items-center gap-2 mt-1">
        <span className="flex items-center gap-0.5 text-xs bg-card/90 px-1.5 py-0.5 rounded shadow">
          <Car className="w-3 h-3" /> {intersection.totalVehicles}
        </span>
        <span className="flex items-center gap-0.5 text-xs bg-card/90 px-1.5 py-0.5 rounded shadow">
          <Clock className="w-3 h-3" /> {intersection.estimatedWaitMinutes}น.
        </span>
      </div>
    </button>
  );
}
