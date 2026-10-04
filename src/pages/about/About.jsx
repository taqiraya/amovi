import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  Compass, 
  Star, 
  Sparkles, 
  HeartHandshake, 
  Lightbulb, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2 
} from 'lucide-react';
import { useLangStore } from '../../store/useLangStore';
import { createMasterRequest } from '../../services/api';
import SEO from '../../components/SEO';

// ایمپورت تصاویر اصلی
import heroBg from '../../assets/images/hero-bg.webp';
import aboutImg1 from '../../assets/images/about-1.webp';
import aboutImg2 from '../../assets/images/about-2.webp';

export default function About() {
  const { currentLang, translations } = useLangStore();
  const isRtl = currentLang === 'fa';
  const t = translations?.aboutPage || {};

  // استیت‌های فرم درخواست انتهای صفحه
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneWhatsApp: '',
    preferredDate: '',
    packageOrService: 'Bespoke Afghanistan Journey',
    additionalRequirements: '',
    agreeTerms: true
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await createMasterRequest({
        ...formData,
        submittedAt: new Date().toISOString()
      });
      setIsSubmitting(false);
      setSubmitSuccess(true);
      setFormData({
        fullName: '',
        email: '',
        phoneWhatsApp: '',
        preferredDate: '',
        packageOrService: 'Bespoke Afghanistan Journey',
        additionalRequirements: '',
        agreeTerms: true
      });
      setTimeout(() => setSubmitSuccess(false), 6000);
    } catch (err) {
      console.error('Error submitting request:', err);
      setIsSubmitting(false);
      alert(isRtl ? 'خطا در ثبت درخواست. لطفاً دوباره تلاش کنید.' : 'Failed to submit request. Please try again.');
    }
  };

  // نگاشت آیکون‌ها برای ۶ ارزش اصلی برند
  const getValueIcon = (index) => {
    switch (index) {
      case 0:
        return <ShieldCheck size={24} className="text-white" />;
      case 1:
        return <Compass size={24} className="text-white" />;
      case 2:
        return <Sparkles size={24} className="text-white" />;
      case 3:
        return <Star size={24} className="fill-white text-white" />;
      case 4:
        return <HeartHandshake size={24} className="text-white" />;
      case 5:
        return <Lightbulb size={24} className="text-white" />;
      default:
        return <Compass size={24} className="text-white" />;
    }
  };

  return (
    <div className={`w-full bg-[#F8FAFC] min-h-screen text-[#14213D] ${isRtl ? 'font-[Sahel]' : 'font-[Inter]'}`}>
      <SEO 
        title={isRtl ? 'درباره ما | آمووی ترول' : 'About Us | Amovi Travel'}
        description={isRtl 
          ? 'آشنایی با آمووی ترول؛ پیشگام در ارائه سفرهای اصیل، مسئولانه و برنامه‌ریزی‌شده در افغانستان با تاکید بر امنیت، احترام به فرهنگ محلی و تعالی حرفه‌ای.'
          : 'About Amovi Travel — Pioneering authentic, safe, and thoughtfully planned journeys across Afghanistan with deep cultural respect and uncompromising safety standards.'}
        canonicalUrl="https://amovi.travel/about"
      />
      
      {/* ========================================================
          ۱. هیرو سکشن اصلی صفحه درباره ما (Brand Profile: Amovi Explore Afghanistan)
      ======================================================== */}
      <section className="relative w-full pt-32 pb-16 sm:pt-40 sm:pb-28 overflow-hidden bg-[#14213D] text-white">
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-50 scale-105"
          style={{ backgroundImage: `url(${heroBg})` }}
        />
        <div className="absolute inset-0 z-10 bg-gradient-to-b from-[#14213D]/95 via-[#14213D]/80 to-[#14213D] pointer-events-none" />

        <div className={`relative z-20 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 ${isRtl ? 'text-right' : 'text-left'}`}>
          <span className="inline-block text-[#FCA311] text-xs font-bold uppercase tracking-[0.2em] mb-2 font-[Inter]">
            {t.heroEyebrow || (isRtl ? 'پروفایل برند' : 'BRAND PROFILE')}
          </span>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight">
            <span className="relative inline-block pb-1 after:absolute after:bottom-0 after:left-0 after:w-full after:h-1 after:bg-[#FCA311] after:rounded-full">
              {t.heroTitlePrefix || (isRtl ? 'آمووی؛ کاوش در ' : 'Amovi Explore ')}
            </span>{' '}
            <span className="text-[#FCA311]">
              {t.heroTitleHighlight || (isRtl ? 'افغانستان' : 'Afghanistan')}
            </span>
          </h1>

          <p className="mt-4 text-slate-300 text-sm sm:text-base md:text-lg max-w-2xl font-light leading-relaxed">
            {t.heroSubtitle || (isRtl 
              ? 'جایی که هر سفر به تجربه‌ای امن، الهام‌بخش و فراموش‌نشدنی تبدیل می‌شود.' 
              : 'Where every journey becomes a safe, inspiring, and unforgettable experience.')}
          </p>
        </div>
      </section>

      {/* ========================================================
          ۲. بخش داستان برند و رسالت آمووی (About Amovi Explore Afghanistan)
      ======================================================== */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center" dir={isRtl ? 'rtl' : 'ltr'}>
          
          {/* ستون متن معرفی و رسالت برند */}
          <div className={`lg:col-span-6 space-y-5 ${isRtl ? 'text-right' : 'text-left'}`}>
            <span className="text-[#FCA311] text-xs font-bold uppercase tracking-widest block font-[Inter]">
              {t.brandStoryEyebrow || (isRtl ? 'درباره آمووی ترول' : 'ABOUT AMOVI EXPLORE AFGHANISTAN')}
            </span>

            <h2 className="text-2xl sm:text-4xl font-black text-[#14213D] leading-tight tracking-tight">
              {t.brandStoryTitle || (isRtl ? 'معرفی شگفتی‌های افغانستان از دریچه‌ای تازه و روشن' : 'Introducing Afghanistan From a Fresh and Positive Perspective')}
            </h2>

            <p className="text-slate-600 text-sm sm:text-base leading-relaxed font-normal">
              {t.brandStoryText1 || (isRtl 
                ? 'آمووی اکسپلور افغانستان، برندی گردشگری است که با هدف معرفی میراث استثنایی تاریخی، فرهنگی و طبیعی افغانستان به جهانیان از دیدگاهی نو، پویا و مثبت پایه‌گذاری شده است.' 
                : 'Amovi Explore Afghanistan is a tourism brand dedicated to introducing Afghanistan’s remarkable historical, cultural, and natural heritage to the world from a fresh and positive perspective.')}
            </p>

            <p className="text-slate-600 text-sm sm:text-base leading-relaxed font-normal">
              {t.brandStoryText2 || (isRtl 
                ? 'آمووی از پیوند عشق عمیق به سرزمین، فرهنگ و میراث افغانستان با دیدگاهی نوین و بین‌المللی متولد شد. رسالت ما ساختن پلی از جنس اعتماد میان گنجینه‌های پنهان این سرزمین و مسافران مشتاق سراسر جهان است.' 
                : 'Amovi was founded from a deep appreciation for Afghanistan’s land, culture, and heritage, combined with a modern international vision for tourism. Our role is to build a bridge of trust between these hidden treasures and travelers.')}
            </p>

            {/* کوت‌باکس با بوردر طلایی عینا مطابق طرح تمپلت */}
            <div className={`border-l-4 rtl:border-r-4 rtl:border-l-0 border-[#FCA311] ps-4 pe-2 py-3 bg-amber-50/50 rounded-r-xl rtl:rounded-l-xl rtl:rounded-r-none mt-6`}>
              <p className="italic font-bold text-[#14213D] text-sm sm:text-base leading-relaxed">
                {t.brandStoryQuote || (isRtl 
                  ? '«با آمووی، هر سفر فراتر از یک مقصد است؛ روایتی تازه است برای بازگو کردن.»' 
                  : '“With Amovi, every journey is more than a destination—it is a new story to tell.”')}
              </p>
            </div>
          </div>

          {/* ستون تصاویر کلاژ هم‌پوشان */}
          <div className="lg:col-span-6 relative pb-8 sm:pb-12">
            <div className="relative w-full max-w-sm sm:max-w-md lg:max-w-lg mx-auto">
              
              {/* عکس بزرگ پس‌زمینه */}
              <div className="w-[85%] rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl border-2 sm:border-4 border-white bg-slate-200 aspect-[4/3]">
                <img
                  src={aboutImg1}
                  alt="Afghanistan Landscapes"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                  onError={(e) => {
                    if (!e.target.dataset.tried) {
                      e.target.dataset.tried = 'true';
                      e.target.src = '/images/provinces/kabul/kabul-hero.webp';
                    }
                  }}
                />
              </div>

              {/* عکس جلو هم‌پوشان با سایه عمیق */}
              <div className={`w-[60%] rounded-xl sm:rounded-2xl overflow-hidden shadow-2xl border-2 sm:border-4 border-white bg-slate-300 aspect-[4/3] absolute -bottom-4 sm:-bottom-6 ${isRtl ? 'left-0' : 'right-0'} hover:scale-105 transition-transform duration-500`}>
                <img
                  src={aboutImg2}
                  alt="Cultural Heritage"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    if (!e.target.dataset.tried) {
                      e.target.dataset.tried = 'true';
                      e.target.src = '/images/provinces/kabul/kabul-culture.webp';
                    }
                  }}
                />
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* ========================================================
          ۳. بخش چشم‌انداز و ماموریت (Vision & Mission)
      ======================================================== */}
      <section className="w-full py-14 sm:py-20 bg-[#14213D] text-white relative overflow-hidden">
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-20 pointer-events-none"
          style={{ backgroundImage: `url(${heroBg})` }}
        />
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8" dir={isRtl ? 'rtl' : 'ltr'}>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 lg:gap-10 items-stretch">
            
            {/* چشم‌انداز (Vision) */}
            <div className={`space-y-3.5 bg-white/5 p-6 sm:p-7 md:p-8 rounded-2xl sm:rounded-3xl border border-white/10 backdrop-blur-sm flex flex-col justify-between ${isRtl ? 'text-right' : 'text-left'}`}>
              <div className="space-y-3.5">
                <span className="text-[#FCA311] text-xs font-bold uppercase tracking-widest block font-[Inter]">
                  {t.visionEyebrow || (isRtl ? 'چشم‌انداز و اهداف کلان' : 'OUR VISION & OBJECTIVES')}
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-white">
                  {t.visionTitle || (isRtl ? 'تبدیل شدن به معتمدترین و معتبرترین برند گردشگری افغانستان' : "To Become Afghanistan's Most Trusted Tourism Brand")}
                </h3>
                <p className="text-slate-300 text-xs sm:text-sm leading-relaxed font-light">
                  {t.visionText || (isRtl 
                    ? 'ما آینده‌ای را ترسیم می‌کنیم که در آن، افغانستان بر روی نقشه گردشگری جهانی به عنوان مقصدی الهام‌بخش شناخته شود؛ جایی که هر سفر، تجربه‌ای پرمعنا و داستانی نو خلق کند.' 
                    : 'We envision a future where Afghanistan is recognized on the global tourism map as an inspiring destination.')}
                </p>
                <p className="text-slate-300 text-xs sm:text-sm leading-relaxed font-light pt-1">
                  {t.objectiveText || (isRtl 
                    ? 'هدف ما ارائه تجربه‌ای اصیل و متمایز از افغانستان بر پایه اعتماد، امنیت کامل، رفاه و استانداردهای عالی بین‌المللی است.' 
                    : 'Our objective is to provide an authentic and distinctive experience of Afghanistan, built on trust, safety, and comfort.')}
                </p>
              </div>
            </div>

            {/* ماموریت (Mission) */}
            <div className={`space-y-3.5 bg-white/5 p-6 sm:p-7 md:p-8 rounded-2xl sm:rounded-3xl border border-white/10 backdrop-blur-sm flex flex-col justify-between ${isRtl ? 'text-right' : 'text-left'}`}>
              <div className="space-y-3.5">
                <span className="text-[#FCA311] text-xs font-bold uppercase tracking-widest block font-[Inter]">
                  {t.missionEyebrow || (isRtl ? 'ماموریت ما' : 'OUR MISSION')}
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-white">
                  {t.missionTitle || (isRtl ? 'سفرهایی امن، الهام‌بخش، آموزنده و سرشار از لذت' : 'Safe, Educational, Inspiring, and Enjoyable Journeys')}
                </h3>
                <p className="text-slate-300 text-xs sm:text-sm leading-relaxed font-light">
                  {t.missionText || (isRtl 
                    ? 'مأموریت ما ارائه سفرهایی امن، آموزنده، الهام‌بخش و لذت‌بخش است که آگاهی بومی، همراهی راهنمایان باسابقه و پشتیبانی چندزبانه حرفه‌ای را در هم می‌آمیزد.' 
                    : 'Our mission is to provide safe, educational, inspiring, and enjoyable travel experiences combining local knowledge, experienced regional guides, and professional support.')}
                </p>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ========================================================
          ۴. بخش ۶ ارزش بنیادین برند آمووی (Our 6 Core Values)
      ======================================================== */}
      <section className="w-full py-14 sm:py-20 lg:py-24 bg-white border-b border-slate-200/60">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14 space-y-2">
            <span className="text-[#FCA311] text-xs font-bold uppercase tracking-widest block font-[Inter]">
              {t.valuesEyebrow || (isRtl ? 'ارزش‌های بنیادین ما' : 'OUR CORE VALUES')}
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#14213D]">
              {t.valuesTitle || (isRtl ? 'شش اصل راهنما در تمام سفرهای آمووی' : 'Six Principles That Guide Every Journey')}
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">
              {t.valuesSubtitle || (isRtl 
                ? 'این ارزش‌ها مبنای تعهد ما نسبت به مسافران، جوامع محلی و حفاظت از میراث ماندگار افغانستان است.' 
                : 'These values define our commitments to our guests, local communities, and the heritage of Afghanistan.')}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 lg:gap-8" dir={isRtl ? 'rtl' : 'ltr'}>
            {(t.valuesList || [
              { id: 'trust', title: 'Trust & Safety', desc: 'Creating a safe, reliable, and comfortable environment for every traveler.' },
              { id: 'respect', title: 'Respect for Culture & Heritage', desc: 'Approaching Afghanistan’s history and traditions with genuine respect.' },
              { id: 'authenticity', title: 'Authentic & Unique Experiences', desc: 'Creating journeys that reveal the authentic character of Afghanistan.' },
              { id: 'quality', title: 'Quality & International Standards', desc: 'Providing high-quality services based on modern international standards.' },
              { id: 'sustainability', title: 'Sustainability & Social Responsibility', desc: 'Supporting local communities and respecting the natural environment.' },
              { id: 'innovation', title: 'Innovation & Continuous Progress', desc: 'Embracing new ideas to improve traveler experience.' }
            ]).map((val, idx) => (
              <div 
                key={val.id || idx}
                className={`bg-[#F8FAFC] p-5 sm:p-6 lg:p-7 rounded-2xl sm:rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-xl hover:border-[#FCA311]/40 transition-all duration-300 hover:-translate-y-1 space-y-3.5 sm:space-y-4 ${isRtl ? 'text-right' : 'text-left'}`}
              >
                <div className="w-12 h-12 rounded-full bg-[#14213D] text-[#FCA311] border border-[#FCA311]/40 flex items-center justify-center shadow-md shadow-[#14213D]/20 shrink-0">
                  {getValueIcon(idx)}
                </div>
                <h3 className="text-base sm:text-lg lg:text-xl font-bold text-[#14213D]">
                  {val.title}
                </h3>
                <p className="text-slate-500 text-xs sm:text-sm leading-relaxed font-normal">
                  {val.desc}
                </p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ========================================================
          ۵. بخش دستاوردها و آمارها (Numbers That Tell Our Story)
      ======================================================== */}
      <section className="w-full py-14 sm:py-20 bg-[#14213D] text-white relative overflow-hidden">
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-20 pointer-events-none"
          style={{ backgroundImage: `url(${heroBg})` }}
        />
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center space-y-2 mb-10">
            <span className="text-[#FCA311] text-xs font-bold uppercase tracking-widest font-[Inter]">
              {t.statsEyebrow || (isRtl ? 'دستاوردهای ما' : 'OUR ACHIEVEMENTS')}
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              {t.statsTitle || (isRtl ? 'اعدادی که داستان ما را می‌گویند' : 'Numbers That Tell Our Story')}
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 text-center" dir="ltr">
            
            {/* ۱. جاذبه‌های بکر */}
            <div className="space-y-1">
              <span className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#FCA311] font-[Inter] tracking-tight block">
                {t.stats?.gemsNumber || '50+'}
              </span>
              <p className="text-xs sm:text-sm text-slate-300 font-medium font-sans">
                {t.stats?.gemsLabel || (isRtl ? 'جاذبه‌های بکر کشف‌شده' : 'Hidden Gems Explored')}
              </p>
            </div>

            {/* ۲. تورهای امن */}
            <div className="space-y-1">
              <span className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#FCA311] font-[Inter] tracking-tight block">
                {t.stats?.toursNumber || '100%'}
              </span>
              <p className="text-xs sm:text-sm text-slate-300 font-medium font-sans">
                {t.stats?.toursLabel || (isRtl ? 'تورهای ایمن و اختصاصی' : 'Secure Tours')}
              </p>
            </div>

            {/* ۳. ولایات پوشش داده شده */}
            <div className="space-y-1">
              <span className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#FCA311] font-[Inter] tracking-tight block">
                {t.stats?.provincesNumber || '12+'}
              </span>
              <p className="text-xs sm:text-sm text-slate-300 font-medium font-sans">
                {t.stats?.provincesLabel || (isRtl ? 'ولایات تحت پوشش' : 'Afghan Provinces')}
              </p>
            </div>

            {/* ۴. امتیاز VIP */}
            <div className="space-y-1">
              <span className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#FCA311] font-[Inter] tracking-tight flex items-center justify-center gap-1.5">
                <span>{t.stats?.ratingNumber || (isRtl ? '۵.۰' : '5.0')}</span>
                <Star className="w-5 h-5 sm:w-6 sm:h-6 fill-[#FCA311] text-[#FCA311] inline shrink-0" />
              </span>
              <p className="text-xs sm:text-sm text-slate-300 font-medium font-sans">
                {t.stats?.ratingLabel || (isRtl ? 'امتیاز مسافران VIP' : 'VIP Rating')}
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* ========================================================
          ۶. بخش آماده برنامه‌ریزی سفر و فرم درخواست (Ready to Plan?)
      ======================================================== */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch" dir={isRtl ? 'rtl' : 'ltr'}>
          
          {/* ستون چپ: بنر تصویری دعوت به تماس */}
          <div className="lg:col-span-5 relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl min-h-[320px] sm:min-h-[360px] lg:min-h-[380px] flex flex-col justify-between p-6 sm:p-8 md:p-10 text-white bg-[#14213D]">
            <div 
              className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-40 scale-105"
              style={{ backgroundImage: `url(${heroBg})` }}
            />
            <div className="absolute inset-0 z-10 bg-gradient-to-t from-[#14213D] via-[#14213D]/70 to-transparent pointer-events-none" />

            <div className={`relative z-20 space-y-3 ${isRtl ? 'text-right' : 'text-left'}`}>
              <span className="text-[#FCA311] text-xs font-bold uppercase tracking-widest block font-[Inter]">
                {t.ctaEyebrow || (isRtl ? 'آماده سفر هستید؟' : 'READY TO PLAN?')}
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight">
                {t.ctaTitle || (isRtl ? 'درخواست تجربه سفر اختصاصی شما' : 'Request Your Experience')}
              </h2>
              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed font-light">
                {t.ctaSubtitle || (isRtl 
                  ? 'به ما بگویید چه چیزی نیاز دارید تا تیم ما در برنامه‌ریزی گام‌های بعدی به شما کمک کند.' 
                  : 'Tell us what you need and our team can help plan the next step.')}
              </p>
            </div>

            <div className={`relative z-20 pt-6 ${isRtl ? 'text-right' : 'text-left'}`}>
              <Link
                to="/contact"
                className="inline-flex items-center justify-center gap-2 bg-[#FCA311] hover:bg-amber-500 text-[#14213D] font-bold py-3 px-6 rounded-full shadow-lg transition-all duration-200 text-xs sm:text-sm group uppercase font-[Inter] tracking-wider w-full sm:w-auto"
              >
                <span>{t.ctaButton || (isRtl ? 'تماس با ما' : 'Contact Us')}</span>
                {isRtl ? (
                  <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" strokeWidth={2.5} />
                ) : (
                  <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" strokeWidth={2.5} />
                )}
              </Link>
            </div>
          </div>

          {/* ستون راست: فرم ثبت درخواست */}
          <div className="lg:col-span-7 bg-white p-5 sm:p-7 md:p-8 rounded-2xl sm:rounded-3xl border border-slate-200 shadow-xl space-y-4">
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-[#14213D]">
                {t.formTitle || (isRtl ? 'ثبت درخواست این پکیج / خدمت' : 'Request This Package / Service')}
              </h3>
            </div>

            {submitSuccess && (
              <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center gap-2.5 text-xs sm:text-sm font-medium">
                <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
                <span>{isRtl ? 'درخواست شما با موفقیت ثبت شد!' : 'Your inquiry has been submitted successfully!'}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3.5">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-[#14213D] mb-1">
                    {isRtl ? 'نام کامل' : 'Full Name'} <span className="text-[#FCA311]">*</span>
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    required
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder={isRtl ? 'نام کامل خود را وارد کنید' : 'Enter your full name'}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#FCA311] text-xs sm:text-sm text-slate-800 bg-slate-50/50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#14213D] mb-1">
                    {isRtl ? 'آدرس ایمیل' : 'Email Address'} <span className="text-[#FCA311]">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder={isRtl ? 'آدرس ایمیل خود را وارد کنید' : 'Enter your email address'}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#FCA311] text-xs sm:text-sm text-slate-800 bg-slate-50/50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-[#14213D] mb-1">
                    {isRtl ? 'شماره تماس / واتس‌اپ' : 'Phone / WhatsApp'} <span className="text-[#FCA311]">*</span>
                  </label>
                  <input
                    type="text"
                    name="phoneWhatsApp"
                    required
                    value={formData.phoneWhatsApp}
                    onChange={handleChange}
                    placeholder="+93 70 633 8223"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#FCA311] text-xs sm:text-sm text-slate-800 bg-slate-50/50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#14213D] mb-1">
                    {isRtl ? 'تاریخ سفر مدنظر' : 'Preferred Travel Date'}
                  </label>
                  <input
                    type="date"
                    name="preferredDate"
                    value={formData.preferredDate}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#FCA311] text-xs sm:text-sm text-slate-800 bg-slate-50/50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#14213D] mb-1">
                  {isRtl ? 'پکیج یا خدمت مدنظر' : 'Package / Service Name'} <span className="text-[#FCA311]">*</span>
                </label>
                <div className="relative">
                  <select
                    name="packageOrService"
                    value={formData.packageOrService}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 ps-3.5 pe-9 rtl:ps-9 rtl:pe-3.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#FCA311] text-xs sm:text-sm text-slate-800 bg-slate-50/50 font-medium cursor-pointer appearance-none"
                  >
                    <option value="Bespoke Afghanistan Journey">
                      {isRtl ? 'سفر اختصاصی و سفارشی افغانستان (Bespoke Journey)' : 'Bespoke Afghanistan Journey'}
                    </option>
                    <option value="Cultural & Heritage Tour">
                      {isRtl ? 'تور فرهنگی و میراث تاریخی (کابل، بامیان، هرات، بلخ)' : 'Cultural & Heritage Tour (Kabul, Bamyan, Herat, Balkh)'}
                    </option>
                    <option value="Photography & Media Expedition">
                      {isRtl ? 'سفر تخصصی عکاسی و مستندسازی' : 'Photography & Media Expedition'}
                    </option>
                    <option value="Adventure & Pamir Trekking">
                      {isRtl ? 'ماجراجویی و کوهنوردی پامیر و نورستان' : 'Adventure & Pamir / Nuristan Trekking'}
                    </option>
                    <option value="Academic & Research Delegations">
                      {isRtl ? 'هیئت‌های دانشگاهی، پژوهشی و علمی' : 'Academic & Research Delegations'}
                    </option>
                    <option value="Diplomatic & Business Logistics">
                      {isRtl ? 'پشتیبانی لجستیکی دیپلماتیک و تجاری' : 'Diplomatic & Business Logistics'}
                    </option>
                    <option value="Secure Transport & Private Guide">
                      {isRtl ? 'ترانسپورت ایمن و راهنمای محلی اختصاصی' : 'Secure Transport & Private Guide'}
                    </option>
                    <option value="Custom Tailored Itinerary">
                      {isRtl ? 'برنامه کاملاً سفارشی‌سازی‌شده / سایر خدمات' : 'Custom Tailored Itinerary / Other'}
                    </option>
                  </select>
                  <div className={`pointer-events-none absolute inset-y-0 ${isRtl ? 'left-3' : 'right-3'} flex items-center text-slate-400`}>
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                      <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                    </svg>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#14213D] mb-1">
                  {isRtl ? 'توضیحات و نیازمندی‌های تکمیلی' : 'Additional Requirements'}
                </label>
                <textarea
                  rows="3"
                  name="additionalRequirements"
                  value={formData.additionalRequirements}
                  onChange={handleChange}
                  placeholder={isRtl ? 'هر نکته یا درخواست خاصی دارید بنویسید...' : 'Tell us anything else we should know about your trip...'}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#FCA311] text-xs sm:text-sm text-slate-800 bg-slate-50/50 resize-none"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="agreeTerms"
                  name="agreeTerms"
                  checked={formData.agreeTerms}
                  onChange={handleChange}
                  className="rounded text-[#FCA311] focus:ring-[#FCA311] w-4 h-4 accent-[#FCA311]"
                />
                <label htmlFor="agreeTerms" className="text-xs text-slate-500 cursor-pointer">
                  {isRtl ? 'قوانین و شرایط آمووی را می‌پذیرم.' : 'I agree to the terms and privacy policy of Amovi Travel.'}
                </label>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#FCA311] hover:bg-amber-500 text-[#14213D] font-bold py-3.5 px-6 rounded-xl shadow-lg transition-all duration-200 text-xs sm:text-sm tracking-wide disabled:opacity-50 cursor-pointer"
              >
                {isSubmitting
                  ? (isRtl ? 'در حال ثبت...' : 'Submitting...')
                  : (t.formSubmit || (isRtl ? 'ثبت درخواست سفر' : 'Submit Request'))}
              </button>
            </form>
          </div>

        </div>
      </section>

    </div>
  );
}