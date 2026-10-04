import { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowLeft, Calendar, User, Search, Compass, BookOpen, Sparkles } from 'lucide-react';
import { useLangStore } from '../../store/useLangStore';
import SEO from '../../components/SEO';
import heroBg from '../../assets/images/hero-bg.webp';
import { getAssetUrl } from '../../config/assets';
import { getBlogPosts } from '../../services/api';

export default function Blog() {
  const { currentLang, translations } = useLangStore();
  const isRtl = currentLang === 'fa';
  const t = translations?.blogPage || {};

  const [posts, setPosts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activePillar, setActivePillar] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    getBlogPosts().then((data) => {
      if (isMounted) {
        if (Array.isArray(data) && data.length > 0) {
          setPosts(data);
        } else if (t.articles && Array.isArray(t.articles)) {
          setPosts(t.articles);
        }
        setLoading(false);
      }
    }).catch(() => {
      if (isMounted) {
        setPosts(t.articles || []);
        setLoading(false);
      }
    });
    return () => { isMounted = false; };
  }, [t.articles]);

  const pillarsList = [
    { id: 'all', label: isRtl ? 'همه مقالات' : 'All Articles', icon: null },
    { id: 'discover', label: isRtl ? 'کشف سرزمین' : 'Discover', icon: Compass },
    { id: 'understand', label: isRtl ? 'شناخت فرهنگ و مردم' : 'Understand', icon: BookOpen },
    { id: 'experience', label: isRtl ? 'تجربه‌ها و سوغات' : 'Experience', icon: Sparkles }
  ];

  const filteredPosts = useMemo(() => {
    let list = posts;

    // فیلتر بر اساس ستون / دسته‌بندی
    if (activePillar !== 'all') {
      list = list.filter((p) => (p.pillar || '').toLowerCase() === activePillar.toLowerCase());
    }

    // فیلتر بر اساس جستجو
    const q = searchTerm.toLowerCase().trim();
    if (!q) return list;

    return list.filter((p) => {
      const titleFa = (p.fa?.title || p.title_fa || p.title || '').toLowerCase();
      const titleEn = (p.en?.title || p.title_en || p.title || '').toLowerCase();
      const contentFa = (typeof p.fa?.content === 'string' ? p.fa.content : (Array.isArray(p.fa?.content) ? p.fa.content.join(' ') : '')).toLowerCase();
      const contentEn = (typeof p.en?.content === 'string' ? p.en.content : (Array.isArray(p.en?.content) ? p.en.content.join(' ') : '')).toLowerCase();
      const excerptFa = (p.fa?.excerpt || '').toLowerCase();
      const excerptEn = (p.en?.excerpt || '').toLowerCase();

      return (
        titleFa.includes(q) || 
        titleEn.includes(q) || 
        contentFa.includes(q) || 
        contentEn.includes(q) ||
        excerptFa.includes(q) ||
        excerptEn.includes(q)
      );
    });
  }, [posts, activePillar, searchTerm]);

  return (
    <div 
      className={`w-full overflow-x-hidden bg-[#F8FAFC] min-h-screen text-[#14213D] ${isRtl ? 'font-[Sahel] text-right' : 'font-[Inter] text-left'}`}
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      <SEO 
        title={isRtl ? 'وبلاگ و مقالات گردشگری | آمووی ترول' : 'Travel Blog & Articles | Amovi Travel'}
        description={isRtl 
          ? 'مقالات، روایت‌ها و راهنماهای معتبر سفر در افغانستان به قلم کارشناسان آمووی ترول.' 
          : 'Authentic travel articles, stories and destination guides across Afghanistan with Amovi Travel.'}
        canonicalUrl="https://amovi.travel/blog"
      />
      
      {/* ۱. هیرو سکشن وبلاگ */}
      <section className="relative w-full pt-32 pb-16 sm:pt-40 sm:pb-24 overflow-hidden bg-[#14213D] text-white">
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-45 scale-105"
          style={{ backgroundImage: `url(${heroBg})` }}
        />
        <div className="absolute inset-0 z-10 bg-gradient-to-b from-[#14213D]/95 via-[#14213D]/80 to-[#14213D] pointer-events-none" />

        <div className={`relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ${isRtl ? 'text-right' : 'text-left'}`}>
          <span className="inline-block text-[#FCA311] text-xs font-bold uppercase tracking-[0.2em] mb-2 font-[Inter]">
            {isRtl ? 'مجله و مقالات گردشگری آمووی' : 'AMOVI TRAVEL JOURNAL & ARTICLES'}
          </span>

          <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight">
            <span className="relative inline-block pb-1 after:absolute after:bottom-0 after:left-0 after:w-full after:h-1 after:bg-[#FCA311] after:rounded-full">
              {isRtl ? 'وبلاگ و روایت‌های سفر' : 'Travel Stories & Blog'}
            </span>
          </h1>

          <p className="mt-3 sm:mt-4 text-slate-300 text-xs sm:text-sm md:text-base max-w-2xl font-light leading-relaxed">
            {isRtl 
              ? 'کشف مقاصد ناب، شناخت فرهنگ و مردمان، و تجربه سوغات و روایت‌های ماندگار افغانستان.' 
              : 'Discover destinations, understand people & culture, and experience stories and treasures across Afghanistan.'}
          </p>
        </div>
      </section>

      {/* ۲. نوار جستجو و تب‌های دسته‌بندی */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-4 space-y-4">
        {/* نوار جستجو */}
        <div className="max-w-md mx-auto relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={isRtl ? 'جستجو در مقالات وبلاگ...' : 'Search articles...'}
            className={`w-full py-3 rounded-2xl bg-white border border-slate-200 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#FCA311] shadow-xs ${
              isRtl ? 'pr-10 pl-4' : 'pl-10 pr-4'
            }`}
          />
          <Search size={16} className={`absolute top-1/2 -translate-y-1/2 text-slate-400 ${isRtl ? 'right-3.5' : 'left-3.5'}`} />
        </div>

        {/* دکمه‌های فیلتر دسته‌بندی */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
          {pillarsList.map((pill) => {
            const Icon = pill.icon;
            const isActive = activePillar === pill.id;
            return (
              <button
                key={pill.id}
                onClick={() => setActivePillar(pill.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                  isActive
                    ? 'bg-[#14213D] text-[#FCA311] shadow-sm'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100 hover:text-[#14213D]'
                }`}
              >
                {Icon && <Icon size={13} className={isActive ? 'text-[#FCA311]' : 'text-slate-400'} />}
                <span>{pill.label}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* ۳. گرید مقالات وبلاگ با ساختار ساده: عکس در بالا، عنوان و متن در پایین */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {loading ? (
          <div className="text-center py-20 text-slate-400 text-sm">
            {isRtl ? 'در حال بارگذاری مقالات...' : 'Loading articles...'}
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="text-center py-20 text-slate-400 text-sm bg-white rounded-3xl border border-slate-200 p-8">
            {isRtl ? 'هیچ مقاله‌ای یافت نشد.' : 'No articles found.'}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8" dir={isRtl ? 'rtl' : 'ltr'}>
            {filteredPosts.map((post) => {
              const postId = post.slug || post.id;
              
              // عنوان دوزبانه دقیق
              const postTitle = isRtl
                ? (post.fa?.title || post.title_fa || post.title || 'مقاله وبلاگ')
                : (post.en?.title || post.title_en || post.title || 'Blog Article');

              // متن خلاصه دوزبانه
              const rawContent = isRtl
                ? (post.fa?.excerpt || post.fa?.content || post.content_fa || post.content)
                : (post.en?.excerpt || post.en?.content || post.content_en || post.content);
              
              const postExcerpt = typeof rawContent === 'string'
                ? rawContent
                : (Array.isArray(rawContent) ? rawContent[0] : (post.excerpt || ''));

              const postImage = post.image || post.image_url || '/images/provinces/kabul/kabul-hero.webp';
              
              const postDate = isRtl
                ? (post.dateFa || (post.createdAt ? new Date(post.createdAt).toLocaleDateString('fa-IR') : 'اخیراً'))
                : (post.date || (post.createdAt ? new Date(post.createdAt).toLocaleDateString('en-US') : 'Recent'));

              const postAuthor = isRtl
                ? (post.fa?.author || post.author_fa || 'تیم گردشگری آمووی')
                : (post.en?.author || post.author_en || 'Amovi Travel Team');

              const postCategory = isRtl
                ? (post.fa?.category || post.category_fa || 'کشف سرزمین')
                : (post.en?.category || post.category_en || 'DISCOVER');

              return (
                <article
                  key={postId}
                  className="bg-white rounded-2xl sm:rounded-3xl overflow-hidden border border-slate-200/90 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col group"
                  dir={isRtl ? 'rtl' : 'ltr'}
                >
                  {/* عکس در قسمت بالای مقاله */}
                  <Link to={`/blog/${postId}`} className="block relative aspect-[16/10] overflow-hidden bg-slate-100">
                    <img
                      src={getAssetUrl(postImage)}
                      alt={postTitle}
                      className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                      loading="lazy"
                      onError={(e) => {
                        if (!e.target.dataset.tried) {
                          e.target.dataset.tried = 'true';
                          e.target.src = getAssetUrl('/images/provinces/kabul/kabul-hero.webp');
                        }
                      }}
                    />
                    {postCategory && (
                      <span className={`absolute top-3 ${isRtl ? 'right-3' : 'left-3'} px-2.5 py-1 rounded-lg bg-[#14213D]/80 backdrop-blur-xs text-[#FCA311] text-[10px] font-bold`}>
                        {postCategory}
                      </span>
                    )}
                  </Link>

                  {/* پایین عکس: مشخصات، عنوان و متن */}
                  <div className={`p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-3.5 ${isRtl ? 'text-right' : 'text-left'}`}>
                    <div>
                      <div className="flex items-center gap-3 text-[11px] text-slate-400 mb-2 font-mono">
                        <span className="flex items-center gap-1">
                          <Calendar size={12} className="text-[#FCA311]" />
                          <span>{postDate}</span>
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <User size={12} className="text-[#FCA311]" />
                          <span>{postAuthor}</span>
                        </span>
                      </div>

                      <h2 className="text-base sm:text-lg font-bold text-[#14213D] group-hover:text-[#FCA311] transition-colors line-clamp-2 leading-snug">
                        <Link to={`/blog/${postId}`}>
                          {postTitle}
                        </Link>
                      </h2>

                      {/* خلاصه متن مقاله */}
                      <p className="mt-2 text-slate-500 text-xs sm:text-sm line-clamp-3 leading-relaxed font-normal">
                        {postExcerpt}
                      </p>
                    </div>

                    {/* دکمه ادامه مطلب */}
                    <div className="pt-3 border-t border-slate-100">
                      <Link
                        to={`/blog/${postId}`}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-[#14213D] group-hover:text-[#FCA311] transition-colors"
                      >
                        <span>{isRtl ? 'مطالعه مقاله' : 'Read Article'}</span>
                        {isRtl ? (
                          <ArrowLeft size={14} className="transition-transform group-hover:-translate-x-1" />
                        ) : (
                          <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                        )}
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

    </div>
  );
}