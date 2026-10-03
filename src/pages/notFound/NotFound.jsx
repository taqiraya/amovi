import { Link } from 'react-router-dom';
import { useLangStore } from '../../store/useLangStore';

export default function NotFound() {
  const { currentLang } = useLangStore();
  const isRtl = currentLang === 'fa';

  return (
    <div className={`pt-36 pb-24 px-6 text-center max-w-xl mx-auto ${isRtl ? 'font-[Sahel]' : 'font-[Inter]'}`}>
      <h1 className="text-8xl font-black text-[#FCA311] mb-2 tracking-tight">404</h1>
      <h2 className="text-2xl sm:text-3xl font-bold text-[#14213D] mb-4">
        {isRtl ? 'صفحه مورد نظر پیدا نشد!' : 'Page Not Found!'}
      </h2>
      <p className="text-slate-600 mb-8 leading-relaxed">
        {isRtl
          ? 'صفحه‌ای که به دنبال آن هستید ممکن است حذف شده یا آدرس آن تغییر کرده باشد.'
          : 'The page you are looking for might have been removed, renamed, or is temporarily unavailable.'}
      </p>
      <Link
        to="/"
        className="inline-flex items-center justify-center bg-[#FCA311] hover:bg-amber-500 text-[#14213D] font-bold px-8 py-3.5 rounded-full shadow-lg transition duration-200"
      >
        {isRtl ? 'بازگشت به صفحه اصلی' : 'Back to Home'}
      </Link>
    </div>
  );
}
