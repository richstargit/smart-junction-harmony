import { useNavigate } from 'react-router-dom';

interface AppLogoProps {
    /** ขนาดของ logo: 'sm' สำหรับ navbar, 'lg' สำหรับ hero */
    size?: 'sm' | 'lg';
    /** แสดงคำอธิบายย่อยใต้ชื่อหรือไม่ */
    showSubtitle?: boolean;
    /** คลิกแล้วกลับหน้าแรกหรือไม่ */
    clickable?: boolean;
    /** สีข้อความ (ใช้กับพื้นหลังเข้ม) */
    variant?: 'default' | 'light';
}

// ===== แก้ชื่อเว็บ + คำอธิบายที่นี่ที่เดียว =====
const APP_NAME = 'Traffic in Love';
const APP_SUBTITLE = 'ระบบควบคุมจราจรอัจฉริยะ';

export default function AppLogo({
    size = 'sm',
    showSubtitle = false,
    clickable = false,
    variant = 'default'
}: AppLogoProps) {
    const navigate = useNavigate();

    const isLarge = size === 'lg';
    const isLight = variant === 'light';

    const content = (
        <div className={`flex items-center gap-${isLarge ? '3' : '2'}`}>
            {/* ===== แก้ Logo Icon ที่นี่ ===== */}
            <div className={`p-${isLarge ? '3' : '2'} w-[70px] h-[70px] overflow-hidden`}>
                <img src="Traffic_inlove_logo.png" alt="" className='w-full h-full object-cover rounded-md' />
            </div>
            <div>
                <span className={`font-bold ${isLarge ? 'text-2xl' : 'text-lg'} ${isLight ? 'text-background' : ''}`}>
                    {APP_NAME}
                </span>
                {showSubtitle && (
                    <p className={`text-sm ${isLight ? 'text-background/70' : 'text-muted-foreground'}`}>
                        {APP_SUBTITLE}
                    </p>
                )}
            </div>
        </div>
    );

    if (clickable) {
        return (
            <button
                onClick={() => navigate('/')}
                className="hover:opacity-80 transition-opacity"
                aria-label="กลับหน้าแรก"
            >
                {content}
            </button>
        );
    }

    return content;
}

export { APP_NAME, APP_SUBTITLE };

