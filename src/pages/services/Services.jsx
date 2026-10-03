import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft, 
  ShieldCheck, 
  Compass, 
  Sparkles, 
  Headphones, 
  X, 
  Info,
  Calendar,
  Send,
  HelpCircle,
  FileCheck2
} from 'lucide-react';
import { useLangStore } from '../../store/useLangStore';
import { createMasterRequest } from '../../services/api';
import heroBg from '../../assets/images/hero-bg.webp';
import SEO from '../../components/SEO';

export default function Services() {
  const { currentLang, translations } = useLangStore();
  const isRtl = currentLang === 'fa';
  const t = translations?.servicesPage || {};

  const formRef = useRef(null);
  const servicesSectionRef = useRef(null);

  const [activeModalService, setActiveModalService] = useState(null);

  const [formData, setFormData] = useState({
    fullName: '',
    nationality: '',
    email: '',
    phoneWhatsApp: '',
    preferredDate: '',
    travelers: '2',
    purposeOfTravel: '',
    packageOrService: 'Visa Assistance',
    additionalRequirements: '',
    agreeTerms: true
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const servicesList = t.services || [];
  const howWork = t.howServicesWork || {};
  const whyChoose = t.whyChoose || {};
  const personalizedCta = t.personalizedCta || {};

  const whyChooseIcons = [
    <ShieldCheck key="shield" className="w-8 h-8 text-[#FCA311]" />,
    <Compass key="compass" className="w-8 h-8 text-[#FCA311]" />,
    <Sparkles key="sparkles" className="w-8 h-8 text-[#FCA311]" />,
    <Headphones key="headphones" className="w-8 h-8 text-[#FCA311]" />
  ];

  const handleSelectService = (serviceTitle) => {
    setFormData((prev) => ({
      ...prev,
      packageOrService: serviceTitle
    }));
    if (activeModalService) {
      setActiveModalService(null);
    }
    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const handleScrollToServices = () => {
    if (servicesSectionRef.current) {
      servicesSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

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
        nationality: '',
        email: '',
        phoneWhatsApp: '',
        preferredDate: '',
        travelers: '2',
        purposeOfTravel: '',
        packageOrService: 'Visa Assistance',
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
      <SEO 
        title={isRtl ? 'خدمات جامع سفر به افغانستان | ویزا، اقامتگاه، ترانسفر و راهنما' : 'Comprehensive Afghanistan Travel Services | Visa, Accommodation, Transport, VIP'}
        description={isRtl 
          ? 'ارائه ۷ خدمت جامع سفر به افغانستان: تسهیلات ویزا، اقامتگاه‌های منتخب، حمل‌ونقل و ترانسفر امن، راهنمایان مجرب، پشتیبانی سلامت و سفرهای تشریفاتی VIP آمووی ترول.' 
          : 'From visa assistance and accommodation to transportation, professional guides, health assistance and VIP travel, Amovi provides essential services for exploring Afghanistan.'}
        keywords="Afghanistan travel services, Afghanistan visa assistance, Afghanistan hotel booking, private driver Afghanistan, tour guides Afghanistan, Amovi Travel services"
      />
      
      {/* ========================================================
          ۱. هیرو سکشن اصلی صفحه خدمات (Services Hero)
      ======================================================== */}
      <section className="relative w-full pt-32 pb-16 sm:pt-40 sm:pb-28 overflow-hidden bg-[#14213D] text-white">
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-45 scale-105"
          style={{ backgroundImage: `url(${heroBg})` }}
        />
        <div className="absolute inset-0 z-10 bg-gradient-to-b from-[#14213D]/95 via-[#14213D]/80 to-[#14213D] pointer-events-none" />

        <div className={`relative z-20 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 ${isRtl ? 'text-right' : 'text-left'}`}>
          <span className="inline-block text-[#FCA311] text-xs font-bold uppercase tracking-[0.2em] mb-2 font-[Inter]">
            {t.heroEyebrow || (isRtl ? 'خدمات آمووی' : 'SERVICES')}
          </span>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight">
            <span className="relative inline-block pb-1 after:absolute after:bottom-0 after:left-0 after:w-full after:h-1 after:bg-[#FCA311] after:rounded-full">
              {t.heroTitlePrefix || (isRtl ? 'هر آنچه برای یک سفر ' : 'Everything You Need for a ')}
            </span>{' '}
            <span className="text-[#FCA311]">
              {t.heroTitleHighlight || (isRtl ? 'آرام و مطمئن نیاز دارید' : 'Smooth Journey')}
            </span>
          </h1>

          <p className="mt-4 text-slate-300 text-sm sm:text-base md:text-lg max-w-3xl font-light leading-relaxed">
            {t.heroSubtitle || (isRtl 
              ? 'از تسهیلات ویزا و اقامتگاه‌های منتخب تا ترانسفر اختصاصی، راهنمایان مسلط بومی و پشتیبانی همه‌جانبه؛ آمووی خدمات اساسی سفر به افغانستان را با آرامش خاطر و اطمینان کامل برای شما فراهم می‌کند.' 
              : 'From visa assistance and accommodation to transportation, professional guides, and personalized travel support, Amovi provides the essential services you need to explore Afghanistan with confidence and peace of mind.')}
          </p>

          {/* دکمه‌های اقدام هیرو */}
          <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
            <button
              type="button"
              onClick={() => {
                if (formRef.current) {
                  formRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
              }}
              className="inline-flex items-center justify-center gap-2 bg-[#FCA311] hover:bg-amber-500 text-[#14213D] font-bold py-3.5 px-7 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 text-xs sm:text-sm uppercase tracking-wider cursor-pointer w-full sm:w-auto"
            >
              <span>{t.planJourney || (isRtl ? 'برنامه‌ریزی سفر' : 'Plan Your Journey')}</span>
              {isRtl ? (
                <ArrowLeft size={16} strokeWidth={2.5} />
              ) : (
                <ArrowRight size={16} strokeWidth={2.5} />
              )}
            </button>

            <button
              type="button"
              onClick={handleScrollToServices}
              className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold py-3.5 px-7 rounded-full border border-white/25 backdrop-blur-sm transition-all duration-200 text-xs sm:text-sm cursor-pointer w-full sm:w-auto"
            >
              <span>{t.exploreServices || (isRtl ? 'مشاهده خدمات ما' : 'Explore Our Services')}</span>
            </button>
          </div>

          {/* ناوبری سریع ۷ خدمت (Quick Jump Pills) */}
          <div className="mt-8 sm:mt-10 pt-6 border-t border-white/10 flex flex-wrap gap-1.5 sm:gap-2 text-xs">
            {servicesList.map((service, idx) => (
              <button
                key={service.id || idx}
                type="button"
                onClick={() => {
                  const el = document.getElementById(`service-${service.id}`);
                  if (el) {
                    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                  }
                }}
                className="px-3 sm:px-3.5 py-1.5 rounded-full bg-white/5 hover:bg-[#FCA311] hover:text-[#14213D] text-slate-300 border border-white/10 transition-colors duration-200 cursor-pointer text-[11px] sm:text-xs font-medium"
              >
                {service.number || `0${idx + 1}`} {service.title}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================
          ۲. عنوان بخش ۷ خدمت اصلی (Our 7 Services Header)
      ======================================================== */}
      <section ref={servicesSectionRef} className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 sm:pt-20 pb-6 sm:pb-8 text-center">
        <span className="text-[#FCA311] text-xs font-bold uppercase tracking-widest block font-[Inter] mb-2">
          {t.sectionEyebrow || (isRtl ? 'خدمات ما — ۷ خدمت تخصصی' : 'OUR SERVICES — 7 SERVICES')}
        </span>
        <h2 className="text-2xl sm:text-4xl font-black text-[#14213D] tracking-tight">
          {t.sectionTitle || (isRtl ? 'پشتیبانی در تمام مراحل سفر شما' : 'Support for Every Step of Your Journey')}
        </h2>
        <p className="text-slate-500 text-xs sm:text-sm md:text-base max-w-2xl mx-auto mt-3 leading-relaxed">
          {t.sectionSubtitle || (isRtl 
            ? 'در آمووی، خدمات کاربردی و مطمئن سفر را ارائه می‌دهیم تا سفری آسان‌تر، راحت‌تر و با هماهنگی کامل در سراسر افغانستان تجربه کنید.' 
            : 'At Amovi, we provide practical and reliable travel services designed to make your journey across Afghanistan smoother, more comfortable, and well supported.')}
        </p>
      </section>

      {/* ========================================================
          ۳. ردیف‌های ۷‌گانه زیگزاگی خدمات با جزییات کامل
      ======================================================== */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-14 sm:space-y-20 lg:space-y-24">
        {servicesList.map((service, index) => {
          const isReversed = index % 2 === 1;

          return (
            <div 
              key={service.id || index}
              id={`service-${service.id}`}
              className={`flex flex-col ${isReversed ? 'lg:flex-row-reverse' : 'lg:flex-row'} items-center gap-8 lg:gap-14 scroll-mt-24`}
              dir={isRtl ? 'rtl' : 'ltr'}
            >
              {/* تصویر شاخص با جلوه شیک */}
              <div className="w-full lg:w-1/2 max-w-xl lg:max-w-none mx-auto">
                <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl border-2 sm:border-4 border-white bg-slate-200 aspect-[16/10] group">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 select-none"
                    loading="lazy"
                    onError={(e) => {
                      if (!e.target.dataset.tried) {
                        e.target.dataset.tried = 'true';
                        e.target.src = '/images/provinces/kabul/kabul-culture.webp';
                      }
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#14213D]/70 via-transparent to-transparent pointer-events-none" />
                  
                  {/* بج شماره خدمت روی عکس */}
                  <div className={`absolute top-3.5 sm:top-4 ${isRtl ? 'right-3.5 sm:right-4' : 'left-3.5 sm:left-4'} bg-[#14213D]/80 backdrop-blur-md px-3 sm:px-3.5 py-1 sm:py-1.5 rounded-full border border-white/20 text-[#FCA311] font-bold text-xs font-[Inter] tracking-wider`}>
                    {service.tag || service.number}
                  </div>

                  {/* تگ لاین کوتاه روی گوشه تصویر */}
                  {service.heroTagline && (
                    <div className="absolute bottom-3.5 sm:bottom-4 inset-x-3.5 sm:inset-x-4 text-white text-xs sm:text-sm font-medium drop-shadow-md">
                      {service.heroTagline}
                    </div>
                  )}
                </div>
              </div>

              {/* توضیحات، بولت‌ها و دکمه‌های اقدام */}
              <div className={`w-full lg:w-1/2 space-y-4 ${isRtl ? 'text-right' : 'text-left'}`}>
                <div className="inline-flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#14213D] text-[#FCA311] font-bold text-xs flex items-center justify-center font-[Inter]">
                    {service.number || `0${index + 1}`}
                  </span>
                  <span className="text-[#FCA311] text-xs font-bold uppercase tracking-widest font-[Inter]">
                    {service.tag}
                  </span>
                </div>

                <h3 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-[#14213D] tracking-tight">
                  {service.title}
                </h3>

                <p className="text-slate-600 text-xs sm:text-sm md:text-base leading-relaxed">
                  {service.description}
                </p>

                {/* چک‌لیست ۴ ویژگی کلیدی */}
                <ul className="space-y-2.5 pt-1 sm:pt-2">
                  {service.bullets?.map((bullet, bIdx) => (
                    <li key={bIdx} className="flex items-start gap-2.5 sm:gap-3 text-slate-700 text-xs sm:text-sm font-medium">
                      <div className="w-5 h-5 rounded-full bg-amber-500/15 text-[#FCA311] flex items-center justify-center shrink-0 mt-0.5">
                        <CheckCircle2 size={15} className="text-[#FCA311]" />
                      </div>
                      <span className="leading-snug">{bullet}</span>
                    </li>
                  ))}
                </ul>

                {/* دکمه‌های عملگر خدمت */}
                <div className="pt-3 sm:pt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3">
                  <button
                    type="button"
                    onClick={() => handleSelectService(service.title)}
                    className="inline-flex items-center justify-center gap-2 bg-[#FCA311] hover:bg-amber-500 text-[#14213D] font-bold py-3 px-6 rounded-full shadow-md hover:shadow-lg transition-all duration-200 text-xs sm:text-sm group uppercase font-[Inter] tracking-wider cursor-pointer w-full sm:w-auto"
                  >
                    <span>{t.requestService || (isRtl ? 'درخواست این خدمت' : 'Request This Service')}</span>
                    {isRtl ? (
                      <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" strokeWidth={2.5} />
                    ) : (
                      <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" strokeWidth={2.5} />
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveModalService(service)}
                    className="inline-flex items-center justify-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-[#14213D] font-semibold py-3 px-5 rounded-full border border-slate-200 transition-colors duration-200 text-xs sm:text-sm cursor-pointer w-full sm:w-auto"
                  >
                    <Info size={15} className="text-[#14213D]/70" />
                    <span>{t.learnMore || (isRtl ? 'جزییات بیشتر' : 'Learn More')}</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </section>

      {/* ========================================================
          ۴. نحوه ارائه خدمات (How Our Services Work - 6 Steps)
      ======================================================== */}
      {howWork.steps && (
        <section className="w-full bg-[#14213D] text-white py-14 sm:py-20 my-8 sm:my-12 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(#FCA311_1px,transparent_1px)] [background-size:24px_24px] opacity-5 pointer-events-none" />
          
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10" dir={isRtl ? 'rtl' : 'ltr'}>
            <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
              <span className="text-[#FCA311] text-xs font-bold uppercase tracking-widest block font-[Inter] mb-2">
                {howWork.eyebrow || (isRtl ? 'نحوه ارائه خدمات ما' : 'HOW OUR SERVICES WORK')}
              </span>
              <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
                {howWork.title || (isRtl ? 'فرآیندی ساده از ثبت درخواست تا تأیید نهایی' : 'A Simple Process from Request to Confirmation')}
              </h2>
              <p className="text-slate-300 text-xs sm:text-sm md:text-base mt-3 leading-relaxed font-light">
                {howWork.subtitle || (isRtl 
                  ? 'چه به یک خدمت انفرادی نیاز داشته باشید و چه بخواهید کل سفر خود را مدیریت کنید، فرآیند ما شفاف و سرراست است.' 
                  : 'Whether you need a single service or support for a complete journey, our process is clear and straightforward.')}
              </p>
            </div>

            {/* گام‌های ۶‌گانه: ۱ در موبایل کوچک، ۲ در موبایل بزرگ، ۳ در تبلت (iPad)، ۶ در دسکتاپ */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-5 lg:gap-4 relative">
              {howWork.steps.map((st, sIdx) => (
                <div 
                  key={sIdx}
                  className="bg-white/5 border border-white/10 rounded-2xl p-4 sm:p-5 hover:border-[#FCA311]/50 transition-all duration-300 flex flex-col justify-between group"
                >
                  <div>
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#FCA311]/15 text-[#FCA311] flex items-center justify-center font-black text-xs sm:text-sm font-[Inter] mb-3 sm:mb-4 group-hover:bg-[#FCA311] group-hover:text-[#14213D] transition-colors duration-300">
                      {st.step}
                    </div>
                    <h4 className="text-sm sm:text-base font-bold text-white mb-1.5 sm:mb-2">
                      {st.title}
                    </h4>
                    <p className="text-slate-300 text-xs leading-relaxed font-light">
                      {st.desc}
                    </p>
                  </div>

                  {sIdx < howWork.steps.length - 1 && (
                    <div className="hidden lg:block pt-3 text-[#FCA311]/40 text-xs font-mono">
                      {isRtl ? '←' : '→'}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ========================================================
          ۵. چرا آمووی؟ (Why Choose Amovi - 4 Columns)
      ======================================================== */}
      {whyChoose.features && (
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16" dir={isRtl ? 'rtl' : 'ltr'}>
          <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
            <span className="text-[#FCA311] text-xs font-bold uppercase tracking-widest block font-[Inter] mb-2">
              {whyChoose.eyebrow || (isRtl ? 'چرا آمووی را انتخاب کنید؟' : 'WHY CHOOSE AMOVI?')}
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-[#14213D] tracking-tight">
              {whyChoose.title || (isRtl ? 'با اطمینان سفر کنید؛ همراه شما در تک‌تک مراحل' : 'Travel with Confidence. Supported Every Step of the Way.')}
            </h2>
            <p className="text-slate-600 text-xs sm:text-sm md:text-base mt-3 leading-relaxed">
              {whyChoose.subtitle || (isRtl 
                ? 'آمووی دانش بومی، هماهنگی‌های حرفه‌ای و پشتیبانی اختصاصی را گردهم آورده تا تجربه شما از سفر در افغانستان آرام، امن و دلپذیر باشد.' 
                : 'Amovi combines local knowledge, professional coordination, and personalized support to help make your journey across Afghanistan smoother and more comfortable.')}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
            {whyChoose.features.map((feat, fIdx) => (
              <div 
                key={feat.id || fIdx}
                className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/80 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col items-start space-y-3.5 sm:space-y-4"
              >
                <div className="p-2.5 sm:p-3 bg-amber-500/10 rounded-2xl">
                  {whyChooseIcons[fIdx % whyChooseIcons.length]}
                </div>
                <h3 className="text-base sm:text-lg font-bold text-[#14213D]">
                  {feat.title}
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                  {feat.desc}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ========================================================
          ۶. بنر خدمات سفارشی‌تر (Need Something More Personalized CTA)
      ======================================================== */}
      <section className="w-full bg-gradient-to-r from-[#14213D] via-[#1b2b4d] to-[#14213D] text-white py-12 sm:py-20 my-6 sm:my-8 shadow-xl">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-5 sm:space-y-6" dir={isRtl ? 'rtl' : 'ltr'}>
          <span className="text-[#FCA311] text-xs font-bold uppercase tracking-widest block font-[Inter]">
            {personalizedCta.eyebrow || (isRtl ? 'خدمات سفارشی' : 'CUSTOM SOLUTIONS')}
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            {personalizedCta.title || (isRtl ? 'به برنامه‌ای شخصی‌سازی‌شده‌تر نیاز دارید؟' : 'Need Something More Personalized?')}
          </h2>
          <p className="text-slate-300 text-xs sm:text-sm md:text-base leading-relaxed max-w-2xl mx-auto font-light">
            {personalizedCta.desc || (isRtl 
              ? 'هر مسافری سلیقه متفاوتی دارد. اگر به ترکیبی از خدمات نیاز دارید یا درخواست ویژه‌ای دارید، تیم ما متناسب با خواست شما راهکاری سفارشی تدارک خواهد دید.' 
              : 'Every traveler is different. If you need a combination of services, have special requirements, or cannot find exactly what you are looking for, our team can help arrange a solution based on your journey.')}
          </p>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-4 pt-3 sm:pt-4">
            <button
              type="button"
              onClick={() => handleSelectService('Customized & VIP Travel')}
              className="inline-flex items-center justify-center gap-2 bg-[#FCA311] hover:bg-amber-500 text-[#14213D] font-bold py-3.5 px-8 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 text-xs sm:text-sm uppercase tracking-wider cursor-pointer w-full sm:w-auto"
            >
              <span>{personalizedCta.requestBtn || (isRtl ? 'ثبت درخواست خدمت' : 'Request a Service')}</span>
              {isRtl ? <ArrowLeft size={16} strokeWidth={2.5} /> : <ArrowRight size={16} strokeWidth={2.5} />}
            </button>

            <Link
              to="/contact"
              className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold py-3.5 px-8 rounded-full border border-white/25 backdrop-blur-sm transition-all duration-200 text-xs sm:text-sm w-full sm:w-auto"
            >
              <span>{personalizedCta.contactBtn || (isRtl ? 'تماس با آمووی' : 'Contact Amovi')}</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ========================================================
          ۷. بخش آماده برنامه‌ریزی و فرم ثبت درخواست (Inquiry Form)
      ======================================================== */}
      <section ref={formRef} className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch" dir={isRtl ? 'rtl' : 'ltr'}>
          
          {/* ستون چپ: بنر دعوت به تماس و مشاوره مستقیم */}
          <div className="lg:col-span-5 relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl min-h-[340px] sm:min-h-[380px] lg:min-h-[420px] flex flex-col justify-between p-6 sm:p-8 md:p-10 text-white bg-[#14213D]">
            <div 
              className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-40 scale-105"
              style={{ backgroundImage: `url(${heroBg})` }}
            />
            <div className="absolute inset-0 z-10 bg-gradient-to-t from-[#14213D] via-[#14213D]/75 to-transparent pointer-events-none" />

            <div className={`relative z-20 space-y-3 ${isRtl ? 'text-right' : 'text-left'}`}>
              <span className="text-[#FCA311] text-xs font-bold uppercase tracking-widest block font-[Inter]">
                {t.ctaEyebrow || (isRtl ? 'آماده آغاز سفر هستید؟' : 'READY TO BEGIN YOUR JOURNEY?')}
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight">
                {t.ctaTitle || (isRtl ? 'درخواست تجربه اختصاصی شما' : 'Request Your Experience')}
              </h2>
              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed font-light">
                {t.ctaSubtitle || (isRtl 
                  ? 'اجازه دهید آمووی نخستین گام‌های یک سفر به‌یادماندنی به افغانستان را برای شما هموار سازد.' 
                  : 'Let Amovi help you take the first step toward a smoother journey to Afghanistan.')}
              </p>

              <div className="pt-3 sm:pt-4 space-y-2 text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={15} className="text-[#FCA311]" />
                  <span>{isRtl ? 'مشاوره کاملاً رایگان و اختصاصی' : 'Free personalized travel consultation'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={15} className="text-[#FCA311]" />
                  <span>{isRtl ? 'پاسخگویی سریع در کمتر از ۲۴ ساعت' : 'Fast response within 24 hours'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={15} className="text-[#FCA311]" />
                  <span>{isRtl ? 'حفظ کامل حریم خصوصی مسافران' : 'Strict data privacy & confidentiality'}</span>
                </div>
              </div>
            </div>

            <div className={`relative z-20 pt-6 sm:pt-8 ${isRtl ? 'text-right' : 'text-left'}`}>
              <Link
                to="/contact"
                className="inline-flex items-center justify-center gap-2 bg-[#FCA311] hover:bg-amber-500 text-[#14213D] font-bold py-3 px-6 rounded-full shadow-lg transition-all duration-200 text-xs sm:text-sm group uppercase font-[Inter] tracking-wider w-full sm:w-auto"
              >
                <span>{t.ctaButton || (isRtl ? 'تماس با آمووی' : 'Contact Amovi')}</span>
                {isRtl ? (
                  <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" strokeWidth={2.5} />
                ) : (
                  <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" strokeWidth={2.5} />
                )}
              </Link>
            </div>
          </div>

          {/* ستون راست: فرم جامع ثبت تقاضای خدمات */}
          <div className="lg:col-span-7 bg-white p-5 sm:p-7 md:p-8 rounded-2xl sm:rounded-3xl border border-slate-200 shadow-xl space-y-4">
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-[#14213D]">
                {t.formTitle || (isRtl ? 'فرم ثبت درخواست و استعلام خدمت' : 'Inquiry & Service Request Form')}
              </h3>
              <p className="text-slate-500 text-xs mt-1">
                {t.formSubtitle || (isRtl ? 'کمی درباره برنامه سفر خود بنویسید تا کارشناسان ما گام‌های بعدی را با شما هماهنگ نمایند.' : 'Tell us a little about your trip, and our team will guide you through the next steps.')}
              </p>
            </div>

            {submitSuccess && (
              <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center gap-2.5 text-xs sm:text-sm font-medium">
                <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
                <span>{t.success || (isRtl ? 'درخواست شما با موفقیت ثبت شد!' : 'Your inquiry has been submitted successfully!')}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3.5">
              
              {/* نام و ملیت */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-[#14213D] mb-1">
                    {t.fullName || (isRtl ? 'نام و نام خانوادگی' : 'Full Name')} <span className="text-[#FCA311]">*</span>
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    required
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder={t.fullNamePlaceholder || (isRtl ? 'نام کامل خود را وارد کنید' : 'Enter your full name')}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#FCA311] text-xs sm:text-sm text-slate-800 bg-slate-50/50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#14213D] mb-1">
                    {t.nationality || (isRtl ? 'ملیت / کشور' : 'Nationality')}
                  </label>
                  <input
                    type="text"
                    name="nationality"
                    value={formData.nationality}
                    onChange={handleChange}
                    placeholder={t.nationalityPlaceholder || (isRtl ? 'مثلاً: فرانسوی، آلمانی...' : 'e.g. German, French, Canadian...')}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#FCA311] text-xs sm:text-sm text-slate-800 bg-slate-50/50"
                  />
                </div>
              </div>

              {/* ایمیل و شماره تماس */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-[#14213D] mb-1">
                    {t.email || (isRtl ? 'آدرس ایمیل' : 'Email Address')} <span className="text-[#FCA311]">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder={t.emailPlaceholder || (isRtl ? 'example@domain.com' : 'Enter your email address')}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#FCA311] text-xs sm:text-sm text-slate-800 bg-slate-50/50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#14213D] mb-1">
                    {t.phone || (isRtl ? 'شماره تماس / واتس‌اپ' : 'Phone / WhatsApp')} <span className="text-[#FCA311]">*</span>
                  </label>
                  <input
                    type="text"
                    name="phoneWhatsApp"
                    required
                    value={formData.phoneWhatsApp}
                    onChange={handleChange}
                    placeholder={t.phonePlaceholder || '+93 700 000 000'}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#FCA311] text-xs sm:text-sm text-slate-800 bg-slate-50/50"
                  />
                </div>
              </div>

              {/* تاریخ سفر مدنظر و تعداد همراهان */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-[#14213D] mb-1">
                    {t.preferredDate || (isRtl ? 'تاریخ تقریبی سفر' : 'Estimated Travel Date')}
                  </label>
                  <input
                    type="date"
                    name="preferredDate"
                    value={formData.preferredDate}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#FCA311] text-xs sm:text-sm text-slate-800 bg-slate-50/50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#14213D] mb-1">
                    {t.travelers || (isRtl ? 'تعداد مسافران' : 'Number of Travelers')}
                  </label>
                  <input
                    type="text"
                    name="travelers"
                    value={formData.travelers}
                    onChange={handleChange}
                    placeholder="2"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#FCA311] text-xs sm:text-sm text-slate-800 bg-slate-50/50"
                  />
                </div>
              </div>

              {/* هدف از سفر و انتخاب خدمت مدنظر */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-[#14213D] mb-1">
                    {t.purposeOfTravel || (isRtl ? 'هدف از سفر' : 'Purpose of Travel')}
                  </label>
                  <input
                    type="text"
                    name="purposeOfTravel"
                    value={formData.purposeOfTravel}
                    onChange={handleChange}
                    placeholder={t.purposePlaceholder || (isRtl ? 'گردشگری، پژوهش، عکاسی...' : 'Tourism, Research, Photography...')}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#FCA311] text-xs sm:text-sm text-slate-800 bg-slate-50/50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#14213D] mb-1">
                    {t.packageOrService || (isRtl ? 'خدمت مورد تقاضا' : 'Requested Service')} <span className="text-[#FCA311]">*</span>
                  </label>
                  <div className="relative">
                    <select
                      name="packageOrService"
                      value={formData.packageOrService}
                      onChange={handleChange}
                      className="w-full px-3.5 py-2.5 ps-3.5 pe-9 rtl:ps-9 rtl:pe-3.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#FCA311] text-xs sm:text-sm text-slate-800 bg-slate-50/50 font-medium cursor-pointer appearance-none"
                    >
                      {servicesList.map((srv, sIdx) => (
                        <option key={sIdx} value={srv.title}>
                          {srv.title}
                        </option>
                      ))}
                      <option value="Customized & VIP Travel">
                        {isRtl ? 'سفرهای سفارشی و تشریفاتی (VIP)' : 'Customized & VIP Travel'}
                      </option>
                      <option value="All Services / Comprehensive Package">
                        {isRtl ? 'بسته جامع سفر (تمامی خدمات)' : 'All Services / Comprehensive Package'}
                      </option>
                    </select>
                    <div className={`pointer-events-none absolute inset-y-0 ${isRtl ? 'left-3' : 'right-3'} flex items-center text-slate-400`}>
                      <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                        <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* پیام و نیازمندی‌های تکمیلی */}
              <div>
                <label className="block text-xs font-bold text-[#14213D] mb-1">
                  {t.requirements || (isRtl ? 'پیام / اطلاعات و نیازمندی‌های تکمیلی' : 'Message / Additional Information')}
                </label>
                <textarea
                  rows="3"
                  name="additionalRequirements"
                  value={formData.additionalRequirements}
                  onChange={handleChange}
                  placeholder={t.requirementsPlaceholder || (isRtl ? 'هرگونه مقصد خاص، علاقه یا نیازمندی ویژه را یادداشت فرمایید...' : 'Share specific details, destination preferences, or special requirements...')}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#FCA311] text-xs sm:text-sm text-slate-800 bg-slate-50/50 resize-none"
                />
              </div>

              {/* موافقت با قوانین و شرایط */}
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
                  {t.agreeTerms || (isRtl ? 'قوانین، شرایط و خط‌مشی حریم خصوصی آمووی را می‌پذیرم.' : 'I agree to the terms and privacy policy of Amovi Travel.')}
                  {' '}(<Link to="/policy" className="text-[#FCA311] hover:underline">{isRtl ? 'مشاهده قوانین' : 'View Policy'}</Link>)
                </label>
              </div>

              {/* دکمه ارسال */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#FCA311] hover:bg-amber-500 text-[#14213D] font-bold py-3.5 px-6 rounded-xl shadow-lg transition-all duration-200 text-xs sm:text-sm tracking-wide disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
              >
                <Send size={16} />
                <span>
                  {isSubmitting
                    ? (t.submitting || (isRtl ? 'در حال ثبت...' : 'Submitting...'))
                    : (t.submit || (isRtl ? 'ثبت درخواست خدمت' : 'Submit Request'))}
                </span>
              </button>
            </form>
          </div>

        </div>
      </section>

      {/* ========================================================
          ۸. مودال جامع جزییات خدمت (Service Detail Modal)
      ======================================================== */}
      {activeModalService && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#14213D]/70 backdrop-blur-sm animate-fadeIn"
          onClick={() => setActiveModalService(null)}
        >
          <div 
            className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl max-w-2xl w-full max-h-[92vh] overflow-y-auto border border-slate-200 relative text-[#14213D] p-5 sm:p-7 md:p-8 space-y-5 sm:space-y-6"
            dir={isRtl ? 'rtl' : 'ltr'}
            onClick={(e) => e.stopPropagation()}
          >
            {/* دکمه بستن */}
            <button
              type="button"
              onClick={() => setActiveModalService(null)}
              className={`absolute top-4 sm:top-5 ${isRtl ? 'left-4 sm:left-5' : 'right-4 sm:right-5'} p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer`}
              aria-label="Close"
            >
              <X size={20} />
            </button>

            {/* سربرگ مودال */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-3 py-1 rounded-full bg-[#14213D] text-[#FCA311] text-xs font-bold font-[Inter]">
                  {activeModalService.tag || activeModalService.number}
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-[#14213D]">
                {activeModalService.title}
              </h3>
              {activeModalService.heroTagline && (
                <p className="text-xs sm:text-sm font-semibold text-[#FCA311] mt-1">
                  {activeModalService.heroTagline}
                </p>
              )}
              <p className="text-slate-600 text-xs sm:text-sm mt-2.5 sm:mt-3 leading-relaxed">
                {activeModalService.intro || activeModalService.description}
              </p>
            </div>

            {/* بخش ۱: آنچه ما ارائه می‌دهیم (What We Provide) */}
            {activeModalService.whatWeProvide && (
              <div className="space-y-3">
                <h4 className="text-sm sm:text-base font-bold text-[#14213D] flex items-center gap-2 border-b border-slate-100 pb-2">
                  <FileCheck2 size={18} className="text-[#FCA311]" />
                  <span>{t.whatWeProvideTitle || (isRtl ? 'آنچه ما ارائه می‌دهیم' : 'What We Provide')}</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {activeModalService.whatWeProvide.map((item, pIdx) => (
                    <div key={pIdx} className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                      <div className="font-bold text-xs sm:text-sm text-[#14213D] mb-1">
                        {item.title}
                      </div>
                      <div className="text-xs text-slate-500 leading-relaxed">
                        {item.desc}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* بخش ۲: گزینه‌ها یا دسته‌بندی‌ها (Options if available) */}
            {activeModalService.options && (
              <div className="space-y-3">
                <h4 className="text-sm sm:text-base font-bold text-[#14213D] flex items-center gap-2 border-b border-slate-100 pb-2">
                  <Sparkles size={18} className="text-[#FCA311]" />
                  <span>{t.optionsTitle || (isRtl ? 'گزینه‌ها و دسته‌بندی‌ها' : 'Available Options & Formats')}</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {activeModalService.options.map((opt, oIdx) => (
                    <div key={oIdx} className="bg-amber-500/5 p-3.5 rounded-xl border border-amber-500/20">
                      <div className="font-bold text-xs sm:text-sm text-[#14213D] mb-1">
                        {opt.title}
                      </div>
                      <div className="text-xs text-slate-600 leading-relaxed">
                        {opt.desc}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* بخش ۳: مراحل انجام کار (How It Works) */}
            {activeModalService.howItWorks && (
              <div className="space-y-3">
                <h4 className="text-sm sm:text-base font-bold text-[#14213D] flex items-center gap-2 border-b border-slate-100 pb-2">
                  <Calendar size={18} className="text-[#FCA311]" />
                  <span>{t.howItWorksTitle || (isRtl ? 'مراحل انجام کار' : 'How It Works')}</span>
                </h4>
                <div className="space-y-2">
                  {activeModalService.howItWorks.map((stepItem, stIdx) => (
                    <div key={stIdx} className="flex items-start gap-3 p-2.5 rounded-xl bg-slate-50/70">
                      <div className="w-6 h-6 rounded-full bg-[#FCA311] text-[#14213D] font-bold text-xs flex items-center justify-center shrink-0 font-[Inter]">
                        {stepItem.step}
                      </div>
                      <div>
                        <div className="font-bold text-xs sm:text-sm text-[#14213D]">
                          {stepItem.title}
                        </div>
                        <div className="text-xs text-slate-500 leading-relaxed mt-0.5">
                          {stepItem.desc}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* بخش ۴: نکات و اطلاعات مهم (Important Information) */}
            {activeModalService.disclaimer && (
              <div className="p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-amber-50/80 border border-amber-200 text-amber-950 flex items-start gap-3">
                <HelpCircle size={20} className="text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-xs sm:text-sm mb-1">
                    {t.importantNoticeTitle || (isRtl ? 'اطلاعات و نکات مهم' : 'Important Information')}
                  </div>
                  <p className="text-xs leading-relaxed text-amber-900/90">
                    {activeModalService.disclaimer}
                  </p>
                </div>
              </div>
            )}

            {/* دکمه درخواست مستقیم در مودال */}
            <div className="pt-3 sm:pt-4 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2.5 sm:gap-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setActiveModalService(null)}
                className="px-5 py-2.5 rounded-full border border-slate-200 text-xs sm:text-sm font-semibold hover:bg-slate-100 transition-colors cursor-pointer w-full sm:w-auto"
              >
                {t.close || (isRtl ? 'بستن' : 'Close')}
              </button>

              <button
                type="button"
                onClick={() => handleSelectService(activeModalService.title)}
                className="inline-flex items-center justify-center gap-2 bg-[#FCA311] hover:bg-amber-500 text-[#14213D] font-bold py-2.5 px-6 rounded-full shadow-md text-xs sm:text-sm uppercase tracking-wider cursor-pointer w-full sm:w-auto"
              >
                <span>{t.requestService || (isRtl ? 'درخواست این خدمت' : 'Request This Service')}</span>
                {isRtl ? <ArrowLeft size={15} /> : <ArrowRight size={15} />}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}