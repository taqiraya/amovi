import { Star } from 'lucide-react';
import { getAssetUrl } from '../../../config/assets';

export default function Testimonials({ currentLang }) {
  const isRtl = currentLang === 'fa';

  // لیست دیتای نظرات مسافران متصل به عکس‌های پوشه public با آدرس‌دهی دقیق و مستقیم
  const amoviTestimonials = [
    {
      id: 1,
      name: "Sarah M.",
      avatar: "/images/testimonials/woman.webp",
      location_en: "United Kingdom",
      location_fa: "بریتانیا",
      text_en: "\"Amovi made our journey through Afghanistan feel effortless. Every detail was thoughtfully planned.\"",
      text_fa: "«آمووی باعث شد سفر ما در سراسر افغانستان کاملاً روان و راحت باشد. تک‌تک جزئیات با فکر و دقت برنامه‌ریزی شده بود.»"
    },
    {
      id: 2,
      name: "James T.",
      avatar: "/images/testimonials/man.webp",
      location_en: "Canada",
      location_fa: "کانادا",
      text_en: "\"An incredible experience! The landscapes, people and culture were beyond my expectations.\"",
      text_fa: "«یک تجربه باورنکردنی! مناظر، مردم و فرهنگ اصیل افغانستان فراتر از تمام انتظارات من بود.»"
    },
    {
      id: 3,
      name: "Fatima A.",
      avatar: "/images/testimonials/woman.webp",
      location_en: "UAE",
      location_fa: "امارات متحده عربی",
      text_en: "\"Professional, reliable and truly passionate about what they do. Highly recommended!\"",
      text_fa: "«حرفه‌ای، قابل اعتماد و واقعاً عاشق کاری که انجام می‌دهند. این آژانس مسافرتی را به شدت توصیه می‌کنم!»"
    },
    {
      id: 4,
      name: "Oliver K.",
      avatar: "/images/testimonials/man.webp",
      location_en: "Germany",
      location_fa: "آلمان",
      text_en: "\"The security protocols and elite accompaniment left us feeling completely safe and respected.\"",
      text_fa: "«پروتکل‌های امنیتی و همراهی عالی آژانس باعث شد ما کاملاً احساس امنیت و احترام داشته باشیم.»"
    }
  ];

  // تکثیر دیتای کارت‌ها برای ایجاد چرخه تکرار مکرر بدون گپ بصری
  const marqueeItems = [...amoviTestimonials, ...amoviTestimonials, ...amoviTestimonials, ...amoviTestimonials];

  return (
    <section className="w-full py-16 bg-[#14213D] text-white flex flex-col items-center justify-center border-t border-white/5">
      
      <style>{`
        @keyframes amoviInfiniteMarquee {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-33.3333%, 0, 0); }
        }
        .animate-marquee-infinite {
          animation: amoviInfiniteMarquee 75s linear infinite;
        }
        .marquee-viewport:hover .animate-marquee-infinite {
          animation-play-state: paused;
        }
      `}</style>

      <div className="w-full space-y-12">
        
        {/* ==================== هدر سکشن نظرات ==================== */}
        <div className="w-full max-w-[1220px] mx-auto px-6 md:px-8 flex flex-col items-center text-center space-y-2">
          <span className="text-[#FCA311] text-[10px] sm:text-xs font-bold tracking-widest uppercase font-[Inter]">
            {isRtl ? "داستان مسافران" : "TRAVELER STORIES"}
          </span>
          <h2 
            className="text-2xl sm:text-3xl lg:text-[36px] font-black leading-tight tracking-tight text-white"
            style={{ fontFamily: isRtl ? 'Sahel, sans-serif' : 'Inter, sans-serif' }}
          >
            {isRtl ? "مسافران ما چه می‌گویند" : "What Our Travelers Say"}
          </h2>
        </div>

        {/* ==================== ریل انیمیشنی مکرر ==================== */}
        <div className="w-full overflow-hidden relative marquee-viewport" dir="ltr">
          
          <div className="flex gap-6 w-max px-4 animate-marquee-infinite">
            {marqueeItems.map((item, index) => (
              <div 
                key={`${item.id}-${index}`} 
                className={`flex flex-col space-y-5 p-6 sm:p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-[#FCA311]/30 transition-all duration-300 w-[290px] sm:w-[360px] shrink-0 ${isRtl ? 'text-right' : 'text-left'}`}
                dir={isRtl ? "rtl" : "ltr"}
              >
                {/* بخش پروفایل و اطلاعات مسافر */}
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full border-2 border-white/10 shadow-md shrink-0 overflow-hidden bg-slate-700">
                    <img 
                      src={getAssetUrl(item.avatar)} 
                      alt={item.name} 
                      className="w-full h-full object-cover" 
                      onError={(e) => {
                        // اگر فرمت .webp پیدا نشد، به طور خودکار فرمت .png یا تصویر یوزر پیشفرض را لود می‌کند تا دایره هرگز خالی نماند
                        if (e.target.src.includes('.webp')) {
                          e.target.src = e.target.src.replace('.webp', '.png');
                        } else if (!e.target.dataset.triedFallback) {
                          e.target.dataset.triedFallback = 'true';
                          e.target.src = e.target.src.includes('man') 
                            ? "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80"
                            : "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80";
                        }
                      }}
                    />
                  </div>
                  <div className="flex flex-col items-start justify-center">
                    <span className="font-bold text-base text-white font-[Inter] leading-none">{item.name}</span>
                    <span 
                      className="text-xs text-slate-400 font-light mt-1.5 block" 
                      style={{ fontFamily: isRtl ? 'Sahel, sans-serif' : 'Inter, sans-serif' }}
                    >
                      {isRtl ? item.location_fa : item.location_en}
                    </span>
                    
                    {/* ۵ ستاره طلایی ثابت */}
                    <div className="flex items-center gap-0.5 mt-2">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={11} className="fill-[#FCA311] text-[#FCA311]" />
                      ))}
                    </div>
                  </div>
                </div>

                {/* متن نظر مسافر */}
                <p 
                  className="text-slate-300 text-xs sm:text-sm leading-relaxed font-light italic flex-grow pt-1"
                  style={{ fontFamily: isRtl ? 'Sahel, sans-serif' : 'Inter, sans-serif' }}
                >
                  {isRtl ? item.text_fa : item.text_en}
                </p>
              </div>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
}
