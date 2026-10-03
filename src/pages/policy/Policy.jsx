import { useLangStore } from '../../store/useLangStore';

export default function Policy() {
  const { currentLang } = useLangStore();
  const isRtl = currentLang === 'fa';

  return (
    <div className={`pt-32 pb-20 px-6 max-w-5xl mx-auto ${isRtl ? 'text-right font-[Sahel]' : 'text-left font-[Inter]'}`}>
      <h1 className="text-3xl sm:text-4xl font-extrabold text-[#14213D] mb-4">
        {isRtl ? 'قوانین و حریم خصوصی' : 'Privacy Policy & Terms'}
      </h1>
      <p className="text-slate-600 leading-relaxed text-base sm:text-lg">
        {isRtl
          ? 'آمووی ترول متعهد به حفظ اطلاعات خصوصی و امنیت داده‌های تمامی مسافران و کاربران گرامی می‌باشد.'
          : 'Amovi Travel is committed to protecting the privacy and personal data of our travelers.'}
      </p>
    </div>
  );
}