import { useSearchParams } from 'react-router-dom';
import { useTrafficData } from '@/hooks/useTrafficData';
import { IntersectionControl } from '@/components/traffic/IntersectionControl';
import { CameraFeed } from '@/components/traffic/CameraFeed';
import { ModeSelector } from '@/components/traffic/ModeSelector';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  TrafficCone, 
  LogOut, 
  Wifi, 
  WifiOff, 
  Car, 
  Clock, 
  Settings,
  LayoutGrid,
  Maximize2
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { TrafficDirection } from '@/types/traffic';

export default function OfficerDashboard() {
  const [searchParams] = useSearchParams();
  const intersectionId = searchParams.get('intersection') || 'int-001';
  const [activeCam, setActiveCam] = useState<TrafficDirection>('north');
  const [showAllCams, setShowAllCams] = useState(false);

  const { 
    intersections, 
    changeLight, 
    changeMode, 
    getAIRecommendation,
    setSelectedId 
  } = useTrafficData();

  useEffect(() => {
    setSelectedId(intersectionId);
  }, [intersectionId, setSelectedId]);

  const intersection = intersections.find(i => i.id === intersectionId);

  if (!intersection) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>ไม่พบข้อมูลแยก</p>
      </div>
    );
  }

  const aiRecommendation = getAIRecommendation(intersection);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-card/95 backdrop-blur">
        <div className="container flex items-center justify-between h-16 px-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <TrafficCone className="w-6 h-6 text-primary" />
              <span className="font-bold text-lg">AI Traffic Control</span>
            </div>
            <Separator orientation="vertical" className="h-6" />
            <div className="flex items-center gap-2">
              <Badge variant={intersection.status === 'online' ? 'default' : 'destructive'}>
                {intersection.status === 'online' ? (
                  <><Wifi className="w-3 h-3 mr-1" /> ออนไลน์</>
                ) : (
                  <><WifiOff className="w-3 h-3 mr-1" /> ออฟไลน์</>
                )}
              </Badge>
              <span className="font-medium">{intersection.name}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1">
                <Car className="w-4 h-4 text-muted-foreground" />
                <span className="font-bold">{intersection.totalVehicles}</span>
                <span className="text-muted-foreground">คัน</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <span className="font-bold">{intersection.estimatedWaitMinutes}</span>
                <span className="text-muted-foreground">นาที</span>
              </div>
            </div>
            <Button variant="outline" size="sm">
              <Settings className="w-4 h-4 mr-2" />
              ตั้งค่า
            </Button>
            <Button variant="ghost" size="sm" onClick={() => window.location.href = '/'}>
              <LogOut className="w-4 h-4 mr-2" />
              ออก
            </Button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="container px-4 py-6">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left column - Camera feeds */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">กล้องวงจรปิด</h2>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowAllCams(!showAllCams)}
              >
                {showAllCams ? (
                  <><Maximize2 className="w-4 h-4 mr-2" /> ขยาย</>
                ) : (
                  <><LayoutGrid className="w-4 h-4 mr-2" /> ดูทั้งหมด</>
                )}
              </Button>
            </div>
            
            {showAllCams ? (
              <div className="grid grid-cols-2 gap-4">
                {(['north', 'south', 'east', 'west'] as TrafficDirection[]).map((dir) => (
                  <CameraFeed
                    key={dir}
                    direction={dir}
                    vehicleCount={intersection.lanes[dir].vehicleCount}
                    isActive={true}
                  />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                <CameraFeed
                  direction={activeCam}
                  vehicleCount={intersection.lanes[activeCam].vehicleCount}
                  isActive={true}
                />
                <div className="flex gap-2">
                  {(['north', 'south', 'east', 'west'] as TrafficDirection[]).map((dir) => (
                    <Button
                      key={dir}
                      variant={activeCam === dir ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setActiveCam(dir)}
                      className="flex-1"
                    >
                      {dir === 'north' && 'เหนือ'}
                      {dir === 'south' && 'ใต้'}
                      {dir === 'east' && 'ตะวันออก'}
                      {dir === 'west' && 'ตะวันตก'}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Intersection control */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">แผนผังสี่แยก</h3>
              <IntersectionControl
                intersection={intersection}
                onChangeLight={(dir, state) => changeLight(intersection.id, dir, state)}
                aiRecommendation={aiRecommendation}
              />
              {intersection.mode !== 'ai-auto' && (
                <p className="text-sm text-muted-foreground text-center mt-4">
                  คลิกที่ไฟจราจรเพื่อเปลี่ยนสถานะ (เปิดได้เลนเดียวต่อครั้ง)
                </p>
              )}
            </Card>
          </div>

          {/* Right column - Controls */}
          <div className="space-y-4">
            <ModeSelector
              mode={intersection.mode}
              onChange={(mode) => changeMode(intersection.id, mode)}
            />

            {/* Stats card */}
            <Card className="p-4">
              <h3 className="font-semibold mb-4">สถิติเรียลไทม์</h3>
              <div className="space-y-4">
                {Object.entries(intersection.lanes).map(([dir, lane]) => (
                  <div key={dir} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${
                        lane.state === 'green' ? 'bg-traffic-green' :
                        lane.state === 'yellow' ? 'bg-traffic-yellow' :
                        'bg-traffic-red'
                      }`} />
                      <span className="text-sm capitalize">
                        {dir === 'north' && 'เหนือ'}
                        {dir === 'south' && 'ใต้'}
                        {dir === 'east' && 'ตะวันออก'}
                        {dir === 'west' && 'ตะวันตก'}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="flex items-center gap-1">
                        <Car className="w-3 h-3" />
                        {lane.vehicleCount}
                      </span>
                      {lane.state !== 'green' && (
                        <span className="text-muted-foreground">
                          รอ {Math.ceil(lane.waitTime / 60)}:{(lane.waitTime % 60).toString().padStart(2, '0')}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* AI Status */}
            {intersection.mode === 'ai-auto' && (
              <Card className="p-4 border-status-ai/30 bg-status-ai/5">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 rounded-full bg-status-ai animate-pulse" />
                  <span className="font-semibold">AI กำลังทำงาน</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  ระบบกำลังวิเคราะห์และปรับไฟจราจรอัตโนมัติ
                  ตามจำนวนรถในแต่ละเลน
                </p>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
