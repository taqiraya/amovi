import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, ArrowRight, ArrowLeft } from 'lucide-react';
import { useLangStore } from '../../store/useLangStore';
import { createMasterRequest } from '../../services/api';
import heroBg from '../../assets/images/hero-bg.webp';

export default function Services() {
  const { currentLang, translations } = useLangStore();
  const isRtl = currentLang === 'fa';
  const t = translations?.servicesPage || {};

  const formRef = useRef(null);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneWhatsApp: '',
    preferredDate: '',
    travelers: '2',
    packageOrService: 'Visa Assistance',
    additionalRequirements: '',
    agreeTerms: true
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const servicesList = t.services || [
    {
      id: 'visa',
      tag: 'VISA ASSISTANCE',
      title: 'Visa Assistance',
      description: 'We help simplify your visa process with expert guidance and full support.',
      bullets: ['Application guidance', 'Document preparation', 'Process support'],
      image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1000&q=80'
    },
    {
      id: 'accommodations',
      tag: 'ACCOMMODATIONS',
      title: 'Accommodations',
      description: 'Comfortable stays selected around your itinerary for a better travel experience.',
      bullets: ['Carefully selected hotels', 'Location-focused options', 'Comfortable arrangements'],
      image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1000&q=80'
    },
    {
      id: 'transportation',
      tag: 'TRANSPORTATION',
      title: 'Transportation',
      description: 'Safe and reliable transportation throughout your journey.',
      bullets: ['Airport transfers', 'Private transportation', 'Route coordination'],
      image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1000&q=80'
    },
    {
      id: 'guides',
      tag: 'PROFESSIONAL GUIDES',
      title: 'Professional Guides',
      description: 'Discover Afghanistan through knowledgeable and friendly local guides.',
      bullets: ['Local expertise', 'Cultural insight', 'Personalized experiences'],
      image: '/tours/images/heratPictures.webp'
    },
    {
      id: 'security',
      tag: 'TRAVEL SECURITY & SUPPORT',
      title: 'Travel Security & Support',
      description: 'Your safety and comfort are our top priority from start to finish.',
      bullets: ['Traveler assistance', 'Local support', 'Journey coordination'],
      image: '/tours/images/bamyanPictures.webp'
    }
  ];

  const handleSelectService = (serviceTitle) => {
    setFormData((prev) => ({
      ...prev,
      packageOrService: serviceTitle
    }));
    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
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
        email: '',
        phoneWhatsApp: '',
        preferredDate: '',
        travelers: '2',
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
      
      {/* ========================================================
          ۱. هیرو سکشن اصلی صفحه خدمات (Travel Beyond Expectations)
      ======================================================== */}
      <section className="relative w-full pt-36 pb-20 sm:pt-40 sm:pb-28 overflow-hidden bg-[#14213D] text-white">
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-45 scale-105"
          style={{ backgroundImage: `url(${heroBg})` }}
        />
        <div className="absolute inset-0 z-10 bg-gradient-to-b from-[#14213D]/95 via-[#14213D]/80 to-[#14213D] pointer-events-none" />

        <div className={`relative z-20 max-w-6xl mx-auto px-6 ${isRtl ? 'text-right' : 'text-left'}`}>
          <span className="inline-block text-[#FCA311] text-xs font-bold uppercase tracking-[0.2em] mb-2 font-[Inter]">
            {t.heroEyebrow || (isRtl ? 'خدمات ما' : 'SERVICES')}
          </span>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight">
            <span className="relative inline-block pb-1 after:absolute after:bottom-0 after:left-0 after:w-full after:h-1 after:bg-[#FCA311] after:rounded-full">
              {t.heroTitlePrefix || (isRtl ? 'فراتر از ' : 'Travel Beyond ')}
            </span>{' '}
            <span className="text-[#FCA311]">
              {t.heroTitleHighlight || (isRtl ? 'انتظارات سفر کنید' : 'Expectations')}
            </span>
          </h1>

          <p className="mt-4 text-slate-300 text-sm sm:text-base md:text-lg max-w-2xl font-light leading-relaxed">
            {t.heroSubtitle || (isRtl 
              ? 'از برنامه‌ریزی تا رسیدن به مقصد، افغانستان را با همراهی کارشناسان محلی و معتمد تجربه کنید.' 
              : 'From planning to arrival, experience Afghanistan with trusted local expertise.')}
          </p>
        </div>
      </section>

      {/* ========================================================
          ۲. عنوان بخش خدمات (Designed Around Your Journey)
      ======================================================== */}
      <section className="max-w-6xl mx-auto px-6 pt-16 sm:pt-20 pb-8 text-center">
        <span className="text-[#FCA311] text-xs font-bold uppercase tracking-widest block font-[Inter] mb-2">
          {t.sectionEyebrow || (isRtl ? 'خدمات آمووی' : 'OUR SERVICES')}
        </span>
        <h2 className="text-2xl sm:text-4xl font-black text-[#14213D] tracking-tight">
          {t.sectionTitle || (isRtl ? 'طراحی‌شده بر اساس سفر شما' : 'Designed Around Your Journey')}
        </h2>
        <p className="text-slate-500 text-sm sm:text-base max-w-2xl mx-auto mt-3 leading-relaxed">
          {t.sectionSubtitle || (isRtl 
            ? 'از تسهیلات ویزا تا ترانسفر امن و مطمئن، آمووی ترول تمام جزئیات را مدیریت می‌کند تا شما فقط از سفر لذت ببرید.' 
            : 'From visa assistance to secure transportation, Amovi Travel handles the details so you can focus on the experience.')}
        </p>
      </section>

      {/* ========================================================
          ۳. ردیف‌های ۵‌گانه زیگزاگی خدمات
      ======================================================== */}
      <section className="max-w-6xl mx-auto px-6 py-8 sm:py-12 space-y-16 sm:space-y-24">
        {servicesList.map((service, index) => {
          const isReversed = index % 2 === 1;

          return (
            <div 
              key={service.id || index}
              className={`flex flex-col ${isReversed ? 'lg:flex-row-reverse' : 'lg:flex-row'} items-center gap-8 lg:gap-14`}
              dir={isRtl ? 'rtl' : 'ltr'}
            >
              {/* بخش تصویر */}
              <div className="w-full lg:w-1/2">
                <div className="relative rounded-3xl overflow-hidden shadow-xl border-4 border-white bg-slate-200 aspect-[16/10] group">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#14213D]/25 via-transparent to-transparent pointer-events-none" />
                </div>
              </div>

              {/* بخش توضیحات و لیست بولت‌ها */}
              <div className={`w-full lg:w-1/2 space-y-4 ${isRtl ? 'text-right' : 'text-left'}`}>
                <span className="text-[#FCA311] text-xs font-bold uppercase tracking-widest block font-[Inter]">
                  {service.tag}
                </span>

                <h3 className="text-2xl sm:text-3xl font-extrabold text-[#14213D] tracking-tight">
                  {service.title}
                </h3>

                <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                  {service.description}
                </p>

                {/* چک‌لیست ویژگی‌ها */}
                <ul className="space-y-2.5 pt-2">
                  {service.bullets?.map((bullet, bIdx) => (
                    <li key={bIdx} className="flex items-center gap-3 text-slate-700 text-sm font-medium">
                      <div className="w-5 h-5 rounded-full bg-amber-500/15 text-[#FCA311] flex items-center justify-center shrink-0">
                        <CheckCircle2 size={16} className="text-[#FCA311]" />
                      </div>
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>

                {/* دکمه درخواست این خدمت */}
                <div className="pt-3">
                  <button
                    type="button"
                    onClick={() => handleSelectService(service.title)}
                    className="inline-flex items-center gap-2 bg-[#FCA311] hover:bg-amber-500 text-[#14213D] font-bold py-3 px-6 rounded-full shadow-md hover:shadow-lg transition-all duration-200 text-xs sm:text-sm group uppercase font-[Inter] tracking-wider cursor-pointer"
                  >
                    <span>{t.requestService || (isRtl ? 'درخواست این خدمت' : 'Request This Service')}</span>
                    {isRtl ? (
                      <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" strokeWidth={2.5} />
                    ) : (
                      <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" strokeWidth={2.5} />
                    )}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </section>

      {/* ========================================================
          ۴. بخش آماده برنامه‌ریزی و فرم ثبت درخواست (Ready to Plan?)
      ======================================================== */}
      <section ref={formRef} className="max-w-6xl mx-auto px-6 py-16 sm:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch" dir={isRtl ? 'rtl' : 'ltr'}>
          
          {/* ستون چپ: بنر دعوت به تماس */}
          <div className="lg:col-span-5 relative rounded-3xl overflow-hidden shadow-xl min-h-[380px] flex flex-col justify-between p-8 sm:p-10 text-white bg-[#14213D]">
            <div 
              className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-40 scale-105"
              style={{ backgroundImage: `url(${heroBg})` }}
            />
            <div className="absolute inset-0 z-10 bg-gradient-to-t from-[#14213D] via-[#14213D]/70 to-transparent pointer-events-none" />

            <div className={`relative z-20 space-y-3 ${isRtl ? 'text-right' : 'text-left'}`}>
              <span className="text-[#FCA311] text-xs font-bold uppercase tracking-widest block font-[Inter]">
                {t.ctaEyebrow || (isRtl ? 'آماده برنامه‌ریزی هستید؟' : 'READY TO PLAN?')}
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight">
                {t.ctaTitle || (isRtl ? 'درخواست تجربه اختصاصی شما' : 'Request Your Experience')}
              </h2>
              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed font-light">
                {t.ctaSubtitle || (isRtl 
                  ? 'به ما بگویید چه برنامه‌ای مدنظر دارید تا تیم ما در برنامه‌ریزی گام‌های بعدی همراه شما باشد.' 
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

          {/* ستون راست: فرم ثبت درخواست خدمت / پکیج */}
          <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xl space-y-4">
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-[#14213D]">
                {t.formTitle || (isRtl ? 'ثبت درخواست این پکیج / خدمت' : 'Request This Package / Service')}
              </h3>
              <p className="text-slate-500 text-xs mt-1">
                {t.formSubtitle || (isRtl ? 'اطلاعات خود را وارد کنید تا کارشناسان ما هماهنگی‌ها را آغاز نمایند.' : 'Submit your inquiry and we will arrange everything for you.')}
              </p>
            </div>

            {submitSuccess && (
              <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center gap-2.5 text-xs sm:text-sm font-medium">
                <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
                <span>{t.success || (isRtl ? 'درخواست شما با موفقیت ثبت شد!' : 'Your inquiry has been submitted successfully!')}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3.5">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-[#14213D] mb-1">
                    {t.fullName || (isRtl ? 'نام کامل' : 'Full Name')} <span className="text-[#FCA311]">*</span>
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
                    {t.email || (isRtl ? 'آدرس ایمیل' : 'Email Address')} <span className="text-[#FCA311]">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder={t.emailPlaceholder || (isRtl ? 'آدرس ایمیل خود را وارد کنید' : 'Enter your email address')}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#FCA311] text-xs sm:text-sm text-slate-800 bg-slate-50/50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
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

                <div>
                  <label className="block text-xs font-bold text-[#14213D] mb-1">
                    {t.preferredDate || (isRtl ? 'تاریخ سفر مدنظر' : 'Preferred Travel Date')}
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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
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

                <div>
                  <label className="block text-xs font-bold text-[#14213D] mb-1">
                    {t.packageOrService || (isRtl ? 'نام پکیج یا خدمت' : 'Package / Service Name')}
                  </label>
                  <input
                    type="text"
                    name="packageOrService"
                    value={formData.packageOrService}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#FCA311] text-xs sm:text-sm text-slate-800 bg-slate-50/50 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#14213D] mb-1">
                  {t.requirements || (isRtl ? 'توضیحات و نیازمندی‌های تکمیلی' : 'Additional Requirements')}
                </label>
                <textarea
                  rows="3"
                  name="additionalRequirements"
                  value={formData.additionalRequirements}
                  onChange={handleChange}
                  placeholder={t.requirementsPlaceholder || (isRtl ? 'هر نکته یا درخواست خاصی دارید بنویسید...' : 'Tell us anything else we should know about your trip...')}
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
                  {t.agreeTerms || (isRtl ? 'قوانین و شرایط آمووی را می‌پذیرم.' : 'I agree to the terms and privacy policy of Amovi Travel.')}
                </label>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#FCA311] hover:bg-amber-500 text-[#14213D] font-bold py-3.5 px-6 rounded-xl shadow-lg transition-all duration-200 text-xs sm:text-sm tracking-wide disabled:opacity-50 cursor-pointer"
              >
                {isSubmitting
                  ? (t.submitting || (isRtl ? 'در حال ثبت...' : 'Submitting...'))
                  : (t.submit || (isRtl ? 'ثبت درخواست سفر' : 'Submit Request'))}
              </button>
            </form>
          </div>

        </div>
      </section>

    </div>
  );
}