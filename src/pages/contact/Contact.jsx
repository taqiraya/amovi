import { useLangStore } from '../../store/useLangStore';
import SocialLinks from '../../components/SocialLinks';

export default function Contact() {
  const { currentLang } = useLangStore();
  const isRtl = currentLang === 'fa';

  return (
    <div className={`pt-32 pb-20 px-6 max-w-5xl mx-auto ${isRtl ? 'text-right font-[Sahel]' : 'text-left font-[Inter]'}`}>
      <h1 className="text-3xl sm:text-4xl font-extrabold text-[#14213D] mb-4">
        {isRtl ? 'تماس با آمووی ترول' : 'Contact Amovi Travel'}
      </h1>
      <p className="text-slate-600 leading-relaxed text-base sm:text-lg mb-8">
        {isRtl
          ? 'تیم مشاوران ما آماده پاسخگویی به سوالات و تنظیم برنامه‌های سفر شما هستند.'
          : 'Our travel specialists are ready to answer your questions and help plan your trip.'}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h2 className="text-xl font-bold text-[#14213D]">
            {isRtl ? 'اطلاعات ارتباطی' : 'Direct Contact'}
          </h2>
          <div className="space-y-3 text-slate-700 font-medium text-sm sm:text-base">
            <p className="flex items-center gap-2">
              <span className="text-[#FCA311] font-bold">Email:</span>
              <a href="mailto:info@amovitravel.com" className="hover:text-[#FCA311] transition-colors">
                info@amovitravel.com
              </a>
            </p>
            <p className="flex items-center gap-2">
              <span className="text-[#FCA311] font-bold">WhatsApp:</span>
              <a href="https://wa.me/93700000000" target="_blank" rel="noopener noreferrer" className="hover:text-[#FCA311] transition-colors" dir="ltr">
                +93 700 000 000
              </a>
            </p>
            <p className="flex items-center gap-2">
              <span className="text-[#FCA311] font-bold">{isRtl ? 'آدرس:' : 'Location:'}</span>
              <span>{isRtl ? 'کابل، افغانستان' : 'Kabul, Afghanistan'}</span>
            </p>
          </div>
        </div>

        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-4 flex flex-col justify-between">
          <div>
            <h2 className="text-xl font-bold text-[#14213D] mb-2">
              {isRtl ? 'شبکه‌های اجتماعی ما' : 'Official Social Channels'}
            </h2>
            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-4">
              {isRtl
                ? 'برای تماشای جدیدترین تصاویر، ویدیوها و به‌روزرسانی‌های سفر ما را در پلتفرم‌های اجتماعی دنبال کنید.'
                : 'Follow our official channels to explore the unseen Afghanistan through our latest stories and videos.'}
            </p>
          </div>
          <SocialLinks variant="contact" />
        </div>
      </div>
    </div>
  );
}
