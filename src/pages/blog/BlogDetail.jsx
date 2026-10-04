import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  User, 
  Calendar, 
  ArrowLeft, 
  ArrowRight,
  Copy,
  Check
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
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-6 text-slate-500">
        {isRtl ? 'در حال بارگذاری مقاله...' : 'Loading article...'}
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-6 text-center space-y-4">
        <h2 className="text-xl font-bold text-[#14213D]">
          {isRtl ? 'مقاله مورد نظر یافت نشد' : 'Article Not Found'}
        </h2>
        <Link 
          to="/blog" 
          className="px-5 py-2.5 rounded-xl bg-[#FCA311] text-[#14213D] font-bold text-xs"
        >
          {isRtl ? 'بازگشت به وبلاگ' : 'Back to Blog'}
        </Link>
      </div>
    );
  }

  const postTitle = post.title || post[currentLang]?.title || (isRtl ? 'مقاله وبلاگ' : 'Blog Article');
  const postImage = post.image || post.image_url || '/images/provinces/kabul/kabul-hero.webp';
  const postAuthor = post.author || post[currentLang]?.author || 'Amovi Travel';
  const postDate = post.createdAt || post.publishedAt || post.date
    ? new Date(post.createdAt || post.publishedAt || post.date).toLocaleDateString(isRtl ? 'fa-IR' : 'en-US')
    : (isRtl ? 'اخیر' : 'Recent');

  const postContent = typeof post.content === 'string' 
    ? post.content 
    : (Array.isArray(post.content) ? post.content.join('\n\n') : (post[currentLang]?.content || post.excerpt || ''));

  return (
    <div className={`w-full bg-[#F8FAFC] min-h-screen text-[#14213D] pb-20 ${isRtl ? 'font-[Sahel]' : 'font-[Inter]'}`} dir={isRtl ? 'rtl' : 'ltr'}>
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

      {/* کانتینر اصلی مقاله: ساختار ساده و کاربرپسند */}
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
        <header className="space-y-3.5">
          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 font-mono">
            <span className="flex items-center gap-1.5 bg-white px-3 py-1 rounded-full border border-slate-200 shadow-xs">
              <Calendar size={13} className="text-[#FCA311]" />
              <span>{postDate}</span>
            </span>
            <span className="flex items-center gap-1.5 bg-white px-3 py-1 rounded-full border border-slate-200 shadow-xs">
              <User size={13} className="text-[#FCA311]" />
              <span>{postAuthor}</span>
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#14213D] tracking-tight leading-tight">
            {postTitle}
          </h1>
        </header>

        {/* ۳. متن مقاله در حالت pre به درخواست صریح کاربر (با حفظ کامل سطرها و پاراگراف‌ها) */}
        <div className="bg-white p-6 sm:p-10 rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-xs">
          <pre className="whitespace-pre-wrap font-[Sahel] sm:font-[Inter] text-slate-800 leading-relaxed text-sm sm:text-base text-justify select-text">
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
