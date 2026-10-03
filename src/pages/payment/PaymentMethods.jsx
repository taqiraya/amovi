import { useLangStore } from '../../store/useLangStore';
import SEO from '../../components/SEO';

export default function PaymentMethods() {
  const { currentLang } = useLangStore();
  const isRtl = currentLang === 'fa';

  return (
    <div className={`pt-32 pb-20 px-6 max-w-5xl mx-auto ${isRtl ? 'text-right font-[Sahel]' : 'text-left font-[Inter]'}`}>
      <SEO 
        title={isRtl ? 'روش‌های پرداخت | آمووی ترول' : 'Payment Methods | Amovi Travel'}
        description={isRtl 
          ? 'راهنمای پرداخت‌های بین‌المللی و محلی امن برای هماهنگی و رزرو سفرها در آمووی ترول.'
          : 'Payment methods, security guidelines, and international transfer options for Amovi Travel services.'}
        canonicalUrl="https://amovi.travel/payment-methods"
      />
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