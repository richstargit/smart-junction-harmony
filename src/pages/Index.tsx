import intersectionHero from '@/assets/intersection-hero.jpg';
import AppLogo, { APP_NAME } from '@/components/AppLogo';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowRight, Bot, Car, Clock, MapPin, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Index() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Hero section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <img
          src={intersectionHero}
          alt="Traffic intersection"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-background/40" />

        <div className="relative z-10 container px-4 text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <AppLogo size="lg" />
          </div>

          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            {APP_NAME}
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            จราจรที่ดี ทำให้คุณรักทุกการเดินทาง
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" onClick={() => navigate('/login')} className="text-lg px-8">
              <Shield className="w-5 h-5 mr-2" />
              เจ้าหน้าที่
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate('/public')} className="text-lg px-8">
              <MapPin className="w-5 h-5 mr-2" />
              ดูสถานการณ์จราจร
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* Features section */}
      <section className="py-20 bg-card">
        <div className="container px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            ฟีเจอร์หลัก
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-6 text-center">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Bot className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">AI Detection</h3>
              <p className="text-muted-foreground">
                ตรวจจับและนับจำนวนรถยนต์แบบเรียลไทม์
                ด้วยเทคโนโลยี Computer Vision
              </p>
            </Card>

            <Card className="p-6 text-center">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Car className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Smart Control</h3>
              <p className="text-muted-foreground">
                ปรับเวลาไฟจราจรอัตโนมัติ
                ตามความหนาแน่นของการจราจร
              </p>
            </Card>

            <Card className="p-6 text-center">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Clock className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Real-time Info</h3>
              <p className="text-muted-foreground">
                แสดงข้อมูลการจราจรแบบเรียลไทม์
                ให้ประชาชนวางแผนเดินทาง
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t">
        <div className="container px-4 text-center text-muted-foreground">
          <p>© 2026 {APP_NAME}</p>
        </div>
      </footer>
    </div>
  );
}
