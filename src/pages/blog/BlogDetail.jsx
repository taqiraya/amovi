import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  User, 
  Calendar, 
  ArrowLeft, 
  ArrowRight,
  Copy,
  Check,
  Tag
} from 'lucide-react';
import { useLangStore } from '../../store/useLangStore';
import SEO from '../../components/SEO';
import { getAssetUrl } from '../../config/assets';
import { getBlogPostById } from '../../services/api';

export default function BlogDetail() {
  const { id } = useParams();
  const { currentLang } = useLangStore();
  const isRtl = currentLang === 'fa';

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let isMounted = true;
    getBlogPostById(id).then((data) => {
      if (isMounted) {
        setPost(data);
        setLoading(false);
      }
    }).catch(() => {
      if (isMounted) {
        setLoading(false);
      }
    });
    return () => { isMounted = false; };
  }, [id]);

  const handleCopy = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  if (loading) {
    return (
      <div className={`min-h-screen bg-[#F8FAFC] flex items-center justify-center p-6 text-slate-500 ${isRtl ? 'font-[Sahel]' : 'font-[Inter]'}`} dir={isRtl ? 'rtl' : 'ltr'}>
        {isRtl ? 'در حال بارگذاری مقاله...' : 'Loading article...'}
      </div>
    );
  }

  if (!post) {
    return (
      <div className={`min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-6 text-center space-y-4 ${isRtl ? 'font-[Sahel]' : 'font-[Inter]'}`} dir={isRtl ? 'rtl' : 'ltr'}>
        <h2 className="text-xl font-bold text-[#14213D]">
          {isRtl ? 'مقاله مورد نظر یافت نشد' : 'Article Not Found'}
        </h2>
        <Link 
          to="/blog" 
          className="px-5 py-2.5 rounded-xl bg-[#FCA311] text-[#14213D] font-bold text-xs"
        >
          {isRtl ? 'بازگشت به مقالات وبلاگ' : 'Back to Blog'}
        </Link>
      </div>
    );
  }

  // عناوین، مشخصات و متون کاملاً دوزبانه
  const postTitle = isRtl
    ? (post.fa?.title || post.title_fa || post.title || 'مقاله وبلاگ')
    : (post.en?.title || post.title_en || post.title || 'Blog Article');

  const postImage = post.image || post.image_url || '/images/provinces/kabul/kabul-hero.webp';
  
  const postAuthor = isRtl
    ? (post.fa?.author || post.author_fa || 'تیم گردشگری آمووی')
    : (post.en?.author || post.author_en || 'Amovi Travel Team');

  const postCategory = isRtl
    ? (post.fa?.category || post.category_fa || 'کشف سرزمین')
    : (post.en?.category || post.category_en || 'DISCOVER');

  const postDate = isRtl
    ? (post.dateFa || (post.createdAt ? new Date(post.createdAt).toLocaleDateString('fa-IR') : 'اخیراً'))
    : (post.date || (post.createdAt ? new Date(post.createdAt).toLocaleDateString('en-US') : 'Recent'));

  // محتوای مقاله (آرایه یا متن)
  const rawContent = isRtl
    ? (post.fa?.content || post.content_fa || post.content || '')
    : (post.en?.content || post.content_en || post.content || '');

  const postContent = typeof rawContent === 'string'
    ? rawContent
    : (Array.isArray(rawContent) ? rawContent.join('\n\n') : String(rawContent || ''));

  return (
    <div 
      className={`w-full bg-[#F8FAFC] min-h-screen text-[#14213D] pb-20 ${isRtl ? 'font-[Sahel] text-right' : 'font-[Inter] text-left'}`} 
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      <SEO 
        title={`${postTitle} | ${isRtl ? 'آمووی ترول' : 'Amovi Travel'}`}
        description={postContent.slice(0, 160)}
        canonicalUrl={`https://amovi.travel/blog/${id}`}
      />

      {/* نوار بالا و دکمه بازگشت */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 sm:pt-36 pb-4">
        <Link
          to="/blog"
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-500 hover:text-[#14213D] transition group"
        >
          {isRtl ? (
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
          ) : (
            <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" />
          )}
          <span>{isRtl ? 'بازگشت به مقالات وبلاگ' : 'Back to Blog Articles'}</span>
        </Link>
      </div>

      {/* کانتینر اصلی مقاله: ساختار ساده، عکس در بالا و متن در پایین */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8">
        
        {/* ۱. عکس در قسمت بالای مقاله */}
        <div className="w-full aspect-[16/9] sm:aspect-[21/9] rounded-2xl sm:rounded-3xl overflow-hidden shadow-lg border border-slate-200/80 bg-slate-100">
          <img
            src={getAssetUrl(postImage)}
            alt={postTitle}
            className="w-full h-full object-cover select-none"
            onError={(e) => {
              if (!e.target.dataset.tried) {
                e.target.dataset.tried = 'true';
                e.target.src = getAssetUrl('/images/provinces/kabul/kabul-hero.webp');
              }
            }}
          />
        </div>

        {/* ۲. بخش عنوان و مشخصات نویسنده و تاریخ */}
        <header className={`space-y-3.5 ${isRtl ? 'text-right' : 'text-left'}`}>
          <div className="flex flex-wrap items-center gap-2.5 text-xs text-slate-500 font-mono">
            {postCategory && (
              <span className="flex items-center gap-1.5 bg-[#14213D] text-[#FCA311] px-3 py-1 rounded-full font-bold text-[11px] shadow-xs">
                <Tag size={12} />
                <span>{postCategory}</span>
              </span>
            )}
            <span className="flex items-center gap-1.5 bg-white px-3 py-1 rounded-full border border-slate-200 shadow-xs">
              <Calendar size={13} className="text-[#FCA311]" />
              <span>{postDate}</span>
            </span>
            <span className="flex items-center gap-1.5 bg-white px-3 py-1 rounded-full border border-slate-200 shadow-xs">
              <User size={13} className="text-[#FCA311]" />
              <span>{postAuthor}</span>
            </span>
          </div>

          <h1 className={`text-2xl sm:text-3xl md:text-4xl font-black text-[#14213D] tracking-tight leading-tight ${isRtl ? 'font-[Sahel] text-right' : 'font-[Inter] text-left'}`}>
            {postTitle}
          </h1>
        </header>

        {/* ۳. متن مقاله در حالت pre با رعایت کامل راست‌چین برای دری و چپ‌چین برای انگلیسی */}
        <div className="bg-white p-6 sm:p-10 rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-xs">
          <pre 
            dir={isRtl ? 'rtl' : 'ltr'}
            className={`whitespace-pre-wrap leading-relaxed text-sm sm:text-base select-text ${
              isRtl ? 'font-[Sahel] text-right text-slate-800' : 'font-[Inter] text-left text-slate-800'
            }`}
          >
{postContent}
          </pre>
        </div>

        {/* ۴. نوار اشتراک‌گذاری و بازگشت */}
        <footer className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
          <button
            onClick={handleCopy}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700 transition cursor-pointer"
          >
            {copied ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
            <span>{copied ? (isRtl ? 'لینک کپی شد' : 'Link Copied') : (isRtl ? 'کپی لینک مقاله' : 'Copy Link')}</span>
          </button>

          <Link
            to="/blog"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#14213D] text-[#FCA311] hover:bg-[#1E293B] text-xs font-bold transition shadow-xs"
          >
            <span>{isRtl ? 'مشاهده سایر مقالات' : 'View More Articles'}</span>
            {isRtl ? <ArrowLeft size={14} /> : <ArrowRight size={14} />}
          </Link>
        </footer>

      </article>

    </div>
  );
}
