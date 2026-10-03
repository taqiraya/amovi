export default function ProvinceHero({ province, localData, isRtl }) {
  return (
    /* هیرو با قد عمیق، هماهنگ با لایوت و هدر سراسری */
    <section className="w-[100%] max-w-[1600px] mx-auto relative min-h-[560px] h-[92vh] sm:min-h-[640px] md:h-[88vh] overflow-hidden shadow-2xl group z-0 bg-black">
      
      {/* ۱. عکس پس‌زمینه پانورامیک (تضمین لود کامل) */}
      <div className="absolute inset-0 z-0">
        <img 
          src={province.images?.hero_cover} 
          alt={localData?.name} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        {/* گرادینت کف برای رسپانسیو موبایل */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/75 to-transparent md:hidden" />
      </div>

      {/* ۲. لایه گرادینت تیره عمیق دوزبانه (اصلاح شده با کدهای رنگی بومی سیستم برای ایجاد شفافیت واقعی) */}
      <div 
        className={`absolute inset-0 z-10 pointer-events-none w-full h-full hidden md:block ${
          isRtl 
            ? 'bg-gradient-to-l from-black via-black/60 to-transparent' 
            : 'bg-gradient-to-r from-black via-black/60 to-transparent'
        }`}
      />

      {/* ۳. باکس متنی قفل‌شده به کف هیرو با فواصل کاملاً مستقل و پویا */}
      <div 
        className={`absolute bottom-6 sm:bottom-12 md:bottom-[8vh] z-20 w-full max-w-3xl px-4 sm:px-8 md:px-16 ${
          isRtl ? 'right-0 text-right' : 'left-0 text-left'
        }`}
      >
        
        {/* بج طلایی بالایی */}
        <span className="text-[#FCA311] text-xs sm:text-sm font-bold uppercase tracking-[0.25em] mb-1.5 sm:mb-2 block">
          {isRtl ? "ولایت" : "Province"}
        </span>

        {/* عنوان بزرگ طلایی */}
        <h1 
          className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-[#FCA311] leading-tight mb-2 sm:mb-3 drop-shadow-md"
          style={{ fontFamily: isRtl ? 'Sahel, sans-serif' : 'Inter, sans-serif' }}
        >
          {localData?.name}
        </h1>

        {/* شعار ولایت */}
        <p 
          className="text-white text-base sm:text-xl font-medium mb-2.5 sm:mb-4 opacity-95 tracking-wide max-w-xl"
          style={{ fontFamily: isRtl ? 'Sahel, sans-serif' : 'Inter, sans-serif' }}
        >
          {localData?.tagline}
        </p>

        {/* معرفی کوتاه چند خطی */}
        <p 
          className="text-[#E5E5E5] text-xs sm:text-sm md:text-base leading-relaxed mb-6 sm:mb-8 opacity-85 line-clamp-3 sm:line-clamp-4 md:line-clamp-none max-w-2xl"
          style={{ fontFamily: isRtl ? 'Sahel, sans-serif' : 'Inter, sans-serif' }}
        >
          {localData?.intro}
        </p>

        {/* دکمه‌های اکشن هیرو (مطابق دیزاین mockup) */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
          <a
            href="/tours"
            className="inline-flex items-center justify-center gap-2 bg-[#FCA311] hover:bg-amber-500 text-[#14213D] font-extrabold py-3.5 px-8 rounded-full shadow-lg transition-all duration-300 transform active:scale-[0.98] cursor-pointer text-xs sm:text-sm font-[Inter] tracking-wider uppercase w-full sm:w-auto"
          >
            <span style={{ fontFamily: isRtl ? 'Sahel, sans-serif' : 'Inter, sans-serif' }}>
              {isRtl ? "مشاهده تورهای موجود" : "View Available Tours"}
            </span>
            <span className={`text-base font-bold transition-transform duration-200 ${isRtl ? 'rotate-180' : ''}`}>→</span>
          </a>

          <button 
            type="button"
            onClick={() => {
              const targetSection = document.getElementById("explore-hub");
              if (targetSection) targetSection.scrollIntoView({ behavior: "smooth" });
            }}
            className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold py-3.5 px-6 rounded-full border border-white/25 backdrop-blur-sm transition-all duration-200 text-xs sm:text-sm cursor-pointer w-full sm:w-auto"
          >
            <span style={{ fontFamily: isRtl ? 'Sahel, sans-serif' : 'Inter, sans-serif' }}>
              {isRtl ? "دیدنی‌های برتر" : "Explore Places"}
            </span>
            <span>↓</span>
          </button>
        </div>

      </div>
    </section>
  );

}
