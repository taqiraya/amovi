import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Compass, Star, ShieldCheck, ArrowRight, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { useLangStore } from '../../store/useLangStore';
import { createMasterRequest } from '../../services/api';

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

  return (
    <div className={`w-full bg-[#F8FAFC] min-h-screen text-[#14213D] ${isRtl ? 'font-[Sahel]' : 'font-[Inter]'}`}>
      
      {/* ========================================================
          ۱. هیرو سکشن اصلی صفحه درباره ما (Our Story & Legacy)
      ======================================================== */}
      <section className="relative w-full pt-36 pb-20 sm:pt-40 sm:pb-28 overflow-hidden bg-[#14213D] text-white">
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-50 scale-105"
          style={{ backgroundImage: `url(${heroBg})` }}
        />
        <div className="absolute inset-0 z-10 bg-gradient-to-b from-[#14213D]/95 via-[#14213D]/80 to-[#14213D] pointer-events-none" />

        <div className={`relative z-20 max-w-6xl mx-auto px-6 ${isRtl ? 'text-right' : 'text-left'}`}>
          <span className="inline-block text-[#FCA311] text-xs font-bold uppercase tracking-[0.2em] mb-2 font-[Inter]">
            {t.heroEyebrow || (isRtl ? 'ما که هستیم' : 'WHO WE ARE')}
          </span>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight">
            <span className="relative inline-block pb-1 after:absolute after:bottom-0 after:left-0 after:w-full after:h-1 after:bg-[#FCA311] after:rounded-full">
              {t.heroTitlePrefix || (isRtl ? 'داستان و میراث ' : 'Our Story ')}
            </span>{' '}
            <span className="text-[#FCA311]">
              {t.heroTitleHighlight || (isRtl ? 'ماندگار ما' : '& Legacy')}
            </span>
          </h1>

          <p className="mt-4 text-slate-300 text-sm sm:text-base md:text-lg max-w-xl font-light leading-relaxed">
            {t.heroSubtitle || (isRtl 
              ? 'چشم‌انداز، ارزش‌ها و تیمی که در پشت پرده آمووی ترول فعالیت دارند را بشناسید.' 
              : 'Discover the vision, values and people behind Amovi Travel.')}
          </p>
        </div>
      </section>

      {/* ========================================================
          ۲. بخش مأموریت ما (Redefining Luxury Travel in Afghanistan)
      ======================================================== */}
      <section className="max-w-6xl mx-auto px-6 py-16 sm:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center" dir={isRtl ? 'rtl' : 'ltr'}>
          
          {/* ستون متن مأموریت */}
          <div className={`lg:col-span-6 space-y-5 ${isRtl ? 'text-right' : 'text-left'}`}>
            <span className="text-[#FCA311] text-xs font-bold uppercase tracking-widest block font-[Inter]">
              {t.missionEyebrow || (isRtl ? 'ماموریت ما' : 'OUR MISSION')}
            </span>

            <h2 className="text-2xl sm:text-4xl font-black text-[#14213D] leading-tight tracking-tight">
              {t.missionTitle || (isRtl ? 'بازتعریف سفرهای لوکس در افغانستان' : 'Redefining Luxury Travel in Afghanistan')}
            </h2>

            <p className="text-slate-600 text-sm sm:text-base leading-relaxed font-normal">
              {t.missionText || (isRtl 
                ? 'در آمووی ترول، ما متعهد به ارائه مهمان‌نوازی در کلاس جهانی با روحی اصیل و بومی هستیم. مأموریت ما خلق سفرهایی پرمعنا است که مسافران را به فرهنگ غنی، مناظر شگفت‌انگیز و میراث ماندگار افغانستان پیوند دهد — در حالی که همواره از مردم و جوامع محلی این سرزمین حمایت می‌کنیم.' 
                : "At Amovi Travel, we are committed to delivering world-class hospitality with a local heart. Our mission is to create meaningful journeys that connect travelers with Afghanistan's rich culture, breathtaking landscapes and enduring heritage — while supporting the people and communities that make this country so extraordinary.")}
            </p>

            {/* کوت‌باکس با بوردر طلایی عینا مطابق طرح تمپلت */}
            <div className={`border-l-4 rtl:border-r-4 rtl:border-l-0 border-[#FCA311] ps-4 pe-2 py-2 bg-amber-50/40 rounded-r-xl rtl:rounded-l-xl rtl:rounded-r-none mt-6`}>
              <p className="italic font-bold text-[#14213D] text-sm sm:text-base leading-relaxed">
                {t.missionQuote || (isRtl 
                  ? '«لوکس بودن هرگز نباید به قیمت از دست رفتن اصالت باشد.»' 
                  : '“Luxury should never come at the expense of authenticity.”')}
              </p>
            </div>
          </div>

          {/* ستون تصاویر کلاژ هم‌پوشان */}
          <div className="lg:col-span-6 relative pb-10 sm:pb-12">
            <div className="relative w-full max-w-lg mx-auto">
              
              {/* عکس بزرگ پس‌زمینه */}
              <div className="w-[85%] rounded-3xl overflow-hidden shadow-xl border-4 border-white bg-slate-200 aspect-[4/3]">
                <img
                  src={aboutImg1}
                  alt="Afghanistan Landscapes"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                />
              </div>

              {/* عکس جلو هم‌پوشان با سایه عمیق */}
              <div className={`w-[60%] rounded-2xl overflow-hidden shadow-2xl border-4 border-white bg-slate-300 aspect-[4/3] absolute -bottom-6 ${isRtl ? 'left-0' : 'right-0'} hover:scale-105 transition-transform duration-500`}>
                <img
                  src={aboutImg2}
                  alt="Cultural Heritage"
                  className="w-full h-full object-cover"
                />
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* ========================================================
          ۳. بخش ارزش‌های ما (What Defines Amovi)
      ======================================================== */}
      <section className="w-full py-16 sm:py-20 bg-white border-y border-slate-200/60">
        <div className="max-w-6xl mx-auto px-6">
          
          <div className="text-center max-w-xl mx-auto mb-14 space-y-2">
            <span className="text-[#FCA311] text-xs font-bold uppercase tracking-widest block font-[Inter]">
              {t.valuesEyebrow || (isRtl ? 'ارزش‌های ما' : 'OUR VALUES')}
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#14213D]">
              {t.valuesTitle || (isRtl ? 'آنچه آمووی را تعریف می‌کند' : 'What Defines Amovi')}
            </h2>
            <p className="text-slate-500 text-sm leading-relaxed">
              {t.valuesSubtitle || (isRtl 
                ? 'سه اصل بنیادین که راهنمای هر سفری است که ما خلق می‌کنیم.' 
                : 'Three principles guide every journey we create.')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8" dir={isRtl ? 'rtl' : 'ltr'}>
            
            {/* کارت ۱: اصالت */}
            <div className={`bg-[#F8FAFC] p-8 rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-xl hover:border-[#FCA311]/40 transition-all duration-300 hover:-translate-y-1 space-y-4 ${isRtl ? 'text-right' : 'text-left'}`}>
              <div className="w-13 h-13 rounded-full bg-[#FCA311] text-white flex items-center justify-center shadow-md shadow-[#FCA311]/20 shrink-0">
                <Compass size={24} />
              </div>
              <h3 className="text-xl font-bold text-[#14213D]">
                {t.values?.authenticityTitle || (isRtl ? 'اصالت' : 'Authenticity')}
              </h3>
              <p className="text-slate-500 text-sm leading-relaxed font-normal">
                {t.values?.authenticityDesc || (isRtl 
                  ? 'ما مسافران را با فرهنگ اصیل افغان، مناظر بکر و تجربه‌های واقعی بومی پیوند می‌دهیم.' 
                  : 'We connect travelers with genuine Afghan culture, landscapes and local experiences.')}
              </p>
            </div>

            {/* کارت ۲: برتری و استاندارد */}
            <div className={`bg-[#F8FAFC] p-8 rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-xl hover:border-[#FCA311]/40 transition-all duration-300 hover:-translate-y-1 space-y-4 ${isRtl ? 'text-right' : 'text-left'}`}>
              <div className="w-13 h-13 rounded-full bg-[#FCA311] text-white flex items-center justify-center shadow-md shadow-[#FCA311]/20 shrink-0">
                <Star size={24} className="fill-white" />
              </div>
              <h3 className="text-xl font-bold text-[#14213D]">
                {t.values?.excellenceTitle || (isRtl ? 'برتری و کیفیت' : 'Excellence')}
              </h3>
              <p className="text-slate-500 text-sm leading-relaxed font-normal">
                {t.values?.excellenceDesc || (isRtl 
                  ? 'ما بالاترین استانداردها را در ارائه خدمات، امنیت و سفرهای اختصاصی حفظ می‌کنیم.' 
                  : 'We maintain the highest standards in service, safety and personalized travel experiences.')}
              </p>
            </div>

            {/* کارت ۳: همراهی امن */}
            <div className={`bg-[#F8FAFC] p-8 rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-xl hover:border-[#FCA311]/40 transition-all duration-300 hover:-translate-y-1 space-y-4 ${isRtl ? 'text-right' : 'text-left'}`}>
              <div className="w-13 h-13 rounded-full bg-[#FCA311] text-white flex items-center justify-center shadow-md shadow-[#FCA311]/20 shrink-0">
                <ShieldCheck size={24} />
              </div>
              <h3 className="text-xl font-bold text-[#14213D]">
                {t.values?.safetyTitle || (isRtl ? 'همراهی امن' : 'Safe Accompaniment')}
              </h3>
              <p className="text-slate-500 text-sm leading-relaxed font-normal">
                {t.values?.safetyDesc || (isRtl 
                  ? 'امنیت و آسایش شما اولویت اصلی ماست؛ از لحظه ورود تا زمان بازگشت به خانه.' 
                  : 'Your safety and comfort are our priority, from the moment you arrive until you return.')}
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* ========================================================
          ۴. بخش دستاوردها و آمارها (Numbers That Tell Our Story)
      ======================================================== */}
      <section className="w-full py-16 bg-[#14213D] text-white relative overflow-hidden">
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-20 pointer-events-none"
          style={{ backgroundImage: `url(${heroBg})` }}
        />
        <div className="relative z-10 max-w-6xl mx-auto px-6">
          
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
              <span className="text-3xl sm:text-5xl font-black text-[#FCA311] font-[Inter] tracking-tight block">
                {t.stats?.gemsNumber || '50+'}
              </span>
              <p className="text-xs sm:text-sm text-slate-300 font-medium font-sans">
                {t.stats?.gemsLabel || (isRtl ? 'جاذبه‌های بکر کشف‌شده' : 'Hidden Gems Explored')}
              </p>
            </div>

            {/* ۲. تورهای امن */}
            <div className="space-y-1">
              <span className="text-3xl sm:text-5xl font-black text-[#FCA311] font-[Inter] tracking-tight block">
                {t.stats?.toursNumber || '100%'}
              </span>
              <p className="text-xs sm:text-sm text-slate-300 font-medium font-sans">
                {t.stats?.toursLabel || (isRtl ? 'تورهای ایمن و اختصاصی' : 'Secure Tours')}
              </p>
            </div>

            {/* ۳. ولایات پوشش داده شده */}
            <div className="space-y-1">
              <span className="text-3xl sm:text-5xl font-black text-[#FCA311] font-[Inter] tracking-tight block">
                {t.stats?.provincesNumber || '12+'}
              </span>
              <p className="text-xs sm:text-sm text-slate-300 font-medium font-sans">
                {t.stats?.provincesLabel || (isRtl ? 'ولایات تحت پوشش' : 'Afghan Provinces')}
              </p>
            </div>

            {/* ۴. امتیاز VIP */}
            <div className="space-y-1">
              <span className="text-3xl sm:text-5xl font-black text-[#FCA311] font-[Inter] tracking-tight block">
                {t.stats?.ratingNumber || '5★'}
              </span>
              <p className="text-xs sm:text-sm text-slate-300 font-medium font-sans">
                {t.stats?.ratingLabel || (isRtl ? 'امتیاز مسافران VIP' : 'VIP Rating')}
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* ========================================================
          ۵. بخش آماده برنامه‌ریزی سفر و فرم درخواست (Ready to Plan?)
      ======================================================== */}
      <section className="max-w-6xl mx-auto px-6 py-16 sm:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch" dir={isRtl ? 'rtl' : 'ltr'}>
          
          {/* ستون چپ: بنر تصویری دعوت به تماس */}
          <div className="lg:col-span-5 relative rounded-3xl overflow-hidden shadow-xl min-h-[380px] flex flex-col justify-between p-8 sm:p-10 text-white bg-[#14213D]">
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
                className="inline-flex items-center gap-2 bg-[#FCA311] hover:bg-amber-500 text-[#14213D] font-bold py-3 px-6 rounded-full shadow-lg transition-all duration-200 text-xs sm:text-sm group uppercase font-[Inter] tracking-wider"
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
          <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xl space-y-4">
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
                    placeholder="+93 700 000 000"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#FCA311] text-xs sm:text-sm text-slate-800 bg-slate-50/50 text-left"
                    dir="ltr"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#14213D] mb-1">
                    {isRtl ? 'تاریخ موردنظر سفر' : 'Preferred Travel Date'} <span className="text-[#FCA311]">*</span>
                  </label>
                  <input
                    type="date"
                    name="preferredDate"
                    required
                    value={formData.preferredDate}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#FCA311] text-xs sm:text-sm text-slate-800 bg-slate-50/50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#14213D] mb-1">
                  {isRtl ? 'نام پکیج یا خدمت' : 'Package / Service Name'} <span className="text-[#FCA311]">*</span>
                </label>
                <input
                  type="text"
                  name="packageOrService"
                  value={formData.packageOrService}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#FCA311] text-xs sm:text-sm text-slate-800 bg-slate-50/50"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#14213D] mb-1">
                  {isRtl ? 'نیازمندی‌های اضافی' : 'Additional Requirements'}
                </label>
                <input
                  type="text"
                  name="additionalRequirements"
                  value={formData.additionalRequirements}
                  onChange={handleChange}
                  placeholder={isRtl ? 'نیازمندی‌های خاص خود را بنویسید...' : 'Tell us about your specific needs...'}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#FCA311] text-xs sm:text-sm text-slate-800 bg-slate-50/50"
                />
              </div>

              <div className="flex items-center gap-2 pt-1 text-xs text-slate-600">
                <input
                  type="checkbox"
                  name="agreeTerms"
                  id="agreeTerms"
                  required
                  checked={formData.agreeTerms}
                  onChange={handleChange}
                  className="accent-[#FCA311] rounded cursor-pointer"
                />
                <label htmlFor="agreeTerms" className="cursor-pointer">
                  {isRtl 
                    ? 'من قوانین و حریم خصوصی را می‌پذیرم.' 
                    : 'I agree to the Privacy Policy and Terms & Conditions.'}
                </label>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#FCA311] hover:bg-amber-500 text-[#14213D] font-extrabold py-3 px-6 rounded-xl shadow-md transition-all duration-200 flex items-center justify-center gap-2 group cursor-pointer disabled:opacity-60 text-xs sm:text-sm"
                >
                  <span>
                    {isSubmitting ? (isRtl ? 'در حال ثبت...' : 'Submitting...') : (t.formSubmit || (isRtl ? 'ثبت درخواست سفر' : 'Submit Request'))}
                  </span>
                  {isRtl ? (
                    <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" strokeWidth={2.5} />
                  ) : (
                    <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" strokeWidth={2.5} />
                  )}
                </button>
              </div>

            </form>
          </div>

        </div>
      </section>

    </div>
  );
}