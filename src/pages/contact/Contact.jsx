import { useLangStore } from '../../store/useLangStore';

export default function Contact() {
  const { currentLang } = useLangStore();
  const isRtl = currentLang === 'fa';

  return (
    <div className={`pt-32 pb-20 px-6 max-w-5xl mx-auto ${isRtl ? 'text-right font-[Sahel]' : 'text-left font-[Inter]'}`}>
      <h1 className="text-3xl sm:text-4xl font-extrabold text-[#14213D] mb-4">
        {isRtl ? 'تماس با آمووی ترول' : 'Contact Amovi Travel'}
      </h1>
      <p className="text-slate-600 leading-relaxed text-base sm:text-lg mb-6">
        {isRtl
          ? 'تیم مشاوران ما آماده پاسخگویی به سوالات و تنظیم برنامه‌های سفر شما هستند.'
          : 'Our travel specialists are ready to answer your questions and help plan your trip.'}
      </p>
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
        <p className="font-semibold text-slate-700">Email: info@amovitravel.com</p>
        <p className="font-semibold text-slate-700">Phone / WhatsApp: +93 700 000 000</p>
        <p className="font-semibold text-slate-700">Location: Kabul, Afghanistan</p>
      </div>
    </div>
  );
}
