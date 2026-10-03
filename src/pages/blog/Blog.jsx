import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowLeft, Clock, ChevronLeft, ChevronRight, Compass } from 'lucide-react';
import { useLangStore } from '../../store/useLangStore';
import SEO from '../../components/SEO';
import heroBg from '../../assets/images/hero-bg.webp';

const ITEMS_PER_PAGE = 6;

export default function Blog() {
  const { currentLang, translations } = useLangStore();
  const isRtl = currentLang === 'fa';
  const t = translations?.blogPage || {};

  const [activePillar, setActivePillar] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);

  // فیلتر مقالات بر اساس پیلار انتخابی
  const filteredArticles = useMemo(() => {
    const raw = t.articles || [];
    if (activePillar === 'all') return raw;
    return raw.filter((item) => item.pillar === activePillar);
  }, [t.articles, activePillar]);

  // محاسبه تعداد کل صفحات
  const totalPages = Math.max(1, Math.ceil(filteredArticles.length / ITEMS_PER_PAGE));

  // مقالات صفحه جاری
  const paginatedArticles = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredArticles.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredArticles, currentPage]);

  const handleSelectPillar = (pillarKey) => {
    setActivePillar(pillarKey);
    setCurrentPage(1);
  };

  const pillarsData = t.pillars || {};

  // دریافت سوال تماتیک پیلار فعال
  const activeQuestion = activePillar !== 'all' && pillarsData[activePillar]?.question 
    ? pillarsData[activePillar].question 
    : null;

  return (
    <div className={`w-full overflow-x-hidden bg-[#F8FAFC] min-h-screen text-[#14213D] ${isRtl ? 'font-[Sahel]' : 'font-[Inter]'}`}>
      <SEO 
        title={isRtl ? 'وبلاگ و روایت‌های سفر در افغانستان | آمووی ترول' : 'Travel Blog & Stories from Afghanistan | Amovi Travel'}
        description={isRtl 
          ? 'روایت‌ها، راهنماهای سفر، فرهنگ و میراث تاریخی افغانستان به قلم کارشناسان آمووی ترول.' 
          : 'Authentic travel stories, deep cultural insights, and field travel guides across Afghanistan with Amovi Travel.'}
        canonicalUrl="https://amovi.travel/blog"
      />
      
      {/* ========================================================
          ۱. هیرو سکشن اصلی وبلاگ (Stories From Afghanistan)
      ======================================================== */}
      <section className="relative w-full pt-32 pb-16 sm:pt-40 sm:pb-24 overflow-hidden bg-[#14213D] text-white">
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-45 scale-105"
          style={{ backgroundImage: `url(${heroBg})` }}
        />
        <div className="absolute inset-0 z-10 bg-gradient-to-b from-[#14213D]/95 via-[#14213D]/80 to-[#14213D] pointer-events-none" />

        <div className={`relative z-20 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 ${isRtl ? 'text-right' : 'text-left'}`}>
          <span className="inline-block text-[#FCA311] text-xs font-bold uppercase tracking-[0.2em] mb-2 font-[Inter]">
            {t.heroEyebrow || (isRtl ? 'روایت‌های سفر' : 'TRAVEL STORIES')}
          </span>

          <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight">
            <span className="relative inline-block pb-1 after:absolute after:bottom-0 after:left-0 after:w-full after:h-1 after:bg-[#FCA311] after:rounded-full">
              {t.heroTitlePrefix || (isRtl ? 'داستان‌هایی از ' : 'Stories From ')}
            </span>{' '}
            <span className="text-[#FCA311]">
              {t.heroTitleHighlight || (isRtl ? 'افغانستان' : 'Afghanistan')}
            </span>
          </h1>

          <p className="mt-3 sm:mt-4 text-slate-300 text-xs sm:text-sm md:text-base max-w-2xl font-light leading-relaxed">
            {t.heroSubtitle || (isRtl 
              ? 'کشف مقاصد، فرهنگ، تاریخ، توصیه‌های کاربردی و تجربیات ناب از افغانستان.' 
              : 'Discover destinations, culture, history, travel advice and experiences from Afghanistan.')}
          </p>
        </div>
      </section>

      {/* ========================================================
          ۲. عنوان بخش مقالات مجله و پیلارها (Stories Worth Discovering)
      ======================================================== */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-16 md:pt-20 pb-6 sm:pb-8 text-center">
        <span className="text-[#FCA311] text-xs font-bold uppercase tracking-widest block font-[Inter] mb-2">
          {t.sectionEyebrow || (isRtl ? 'مجله گردشگری' : 'JOURNAL')}
        </span>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#14213D] tracking-tight">
          {t.sectionTitle || (isRtl ? 'داستان‌هایی شایسته کشف شدن' : 'Stories Worth Discovering')}
        </h2>
        <p className="text-slate-500 text-xs sm:text-sm md:text-base max-w-2xl mx-auto mt-2.5 sm:mt-3 leading-relaxed">
          {t.sectionSubtitle || (isRtl 
            ? 'سفر به اعماق افغانستان از دریچه روایت‌هایی درباره مناظر، میراث، مردم و تجربیات.' 
            : 'Explore Afghanistan through stories about its landscapes, heritage, people and experiences.')}
        </p>

        {/* تب‌های دسته‌بندی پیلارها (Discover, Understand, Experience) */}
        <div className="mt-8 sm:mt-10 flex flex-wrap items-center justify-center gap-2 sm:gap-3" dir={isRtl ? 'rtl' : 'ltr'}>
          <button
            type="button"
            onClick={() => handleSelectPillar('all')}
            className={`px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer ${
              activePillar === 'all'
                ? 'bg-[#14213D] text-[#FCA311] shadow-lg shadow-[#14213D]/20 scale-105'
                : 'bg-white text-slate-600 hover:text-[#14213D] border border-slate-200/80 hover:border-slate-300'
            }`}
          >
            {pillarsData.all || (isRtl ? 'همه داستان‌ها' : 'All Stories')}
          </button>

          {['discover', 'understand', 'experience'].map((pKey) => {
            const pillar = pillarsData[pKey];
            if (!pillar) return null;
            const isActive = activePillar === pKey;

            return (
              <button
                key={pKey}
                type="button"
                onClick={() => handleSelectPillar(pKey)}
                className={`px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'bg-[#14213D] text-[#FCA311] shadow-lg shadow-[#14213D]/20 scale-105'
                    : 'bg-white text-slate-600 hover:text-[#14213D] border border-slate-200/80 hover:border-slate-300'
                }`}
              >
                {pillar.label}
              </button>
            );
          })}
        </div>

        {/* ساب‌تایتل تماتیک پیلار انتخاب‌شده */}
        {activeQuestion && (
          <div className="mt-4 sm:mt-5 inline-flex items-center gap-2 px-3.5 sm:px-4 py-1.5 rounded-full bg-amber-500/10 border border-[#FCA311]/30 text-[#14213D] text-xs sm:text-sm font-medium animate-fadeIn max-w-full">
            <Compass size={15} className="text-[#FCA311] shrink-0" />
            <span className="italic truncate">{activeQuestion}</span>
          </div>
        )}
      </section>

      {/* ========================================================
          ۳. گرید کارتی مقالات وبلاگ (پاسخگو: ۱ ستونه موبایل، ۲ ستونه تبلت، ۳ ستونه دسکتاپ)
      ======================================================== */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 sm:pb-16 md:pb-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 lg:gap-8" dir={isRtl ? 'rtl' : 'ltr'}>
          {paginatedArticles.map((article) => (
            <Link
              key={article.id}
              to={`/blog/${article.id}`}
              className="bg-white rounded-2xl sm:rounded-3xl overflow-hidden border border-slate-200/90 shadow-sm hover:shadow-2xl transition-all duration-300 hover:-translate-y-1.5 flex flex-col cursor-pointer group"
            >
              {/* تصویر مقاله با بج تاریخ و افکت زوم */}
              <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                <img
                  src={article.image || '/images/provinces/kabul/kabul-hero.webp'}
                  alt={article.title}
                  className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105 select-none"
                  loading="lazy"
                  onError={(e) => {
                    if (!e.target.dataset.tried) {
                      e.target.dataset.tried = 'true';
                      e.target.src = '/images/provinces/kabul/kabul-hero.webp';
                    }
                  }}
                />
                
                {/* نشان تاریخ انتشار عینا مطابق دیزاین */}
                <div className={`absolute top-3.5 sm:top-4 ${isRtl ? 'right-3.5 sm:right-4' : 'left-3.5 sm:left-4'} bg-[#14213D]/90 backdrop-blur-sm text-white px-2.5 sm:px-3 py-1 rounded-full text-[10px] sm:text-[11px] font-bold tracking-wider uppercase font-[Inter] shadow-md`}>
                  {article.date}
                </div>
              </div>

              {/* بدنه کارت */}
              <div className={`p-4 sm:p-6 flex-1 flex flex-col justify-between space-y-3 sm:space-y-4 ${isRtl ? 'text-right' : 'text-left'}`}>
                <div className="space-y-2 sm:space-y-2.5">
                  <span className="text-[#FCA311] text-[10px] sm:text-[11px] font-bold uppercase tracking-wider block font-[Inter]">
                    {article.category}
                  </span>

                  <h3 className="text-base sm:text-lg md:text-xl font-bold text-[#14213D] group-hover:text-[#FCA311] transition-colors line-clamp-2 leading-snug">
                    {article.title}
                  </h3>

                  <p className="text-slate-500 text-xs sm:text-sm line-clamp-3 leading-relaxed font-normal">
                    {article.excerpt}
                  </p>
                </div>

                {/* فوتر کارت با دکمه مطالعه و زمان مطالعه */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#14213D] group-hover:text-[#FCA311] transition-colors uppercase font-[Inter] tracking-wider">
                    <span>{t.readMore || (isRtl ? 'مطالعه بیشتر' : 'Read More')}</span>
                    {isRtl ? (
                      <ArrowLeft size={14} className="transition-transform group-hover:-translate-x-1" />
                    ) : (
                      <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                    )}
                  </span>
                  
                  <span className="text-slate-400 text-xs flex items-center gap-1">
                    <Clock size={13} className="text-[#FCA311]" />
                    <span>{article.readTime || '4 min'}</span>
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* ========================================================
            ۴. کنترل‌های شماره صفحات داینامیک (Pagination)
        ======================================================== */}
        {totalPages > 1 && (
          <div className="mt-10 sm:mt-14 flex items-center justify-center gap-1.5 sm:gap-2" dir="ltr">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-slate-300 flex items-center justify-center text-slate-600 hover:border-[#14213D] hover:text-[#14213D] disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
              aria-label="Previous Page"
            >
              <ChevronLeft size={16} />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full font-bold text-xs sm:text-sm transition-all duration-200 cursor-pointer ${
                  currentPage === page
                    ? 'bg-[#FCA311] text-[#14213D] shadow-md shadow-[#FCA311]/30 font-extrabold scale-105'
                    : 'border border-slate-300 text-slate-600 hover:border-[#14213D] hover:text-[#14213D]'
                }`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-slate-300 flex items-center justify-center text-slate-600 hover:border-[#14213D] hover:text-[#14213D] disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
              aria-label="Next Page"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        )}
      </section>

    </div>
  );
}