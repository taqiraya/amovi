import { useState, useMemo } from 'react';
import { ArrowRight, ArrowLeft, Calendar, Tag, Clock, X, ChevronLeft, ChevronRight, Compass } from 'lucide-react';
import { useLangStore } from '../../store/useLangStore';
import heroBg from '../../assets/images/hero-bg.webp';

const ITEMS_PER_PAGE = 6;

export default function Blog() {
  const { currentLang, translations } = useLangStore();
  const isRtl = currentLang === 'fa';
  const t = translations?.blogPage || {};

  const [activePillar, setActivePillar] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedArticle, setSelectedArticle] = useState(null);

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

  const handleOpenArticle = (article) => {
    setSelectedArticle(article);
  };

  const handleCloseArticle = () => {
    setSelectedArticle(null);
  };

  const pillarsData = t.pillars || {};

  // دریافت سوال تماتیک پیلار فعال
  const activeQuestion = activePillar !== 'all' && pillarsData[activePillar]?.question 
    ? pillarsData[activePillar].question 
    : null;

  return (
    <div className={`w-full bg-[#F8FAFC] min-h-screen text-[#14213D] ${isRtl ? 'font-[Sahel]' : 'font-[Inter]'}`}>
      
      {/* ========================================================
          ۱. هیرو سکشن اصلی وبلاگ (Stories From Afghanistan)
      ======================================================== */}
      <section className="relative w-full pt-36 pb-20 sm:pt-40 sm:pb-28 overflow-hidden bg-[#14213D] text-white">
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-45 scale-105"
          style={{ backgroundImage: `url(${heroBg})` }}
        />
        <div className="absolute inset-0 z-10 bg-gradient-to-b from-[#14213D]/95 via-[#14213D]/80 to-[#14213D] pointer-events-none" />

        <div className={`relative z-20 max-w-6xl mx-auto px-6 ${isRtl ? 'text-right' : 'text-left'}`}>
          <span className="inline-block text-[#FCA311] text-xs font-bold uppercase tracking-[0.2em] mb-2 font-[Inter]">
            {t.heroEyebrow || (isRtl ? 'روایت‌های سفر' : 'TRAVEL STORIES')}
          </span>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight">
            <span className="relative inline-block pb-1 after:absolute after:bottom-0 after:left-0 after:w-full after:h-1 after:bg-[#FCA311] after:rounded-full">
              {t.heroTitlePrefix || (isRtl ? 'داستان‌هایی از ' : 'Stories From ')}
            </span>{' '}
            <span className="text-[#FCA311]">
              {t.heroTitleHighlight || (isRtl ? 'افغانستان' : 'Afghanistan')}
            </span>
          </h1>

          <p className="mt-4 text-slate-300 text-sm sm:text-base md:text-lg max-w-2xl font-light leading-relaxed">
            {t.heroSubtitle || (isRtl 
              ? 'کشف مقاصد، فرهنگ، تاریخ، توصیه‌های کاربردی و تجربیات ناب از افغانستان.' 
              : 'Discover destinations, culture, history, travel advice and experiences from Afghanistan.')}
          </p>
        </div>
      </section>

      {/* ========================================================
          ۲. عنوان بخش مقالات مجله و پیلارها (Stories Worth Discovering)
      ======================================================== */}
      <section className="max-w-6xl mx-auto px-6 pt-16 sm:pt-20 pb-8 text-center">
        <span className="text-[#FCA311] text-xs font-bold uppercase tracking-widest block font-[Inter] mb-2">
          {t.sectionEyebrow || (isRtl ? 'مجله گردشگری' : 'JOURNAL')}
        </span>
        <h2 className="text-2xl sm:text-4xl font-black text-[#14213D] tracking-tight">
          {t.sectionTitle || (isRtl ? 'داستان‌هایی شایسته کشف شدن' : 'Stories Worth Discovering')}
        </h2>
        <p className="text-slate-500 text-sm sm:text-base max-w-2xl mx-auto mt-3 leading-relaxed">
          {t.sectionSubtitle || (isRtl 
            ? 'سفر به اعماق افغانستان از دریچه روایت‌هایی درباره مناظر، میراث، مردم و تجربیات.' 
            : 'Explore Afghanistan through stories about its landscapes, heritage, people and experiences.')}
        </p>

        {/* تب‌های دسته‌بندی پیلارها (Discover, Understand, Experience) */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-2.5 sm:gap-3" dir={isRtl ? 'rtl' : 'ltr'}>
          <button
            type="button"
            onClick={() => handleSelectPillar('all')}
            className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer ${
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
                className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer ${
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
          <div className="mt-5 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-[#FCA311]/30 text-[#14213D] text-xs sm:text-sm font-medium animate-fadeIn">
            <Compass size={15} className="text-[#FCA311] shrink-0" />
            <span className="italic">{activeQuestion}</span>
          </div>
        )}
      </section>

      {/* ========================================================
          ۳. گرید کارتی مقالات وبلاگ (۳ ستونه پاسخگو)
      ======================================================== */}
      <section className="max-w-6xl mx-auto px-6 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" dir={isRtl ? 'rtl' : 'ltr'}>
          {paginatedArticles.map((article) => (
            <article
              key={article.id}
              onClick={() => handleOpenArticle(article)}
              className="bg-white rounded-3xl overflow-hidden border border-slate-200/90 shadow-sm hover:shadow-2xl transition-all duration-300 hover:-translate-y-1.5 flex flex-col cursor-pointer group"
            >
              {/* تصویر مقاله با بج تاریخ و افکت زوم */}
              <div className="relative aspect-[16/10] overflow-hidden bg-slate-200">
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  loading="lazy"
                  onError={(e) => {
                    // در صورت خطای لود عکس‌های اکسترنال، از عکس محلی پروژه استفاده می‌شود
                    e.target.src = '/tours/images/bamyanPictures.webp';
                  }}
                />
                
                {/* نشان تاریخ انتشار عینا مطابق دیزاین */}
                <div className={`absolute top-4 ${isRtl ? 'right-4' : 'left-4'} bg-[#14213D]/90 backdrop-blur-sm text-white px-3 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase font-[Inter] shadow-md`}>
                  {article.date}
                </div>
              </div>

              {/* بدنه کارت */}
              <div className={`p-6 flex-1 flex flex-col justify-between space-y-4 ${isRtl ? 'text-right' : 'text-left'}`}>
                <div className="space-y-2.5">
                  <span className="text-[#FCA311] text-[11px] font-bold uppercase tracking-wider block font-[Inter]">
                    {article.category}
                  </span>

                  <h3 className="text-lg sm:text-xl font-bold text-[#14213D] group-hover:text-[#FCA311] transition-colors line-clamp-2 leading-snug">
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
            </article>
          ))}
        </div>

        {/* ========================================================
            ۴. کنترل‌های شماره صفحات داینامیک (Pagination)
        ======================================================== */}
        {totalPages > 1 && (
          <div className="mt-14 flex items-center justify-center gap-2" dir="ltr">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="w-10 h-10 rounded-full border border-slate-300 flex items-center justify-center text-slate-600 hover:border-[#14213D] hover:text-[#14213D] disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
              aria-label="Previous Page"
            >
              <ChevronLeft size={18} />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-10 h-10 rounded-full font-bold text-sm transition-all duration-200 cursor-pointer ${
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
              className="w-10 h-10 rounded-full border border-slate-300 flex items-center justify-center text-slate-600 hover:border-[#14213D] hover:text-[#14213D] disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
              aria-label="Next Page"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        )}
      </section>

      {/* ========================================================
          ۵. مودال نمایش کامل متن مقاله اصلی (Full Story Modal)
      ======================================================== */}
      {selectedArticle && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn"
          onClick={handleCloseArticle}
        >
          <div 
            className="bg-white w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl max-h-[90vh] flex flex-col relative"
            dir={isRtl ? 'rtl' : 'ltr'}
            onClick={(e) => e.stopPropagation()}
          >
            {/* دکمه بستن */}
            <button
              onClick={handleCloseArticle}
              className={`absolute top-4 ${isRtl ? 'left-4' : 'right-4'} z-10 w-9 h-9 rounded-full bg-[#14213D]/80 text-white hover:bg-[#14213D] flex items-center justify-center transition-colors shadow-md cursor-pointer`}
              aria-label="Close Modal"
            >
              <X size={18} />
            </button>

            {/* تصویر بالای مودال */}
            <div className="relative aspect-[16/9] w-full bg-slate-200 shrink-0">
              <img
                src={selectedArticle.image}
                alt={selectedArticle.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = '/tours/images/bamyanPictures.webp';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent pointer-events-none" />
              <div className={`absolute bottom-4 ${isRtl ? 'right-6' : 'left-6'} text-white`}>
                <span className="bg-[#FCA311] text-[#14213D] px-3.5 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider font-[Inter]">
                  {selectedArticle.category}
                </span>
              </div>
            </div>

            {/* بدنه و متن کامل پاراگراف‌های مقاله */}
            <div className="p-6 sm:p-8 overflow-y-auto space-y-4">
              <div className="flex items-center gap-4 text-xs text-slate-400 font-medium">
                <span className="flex items-center gap-1.5">
                  <Calendar size={14} className="text-[#FCA311]" />
                  <span>{selectedArticle.date}</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock size={14} className="text-[#FCA311]" />
                  <span>{selectedArticle.readTime || '4 min'}</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <Tag size={14} className="text-[#FCA311]" />
                  <span>Amovi Travel Editorial</span>
                </span>
              </div>

              <h2 className="text-xl sm:text-2xl font-black text-[#14213D] leading-tight">
                {selectedArticle.title}
              </h2>

              <p className="text-[#14213D] font-semibold text-sm sm:text-base leading-relaxed bg-amber-50/50 p-3.5 rounded-2xl border-l-4 rtl:border-r-4 rtl:border-l-0 border-[#FCA311]">
                {selectedArticle.excerpt}
              </p>

              {/* پاراگراف‌های تفصیلی مقاله */}
              <div className="space-y-3.5 pt-2 text-slate-700 text-sm sm:text-base leading-relaxed font-normal">
                {selectedArticle.content && Array.isArray(selectedArticle.content) ? (
                  selectedArticle.content.map((paragraph, pIdx) => (
                    <p key={pIdx} className="leading-relaxed">
                      {paragraph}
                    </p>
                  ))
                ) : (
                  <p>{selectedArticle.excerpt}</p>
                )}
              </div>

              <div className="pt-5 flex items-center justify-between border-t border-slate-100">
                <span className="text-xs text-slate-400">
                  {isRtl ? 'آمووی ترول | روایت‌های ماندگار افغانستان' : 'Amovi Travel | Authentic Afghanistan Stories'}
                </span>
                <button
                  type="button"
                  onClick={handleCloseArticle}
                  className="bg-[#14213D] hover:bg-slate-800 text-white font-bold py-2 px-6 rounded-xl text-xs transition-colors cursor-pointer"
                >
                  {t.close || (isRtl ? 'بستن' : 'Close')}
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}