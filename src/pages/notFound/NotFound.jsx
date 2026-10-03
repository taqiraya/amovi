import { Link } from 'react-router-dom';
import { useLangStore } from '../../store/useLangStore';
import SEO from '../../components/SEO';

export default function NotFound() {
  const { currentLang } = useLangStore();
  const isRtl = currentLang === 'fa';

  return (
    <div className={`pt-32 sm:pt-40 pb-20 sm:pb-28 px-4 sm:px-6 text-center max-w-xl mx-auto overflow-x-hidden ${isRtl ? 'font-[Sahel]' : 'font-[Inter]'}`}>
      <SEO 
        title={isRtl ? 'صفحه مورد نظر پیدا نشد (۴۰۴) | آمووی ترول' : 'Page Not Found (404) | Amovi Travel'}
        description={isRtl ? 'متاسفانه صفحه مورد نظر شما در آمووی ترول پیدا نشد.' : 'The requested page was not found on Amovi Travel.'}
      />
      <h1 className="text-6xl sm:text-7xl md:text-8xl font-black text-[#FCA311] mb-2 tracking-tight">404</h1>
      <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#14213D] mb-3 sm:mb-4">
        {isRtl ? 'صفحه مورد نظر پیدا نشد!' : 'Page Not Found!'}
      </h2>
      <p className="text-xs sm:text-sm md:text-base text-slate-600 mb-6 sm:mb-8 leading-relaxed">
        {isRtl
          ? 'صفحه‌ای که به دنبال آن هستید ممکن است حذف شده یا آدرس آن تغییر کرده باشد.'
          : 'The page you are looking for might have been removed, renamed, or is temporarily unavailable.'}
      </p>
      <Link
        to="/"
        className="inline-flex items-center justify-center bg-[#FCA311] hover:bg-amber-500 text-[#14213D] font-bold px-6 sm:px-8 py-3 sm:py-3.5 text-xs sm:text-sm rounded-full shadow-lg transition duration-200"
      >
        {isRtl ? 'بازگشت به صفحه اصلی' : 'Back to Home'}
      </Link>
    </div>
  );
}
