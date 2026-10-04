import { useLangStore } from '../store/useLangStore';
import amoviLogo from '../assets/images/logo.png';

export default function BrandLoader({ 
  message, 
  fullScreen = false, 
  minHeight = 'min-h-[60vh]' 
}) {
  const { currentLang } = useLangStore();
  const isRtl = currentLang === 'fa';

  const defaultMessage = isRtl 
    ? 'در حال آماده‌سازی اطلاعات سفر...' 
    : 'Preparing your travel experience...';

  const content = (
    <div className="flex flex-col items-center justify-center p-6 text-center select-none animate-fadeIn">
      {/* نگهدارنده لوگو همراه با حلقه انیمیشنی طلایی */}
      <div className="relative flex items-center justify-center mb-5">
        {/* هاله نور ملایم پس‌زمینه */}
        <div className="absolute w-28 h-28 rounded-full bg-[#FCA311]/20 blur-xl animate-pulse" />
        
        {/* حلقه چرخشی طلایی دور لوگو */}
        <div className="absolute w-20 h-20 rounded-full border-2 border-transparent border-t-[#FCA311] border-r-[#FCA311]/60 animate-spin" />

        {/* لوگوی رسمی آمووی ترول */}
        <div className="relative z-10 w-16 h-16 rounded-2xl bg-[#14213D] border border-[#FCA311]/40 p-2.5 shadow-xl shadow-[#14213D]/25 flex items-center justify-center">
          <img
            src={amoviLogo}
            alt="Amovi Travel"
            className="w-full h-full object-contain"
            onError={(e) => {
              if (!e.target.dataset.tried) {
                e.target.dataset.tried = 'true';
                e.target.src = '/logo.png';
              }
            }}
          />
        </div>
      </div>

      {/* تایپوگرافی نام برند آمووی */}
      <div className="space-y-0.5 mb-2">
        <h3 className="text-base sm:text-lg font-black text-[#14213D] tracking-wide font-[Inter]">
          Amovi Travel
        </h3>
        <p className="text-[10px] sm:text-xs uppercase tracking-[0.2em] text-[#FCA311] font-bold font-[Inter]">
          Travel & Experiences
        </p>
      </div>

      {/* متن وضعیت لودینگ */}
      <p className="text-xs sm:text-sm text-slate-500 font-medium animate-pulse mt-1">
        {message || defaultMessage}
      </p>

      {/* خط متحرک لودینگ طلایی و سورمه‌ای */}
      <div className="w-28 sm:w-36 h-1 bg-slate-200/80 rounded-full overflow-hidden mt-3">
        <div className="h-full bg-gradient-to-r from-[#14213D] via-[#FCA311] to-[#14213D] rounded-full animate-pulse" />
      </div>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-[9999] bg-white/95 backdrop-blur-md flex items-center justify-center transition-all duration-300">
        {content}
      </div>
    );
  }

  return (
    <div className={`w-full ${minHeight} flex items-center justify-center`}>
      {content}
    </div>
  );
}
