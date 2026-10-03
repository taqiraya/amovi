import { useLangStore } from '../../store/useLangStore';

export default function Blog() {
  const { currentLang } = useLangStore();
  const isRtl = currentLang === 'fa';

  return (
    <div className={`pt-32 pb-20 px-6 max-w-5xl mx-auto ${isRtl ? 'text-right font-[Sahel]' : 'text-left font-[Inter]'}`}>
      <h1 className="text-3xl sm:text-4xl font-extrabold text-[#14213D] mb-4">
        {isRtl ? 'مجله و وبلاگ سفر' : 'Travel Blog'}
      </h1>
      <p className="text-slate-600 leading-relaxed text-base sm:text-lg">
        {isRtl
          ? 'مقالات، راهنماهای سفر، و داستان‌های جذاب از شگفتی‌های ناشناخته افغانستان.'
          : 'Articles, travel guides, and stories exploring the unseen wonders of Afghanistan.'}
      </p>
    </div>
  );
}