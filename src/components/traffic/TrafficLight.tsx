import { cn } from '@/lib/utils';
import { TrafficLightState } from '@/types/traffic';

interface TrafficLightProps {
  state: TrafficLightState;
  size?: 'sm' | 'md' | 'lg';
  showGlow?: boolean;
  onClick?: (state: TrafficLightState) => void;
  interactive?: boolean;
}

export function TrafficLight({ 
  state, 
  size = 'md', 
  showGlow = true,
  onClick,
  interactive = false
}: TrafficLightProps) {
  const sizes = {
    sm: { container: 'w-8 gap-1 p-1 rounded-lg', light: 'w-5 h-5' },
    md: { container: 'w-12 gap-1.5 p-1.5 rounded-xl', light: 'w-8 h-8' },
    lg: { container: 'w-16 gap-2 p-2 rounded-2xl', light: 'w-10 h-10' }
  };

  const handleClick = (lightState: TrafficLightState) => {
    if (interactive && onClick) {
      onClick(lightState);
    }
  };

  return (
    <div className={cn(
      'flex flex-col items-center bg-foreground/90',
      sizes[size].container
    )}>
      {/* Red */}
      <button
        onClick={() => handleClick('red')}
        disabled={!interactive}
        className={cn(
          'rounded-full transition-all duration-300',
          sizes[size].light,
          state === 'red' 
            ? 'bg-traffic-red' 
            : 'bg-traffic-red/20',
          state === 'red' && showGlow && 'shadow-[0_0_20px_hsl(var(--traffic-red-glow))]',
          interactive && 'cursor-pointer hover:scale-110'
        )}
      />
      {/* Yellow */}
      <button
        onClick={() => handleClick('yellow')}
        disabled={!interactive}
        className={cn(
          'rounded-full transition-all duration-300',
          sizes[size].light,
          state === 'yellow' 
            ? 'bg-traffic-yellow' 
            : 'bg-traffic-yellow/20',
          state === 'yellow' && showGlow && 'shadow-[0_0_20px_hsl(45_100%_50%_/_0.4)]',
          interactive && 'cursor-pointer hover:scale-110'
        )}
      />
      {/* Green */}
      <button
        onClick={() => handleClick('green')}
        disabled={!interactive}
        className={cn(
          'rounded-full transition-all duration-300',
          sizes[size].light,
          state === 'green' 
            ? 'bg-traffic-green' 
            : 'bg-traffic-green/20',
          state === 'green' && showGlow && 'shadow-[0_0_20px_hsl(var(--traffic-green-glow))]',
          interactive && 'cursor-pointer hover:scale-110'
        )}
      />
    </div>
  );
}
