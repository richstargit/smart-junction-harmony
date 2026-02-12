import { useState } from 'react';
import { useTrafficData } from '@/hooks/useTrafficData';
import { TrafficMapMarker } from '@/components/traffic/TrafficMapMarker';
import { TrafficInfoSheet } from '@/components/traffic/TrafficInfoSheet';
import { GoogleMapView } from '@/components/traffic/GoogleMapView';
import { TrafficStatisticsChart } from '@/components/traffic/TrafficStatisticsChart';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import AppLogo from '@/components/AppLogo';
import {
  Search,
  MapPin,
  Navigation,
  RefreshCw,
  Menu,
  X,
  Map,
  BarChart3
} from 'lucide-react';

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';

export default function PublicTrafficMap() {
  const { intersections, selectedId, setSelectedId } = useTrafficData();
  const [searchQuery, setSearchQuery] = useState('');
  const [showMenu, setShowMenu] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [viewMode, setViewMode] = useState<'map' | 'stats'>('map');
  const [useGoogleMaps, setUseGoogleMaps] = useState(!!GOOGLE_MAPS_API_KEY);

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
          <AppLogo size="sm" clickable />

          <div className="flex-1 max-w-xs">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="ค้นหาสถานที่..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-9"
              />
              {/* Search dropdown */}
              {searchQuery && filteredIntersections.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-card border rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
                  {filteredIntersections.map((intersection) => (
                    <button
                      key={intersection.id}
                      className="w-full px-3 py-2 text-left hover:bg-muted flex items-center gap-2 transition-colors"
                      onClick={() => {
                        setSelectedId(intersection.id);
                        setSearchQuery('');
                      }}
                    >
                      <MapPin className="w-4 h-4 text-primary flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="font-medium truncate">{intersection.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {intersection.totalVehicles} คัน • รอ {intersection.estimatedWaitMinutes} นาที
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
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
            {GOOGLE_MAPS_API_KEY && (
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => setUseGoogleMaps(!useGoogleMaps)}
              >
                <Map className="w-4 h-4 mr-2" />
                {useGoogleMaps ? 'ใช้แผนที่แบบง่าย' : 'ใช้ Google Maps'}
              </Button>
            )}
          </div>
        )}
      </header>

      {/* View toggle */}
      <div className="bg-card border-b px-4 py-2">
        <div className="flex gap-2">
          <Button
            variant={viewMode === 'map' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('map')}
            className="flex-1"
          >
            <Map className="w-4 h-4 mr-2" />
            แผนที่
          </Button>
          <Button
            variant={viewMode === 'stats' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('stats')}
            className="flex-1"
          >
            <BarChart3 className="w-4 h-4 mr-2" />
            สถิติ
          </Button>
        </div>
      </div>

      {/* Main content */}
      <main className="flex-1 relative">
        {viewMode === 'stats' ? (
          <div className="p-4 space-y-4 overflow-auto h-full">
            <TrafficStatisticsChart />

            {/* Intersection list for stats */}
            <div className="space-y-3">
              <h3 className="font-semibold">เลือกแยกเพื่อดูสถิติ</h3>
              {filteredIntersections.map((intersection) => (
                <Button
                  key={intersection.id}
                  variant={selectedId === intersection.id ? 'default' : 'outline'}
                  className="w-full justify-start"
                  onClick={() => setSelectedId(intersection.id)}
                >
                  <MapPin className="w-4 h-4 mr-2" />
                  {intersection.name}
                  <Badge className="ml-auto" variant="secondary">
                    {intersection.totalVehicles} คัน
                  </Badge>
                </Button>
              ))}
            </div>
          </div>
        ) : useGoogleMaps && GOOGLE_MAPS_API_KEY ? (
          <GoogleMapView
            intersections={filteredIntersections}
            selectedId={selectedId}
            onSelectIntersection={setSelectedId}
            apiKey={GOOGLE_MAPS_API_KEY}
          />
        ) : (
          <>
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
          </>
        )}

        {/* Legend - only show in map mode */}
        {viewMode === 'map' && !useGoogleMaps && (
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
        )}

        {/* Stats summary - only show in map mode */}
        {viewMode === 'map' && (
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
        )}
      </main>

      {/* Bottom hint - hide when sheet is open */}
      {!selectedId && (
        <div className="bg-card border-t px-4 py-3 text-center safe-area-bottom">
          <p className="text-sm text-muted-foreground">
            กดที่หมุดเพื่อดูรายละเอียดการจราจร
          </p>
        </div>
      )}

      {/* Traffic info sheet */}
      <TrafficInfoSheet
        intersection={selectedIntersection}
        isOpen={!!selectedId}
        onClose={() => setSelectedId(null)}
      />
    </div>
  );
}
