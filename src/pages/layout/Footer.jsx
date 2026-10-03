import { Link } from "react-router-dom";
import { useLangStore } from "../../store/useLangStore";
import { Mail, Phone, MapPin } from "lucide-react";
import SocialLinks from "../../components/SocialLinks";

// لوگوی رسمی آژانس
import amoviLogo from "../../assets/images/logo.png";

function Footer() {
  const { currentLang, translations } = useLangStore();
  const isRtl = currentLang === "fa";

  // لینک‌های ناوبری سریع
  const quickLinks = [
    { name: translations.services || (isRtl ? "خدمات لوکس" : "Services"), path: "/services" },
    { name: translations.destinations || (isRtl ? "مقاصد رویایی" : "Destinations"), path: "/destinations" },
    { name: translations.tours || (isRtl ? "سفرهای ویژه" : "Tours"), path: "/tours" },
    { name: translations.blog || (isRtl ? "مجله سفر" : "Blog"), path: "/blog" },
    { name: translations.nav?.gallery || (isRtl ? "گالری تصاویر" : "Gallery"), path: "/gallery" },
  ];

  // بخش قوانین و حقوقی
  const legalLinks = [
    { name: isRtl ? "سیاست حریم خصوصی" : "Privacy Policy", path: "/privacy-policy" },
    { name: isRtl ? "شرایط و ضوابط عمومی" : "Terms & Conditions", path: "/terms-and-conditions" },
    { name: isRtl ? "مقررات و شرایط رزرو" : "Booking Terms", path: "/booking-terms" },
  ];

  return (
    <footer 
      className={`bg-[#14213D] text-white border-t border-white/10 w-full ${isRtl ? 'text-right font-[Sahel]' : 'text-left font-[Inter]'}`}
      dir={isRtl ? "rtl" : "ltr"}
    >
      {/* کانتینر اصلی محتوای فوتر با عرض استاندارد پروژه */}
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 md:px-8 lg:px-10 py-12 md:py-14">
        
        {/* گرید هوشمند مچ‌شده با عکس: در موبایل ۲ ستونه با فاصله‌های بهینه شده */}
        <div className="grid gap-y-8 gap-x-6 sm:gap-x-8 grid-cols-2 md:grid-cols-4 lg:grid-cols-[1.5fr_1fr_1.2fr_1fr] lg:gap-8 xl:gap-14">
          
          {/* ستون اول: معرفی آژانس و شبکه‌های اجتماعی */}
          <div className="col-span-2 md:col-span-1 flex flex-col items-start">
            <Link to="/" className={`flex items-center gap-2.5 ${isRtl ? 'flex-row-reverse text-right md:flex-row md:text-left' : ''}`}>
              <img 
                src={amoviLogo} 
                alt="Amovi Travel" 
                className="h-10 w-auto object-contain rounded-xl border border-[#FCA311]"
                onError={(e) => {
                  if (!e.target.dataset.tried) {
                    e.target.dataset.tried = 'true';
                    e.target.src = '/logo.png';
                  }
                }}
              />
              <div dir="ltr" className="text-left">
                <span className="block text-[16px] font-extrabold leading-tight tracking-wide text-white font-[Inter]">
                  Amovi Travel
                </span>
                <span className="block text-[8px] font-bold uppercase tracking-[0.12em] text-[#FCA311] font-[Inter]">
                  Travel & Experiences
                </span>
              </div>
            </Link>
            
            <p className="mt-4 max-w-sm text-[13px] leading-6 text-slate-300 font-light">
              {isRtl 
                ? "آمووی ترول: کشف جاذبه‌های باشکوه و ناشناخته افغانستان از طریق سفرهایی پرمعنا، مقاصد استثنایی و تجربه‌های مسافرتی لوکس و VIP که کاملاً اختصاصی طراحی شده‌اند."
                : "Amovi Travel: Explore Afghanistan through meaningful journeys, remarkable destinations, and carefully crafted travel experiences."}
            </p>
            
            {/* شبکه‌های اجتماعی رسمی ۷ گانه */}
            <SocialLinks variant="footer" />
          </div>

          {/* ستون دوم: لینک‌های سریع */}
          <div className="col-span-1 flex flex-col items-start">
            <h3 className="text-[14px] font-bold text-white tracking-wide border-b border-white/10 pb-1.5 w-fit">
              {isRtl ? "دسترسی سریع" : "Quick Links"}
            </h3>
            <nav className="mt-4 flex flex-col gap-2.5">
              {quickLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className="w-fit text-[13px] text-slate-300 transition-colors duration-200 hover:text-[#FCA311] font-medium"
                >
                  {link.name}
                </Link>
              ))}
            </nav>
          </div>

          {/* ستون سوم: اطلاعات ارتباطی مجهز به تراز متراکم در ۳۲۵ پیکسل */}
          <div className="col-span-1 flex flex-col items-start">
            <h3 className="text-[14px] font-bold text-white tracking-wide border-b border-white/10 pb-1.5 w-fit">
              {isRtl ? "ارتباط با ما" : "Contact Us"}
            </h3>
            <nav className="mt-4 flex flex-col gap-3.5 w-full overflow-hidden">
              <a 
                href="mailto:info@amovitravel.com" 
                className={`inline-flex items-center gap-2 text-[13px] text-slate-300 transition-colors duration-200 hover:text-[#FCA311] font-medium group cursor-pointer w-fit ${isRtl ? 'flex-row-reverse' : ''}`}
              >
                <Mail size={14} className="text-slate-400 group-hover:text-[#FCA311] shrink-0" />
                <span className="font-[Inter] text-xs sm:text-sm">info@amovitravel.com</span>
              </a>

              <a 
                href="tel:+93700000000" 
                className={`inline-flex items-center gap-2 text-[13px] text-slate-300 transition-colors duration-200 hover:text-[#FCA311] font-medium group cursor-pointer w-fit ${isRtl ? 'flex-row-reverse' : ''}`}
                dir="ltr"
              >
                <Phone size={14} className="text-slate-400 group-hover:text-[#FCA311] shrink-0" />
                <span className="font-[Inter] text-xs sm:text-sm">+93 700 000 000</span>
              </a>

              <div className={`inline-flex items-center gap-2 text-[13px] text-slate-300 transition-colors duration-200 hover:text-[#FCA311] font-medium group w-fit ${isRtl ? 'flex-row-reverse' : ''}`}>
                <MapPin size={14} className="text-slate-400 group-hover:text-[#FCA311] shrink-0" />
                <span className="text-xs sm:text-sm">{isRtl ? "چهارراهی انصاری، شهرنو، کابل" : "Ansari Square, Shahr-e Naw, Kabul"}</span>
              </div>
            </nav>
          </div>

          {/* ستون چهارم: بخش قوانین و حریم خصوصی */}
          <div className="col-span-1 flex flex-col items-start">
            <h3 className="text-[14px] font-bold text-white tracking-wide border-b border-white/10 pb-1.5 w-fit">
              {isRtl ? "قوانین و مقررات" : "Legal"}
            </h3>
            <nav className="mt-4 flex flex-col gap-2.5">
              {legalLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className="w-fit text-[13px] text-slate-300 transition-colors duration-200 hover:text-[#FCA311] font-medium"
                >
                  {link.name}
                </Link>
              ))}
            </nav>
          </div>

        </div>
      </div>

      {/* نوار حقوق مادی و معنوی نهایی */}
      <div className="border-t border-white/5 bg-black/30 py-4 w-full">
        <div className="mx-auto flex max-w-[1440px] items-center justify-center px-4 text-center">
          <p className="text-[11px] text-slate-400 font-light tracking-wide font-[Inter]">
            {isRtl 
              ? `© ${new Date().getFullYear()} آمووی ترول. تمامی حقوق محفوظ است.`
              : `© ${new Date().getFullYear()} Amovi Travel. All Rights Reserved.`}
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
