import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { TrafficCone, MapPin, Shield, ArrowRight } from 'lucide-react';
import intersectionHero from '@/assets/intersection-hero.jpg';

const INTERSECTIONS = [
  { id: 'int-001', name: 'แยกอโศก' },
  { id: 'int-002', name: 'แยกสยาม' },
  { id: 'int-003', name: 'แยกราชประสงค์' },
  { id: 'int-004', name: 'แยกพร้อมพงษ์' }
];

export default function OfficerLogin() {
  const [officerId, setOfficerId] = useState('');
  const [selectedIntersection, setSelectedIntersection] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!officerId || !selectedIntersection) {
      toast({
        title: 'กรุณากรอกข้อมูลให้ครบ',
        description: 'ต้องระบุรหัสเจ้าหน้าที่และเลือกแยกที่ประจำการ',
        variant: 'destructive'
      });
      return;
    }

    setIsLoading(true);
    
    // Simulate login
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast({
      title: 'เข้าสู่ระบบสำเร็จ',
      description: `ยินดีต้อนรับ เจ้าหน้าที่ ${officerId}`
    });
    
    navigate(`/dashboard?intersection=${selectedIntersection}`);
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side - Hero image */}
      <div className="hidden lg:flex lg:w-1/2 relative">
        <img 
          src={intersectionHero} 
          alt="Traffic intersection" 
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-foreground/80 to-foreground/40" />
        <div className="relative z-10 p-12 flex flex-col justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-primary rounded-xl">
              <TrafficCone className="w-8 h-8 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-background">AI Traffic Control</h1>
              <p className="text-background/70">ระบบควบคุมจราจรอัจฉริยะ</p>
            </div>
          </div>
          
          <div className="text-background">
            <h2 className="text-4xl font-bold mb-4">
              ควบคุมจราจรอย่างชาญฉลาด<br />ด้วยพลัง AI
            </h2>
            <p className="text-background/80 text-lg max-w-md">
              ระบบตรวจจับรถยนต์อัตโนมัติ คำนวณเวลาไฟจราจรที่เหมาะสม 
              ลดความแออัดและเพิ่มประสิทธิภาพการจราจร
            </p>
          </div>
        </div>
      </div>

      {/* Right side - Login form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-background">
        <Card className="w-full max-w-md p-8">
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="p-3 bg-primary rounded-xl">
              <TrafficCone className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold">AI Traffic Control</h1>
              <p className="text-sm text-muted-foreground">ระบบควบคุมจราจรอัจฉริยะ</p>
            </div>
          </div>

          <div className="mb-6">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-semibold">เข้าสู่ระบบเจ้าหน้าที่</h2>
            </div>
            <p className="text-muted-foreground text-sm">
              กรอกรหัสเจ้าหน้าที่และเลือกแยกที่ประจำการ
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="officerId">รหัสเจ้าหน้าที่</Label>
              <Input
                id="officerId"
                placeholder="เช่น TF-001"
                value={officerId}
                onChange={(e) => setOfficerId(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="intersection">เลือกแยกที่ประจำการ</Label>
              <Select value={selectedIntersection} onValueChange={setSelectedIntersection}>
                <SelectTrigger>
                  <SelectValue placeholder="เลือกสถานที่" />
                </SelectTrigger>
                <SelectContent>
                  {INTERSECTIONS.map((int) => (
                    <SelectItem key={int.id} value={int.id}>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        {int.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'กำลังเข้าสู่ระบบ...' : (
                <>
                  เข้าสู่ระบบ
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            สำหรับประชาชนทั่วไป{' '}
            <Button variant="link" className="px-1" onClick={() => navigate('/public')}>
              ดูสถานการณ์จราจร
            </Button>
          </p>
        </Card>
      </div>
    </div>
  );
}
