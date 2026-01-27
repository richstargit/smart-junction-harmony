import { useState } from 'react';
import { useTrafficData } from '@/hooks/useTrafficData';
import { TrafficMapMarker } from '@/components/traffic/TrafficMapMarker';
import { TrafficInfoSheet } from '@/components/traffic/TrafficInfoSheet';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  TrafficCone, 
  Search, 
  MapPin, 
  Navigation, 
  RefreshCw,
  Menu,
  X
} from 'lucide-react';

export default function PublicTrafficMap() {
  const { intersections, selectedId, setSelectedId } = useTrafficData();
  const [searchQuery, setSearchQuery] = useState('');
  const [showMenu, setShowMenu] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const selectedIntersection = intersections.find(i => i.id === selectedId) || null;
  
  const filteredIntersections = intersections.filter(i => 
    i.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsRefreshing(false);
  };

  return (
    <div className="min-h-screen bg-muted flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card border-b px-4 py-3 safe-area-top">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <TrafficCone className="w-6 h-6 text-primary" />
            <span className="font-bold">Traffic Live</span>
          </div>
          
          <div className="flex-1 max-w-xs">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="ค้นหาสถานที่..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-9"
              />
            </div>
          </div>
          
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => setShowMenu(!showMenu)}
          >
            {showMenu ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>

        {/* Dropdown menu */}
        {showMenu && (
          <div className="absolute top-full left-0 right-0 bg-card border-b shadow-lg p-4 space-y-3">
            <Button variant="outline" className="w-full justify-start" onClick={handleRefresh}>
              <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
              รีเฟรชข้อมูล
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Navigation className="w-4 h-4 mr-2" />
              ใช้ตำแหน่งปัจจุบัน
            </Button>
          </div>
        )}
      </header>

      {/* Map area */}
      <main className="flex-1 relative">
        {/* Simulated map background */}
        <div className="absolute inset-0 bg-gradient-to-br from-muted to-muted/50">
          {/* Grid pattern for map-like feel */}
          <div className="absolute inset-0 opacity-20" style={{
            backgroundImage: `
              linear-gradient(to right, hsl(var(--border)) 1px, transparent 1px),
              linear-gradient(to bottom, hsl(var(--border)) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px'
          }} />
        </div>

        {/* Traffic markers */}
        <div className="relative h-full p-4">
          <div className="grid grid-cols-2 gap-8 place-items-center h-full py-8">
            {filteredIntersections.map((intersection, index) => (
              <div 
                key={intersection.id}
                className="transform"
                style={{
                  transform: `translate(${(index % 2 - 0.5) * 20}px, ${Math.floor(index / 2) * 10}px)`
                }}
              >
                <TrafficMapMarker
                  intersection={intersection}
                  isSelected={selectedId === intersection.id}
                  onClick={() => setSelectedId(intersection.id)}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="absolute bottom-4 left-4 bg-card/95 backdrop-blur rounded-lg p-3 shadow-lg">
          <p className="text-xs font-medium mb-2">ระดับการจราจร</p>
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-traffic-green" />
              <span className="text-xs">คล่องตัว (≤2 นาที)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-traffic-yellow" />
              <span className="text-xs">หนาแน่นปานกลาง (3-5 นาที)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-traffic-red" />
              <span className="text-xs">หนาแน่นมาก (&gt;5 นาที)</span>
            </div>
          </div>
        </div>

        {/* Stats summary */}
        <div className="absolute top-4 right-4 bg-card/95 backdrop-blur rounded-lg p-3 shadow-lg">
          <div className="flex items-center gap-2 mb-2">
            <MapPin className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium">{intersections.length} แยก</span>
          </div>
          <div className="flex gap-2">
            <Badge className="bg-traffic-green/20 text-traffic-green hover:bg-traffic-green/30">
              {intersections.filter(i => i.estimatedWaitMinutes <= 2).length} คล่องตัว
            </Badge>
            <Badge className="bg-traffic-red/20 text-traffic-red hover:bg-traffic-red/30">
              {intersections.filter(i => i.estimatedWaitMinutes > 5).length} หนาแน่น
            </Badge>
          </div>
        </div>
      </main>

      {/* Bottom hint */}
      <div className="bg-card border-t px-4 py-3 text-center safe-area-bottom">
        <p className="text-sm text-muted-foreground">
          กดที่หมุดเพื่อดูรายละเอียดการจราจร
        </p>
      </div>

      {/* Traffic info sheet */}
      <TrafficInfoSheet
        intersection={selectedIntersection}
        isOpen={!!selectedId}
        onClose={() => setSelectedId(null)}
      />
    </div>
  );
}
