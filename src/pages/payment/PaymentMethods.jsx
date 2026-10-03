import { useLangStore } from '../../store/useLangStore';

export default function PaymentMethods() {
  const { currentLang } = useLangStore();
  const isRtl = currentLang === 'fa';

  return (
    <div className={`pt-32 pb-20 px-6 max-w-5xl mx-auto ${isRtl ? 'text-right font-[Sahel]' : 'text-left font-[Inter]'}`}>
      <h1 className="text-3xl sm:text-4xl font-extrabold text-[#14213D] mb-4">
        {isRtl ? 'روش‌های پرداخت' : 'Payment Methods'}
      </h1>
      <p className="text-slate-600 leading-relaxed text-base sm:text-lg">
        {isRtl
          ? 'اطلاعات و راهنمای روش‌های پرداخت بین‌المللی و محلی برای رزرو خدمات و تورها.'
          : 'Information and guidance on international and local payment methods for bookings.'}
      </p>
    </div>
  );
}