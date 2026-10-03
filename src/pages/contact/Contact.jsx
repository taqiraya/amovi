import { useState } from 'react';
import { Mail, MapPin, ArrowRight, ArrowLeft, MessageCircle, CheckCircle2 } from 'lucide-react';
import { useLangStore } from '../../store/useLangStore';
import { createContactMessage } from '../../services/api';
import heroBg from '../../assets/images/hero-bg.webp';

export default function Contact() {
  const { currentLang, translations } = useLangStore();
  const isRtl = currentLang === 'fa';
  const t = translations?.contactPage || {};

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneWhatsApp: '',
    subject: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await createContactMessage({
        ...formData,
        submittedAt: new Date().toISOString()
      });
      setIsSubmitting(false);
      setSubmitSuccess(true);
      setFormData({
        fullName: '',
        email: '',
        phoneWhatsApp: '',
        subject: '',
        message: ''
      });
      setTimeout(() => setSubmitSuccess(false), 6000);
    } catch (err) {
      console.error('Error sending message:', err);
      setIsSubmitting(false);
      alert(isRtl ? 'خطا در ارسال پیام. لطفاً دوباره تلاش کنید.' : 'Failed to send message. Please try again.');
    }
  };

  return (
    <div className={`w-full bg-[#F8FAFC] min-h-screen ${isRtl ? 'font-[Sahel]' : 'font-[Inter]'}`}>
      
      {/* ========================================================
          ۱. هیرو سکشن اصلی صفحه تماس (با الهام مستقیم از تمپلت)
      ======================================================== */}
      <section className="relative w-full pt-36 pb-20 sm:pt-40 sm:pb-24 overflow-hidden bg-[#14213D] text-white">
        {/* تصویر پس‌زمینه کوه‌ها با اورلی گرادینت تیره و شفاف */}
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-45 scale-105"
          style={{ backgroundImage: `url(${heroBg})` }}
        />
        <div className="absolute inset-0 z-10 bg-gradient-to-b from-[#14213D]/95 via-[#14213D]/80 to-[#14213D] pointer-events-none" />

        {/* محتوای متنی هیرو */}
        <div className={`relative z-20 max-w-6xl mx-auto px-6 ${isRtl ? 'text-right' : 'text-left'}`}>
          <span className="inline-block text-[#FCA311] text-xs font-bold uppercase tracking-[0.2em] mb-2 font-[Inter]">
            {t.eyebrow || (isRtl ? 'در تماس باشید' : 'GET IN TOUCH')}
          </span>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight">
            <span className="relative inline-block pb-1 after:absolute after:bottom-0 after:left-0 after:w-full after:h-1 after:bg-[#FCA311] after:rounded-full">
              {t.titlePrefix || (isRtl ? 'تماس با ' : 'Contact ')}
            </span>{' '}
            <span className="text-[#FCA311]">
              {t.titleHighlight || 'Amovi Travel'}
            </span>
          </h1>

          <p className="mt-4 text-slate-300 text-sm sm:text-base md:text-lg max-w-xl font-light leading-relaxed">
            {t.subtitle || (isRtl ? 'ما اینجا هستیم تا در برنامه‌ریزی سفر بعدی به شما کمک کنیم.' : "We're here to help plan your next journey.")}
          </p>
        </div>
      </section>

      {/* ========================================================
          ۲. بخش میانی: دو ستونه (اطلاعات تماس + فرم ارسال پیام)
      ======================================================== */}
      <section className="max-w-6xl mx-auto px-6 py-12 sm:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start" dir={isRtl ? 'rtl' : 'ltr'}>
          
          {/* 🔴 ستون اول (چپ): Let's Talk و کارت‌های اطلاعات ارتباطی */}
          <div className={`lg:col-span-5 space-y-6 ${isRtl ? 'text-right' : 'text-left'}`}>
            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-[#14213D] tracking-tight">
                {t.letsTalkTitle || (isRtl ? 'بیایید گفتگو کنیم' : "Let's Talk")}
              </h2>
              <p className="text-slate-500 text-sm mt-2 leading-relaxed">
                {t.letsTalkSubtitle || (isRtl 
                  ? 'از طریق هر یک از کانال‌های زیر با ما در ارتباط باشید. همواره خوشحال می‌شویم کمکتان کنیم.' 
                  : "Reach out to us through any of the following channels. We're always happy to help.")}
              </p>
            </div>

            {/* کارت‌های سه‌گانه ارتباطی */}
            <div className="space-y-4">
              
              {/* ۱. کارت واتس‌اپ */}
              <a
                href="https://wa.me/93700000000"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-4 p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm hover:shadow-md hover:border-[#FCA311]/50 transition-all duration-200 hover:-translate-y-0.5"
              >
                <div className="w-13 h-13 rounded-full bg-[#FCA311] flex items-center justify-center text-white shrink-0 shadow-md shadow-[#FCA311]/20 group-hover:scale-105 transition-transform duration-200">
                  <MessageCircle size={24} className="fill-white/20" />
                </div>
                <div className="flex-grow">
                  <h3 className="text-base font-bold text-[#14213D] group-hover:text-[#FCA311] transition-colors">
                    {t.whatsappTitle || 'WhatsApp'}
                  </h3>
                  <p className="text-sm font-semibold text-slate-700 font-[Inter] tracking-wide" dir="ltr">
                    {t.whatsappNumber || '+93 700 000 000'}
                  </p>
                  <span className="text-xs text-slate-400 block mt-0.5 font-normal">
                    {t.whatsappAction || (isRtl ? 'در واتس‌اپ با ما گفتگو کنید' : 'Chat with us on WhatsApp')}
                  </span>
                </div>
              </a>

              {/* ۲. کارت ایمیل */}
              <a
                href="mailto:info@amovitravel.com"
                className="group flex items-center gap-4 p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm hover:shadow-md hover:border-[#FCA311]/50 transition-all duration-200 hover:-translate-y-0.5"
              >
                <div className="w-13 h-13 rounded-full bg-[#FCA311] flex items-center justify-center text-white shrink-0 shadow-md shadow-[#FCA311]/20 group-hover:scale-105 transition-transform duration-200">
                  <Mail size={24} />
                </div>
                <div className="flex-grow">
                  <h3 className="text-base font-bold text-[#14213D] group-hover:text-[#FCA311] transition-colors">
                    {t.emailTitle || 'Email'}
                  </h3>
                  <p className="text-sm font-semibold text-slate-700 font-[Inter]">
                    {t.emailAddress || 'info@amovitravel.com'}
                  </p>
                  <span className="text-xs text-slate-400 block mt-0.5 font-normal">
                    {t.emailAction || (isRtl ? 'برای ما ایمیل ارسال کنید' : 'Send us an email')}
                  </span>
                </div>
              </a>

              {/* ۳. کارت دفتر کابل */}
              <button
                type="button"
                onClick={() => {
                  document.getElementById('office-map')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className={`group w-full flex items-center gap-4 p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm hover:shadow-md hover:border-[#FCA311]/50 transition-all duration-200 hover:-translate-y-0.5 cursor-pointer ${isRtl ? 'text-right' : 'text-left'}`}
              >
                <div className="w-13 h-13 rounded-full bg-[#FCA311] flex items-center justify-center text-white shrink-0 shadow-md shadow-[#FCA311]/20 group-hover:scale-105 transition-transform duration-200">
                  <MapPin size={24} />
                </div>
                <div className="flex-grow">
                  <h3 className="text-base font-bold text-[#14213D] group-hover:text-[#FCA311] transition-colors">
                    {t.officeTitle || (isRtl ? 'دفتر کابل' : 'Kabul Office')}
                  </h3>
                  <p className="text-sm font-semibold text-slate-700">
                    {t.officeLocation || (isRtl ? 'کابل، افغانستان' : 'Kabul, Afghanistan')}
                  </p>
                  <span className="text-xs text-slate-400 block mt-0.5 font-normal">
                    {t.officeAction || (isRtl ? 'از دفتر ما بازدید کنید' : 'Visit our office')}
                  </span>
                </div>
              </button>

            </div>
          </div>

          {/* 🔴 ستون دوم (راست): فرم Send Us a Message */}
          <div className="lg:col-span-7 bg-white p-6 sm:p-10 rounded-3xl border border-slate-200/90 shadow-xl space-y-6">
            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-[#14213D] tracking-tight">
                {t.formTitle || (isRtl ? 'برای ما پیام بفرستید' : 'Send Us a Message')}
              </h2>
              <p className="text-slate-500 text-sm mt-1.5 leading-relaxed">
                {t.formSubtitle || (isRtl 
                  ? 'فرم زیر را پر کنید تا در کوتاه‌ترین زمان پاسخگوی شما باشیم.' 
                  : "Fill out the form below and we'll get back to you as soon as possible.")}
              </p>
            </div>

            {submitSuccess && (
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center gap-3 animate-fade-in text-sm font-medium">
                <CheckCircle2 size={20} className="text-emerald-600 shrink-0" />
                <span>{t.sentSuccess || 'Your message has been sent successfully!'}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* سطر اول: نام کامل و آدرس ایمیل */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#14213D] mb-1.5">
                    {t.fullName || (isRtl ? 'نام کامل' : 'Full Name')} <span className="text-[#FCA311]">*</span>
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    required
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder={t.fullNamePlaceholder || (isRtl ? 'نام کامل خود را وارد کنید' : 'Enter your full name')}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-[#FCA311] text-sm text-slate-800 placeholder-slate-400 bg-slate-50/50 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#14213D] mb-1.5">
                    {t.email || (isRtl ? 'آدرس ایمیل' : 'Email Address')} <span className="text-[#FCA311]">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder={t.emailPlaceholder || (isRtl ? 'آدرس ایمیل خود را وارد کنید' : 'Enter your email address')}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-[#FCA311] text-sm text-slate-800 placeholder-slate-400 bg-slate-50/50 transition-colors"
                  />
                </div>
              </div>

              {/* سطر دوم: شماره تماس / واتس‌اپ و موضوع */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#14213D] mb-1.5">
                    {t.phone || (isRtl ? 'شماره تماس / واتس‌اپ' : 'Phone / WhatsApp')} <span className="text-[#FCA311]">*</span>
                  </label>
                  <input
                    type="text"
                    name="phoneWhatsApp"
                    required
                    value={formData.phoneWhatsApp}
                    onChange={handleChange}
                    placeholder={t.phonePlaceholder || '+93 700 000 000'}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-[#FCA311] text-sm text-slate-800 placeholder-slate-400 bg-slate-50/50 transition-colors text-left"
                    dir="ltr"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#14213D] mb-1.5">
                    {t.subject || (isRtl ? 'موضوع پیام' : 'Subject')} <span className="text-[#FCA311]">*</span>
                  </label>
                  <select
                    name="subject"
                    required
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-[#FCA311] text-sm text-slate-800 bg-slate-50/50 transition-colors cursor-pointer"
                  >
                    <option value="" disabled>
                      {t.selectSubject || (isRtl ? 'یک موضوع انتخاب کنید' : 'Select a subject')}
                    </option>
                    <option value="tour">{t.subjectOptions?.tour || (isRtl ? 'رزرو و پکیج‌های تور' : 'Tour Packages & Booking')}</option>
                    <option value="visa">{t.subjectOptions?.visa || (isRtl ? 'خدمات تسهیلات ویزا' : 'Visa Support Services')}</option>
                    <option value="custom">{t.subjectOptions?.custom || (isRtl ? 'درخواست سفر اختصاصی' : 'Custom Journey Request')}</option>
                    <option value="general">{t.subjectOptions?.general || (isRtl ? 'پرسش‌های عمومی' : 'General Inquiry')}</option>
                    <option value="other">{t.subjectOptions?.other || (isRtl ? 'سایر موارد' : 'Other Inquiries')}</option>
                  </select>
                </div>
              </div>

              {/* سطر سوم: متن پیام */}
              <div>
                <label className="block text-xs font-bold text-[#14213D] mb-1.5">
                  {t.message || (isRtl ? 'متن پیام' : 'Message')} <span className="text-[#FCA311]">*</span>
                </label>
                <textarea
                  name="message"
                  required
                  rows={4}
                  value={formData.message}
                  onChange={handleChange}
                  placeholder={t.messagePlaceholder || (isRtl ? 'بفرمایید چگونه می‌توانیم به شما کمک کنیم...' : 'Tell us how we can help you...')}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-[#FCA311] text-sm text-slate-800 placeholder-slate-400 bg-slate-50/50 transition-colors resize-none"
                />
              </div>

              {/* دکمه ارسال پیام طلایی عینا مطابق تمپلت */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#FCA311] hover:bg-amber-500 active:scale-[0.99] text-[#14213D] font-extrabold py-3.5 px-6 rounded-xl shadow-md transition-all duration-200 flex items-center justify-center gap-2 group cursor-pointer disabled:opacity-60"
                >
                  <span className="text-sm sm:text-base">
                    {isSubmitting ? (t.sending || 'Sending...') : (t.sendMessage || 'Send Message')}
                  </span>
                  {isRtl ? (
                    <ArrowLeft size={18} className="transition-transform group-hover:-translate-x-1" strokeWidth={2.5} />
                  ) : (
                    <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" strokeWidth={2.5} />
                  )}
                </button>
              </div>

            </form>
          </div>

        </div>
      </section>

      {/* ========================================================
          ۳. بخش نقشه دفتر کابل (عینا مطابق طرح تمپلت)
      ======================================================== */}
      <section id="office-map" className="max-w-6xl mx-auto px-6 pb-20">
        <div className="relative w-full h-[360px] sm:h-[420px] rounded-3xl overflow-hidden border border-slate-200 shadow-xl bg-slate-100">
          
          {/* نقشه اینتراکتیو با تایل‌های دقیق کابل - شهرنو چهارراهی انصاری */}
          <iframe
            title="Amovi Travel Kabul Office Location"
            src="https://www.openstreetmap.org/export/embed.html?bbox=69.155,34.524,69.180,34.544&layer=mapnik&marker=34.5338,69.1668"
            className="w-full h-full border-0 filter contrast-[1.02] brightness-[0.98]"
            loading="lazy"
          />

          {/* کارت شناور مشخصات دفتر روی نقشه (عینا مطابق تصویر تمپلت) */}
          <div className={`absolute top-6 ${isRtl ? 'right-6 text-right' : 'left-6 text-left'} z-20 bg-white/95 backdrop-blur-md p-6 rounded-2xl shadow-2xl border border-slate-100 max-w-xs sm:max-w-sm`}>
            <span className="text-[#FCA311] text-[10px] sm:text-xs font-bold uppercase tracking-widest block mb-1 font-[Inter]">
              {t.visitOurOffice || (isRtl ? 'بازدید از دفتر ما' : 'VISIT OUR OFFICE')}
            </span>
            <h3 className="text-xl font-black text-[#14213D] mb-2">
              {t.officeCity || (isRtl ? 'کابل، افغانستان' : 'Kabul, Afghanistan')}
            </h3>
            <div className="flex items-start gap-2 text-xs sm:text-sm text-slate-600 mb-5 leading-relaxed">
              <MapPin size={16} className="text-[#FCA311] shrink-0 mt-0.5" />
              <span>{t.officeAddress || (isRtl ? 'چهارراهی انصاری، شهرنو، کابل، افغانستان' : 'Ansari Square, Shahr-e Naw, Kabul, Afghanistan')}</span>
            </div>
            
            <a
              href="https://www.google.com/maps/search/?api=1&query=Char+Rahi+Ansari+Shahr-e+Naw+Kabul+Afghanistan"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#FCA311] hover:bg-amber-500 text-[#14213D] text-xs sm:text-sm font-bold py-2.5 px-5 rounded-full shadow-md transition-all duration-200 group"
            >
              <span>{t.getDirections || (isRtl ? 'مسیریابی روی نقشه' : 'Get Directions')}</span>
              {isRtl ? (
                <ArrowLeft size={14} className="transition-transform group-hover:-translate-x-1" strokeWidth={2.5} />
              ) : (
                <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" strokeWidth={2.5} />
              )}
            </a>
          </div>

          {/* پین مرکزی اختصاصی برند Amovi در قلب نقشه */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 pointer-events-none flex flex-col items-center">
            <div className="w-10 h-10 rounded-full bg-[#FCA311] text-[#14213D] border-2 border-white shadow-xl flex items-center justify-center animate-bounce">
              <MapPin size={22} className="fill-[#14213D]" />
            </div>
            <span className="bg-[#14213D] text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full shadow-md mt-1 font-[Inter]">
              Shahr-e Naw, Kabul
            </span>
          </div>

        </div>
      </section>

    </div>
  );
}
