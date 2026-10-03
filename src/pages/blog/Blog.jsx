import { useState } from 'react';
import { ArrowRight, ArrowLeft, Calendar, Tag, Clock, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useLangStore } from '../../store/useLangStore';
import heroBg from '../../assets/images/hero-bg.webp';

export default function Blog() {
  const { currentLang, translations } = useLangStore();
  const isRtl = currentLang === 'fa';
  const t = translations?.blogPage || {};

  const [currentPage, setCurrentPage] = useState(1);
  const [selectedArticle, setSelectedArticle] = useState(null);

  const articlesList = t.articles || [
    {
      id: 'bamyan-landscapes',
      date: '12 SEP 2026',
      category: 'DESTINATIONS',
      title: "Discovering Bamyan's Hidden Landscapes",
      excerpt: "Explore the landscapes, history and cultural heritage that make Bamyan one of Afghanistan's remarkable destinations.",
      image: '/tours/images/bamyanPictures.webp'
    },
    {
      id: 'herat-timeless',
      date: '08 SEP 2026',
      category: 'CULTURE',
      title: "Exploring Herat's Timeless Beauty",
      excerpt: "From ancient architecture to vibrant culture, Herat offers a unique glimpse into Afghanistan's rich past.",
      image: '/tours/images/heratPictures.webp'
    },
    {
      id: 'travel-tips',
      date: '03 SEP 2026',
      category: 'TRAVEL TIPS',
      title: 'Travel Tips for Visiting Afghanistan',
      excerpt: 'Essential tips to help you plan a safe, comfortable and rewarding journey across Afghanistan.',
      image: '/images/provinces/kabul/bagh-e-babur.webp'
    },
    {
      id: 'balkh-history',
      date: '28 AUG 2026',
      category: 'HERITAGE',
      title: 'The History of Balkh: The Ancient Jewel',
      excerpt: 'Discover the historical significance of Balkh, one of the oldest cities in the world.',
      image: '/tours/images/mazarPictures.webp'
    },
    {
      id: 'nuristan-hiking',
      date: '20 AUG 2026',
      category: 'ADVENTURE',
      title: 'Hiking in Nuristan: Nature at Its Purest',
      excerpt: 'Explore pristine valleys, crystal rivers and breathtaking mountain trails in Nuristan.',
      image: '/tours/images/noristanPictures.webp'
    },
    {
      id: 'kandahar-hospitality',
      date: '15 AUG 2026',
      category: 'EXPERIENCES',
      title: 'Kandahar: Where History Meets Hospitality',
      excerpt: 'Experience the cultural heart of Afghanistan with its rich history and warm people.',
      image: '/tours/images/kandaharPictures.webp'
    },
    {
      id: 'samangan-beauty',
      date: '10 AUG 2026',
      category: 'CULTURE',
      title: "The Beauty of Samangan's Historical Sites",
      excerpt: 'Uncover the hidden gems of Samangan, from ancient sites to stunning landscapes.',
      image: '/images/provinces/bamyan/Buddha-1.webp'
    },
    {
      id: 'ghor-mountains',
      date: '02 AUG 2026',
      category: 'DESTINATIONS',
      title: "Ghor's Majestic Mountains",
      excerpt: 'A journey through dramatic peaks, remote villages and untouched nature.',
      image: '/tours/images/ghorPictures.webp'
    },
    {
      id: 'visit-afghanistan-now',
      date: '25 JUL 2026',
      category: 'TRAVEL TIPS',
      title: 'Why You Should Visit Afghanistan Now',
      excerpt: 'Experience authentic culture, warm hospitality and breathtaking landscapes before the world discovers it.',
      image: '/images/provinces/kabul/kabul-hero.webp'
    }
  ];

  const handleOpenArticle = (article) => {
    setSelectedArticle(article);
  };

  const handleCloseArticle = () => {
    setSelectedArticle(null);
  };

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
          ۲. عنوان بخش مقالات مجله (Stories Worth Discovering)
      ======================================================== */}
      <section className="max-w-6xl mx-auto px-6 pt-16 sm:pt-20 pb-10 text-center">
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
      </section>

      {/* ========================================================
          ۳. گرید ۹ کارته مقالات وبلاگ (۳ ستونه)
      ======================================================== */}
      <section className="max-w-6xl mx-auto px-6 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" dir={isRtl ? 'rtl' : 'ltr'}>
          {articlesList.map((article) => (
            <article
              key={article.id}
              onClick={() => handleOpenArticle(article)}
              className="bg-white rounded-3xl overflow-hidden border border-slate-200/90 shadow-sm hover:shadow-2xl transition-all duration-300 hover:-translate-y-1.5 flex flex-col cursor-pointer group"
            >
              {/* تصویر و بج تاریخ روی تصویر */}
              <div className="relative aspect-[16/10] overflow-hidden bg-slate-200">
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  loading="lazy"
                />
                
                {/* تاریخ انتشار مطابق طرح تمپلت */}
                <div className={`absolute top-4 ${isRtl ? 'right-4' : 'left-4'} bg-[#14213D]/90 backdrop-blur-sm text-white px-3 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase font-[Inter] shadow-md`}>
                  {article.date}
                </div>
              </div>

              {/* بدنه کارت مقاله */}
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

                {/* دکمه / لینک مطالعه بیشتر */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#14213D] group-hover:text-[#FCA311] transition-colors uppercase font-[Inter] tracking-wider">
                    <span>{t.readMore || (isRtl ? 'مطالعه بیشتر' : 'Read More')}</span>
                    {isRtl ? (
                      <ArrowLeft size={14} className="transition-transform group-hover:-translate-x-1" />
                    ) : (
                      <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                    )}
                  </span>
                  
                  <span className="text-slate-400 text-xs flex items-center gap-1">
                    <Clock size={13} />
                    <span>4 min</span>
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* ========================================================
            ۴. کنترل‌های شماره صفحات (Pagination)
        ======================================================== */}
        <div className="mt-14 flex items-center justify-center gap-2" dir="ltr">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="w-10 h-10 rounded-full border border-slate-300 flex items-center justify-center text-slate-600 hover:border-[#14213D] hover:text-[#14213D] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            aria-label="Previous Page"
          >
            <ChevronLeft size={18} />
          </button>

          {[1, 2, 3].map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`w-10 h-10 rounded-full font-bold text-sm transition-all duration-200 ${
                currentPage === page
                  ? 'bg-[#FCA311] text-[#14213D] shadow-md shadow-[#FCA311]/30 font-extrabold'
                  : 'border border-slate-300 text-slate-600 hover:border-[#14213D] hover:text-[#14213D]'
              }`}
            >
              {page}
            </button>
          ))}

          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, 3))}
            disabled={currentPage === 3}
            className="w-10 h-10 rounded-full border border-slate-300 flex items-center justify-center text-slate-600 hover:border-[#14213D] hover:text-[#14213D] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            aria-label="Next Page"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </section>

      {/* ========================================================
          ۵. مودال نمایش جزئیات کامل مقاله انتخاب‌شده
      ======================================================== */}
      {selectedArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div 
            className="bg-white w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl max-h-[90vh] flex flex-col relative"
            dir={isRtl ? 'rtl' : 'ltr'}
          >
            {/* دکمه بستن */}
            <button
              onClick={handleCloseArticle}
              className={`absolute top-4 ${isRtl ? 'left-4' : 'right-4'} z-10 w-9 h-9 rounded-full bg-[#14213D]/80 text-white hover:bg-[#14213D] flex items-center justify-center transition-colors shadow-md`}
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
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
              <div className={`absolute bottom-4 ${isRtl ? 'right-6' : 'left-6'} text-white`}>
                <span className="bg-[#FCA311] text-[#14213D] px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider font-[Inter]">
                  {selectedArticle.category}
                </span>
              </div>
            </div>

            {/* متن مقاله با اسکرول بار زیبا */}
            <div className="p-6 sm:p-8 overflow-y-auto space-y-4">
              <div className="flex items-center gap-4 text-xs text-slate-400 font-medium">
                <span className="flex items-center gap-1.5">
                  <Calendar size={14} className="text-[#FCA311]" />
                  <span>{selectedArticle.date}</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <Tag size={14} className="text-[#FCA311]" />
                  <span>Amovi Travel Editorial</span>
                </span>
              </div>

              <h2 className="text-xl sm:text-2xl font-black text-[#14213D] leading-tight">
                {selectedArticle.title}
              </h2>

              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                {selectedArticle.excerpt}
              </p>

              <div className="space-y-3 pt-3 border-t border-slate-100 text-slate-600 text-sm leading-relaxed">
                <p>
                  {isRtl
                    ? 'افغانستان با قدمتی چندهزار ساله و موقعیت استراتژیک در قلب جاده ابریشم، گنجینه‌ای از شگفتی‌های تاریخی، تنوع فرهنگی کم‌نظیر و طبیعتی خیره‌کننده است. از قله‌های سربه‌فلک‌کشیده پامیر و هندوکش تا دشت‌های باستانی بلخ و بناهای فیروزه‌ای هرات، هر گوشه از این سرزمین داستانی ناگفته در سینه دارد.'
                    : 'Afghanistan, with thousands of years of rich history and its strategic position at the crossroads of the ancient Silk Road, is a treasure trove of historical wonders, cultural diversity and breathtaking natural landscapes. From the towering peaks of Pamir and Hindu Kush to the ancient plains of Balkh and the turquoise minarets of Herat, every corner holds an untold story.'}
                </p>
                <p>
                  {isRtl
                    ? 'تیم آمووی ترول با شناخت عمیق از مناطق محلی و همراهی راهنمایان بومی متخصص، به شما امکان می‌دهد تا این روایت‌های زنده را از نزدیک لمس کرده و با آسودگی خاطر به کشف ناشناخته‌ها بپردازید.'
                    : 'The Amovi Travel team, equipped with deep local knowledge and seasoned professional guides, enables you to experience these living narratives firsthand while traveling with complete peace of mind and comfort.'}
                </p>
              </div>

              <div className="pt-4 flex items-center justify-between border-t border-slate-100">
                <span className="text-xs text-slate-400">
                  {isRtl ? 'اشتراک‌گذاری در شبکه‌های اجتماعی' : 'Share this story on social media'}
                </span>
                <button
                  type="button"
                  onClick={handleCloseArticle}
                  className="bg-[#14213D] hover:bg-slate-800 text-white font-bold py-2 px-5 rounded-xl text-xs transition-colors cursor-pointer"
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