import { useState, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  User, 
  Calendar, 
  Clock, 
  Eye, 
  Search, 
  Mail, 
  CheckCircle2, 
  Check, 
  Copy, 
  ArrowLeft, 
  ArrowRight,
  Send
} from 'lucide-react';
import { useLangStore } from '../../store/useLangStore';
import heroBg from '../../assets/images/hero-bg.webp';

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

  // استیت‌های جستجو و اشتراک خبرنامه
  const [searchQuery, setSearchQuery] = useState('');
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate('/blog');
    }
  };

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (newsletterEmail.trim()) {
      setSubscribed(true);
      setNewsletterEmail('');
      setTimeout(() => setSubscribed(false), 5000);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 3000);
  };

  const shareUrl = encodeURIComponent(window.location.href);
  const shareTitle = encodeURIComponent(currentArticle.title);

  return (
    <div className={`w-full bg-[#F8FAFC] min-h-screen text-[#14213D] ${isRtl ? 'font-[Sahel]' : 'font-[Inter]'}`}>
      
      {/* ========================================================
          ۱. هیرو بنر جزئیات مقاله (Hero Banner - عینا مطابق دیزاین)
      ======================================================== */}
      <section className="relative w-full pt-36 pb-16 sm:pt-40 sm:pb-24 overflow-hidden bg-[#14213D] text-white">
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-45 scale-105"
          style={{ backgroundImage: `url(${heroBg})` }}
        />
        <div className="absolute inset-0 z-10 bg-gradient-to-b from-[#14213D]/95 via-[#14213D]/80 to-[#14213D] pointer-events-none" />

        <div className={`relative z-20 max-w-6xl mx-auto px-6 ${isRtl ? 'text-right' : 'text-left'}`}>
          
          {/* نشان دسته‌بندی طلایی */}
          <div className="mb-4">
            <span className="inline-block bg-[#FCA311] text-[#14213D] text-[11px] font-extrabold uppercase px-3.5 py-1 rounded-full tracking-wider font-[Inter] shadow-sm">
              {currentArticle.category || 'CULTURE'}
            </span>
          </div>

          {/* تیتر بزرگ مقاله */}
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight max-w-4xl">
            {currentArticle.title}
          </h1>

          {/* ردیف متاداده‌های مقاله: نویسنده، تاریخ، مدت مطالعه، بازدید */}
          <div className="mt-6 flex flex-wrap items-center gap-4 sm:gap-6 text-xs sm:text-sm text-slate-300 font-medium">
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
      <main className="max-w-6xl mx-auto px-6 py-12 sm:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12" dir={isRtl ? 'rtl' : 'ltr'}>
          
          {/* ----------------------------------------------------
              ستون ۸ تایی: بدنه مقاله اصلی (Article Body)
          ---------------------------------------------------- */}
          <article className="lg:col-span-8 space-y-8">
            
            {/* عکس شاخص مقاله (Featured Image - Full Width 16:9) */}
            <div className="relative aspect-[16/9] w-full rounded-3xl overflow-hidden shadow-xl border-4 border-white bg-slate-200 group">
              <img
                src={currentArticle.image}
                alt={currentArticle.title}
                className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-700"
                onError={(e) => {
                  e.target.src = '/images/provinces/kabul/kabul-hero.webp';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none" />
            </div>

            {/* پاراگراف آغازین و لید متن */}
            <p className="text-slate-700 text-base sm:text-lg leading-relaxed font-normal">
              {currentArticle.content?.[0] || currentArticle.excerpt}
            </p>

            {/* تیتر فرعی اول: تنوع فرهنگی */}
            <div className="space-y-4 pt-2">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#14213D] tracking-tight">
                {t.tapestryTitle || (isRtl ? 'تجربه‌ای از تنوع فرهنگی' : 'The Rich Cultural Tapestry')}
              </h2>
              
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                {currentArticle.content?.[1] || (isRtl 
                  ? 'از بوداهای باشکوه بامیان تا سایت‌های تاریخی، هرات افغانستان ترکیبی منحصربه‌فرد از فرهنگ‌ها، معماری و سنت‌ها را ارائه می‌دهد. مردم، مهمان‌نوازی گرم و داستان‌های آن‌ها هر سفر را فراموش‌نشدنی می‌سازد.'
                  : 'From the majestic Buddhas of Bamyan to the historic sites of Herat, Afghanistan offers a unique blend of cultures, architecture and traditions. Its people, their hospitality and their stories make every journey unforgettable.')}
              </p>
            </div>

            {/* نقل‌قول طلایی ویژه (Quote Block - عینا مطابق طرح تمپلت) */}
            <div className="bg-amber-50/70 border-l-4 rtl:border-r-4 rtl:border-l-0 border-[#FCA311] p-6 sm:p-7 rounded-2xl shadow-sm my-6">
              <p className="italic font-bold text-[#14213D] text-base sm:text-lg leading-relaxed">
                {t.quoteText || (isRtl 
                  ? '«افغانستان تنها یک مقصد نیست؛ داستانی است که باید آن را تجربه کرد.»' 
                  : '“Afghanistan is not simply a destination; it is a story waiting to be experienced.”')}
              </p>
            </div>

            {/* پاراگراف بعدی متن */}
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              {currentArticle.content?.[2] || (isRtl 
                ? 'در امووی ترول، ما به سفر مسئولانه باور داریم که از جوامع محلی حمایت می‌کند و به حفظ میراث فرهنگی کشور کمک می‌نماید. تورهای ما برای ایجاد تجربیات معنادار در عین ترویج سفر پایدار و درک فرهنگی طراحی شده‌اند.'
                : 'At Amovi Travel, we believe in responsible travel that supports local communities and helps preserve the country\'s cultural legacy. Our tours are designed to create meaningful experiences while promoting sustainable travel and cultural understanding.')}
            </p>

            {/* بخش چرا سفر فرهنگی مهم است؟ (Why Cultural Travel Matters) */}
            <div className="space-y-4 pt-4">
              <h3 className="text-xl sm:text-2xl font-bold text-[#14213D]">
                {t.highlightsTitle || (isRtl ? 'چرا سفر فرهنگی مهم است؟' : 'Why Cultural Travel Matters')}
              </h3>

              <ul className="space-y-3 pt-1">
                {(t.highlights || [
                  'Connect with local communities and traditions',
                  'Explore historical landmarks and ancient sites',
                  'Support cultural preservation and local economies'
                ]).map((highlight, hIdx) => (
                  <li key={hIdx} className="flex items-center gap-3 text-slate-700 text-sm sm:text-base font-medium">
                    <div className="w-5 h-5 rounded-full bg-[#FCA311] text-[#14213D] flex items-center justify-center shrink-0 shadow-sm">
                      <CheckCircle2 size={16} className="text-white" />
                    </div>
                    <span>{highlight}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* عکس دوم درون مقاله (Secondary In-article Image) */}
            <div className="relative aspect-[16/10] w-full rounded-3xl overflow-hidden shadow-lg border-2 border-white bg-slate-200 my-8">
              <img
                src="/images/provinces/bamyan/bamyan-hero.webp"
                alt="Exploring Afghanistan Landscapes"
                className="w-full h-full object-cover hover:scale-103 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#14213D]/30 via-transparent to-transparent pointer-events-none" />
            </div>

            {/* پاراگراف‌های پایانی در صورت وجود */}
            {currentArticle.content?.slice(3).map((para, pIdx) => (
              <p key={pIdx} className="text-slate-600 text-sm sm:text-base leading-relaxed">
                {para}
              </p>
            ))}

            {/* بخش اشتراک‌گذاری در شبکه‌های اجتماعی (Share this article) */}
            <div className="pt-8 border-t border-slate-200/80 flex flex-wrap items-center justify-between gap-4">
              <span className="text-xs sm:text-sm font-bold text-[#14213D] uppercase tracking-wider font-[Inter]">
                {t.shareArticle || (isRtl ? 'اشتراک‌گذاری این مقاله:' : 'Share this article:')}
              </span>

              <div className="flex items-center gap-2.5">
                {/* واتس‌اپ */}
                <a
                  href={`https://api.whatsapp.com/send?text=${shareTitle}%20${shareUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-[#FCA311] hover:bg-amber-500 text-[#14213D] flex items-center justify-center shadow-sm hover:scale-110 transition-all cursor-pointer"
                  title="Share on WhatsApp"
                  aria-label="Share on WhatsApp"
                >
                  <Send size={16} />
                </a>

                {/* تلگرام */}
                <a
                  href={`https://t.me/share/url?url=${shareUrl}&text=${shareTitle}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-[#FCA311] hover:bg-amber-500 text-[#14213D] flex items-center justify-center shadow-sm hover:scale-110 transition-all cursor-pointer"
                  title="Share on Telegram"
                  aria-label="Share on Telegram"
                >
                  <Send size={16} className="-rotate-45" />
                </a>

                {/* کپی لینک */}
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="w-10 h-10 rounded-full bg-[#14213D] hover:bg-slate-800 text-[#FCA311] flex items-center justify-center shadow-sm hover:scale-110 transition-all cursor-pointer"
                  title="Copy Link"
                  aria-label="Copy Link"
                >
                  {copiedLink ? <Check size={16} className="text-emerald-400" /> : <Copy size={16} />}
                </button>
              </div>
            </div>

            {/* پیام کپی شدن لینک */}
            {copiedLink && (
              <div className="text-xs text-emerald-600 font-bold bg-emerald-50 px-4 py-2 rounded-xl border border-emerald-200 w-fit">
                {t.copied || (isRtl ? 'لینک مقاله کپی شد!' : 'Link copied to clipboard!')}
              </div>
            )}

            {/* دکمه بازگشت به لیست مقالات */}
            <div className="pt-4">
              <Link
                to="/blog"
                className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[#14213D] hover:text-[#FCA311] transition-colors uppercase font-[Inter] tracking-wider"
              >
                {isRtl ? <ArrowRight size={16} /> : <ArrowLeft size={16} />}
                <span>{t.backToBlog || (isRtl ? 'بازگشت به مقالات' : 'Back to Stories')}</span>
              </Link>
            </div>

          </article>

          {/* ----------------------------------------------------
              ستون ۴ تایی: سایدبار کناری (Sidebar - عینا مطابق دیزاین)
          ---------------------------------------------------- */}
          <aside className="lg:col-span-4 space-y-8">
            
            {/* ۱. باکس جستجو (Search Box) */}
            <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200/90 shadow-sm">
              <form onSubmit={handleSearchSubmit} className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t.searchPlaceholder || (isRtl ? 'جستجوی مقالات...' : 'Search articles...')}
                  className="w-full px-4 py-3 pe-11 rounded-2xl border border-slate-200 text-xs sm:text-sm text-slate-800 bg-slate-50/70 focus:outline-none focus:border-[#FCA311] transition-colors"
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
            <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm space-y-5">
              <h3 className="text-lg font-bold text-[#14213D] border-b border-slate-100 pb-3">
                {t.relatedArticles || (isRtl ? 'مقالات مرتبط' : 'Related Articles')}
              </h3>

              <div className="space-y-4">
                {relatedArticles.map((relItem) => (
                  <Link
                    key={relItem.id}
                    to={`/blog/${relItem.id}`}
                    className="flex items-center gap-3.5 group cursor-pointer"
                  >
                    {/* تصویر کوچک بندانگشتی */}
                    <div className="w-18 h-18 rounded-2xl overflow-hidden bg-slate-200 shrink-0 border border-slate-100">
                      <img
                        src={relItem.image}
                        alt={relItem.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        onError={(e) => {
                          e.target.src = '/tours/images/bamyanPictures.webp';
                        }}
                      />
                    </div>

                    {/* عنوان و تاریخ */}
                    <div className="flex-1 space-y-1">
                      <h4 className="text-xs sm:text-sm font-bold text-[#14213D] group-hover:text-[#FCA311] transition-colors line-clamp-2 leading-snug">
                        {relItem.title}
                      </h4>
                      <p className="text-[11px] text-slate-400 font-medium font-[Inter]">
                        {relItem.date}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* ۳. کارت اشتراک در ژورنال (Subscribe to Our Journal) */}
            <div className="bg-[#14213D] text-white p-6 sm:p-8 rounded-3xl text-center space-y-4 shadow-xl relative overflow-hidden">
              <div 
                className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-20 pointer-events-none scale-105"
                style={{ backgroundImage: `url(${heroBg})` }}
              />

              <div className="relative z-10 space-y-4">
                {/* آیکون نامه طلایی در دایره */}
                <div className="w-13 h-13 rounded-full bg-amber-500/20 text-[#FCA311] border border-[#FCA311]/40 flex items-center justify-center mx-auto shadow-md">
                  <Mail size={22} />
                </div>

                <div className="space-y-2">
                  <h3 className="text-lg sm:text-xl font-extrabold text-white">
                    {t.subscribeTitle || (isRtl ? 'عضویت در خبرنامه آمووی' : 'Subscribe to Our Journal')}
                  </h3>
                  <p className="text-slate-300 text-xs sm:text-sm leading-relaxed font-light">
                    {t.subscribeSubtitle || (isRtl 
                      ? 'جدیدترین داستان‌های سفر، مقاصد و بینش‌های اختصاصی از افغانستان را دریافت کنید.' 
                      : 'Get the latest travel stories, destinations and exclusive insights from Afghanistan.')}
                  </p>
                </div>

                {subscribed ? (
                  <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs font-bold flex items-center justify-center gap-2">
                    <CheckCircle2 size={16} />
                    <span>{t.subscribedSuccess || (isRtl ? 'با تشکر! عضویت شما ثبت شد.' : 'Thank you for subscribing!')}</span>
                  </div>
                ) : (
                  <form onSubmit={handleNewsletterSubmit} className="space-y-3 pt-2">
                    <input
                      type="email"
                      required
                      value={newsletterEmail}
                      onChange={(e) => setNewsletterEmail(e.target.value)}
                      placeholder={isRtl ? 'ایمیل خود را وارد کنید...' : 'Enter your email...'}
                      className="w-full px-4 py-2.5 rounded-xl border border-white/20 bg-white/10 text-white placeholder-slate-400 text-xs sm:text-sm focus:outline-none focus:border-[#FCA311]"
                    />
                    <button
                      type="submit"
                      className="w-full bg-[#FCA311] hover:bg-amber-500 text-[#14213D] font-bold py-2.5 px-4 rounded-xl text-xs sm:text-sm uppercase tracking-wider font-[Inter] transition-all shadow-md cursor-pointer"
                    >
                      {t.subscribeButton || (isRtl ? 'عضویت در خبرنامه' : 'Subscribe →')}
                    </button>
                  </form>
                )}
              </div>
            </div>

          </aside>

        </div>
      </main>

    </div>
  );
}
