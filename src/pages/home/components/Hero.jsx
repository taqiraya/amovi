import { Link } from 'react-router-dom';
// ایمپورت کردن تصاویر پروژه
import heroBg from '../../../assets/images/hero-bg.webp';
import heroMain from '../../../assets/images/hero-main.webp';
import heroTop from '../../../assets/images/hero-top.webp';
import heroBottom from '../../../assets/images/hero-bottom.webp';

export default function Hero({ currentLang }) {
  const isRtl = currentLang === 'fa';

  return (
    <section className="relative w-full min-h-[640px] py-14 sm:py-20 md:py-0 md:h-[95vh] md:min-h-[720px] md:max-h-[950px] flex flex-col justify-center overflow-hidden bg-[#14213D]" dir="ltr">

      {/* تصویر پس‌زمینه سراسری - در حالت دری عکس فلیپ می‌شود */}
      <div 
        className={`absolute inset-0 z-0 bg-cover bg-center bg-no-repeat transition-transform duration-500 ${isRtl ? 'scale-x-[-1]' : ''}`}
        style={{ backgroundImage: `url(${heroBg})` }}
      />

      {/* ۲. لایه گرادینت سرمه‌ای تیره هوشمند */}
      <div className={`absolute inset-y-0 w-full md:w-[55%] z-10 pointer-events-none transition-all duration-500
        ${isRtl 
          ? 'right-0 left-auto bg-gradient-to-l from-[#14213D]/95 via-[#14213D]/75 to-transparent' 
          : 'left-0 right-auto bg-gradient-to-r from-[#14213D]/95 via-[#14213D]/75 to-transparent'
        }`} 
      />

      {/* ۳. کانتینر اصلی محتوا با عرض دقیق ۱۲۲۰ پیکسل */}
      <div className="w-full max-w-[1220px] mx-auto px-4 sm:px-6 md:px-8 grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-4 lg:gap-8 items-center relative z-20 h-full pt-16 pb-8 md:py-0 text-left" dir="ltr">
        
        {/* بخش متن هیرو */}
        <div 
          className={`w-full md:col-span-6 flex flex-col justify-center space-y-4 sm:space-y-6 lg:-mt-6 
            ${isRtl ? 'md:order-2 items-stretch text-right' : 'md:order-1 items-start text-left'}`}
          dir={isRtl ? "rtl" : "ltr"}
        >
          <div className={`space-y-2 sm:space-y-3 flex flex-col w-full ${isRtl ? 'items-stretch' : 'items-start'}`}>
            <span className="text-[#FCA311] font-bold tracking-widest text-xs md:text-sm block uppercase font-[Inter]">
              {isRtl ? 'آمووی ترول' : 'AMOVI TRAVEL'}
            </span>
            
            <h1 
              className="text-3xl sm:text-4xl md:text-[36px] lg:text-[46px] xl:text-[48px] font-extrabold leading-[1.25] sm:leading-[1.2] text-white tracking-tight w-full"
              style={{ fontFamily: isRtl ? 'Sahel, sans-serif' : 'Inter, sans-serif' }}
            >
              {isRtl ? (
                <span className="whitespace-normal block w-full">
                  کشف زیبایی‌های <br />
                  <span className="text-[#FCA311]">ناشناخته افغانستان</span>
                </span>
              ) : (
                <>
                  Discover the <br />
                  Unseen Afghanistan
                </>
              )}
            </h1>
            
            <p 
              className="text-gray-200/90 text-xs sm:text-sm md:text-[14px] lg:text-[15px] max-w-xs sm:max-w-md leading-relaxed font-light w-full"
              style={{ fontFamily: isRtl ? 'Sahel, sans-serif' : 'Inter, sans-serif' }}
            >
              {isRtl 
                ? 'سفری فراتر از زمان به قلب مناظر بکر، فرهنگ غنی و تاریخ اصیل که برای همیشه در یاد شما تکرار خواهد شد.' 
                : 'Journey beyond the ordinary and discover Afghanistan through unforgettable landscapes, culture, history and authentic experiences.'}
            </p>
          </div>

          {/* دکمه مشاهده تورها */}
          <div className="flex pt-1">
            <Link 
              to="/tours"
              className="flex items-center gap-3 bg-[#FCA311] hover:bg-[#e08f0a] text-[#14213D] font-extrabold px-5 py-2.5 sm:px-6 sm:py-3 rounded-full transition-all duration-300 shadow-md shadow-[#FCA311]/10 group text-xs tracking-wider uppercase cursor-pointer font-[Inter]"
            >
              <span>{isRtl ? 'مشاهده تورها' : 'Explore Tours'}</span>
              <svg className={`w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1 ${isRtl ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Link>
          </div>
        </div>

        {/* ۴. بخش تصاویر دایره‌ای هیرو */}
        <div className={`w-full md:col-span-6 flex items-center relative mt-4 md:mt-0 lg:mt-12 pb-6 md:pb-0
          ${isRtl ? 'md:order-1 justify-start' : 'md:order-2 justify-end'}`}
        >
          {/* کانتینر اصلی کلاژ دایره‌ای با ابعاد واکنش‌گرا برای موبایل، آیپد و دسکتاپ */}
          <div className="relative mx-auto md:mx-0 w-[270px] h-[270px] sm:w-[350px] sm:h-[350px] md:w-[320px] md:h-[320px] lg:w-[460px] lg:h-[460px] xl:w-[540px] xl:h-[540px]">
            
            {/* دایره بزرگ پایه در بالا */}
            <div className={`absolute w-[180px] h-[180px] sm:w-[240px] sm:h-[240px] md:w-[220px] md:h-[220px] lg:w-[320px] lg:h-[320px] xl:w-[370px] xl:h-[370px] rounded-full border-4 lg:border-[6px] border-[#FCA311] overflow-hidden shadow-2xl z-10 top-2 sm:top-4 transition-all duration-500
              ${isRtl ? 'left-2 sm:left-6 md:left-4 lg:left-8' : 'right-2 sm:right-6 md:right-4 lg:right-8'}`}
            >
              <img src={heroMain} alt="Main Luxury View" className="w-full h-full object-cover" />
            </div>

            {/* دایره متوسط سمت چپ */}
            <div className={`absolute w-[130px] h-[130px] sm:w-[170px] sm:h-[170px] md:w-[160px] md:h-[160px] lg:w-[220px] lg:h-[220px] xl:w-[260px] xl:h-[260px] rounded-full border-4 lg:border-[6px] border-[#FCA311] overflow-hidden shadow-2xl z-20 bottom-2 transition-all duration-500
              ${isRtl ? 'right-2 sm:right-5 md:right-3 lg:right-6' : 'left-2 sm:left-5 md:left-3 lg:left-6'}`}
            >
              <img src={heroTop} alt="Top Experience" className="w-full h-full object-cover" />
            </div>

            {/* دایره کوچک رویی */}
            <div className={`absolute w-[100px] h-[100px] sm:w-[130px] sm:h-[130px] md:w-[125px] md:h-[125px] lg:w-[170px] lg:h-[170px] xl:w-[200px] xl:h-[200px] rounded-full border-4 lg:border-[6px] border-[#FCA311] overflow-hidden shadow-2xl z-30 bottom-8 sm:bottom-10 transition-all duration-500
              ${isRtl ? 'left-0 sm:-left-2' : 'right-0 sm:-right-2 md:right-0 lg:-right-4 xl:-right-8'}`}
            >
              <img src={heroBottom} alt="Bottom Experience" className="w-full h-full object-cover" />
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
