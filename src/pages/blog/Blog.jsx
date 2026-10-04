import { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowLeft, Calendar, User, Search } from 'lucide-react';
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

  const filteredPosts = useMemo(() => {
    const q = searchTerm.toLowerCase().trim();
    if (!q) return posts;
    return posts.filter((p) => {
      const title = (p.title || (p[currentLang]?.title) || '').toLowerCase();
      const content = (p.content || (p[currentLang]?.content) || p.excerpt || '').toLowerCase();
      return title.includes(q) || content.includes(q);
    });
  }, [posts, searchTerm, currentLang]);

  return (
    <div className={`w-full overflow-x-hidden bg-[#F8FAFC] min-h-screen text-[#14213D] ${isRtl ? 'font-[Sahel]' : 'font-[Inter]'}`}>
      <SEO 
        title={isRtl ? 'وبلاگ و مقالات گردشگری | آمووی ترول' : 'Travel Blog & Articles | Amovi Travel'}
        description={isRtl 
          ? 'مقالات، روایت‌ها و راهنماهای سفر در افغانستان به قلم کارشناسان آمووی ترول.' 
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

        <div className={`relative z-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 ${isRtl ? 'text-right' : 'text-left'}`}>
          <span className="inline-block text-[#FCA311] text-xs font-bold uppercase tracking-[0.2em] mb-2 font-[Inter]">
            {isRtl ? 'مجله و مقالات گردشگری' : 'TRAVEL JOURNAL & ARTICLES'}
          </span>

          <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight">
            <span className="relative inline-block pb-1 after:absolute after:bottom-0 after:left-0 after:w-full after:h-1 after:bg-[#FCA311] after:rounded-full">
              {isRtl ? 'وبلاگ و روایت‌های سفر' : 'Travel Stories & Blog'}
            </span>
          </h1>

          <p className="mt-3 sm:mt-4 text-slate-300 text-xs sm:text-sm md:text-base max-w-2xl font-light leading-relaxed">
            {isRtl 
              ? 'کشف مقاصد، تاریخ، فرهنگ و تجربیات ناب از سفر به گوشه‌وکنار افغانستان.' 
              : 'Discover destinations, culture, history and experiences from journeys across Afghanistan.'}
          </p>
        </div>
      </section>

      {/* ۲. نوار جستجو ساده */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-4">
        <div className="max-w-md mx-auto relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={isRtl ? 'جستجو در مقالات وبلاگ...' : 'Search articles...'}
            className="w-full pr-10 pl-4 py-3 rounded-2xl bg-white border border-slate-200 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#FCA311] shadow-xs"
          />
          <Search size={16} className={`absolute top-1/2 -translate-y-1/2 text-slate-400 ${isRtl ? 'right-3.5' : 'left-3.5'}`} />
        </div>
      </section>

      {/* ۳. گرید مقالات وبلاگ با ساختار ساده: عکس در بالا، عنوان و متن در پایین */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
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
              const postId = post.id || post.slug;
              const postTitle = post.title || post[currentLang]?.title || (isRtl ? 'مقاله آمووی ترول' : 'Amovi Article');
              const postImage = post.image || post.image_url || '/images/provinces/kabul/kabul-hero.webp';
              const postContent = typeof post.content === 'string' ? post.content : (Array.isArray(post.content) ? post.content.join('\n\n') : (post[currentLang]?.content || post.excerpt || ''));
              const postDate = post.createdAt || post.publishedAt || post.date 
                ? new Date(post.createdAt || post.publishedAt || post.date).toLocaleDateString(isRtl ? 'fa-IR' : 'en-US') 
                : (isRtl ? 'اخیر' : 'Recent');
              const postAuthor = post.author || post[currentLang]?.author || 'Amovi Travel';

              return (
                <article
                  key={postId}
                  className="bg-white rounded-2xl sm:rounded-3xl overflow-hidden border border-slate-200/90 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col group"
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
                        {postContent}
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