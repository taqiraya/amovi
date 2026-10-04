import { useState, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  User, 
  Calendar, 
  Clock, 
  Eye, 
  Search, 
  CheckCircle2, 
  Check, 
  Copy, 
  ArrowLeft, 
  ArrowRight
} from 'lucide-react';
import { useLangStore } from '../../store/useLangStore';
import SEO from '../../components/SEO';
import heroBg from '../../assets/images/hero-bg.webp';
import { getAssetUrl } from '../../config/assets';

export default function BlogDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentLang, translations } = useLangStore();
  const isRtl = currentLang === 'fa';
  
  const blogData = translations?.blogPage || {};
  const t = translations?.blogDetailPage || {};
  // یافتن مقاله فعلی بر اساس id
  const currentArticle = useMemo(() => {
    const list = blogData.articles || [];
    return list.find((a) => a.id === id) || list[0] || {
      id: 'beyond-headlines',
      category: 'CULTURE',
      title: isRtl ? 'میراث فرهنگی پنهان افغانستان را کشف کنید' : 'Discover the Hidden Cultural Heritage of Afghanistan',
      date: isRtl ? '۲۸ سپتامبر ۲۰۲۶' : 'Sep 28, 2026',
      readTime: isRtl ? '۷ دقیقه مطالعه' : '7 min read',
      excerpt: isRtl 
        ? 'افغانستان سرزمینی از زیبایی‌های بی‌زمان، تاریخ غنی و میراث فرهنگی استثنایی است.' 
        : 'Afghanistan is a land of timeless beauty, rich history and extraordinary cultural heritage.',
      content: [
        isRtl 
          ? 'افغانستان سرزمینی از زیبایی‌های بی‌زمان، تاریخ غنی و میراث فرهنگی استثنایی است. از شهرهای باستانی تا دره‌های پنهان، هر منطقه داستانی از تاب‌آوری، هنر و سنت را روایت می‌کند. سفر به این سرزمین تنها بازدید از مکان‌ها نیست، بلکه ارتباط با تاریخی است که نسل‌ها را شکل داده است.'
          : 'Afghanistan is a land of timeless beauty, rich history and extraordinary cultural heritage. From ancient cities to hidden valleys, every region tells a story of resilience, art and tradition. Traveling here is not just about visiting places, it\'s about connecting with a history that has shaped generations.',
        isRtl
          ? 'از بوداهای باشکوه بامیان تا سایت‌های تاریخی هرات، افغانستان ترکیبی منحصربه‌فرد از فرهنگ‌ها، معماری و سنت‌ها را ارائه می‌دهد. مردم، مهمان‌نوازی گرم و داستان‌های آن‌ها هر سفر را فراموش‌نشدنی می‌سازد.'
          : 'From the majestic Buddhas of Bamyan to the historic sites of Herat, Afghanistan offers a unique blend of cultures, architecture and traditions. Its people, their hospitality and their stories make every journey unforgettable.',
        isRtl
          ? 'در امووی ترول، ما به سفر مسئولانه باور داریم که از جوامع محلی حمایت می‌کند و به حفظ میراث فرهنگی کشور کمک می‌نماید. تورهای ما برای ایجاد تجربیات معنادار در عین ترویج سفر پایدار و درک فرهنگی طراحی شده‌اند.'
          : 'At Amovi Travel, we believe in responsible travel that supports local communities and helps preserve the country\'s cultural legacy. Our tours are designed to create meaningful experiences while promoting sustainable travel and cultural understanding.'
      ],
      image: '/images/provinces/kabul/kabul-hero.webp'
    };
  }, [blogData.articles, id, isRtl]);

  // ۳ مقاله مرتبط
  const relatedArticles = useMemo(() => {
    const list = blogData.articles || [];
    return list
      .filter((a) => a.id !== currentArticle.id)
      .slice(0, 3);
  }, [blogData.articles, currentArticle.id]);

  // استیت‌های جستجو و کپی لینک
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate('/blog');
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 3000);
  };

  const shareUrl = encodeURIComponent(window.location.href);
  const shareTitle = encodeURIComponent(currentArticle.title);

  // Schema.org BlogPosting
  const blogPostingSchema = useMemo(() => {
    if (!currentArticle) return null;
    return {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: currentArticle.title,
      description: currentArticle.excerpt,
      image: currentArticle.image ? (currentArticle.image.startsWith('http') ? currentArticle.image : `https://amovi.travel${currentArticle.image}`) : 'https://amovi.travel/logo.png',
      author: {
        '@type': 'Organization',
        name: 'Amovi Travel',
        url: 'https://amovi.travel'
      },
      publisher: {
        '@type': 'Organization',
        name: 'Amovi Travel',
        logo: {
          '@type': 'ImageObject',
          url: 'https://amovi.travel/logo.png'
        }
      },
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': `https://amovi.travel/blog/${currentArticle.id}`
      }
    };
  }, [currentArticle]);

  return (
    <div className={`w-full overflow-x-hidden bg-[#F8FAFC] min-h-screen text-[#14213D] ${isRtl ? 'font-[Sahel]' : 'font-[Inter]'}`}>
      <SEO 
        title={currentArticle.title}
        description={currentArticle.excerpt}
        canonicalUrl={`https://amovi.travel/blog/${currentArticle.id}`}
        ogImage={currentArticle.image}
        ogType="article"
        schema={blogPostingSchema}
      />
      
      {/* ========================================================
          ۱. هیرو بنر جزئیات مقاله (Hero Banner - عینا مطابق دیزاین)
      ======================================================== */}
      <section className="relative w-full pt-32 pb-14 sm:pt-40 sm:pb-20 md:pb-24 overflow-hidden bg-[#14213D] text-white">
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-45 scale-105"
          style={{ backgroundImage: `url(${heroBg})` }}
        />
        <div className="absolute inset-0 z-10 bg-gradient-to-b from-[#14213D]/95 via-[#14213D]/80 to-[#14213D] pointer-events-none" />

        <div className={`relative z-20 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 ${isRtl ? 'text-right' : 'text-left'}`}>
          
          {/* نشان دسته‌بندی طلایی */}
          <div className="mb-3 sm:mb-4">
            <span className="inline-block bg-[#FCA311] text-[#14213D] text-[10px] sm:text-[11px] font-extrabold uppercase px-3 sm:px-3.5 py-1 rounded-full tracking-wider font-[Inter] shadow-sm">
              {currentArticle.category || 'CULTURE'}
            </span>
          </div>

          {/* تیتر بزرگ مقاله */}
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight max-w-4xl">
            {currentArticle.title}
          </h1>

          {/* ردیف متاداده‌های مقاله: نویسنده، تاریخ، مدت مطالعه، بازدید */}
          <div className="mt-5 sm:mt-6 flex flex-wrap items-center gap-3 sm:gap-6 text-xs sm:text-sm text-slate-300 font-medium">
            <div className="flex items-center gap-1.5">
              <User size={15} className="text-[#FCA311]" />
              <span>{t.author || (isRtl ? 'امووی ترول' : 'By Amovi Travel')}</span>
            </div>

            <div className="flex items-center gap-1.5">
              <Calendar size={15} className="text-[#FCA311]" />
              <span>{currentArticle.date}</span>
            </div>

            <div className="flex items-center gap-1.5">
              <Clock size={15} className="text-[#FCA311]" />
              <span>{currentArticle.readTime || t.defaultReadTime || (isRtl ? '۷ دقیقه مطالعه' : '7 min read')}</span>
            </div>

            <div className="flex items-center gap-1.5">
              <Eye size={15} className="text-[#FCA311]" />
              <span>{t.views || (isRtl ? '۱.۲K بازدید' : '1.2K views')}</span>
            </div>
          </div>

        </div>
      </section>

      {/* ========================================================
          ۲. بخش اصلی محتوا: لایوت دو ستونه (۸ ستون مقاله + ۴ ستون سایدبار)
      ======================================================== */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12" dir={isRtl ? 'rtl' : 'ltr'}>
          
          {/* ----------------------------------------------------
              ستون ۸ تایی: بدنه مقاله اصلی (Article Body)
          ---------------------------------------------------- */}
          <article className="lg:col-span-8 space-y-6 sm:space-y-8">
            
            {/* عکس شاخص مقاله (Featured Image - Full Width 16:9) */}
            <div className="relative aspect-[16/9] w-full rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl border-2 sm:border-4 border-white bg-slate-100 group">
              <img
                src={getAssetUrl(currentArticle.image || '/images/provinces/kabul/kabul-hero.webp')}
                alt={currentArticle.title}
                className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-102 select-none"
                onError={(e) => {
                  if (!e.target.dataset.tried) {
                    e.target.dataset.tried = 'true';
                    e.target.src = getAssetUrl('/images/provinces/kabul/kabul-hero.webp');
                  }
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none" />
            </div>

            {/* پاراگراف آغازین و لید متن */}
            <p className="text-slate-700 text-base sm:text-lg leading-relaxed font-normal">
              {currentArticle.content?.[0] || currentArticle.excerpt}
            </p>

            {/* تیتر فرعی اول: تنوع فرهنگی */}
            <div className="space-y-3 sm:space-y-4 pt-2">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-[#14213D] tracking-tight">
                {t.tapestryTitle || (isRtl ? 'تجربه‌ای از تنوع فرهنگی' : 'The Rich Cultural Tapestry')}
              </h2>
              
              <p className="text-slate-600 text-xs sm:text-sm md:text-base leading-relaxed">
                {currentArticle.content?.[1] || (isRtl 
                  ? 'از بوداهای باشکوه بامیان تا سایت‌های تاریخی، هرات افغانستان ترکیبی منحصربه‌فرد از فرهنگ‌ها، معماری و سنت‌ها را ارائه می‌دهد. مردم، مهمان‌نوازی گرم و داستان‌های آن‌ها هر سفر را فراموش‌نشدنی می‌سازد.'
                  : 'From the majestic Buddhas of Bamyan to the historic sites of Herat, Afghanistan offers a unique blend of cultures, architecture and traditions. Its people, their hospitality and their stories make every journey unforgettable.')}
              </p>
            </div>

            {/* نقل‌قول طلایی ویژه (Quote Block - عینا مطابق طرح تمپلت) */}
            <div className="bg-amber-50/70 border-l-4 rtl:border-r-4 rtl:border-l-0 border-[#FCA311] p-4 sm:p-6 md:p-7 rounded-2xl shadow-sm my-4 sm:my-6">
              <p className="italic font-bold text-[#14213D] text-sm sm:text-base md:text-lg leading-relaxed">
                {t.quoteText || (isRtl 
                  ? '«افغانستان تنها یک مقصد نیست؛ داستانی است که باید آن را تجربه کرد.»' 
                  : '“Afghanistan is not simply a destination; it is a story waiting to be experienced.”')}
              </p>
            </div>

            {/* پاراگراف بعدی متن */}
            <p className="text-slate-600 text-xs sm:text-sm md:text-base leading-relaxed">
              {currentArticle.content?.[2] || (isRtl 
                ? 'در امووی ترول، ما به سفر مسئولانه باور داریم که از جوامع محلی حمایت می‌کند و به حفظ میراث فرهنگی کشور کمک می‌نماید. تورهای ما برای ایجاد تجربیات معنادار در عین ترویج سفر پایدار و درک فرهنگی طراحی شده‌اند.'
                : 'At Amovi Travel, we believe in responsible travel that supports local communities and helps preserve the country\'s cultural legacy. Our tours are designed to create meaningful experiences while promoting sustainable travel and cultural understanding.')}
            </p>

            {/* بخش چرا سفر فرهنگی مهم است؟ (Why Cultural Travel Matters) */}
            <div className="space-y-3 sm:space-y-4 pt-2 sm:pt-4">
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-[#14213D]">
                {t.highlightsTitle || (isRtl ? 'چرا سفر فرهنگی مهم است؟' : 'Why Cultural Travel Matters')}
              </h3>

              <ul className="space-y-2.5 sm:space-y-3 pt-1">
                {(t.highlights || [
                  'Connect with local communities and traditions',
                  'Explore historical landmarks and ancient sites',
                  'Support cultural preservation and local economies'
                ]).map((highlight, hIdx) => (
                  <li key={hIdx} className="flex items-start sm:items-center gap-2.5 sm:gap-3 text-slate-700 text-xs sm:text-sm md:text-base font-medium">
                    <div className="w-5 h-5 rounded-full bg-[#FCA311] text-[#14213D] flex items-center justify-center shrink-0 shadow-sm mt-0.5 sm:mt-0">
                      <CheckCircle2 size={15} className="text-white" />
                    </div>
                    <span>{highlight}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* عکس دوم درون مقاله (Secondary In-article Image) */}
            <div className="relative aspect-[16/10] w-full rounded-2xl sm:rounded-3xl overflow-hidden shadow-lg border-2 border-white bg-slate-200 my-6 sm:my-8">
              <img
                src="/images/provinces/bamyan/bamyan-hero.webp"
                alt="Exploring Afghanistan Landscapes"
                className="w-full h-full object-cover hover:scale-103 transition-transform duration-700"
                onError={(e) => {
                  if (!e.target.dataset.tried) {
                    e.target.dataset.tried = 'true';
                    e.target.src = '/images/provinces/kabul/kabul-hero.webp';
                  }
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#14213D]/30 via-transparent to-transparent pointer-events-none" />
            </div>

            {/* پاراگراف‌های پایانی در صورت وجود */}
            {currentArticle.content?.slice(3).map((para, pIdx) => (
              <p key={pIdx} className="text-slate-600 text-xs sm:text-sm md:text-base leading-relaxed">
                {para}
              </p>
            ))}

            {/* بخش اشتراک‌گذاری در شبکه‌های اجتماعی (Share this article) */}
            <div className="pt-6 sm:pt-8 border-t border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
              <span className="text-xs sm:text-sm font-bold text-[#14213D] uppercase tracking-wider font-[Inter]">
                {t.shareArticle || (isRtl ? 'اشتراک‌گذاری این مقاله:' : 'Share this article:')}
              </span>

              <div className="flex items-center gap-2 sm:gap-2.5">
                {/* فیسبوک */}
                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#1877F2] hover:bg-[#166fe5] text-white flex items-center justify-center shadow-sm hover:scale-110 transition-all cursor-pointer"
                  title="Share on Facebook"
                  aria-label="Share on Facebook"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>

                {/* واتس‌اپ */}
                <a
                  href={`https://api.whatsapp.com/send?text=${shareTitle}%20${shareUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#25D366] hover:bg-[#20ba59] text-white flex items-center justify-center shadow-sm hover:scale-110 transition-all cursor-pointer"
                  title="Share on WhatsApp"
                  aria-label="Share on WhatsApp"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                  </svg>
                </a>

                {/* کپی لینک */}
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#14213D] hover:bg-slate-800 text-[#FCA311] flex items-center justify-center shadow-sm hover:scale-110 transition-all cursor-pointer"
                  title="Copy Link"
                  aria-label="Copy Link"
                >
                  {copiedLink ? <Check size={16} className="text-emerald-400" /> : <Copy size={16} />}
                </button>
              </div>
            </div>

            {/* پیام کپی شدن لینک */}
            {copiedLink && (
              <div className="text-xs text-emerald-600 font-bold bg-emerald-50 px-3.5 py-2 rounded-xl border border-emerald-200 w-fit">
                {t.copied || (isRtl ? 'لینک مقاله کپی شد!' : 'Link copied to clipboard!')}
              </div>
            )}

            {/* دکمه بازگشت به لیست مقالات */}
            <div className="pt-2 sm:pt-4">
              <Link
                to="/blog"
                className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[#14213D] hover:text-[#FCA311] transition-colors uppercase font-[Inter] tracking-wider"
              >
                {isRtl ? <ArrowRight size={15} /> : <ArrowLeft size={15} />}
                <span>{t.backToBlog || (isRtl ? 'بازگشت به مقالات' : 'Back to Stories')}</span>
              </Link>
            </div>

          </article>

          {/* ----------------------------------------------------
              ستون ۴ تایی: سایدبار کناری (Sidebar - عینا مطابق دیزاین)
          ---------------------------------------------------- */}
          <aside className="lg:col-span-4 space-y-6 sm:space-y-8">
            
            {/* ۱. باکس جستجو (Search Box) */}
            <div className="bg-white p-4 sm:p-5 rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-sm">
              <form onSubmit={handleSearchSubmit} className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t.searchPlaceholder || (isRtl ? 'جستجوی مقالات...' : 'Search articles...')}
                  className="w-full px-4 py-2.5 sm:py-3 pe-11 rounded-xl sm:rounded-2xl border border-slate-200 text-xs sm:text-sm text-slate-800 bg-slate-50/70 focus:outline-none focus:border-[#FCA311] transition-colors"
                />
                <button
                  type="submit"
                  className={`absolute top-1/2 -translate-y-1/2 ${isRtl ? 'left-3' : 'right-3'} text-[#FCA311] hover:text-amber-600 transition-colors cursor-pointer`}
                  aria-label="Search"
                >
                  <Search size={18} />
                </button>
              </form>
            </div>

            {/* ۲. کارت مقالات مرتبط (Related Articles) */}
            <div className="bg-white p-5 sm:p-6 rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-sm space-y-4 sm:space-y-5">
              <h3 className="text-base sm:text-lg font-bold text-[#14213D] border-b border-slate-100 pb-3">
                {t.relatedArticles || (isRtl ? 'مقالات مرتبط' : 'Related Articles')}
              </h3>

              <div className="space-y-3.5 sm:space-y-4">
                {relatedArticles.map((relItem) => (
                  <Link
                    key={relItem.id}
                    to={`/blog/${relItem.id}`}
                    className="flex items-center gap-3 sm:gap-3.5 group cursor-pointer"
                  >
                    {/* تصویر کوچک بندانگشتی */}
                    <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-xl sm:rounded-2xl overflow-hidden bg-slate-200 shrink-0 border border-slate-100">
                      <img
                        src={getAssetUrl(relItem.image)}
                        alt={relItem.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        onError={(e) => {
                          if (!e.target.dataset.tried) {
                            e.target.dataset.tried = 'true';
                            e.target.src = getAssetUrl('/tours/images/bamyanPictures.webp');
                          }
                        }}
                      />
                    </div>

                    {/* عنوان و تاریخ */}
                    <div className="flex-1 space-y-0.5 sm:space-y-1 min-w-0">
                      <h4 className="text-xs sm:text-sm font-bold text-[#14213D] group-hover:text-[#FCA311] transition-colors line-clamp-2 leading-snug">
                        {relItem.title}
                      </h4>
                      <p className="text-[10px] sm:text-[11px] text-slate-400 font-medium font-[Inter]">
                        {relItem.date}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

          </aside>

        </div>
      </main>

    </div>
  );
}
