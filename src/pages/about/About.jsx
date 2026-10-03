import { useLangStore } from '../../store/useLangStore';

export default function About() {
  const { currentLang } = useLangStore();
  const isRtl = currentLang === 'fa';

  return (
    <div className={`pt-32 pb-20 px-6 max-w-5xl mx-auto ${isRtl ? 'text-right font-[Sahel]' : 'text-left font-[Inter]'}`}>
      <h1 className="text-3xl sm:text-4xl font-extrabold text-[#14213D] mb-4">
        {isRtl ? 'درباره آمووی ترول' : 'About Amovi Travel'}
      </h1>
      <p className="text-slate-600 leading-relaxed text-base sm:text-lg">
        {isRtl
          ? 'آژانس مسافرتی آمووی ترول، ارائه‌دهنده تخصصی خدمات گردشگری، تورهای فرهنگی و سفرهای اختصاصی در سرتاسر افغانستان با استانداردهای بین‌المللی و امنیت کامل.'
          : 'Amovi Travel provides specialized tourism experiences, cultural journeys, and bespoke travel across Afghanistan with world-class standards and utmost safety.'}
      </p>
    </div>
  );
}