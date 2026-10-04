import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Shield, FileText, CalendarCheck, CheckCircle2 } from 'lucide-react';
import { useLangStore } from '../../store/useLangStore';
import { getLegalContent } from '../../services/api';
import SEO from '../../components/SEO';
import heroBg from '../../assets/images/hero-bg.webp';

export default function Policy({ defaultTab = 'privacy' }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const { currentLang, translations } = useLangStore();
  const isRtl = currentLang === 'fa';
  
  const legalData = translations?.legalPage || {};
  const [dynamicData, setDynamicData] = useState(null);

  // خواندن تب فعال مستقیماً از کوئری پارامز یا پراپ پیش‌فرض
  const queryTab = searchParams.get('tab');
  const activeTab = queryTab || defaultTab || 'privacy';

  useEffect(() => {
    let isMounted = true;
    getLegalContent().then((data) => {
      if (isMounted && data) {
        setDynamicData(data);
      }
    }).catch(() => {});
    return () => {
      isMounted = false;
    };
  }, []);

  const handleTabChange = (tabKey) => {
    setSearchParams({ tab: tabKey });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const fallbackDoc = legalData[activeTab] || legalData.privacy || {};
  const serverDoc = dynamicData?.[activeTab];
  
  let currentDoc = fallbackDoc;
  if (serverDoc) {
    const langDoc = isRtl ? serverDoc.fa : serverDoc.en;
    if (langDoc && langDoc.title) {
      currentDoc = {
        title: langDoc.title || fallbackDoc.title,
        lastUpdated: langDoc.lastUpdated || fallbackDoc.lastUpdated,
        intro: langDoc.intro || fallbackDoc.intro,
        sections: Array.isArray(langDoc.sections) && langDoc.sections.length > 0 
          ? langDoc.sections 
          : fallbackDoc.sections
      };
    }
  }

  return (
    <div className={`w-full overflow-x-hidden bg-[#F8FAFC] min-h-screen text-[#14213D] ${isRtl ? 'font-[Sahel]' : 'font-[Inter]'}`}>
      <SEO 
        title={isRtl ? `${currentDoc.title || 'قوانین و مقررات'} | آمووی ترول` : `${currentDoc.title || 'Legal & Terms'} | Amovi Travel`}
        description={isRtl 
          ? (currentDoc.subtitle || 'قوانین، مقررات رزرو و حفظ حریم خصوصی آژانس مسافرتی آمووی ترول.')
          : (currentDoc.subtitle || 'Legal policies, terms and conditions, and booking regulations for Amovi Travel.')}
        canonicalUrl={`https://amovi.travel/policy?tab=${activeTab}`}
      />
      
      {/* ========================================================
          ۱. هیرو سکشن مرکز قوانین و حریم خصوصی
      ======================================================== */}
      <section className="relative w-full pt-32 pb-14 sm:pt-40 sm:pb-20 overflow-hidden bg-[#14213D] text-white">
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-45 scale-105"
          style={{ backgroundImage: `url(${heroBg})` }}
        />
        <div className="absolute inset-0 z-10 bg-gradient-to-b from-[#14213D]/95 via-[#14213D]/80 to-[#14213D] pointer-events-none" />

        <div className={`relative z-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 ${isRtl ? 'text-right' : 'text-left'}`}>
          <span className="inline-block text-[#FCA311] text-xs font-bold uppercase tracking-[0.2em] mb-2 font-[Inter]">
            {isRtl ? 'مرکز اسناد حقوقی آمووی' : 'AMOVI LEGAL & COMPLIANCE'}
          </span>

          <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">
            {legalData.title || (isRtl ? 'مرکز قوانین و شرایط حقوقی' : 'Legal & Terms Center')}
          </h1>

          <p className="mt-2.5 sm:mt-3 text-slate-300 text-xs sm:text-sm md:text-base max-w-2xl font-light leading-relaxed">
            {legalData.subtitle || (isRtl 
              ? 'مجموعه توافق‌نامه‌ها، قوانین حقوقی، شرایط رزرو و سیاست‌های حریم خصوصی آمووی اکسپلور افغانستان.' 
              : 'Important legal agreements, policies, and guidelines for traveling with Amovi Explore Afghanistan.')}
          </p>

          {/* تب‌های انتخاب سند حقوقی */}
          <div className="mt-6 sm:mt-8 flex flex-wrap gap-2 sm:gap-3" dir={isRtl ? 'rtl' : 'ltr'}>
            <button
              type="button"
              onClick={() => handleTabChange('privacy')}
              className={`inline-flex items-center gap-1.5 sm:gap-2 px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer ${
                activeTab === 'privacy'
                  ? 'bg-[#FCA311] text-[#14213D] shadow-lg shadow-[#FCA311]/30 scale-105 font-extrabold'
                  : 'bg-white/10 text-slate-200 hover:bg-white/20 border border-white/20'
              }`}
            >
              <Shield size={15} />
              <span>{legalData.tabs?.privacy || (isRtl ? 'حریم خصوصی' : 'Privacy Policy')}</span>
            </button>

            <button
              type="button"
              onClick={() => handleTabChange('terms')}
              className={`inline-flex items-center gap-1.5 sm:gap-2 px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer ${
                activeTab === 'terms'
                  ? 'bg-[#FCA311] text-[#14213D] shadow-lg shadow-[#FCA311]/30 scale-105 font-extrabold'
                  : 'bg-white/10 text-slate-200 hover:bg-white/20 border border-white/20'
              }`}
            >
              <FileText size={15} />
              <span>{legalData.tabs?.terms || (isRtl ? 'شرایط و ضوابط عمومی' : 'Terms & Conditions')}</span>
            </button>

            <button
              type="button"
              onClick={() => handleTabChange('booking')}
              className={`inline-flex items-center gap-1.5 sm:gap-2 px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer ${
                activeTab === 'booking'
                  ? 'bg-[#FCA311] text-[#14213D] shadow-lg shadow-[#FCA311]/30 scale-105 font-extrabold'
                  : 'bg-white/10 text-slate-200 hover:bg-white/20 border border-white/20'
              }`}
            >
              <CalendarCheck size={15} />
              <span>{legalData.tabs?.booking || (isRtl ? 'مقررات و شرایط رزرو' : 'Booking Terms & Conditions')}</span>
            </button>
          </div>

        </div>
      </section>

      {/* ========================================================
          ۲. بدنه متن سند قانونی انتخاب‌شده
      ======================================================== */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 md:py-16">
        <div className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-8 md:p-10 border border-slate-200/90 shadow-xl space-y-6 sm:space-y-8" dir={isRtl ? 'rtl' : 'ltr'}>
          
          {/* هدر سند */}
          <div className="border-b border-slate-100 pb-5 sm:pb-6 space-y-2">
            <span className="text-[#FCA311] text-xs font-bold uppercase tracking-wider font-[Inter] block">
              {currentDoc.lastUpdated || 'Last Updated: September 2026'}
            </span>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-[#14213D]">
              {currentDoc.title}
            </h2>
            <p className="text-slate-600 text-xs sm:text-sm md:text-base leading-relaxed pt-1 font-normal">
              {currentDoc.intro}
            </p>
          </div>

          {/* لیست بندهای ۹‌گانه سند حقوقی */}
          <div className="space-y-4 sm:space-y-6">
            {currentDoc.sections?.map((section) => (
              <div 
                key={section.num}
                className="bg-[#F8FAFC] p-4 sm:p-6 rounded-xl sm:rounded-2xl border border-slate-200/70 hover:border-[#FCA311]/40 transition-colors space-y-2 sm:space-y-2.5"
              >
                <div className="flex items-center gap-2.5 sm:gap-3">
                  <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl bg-[#14213D] text-[#FCA311] flex items-center justify-center text-xs font-black font-[Inter] shrink-0">
                    {section.num}
                  </span>
                  <h3 className="text-sm sm:text-base md:text-lg font-bold text-[#14213D]">
                    {section.title}
                  </h3>
                </div>

                <p className="text-slate-600 text-xs sm:text-sm md:text-base leading-relaxed ps-0 sm:ps-11">
                  {section.content}
                </p>
              </div>
            ))}
          </div>

          {/* فوتر سند با تاکید بر تعهد و تماس */}
          <div className="pt-5 sm:pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 text-xs text-slate-500 text-center sm:text-start">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-[#FCA311] shrink-0" />
              <span>
                {isRtl 
                  ? 'تمامی سفرهای آمووی تحت پوشش پروتکل‌های امنیتی و تعهدات رسمی اجرا می‌شوند.' 
                  : 'All Amovi journeys are operated under verified safety protocols and official commitments.'}
              </span>
            </div>

            <span className="font-[Inter] text-slate-400">
              Amovi Explore Afghanistan © 2026
            </span>
          </div>

        </div>
      </main>

    </div>
  );
}