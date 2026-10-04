import amoviLogo from '../assets/images/logo.png';

/**
 * کامپوننت لودینگ رسمی آمووی ترول
 * تنها نمایش‌دهنده لوگوی شرکت همراه با هاله نور و حلقه ظریف طلایی (بدون هیچ خط یا نوشته اضافی)
 */
export default function BrandLoader({ 
  fullScreen = false, 
  minHeight = 'min-h-[60vh]' 
}) {
  const content = (
    <div className="flex items-center justify-center select-none animate-fadeIn">
      {/* کانتینر مرکزی لوگو */}
      <div className="relative flex items-center justify-center">
        {/* هاله نور طلایی ملایم */}
        <div className="absolute w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-[#FCA311]/25 blur-xl animate-pulse" />
        
        {/* حلقه چرخشی ظریف طلایی دور لوگو */}
        <div className="absolute w-20 h-20 sm:w-24 sm:h-24 rounded-full border-2 border-transparent border-t-[#FCA311] border-r-[#FCA311]/60 animate-spin" />

        {/* باکس لوگوی رسمی شرکت آمووی ترول */}
        <div className="relative z-10 w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-[#14213D] border border-[#FCA311]/40 p-2.5 shadow-2xl shadow-[#14213D]/30 flex items-center justify-center">
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
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-[9999] bg-white/95 backdrop-blur-md flex items-center justify-center transition-opacity duration-300">
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
