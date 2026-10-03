import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  CreditCard, 
  Banknote, 
  Building2, 
  Coins, 
  ShieldCheck, 
  ArrowRight, 
  ArrowLeft, 
  HelpCircle,
  CheckCircle2,
  Lock
} from 'lucide-react';
import { useLangStore } from '../../store/useLangStore';
import SEO from '../../components/SEO';
import heroBg from '../../assets/images/hero-bg.webp';

export default function PaymentMethods() {
  const { currentLang } = useLangStore();
  const isRtl = currentLang === 'fa';

  const [activeFaq, setActiveFaq] = useState(null);

  const paymentOptions = [
    {
      id: 'cash',
      icon: <Banknote className="w-8 h-8 text-[#FCA311]" />,
      badge_en: 'Most Popular',
      badge_fa: 'محبوب‌ترین گزینه',
      title_en: 'Cash on Arrival (USD / EUR / AFN)',
      title_fa: 'پرداخت نقدی هنگام ورود (دالر، یورو، افغانی)',
      desc_en: 'Pay your tour balance securely upon arrival at our Kabul headquarters or via our airport reception team. Crisp, undamaged banknotes are required.',
      desc_fa: 'تسویه باقی‌مانده هزینه سفر هنگام ورود به کابل در دفتر رسمی یا از طریق تیم استقبال میدان هوایی با رسید چاپی رسمی. اسکناس‌های سالم و بدون پارگی پذیرفته می‌شوند.',
      features_en: ['Zero international transfer fees', 'Official stamped receipt provided', 'Immediate confirmation'],
      features_fa: ['بدون کارمزد انتقال بین‌المللی', 'صدور رسید مهر و امضا شده رسمی', 'تأییدیه آنی و بدون تاخیر']
    },
    {
      id: 'wire',
      icon: <Building2 className="w-8 h-8 text-[#FCA311]" />,
      badge_en: 'Corporate & Groups',
      badge_fa: 'سازمانی و گروهی',
      title_en: 'International Bank Wire (SWIFT / IBAN)',
      title_fa: 'حواله مستقیم بانکی بین‌المللی (سویفت)',
      desc_en: 'Direct electronic wire transfer to our registered business accounts in UAE, Turkey, or partner banks for early reservations and group tours.',
      desc_fa: 'انتقال مستقیم وجه به حساب‌های بانکی شرکتی ثبت‌شده آمووی در امارات متحده عربی، ترکیه یا بانک‌های همکار جهت پیش‌پرداخت تورهای گروهی.',
      features_en: ['Suitable for diplomatic & corporate billing', 'Official commercial invoice issued', 'Takes 2-4 business days to clear'],
      features_fa: ['مناسب برای سازمان‌ها، سفارت‌ها و شرکت‌ها', 'صدور پیش‌فاکتور و اینویس رسمی تجاری', 'مدت زمان تسویه ۲ تا ۴ روز کاری']
    },
    {
      id: 'sarafi',
      icon: <Coins className="w-8 h-8 text-[#FCA311]" />,
      badge_en: 'Fast Local & Regional',
      badge_fa: 'سریع و منطقه‌ای',
      title_en: 'Licensed Sarafi / Hawala Exchange',
      title_fa: 'صرافی و حواله معتبر (سرای شهزاده)',
      desc_en: 'Transfer funds smoothly through verified licensed exchange offices across Kabul, Dubai, Istanbul, Tehran, and Frankfurt.',
      desc_fa: 'انتقال سریع و امن وجه از طریق صرافی‌های دارای مجوز رسمی در سرای شهزاده کابل، دبی، استانبول، تهران و فرانکفورت.',
      features_en: ['Fast same-day processing', 'Extensive regional network', 'Standard commercial code verification'],
      features_fa: ['تسویه سریع در همان روز', 'شبکه گسترده در شهرهای مختلف منطقه', 'تاییدیه با کد رهگیری رسمی صرافی']
    },
    {
      id: 'crypto',
      icon: <Lock className="w-8 h-8 text-[#FCA311]" />,
      badge_en: 'Modern & Instant',
      badge_fa: 'فوری و مدرن',
      title_en: 'Cryptocurrency (USDT / Stablecoins)',
      title_fa: 'ارز دیجیتال (تتر USDT / استیبل‌کوین)',
      desc_en: 'Instant, low-fee digital settlement using USDT (TRC-20 / ERC-20) for international travelers wishing to avoid cross-border bank delays.',
      desc_fa: 'تسویه آنی و بدون مرز با حداقل کارمزد شبکه از طریق تتر USDT برای مسافران بین‌المللی که مایل به پرداخت بدون معطلی بانکی هستند.',
      features_en: ['Instant 24/7 confirmation', 'Minimal blockchain network fees', 'Zero banking bureaucracy'],
      features_fa: ['تأییدیه آنی به صورت ۲۴ ساعته', 'کمترین کارمزد انتقال بین‌المللی', 'بدون بروکراسی‌های سنتی بانکی']
    },
    {
      id: 'cards',
      icon: <CreditCard className="w-8 h-8 text-[#FCA311]" />,
      badge_en: 'Online Booking',
      badge_fa: 'رزرو آنلاین',
      title_en: 'Credit & Debit Cards via International Partners',
      title_fa: 'کارت‌های اعتباری و بین‌المللی (ویزا / مسترکارت)',
      desc_en: 'Secure payment links provided through our licensed booking partners in the UAE and Europe for upfront deposits.',
      desc_fa: 'ارسال لینک پرداخت امن اینترنتی از طریق شرکای دارای مجوز گردشگری آمووی در اروپا و امارات جهت واریز بیعانه اولیه.',
      features_en: ['Supports Visa, MasterCard, and Amex', 'Protected with 3D Secure protocol', 'Convenient online invoicing'],
      features_fa: ['پشتیبانی از Visa و MasterCard', 'رمزگذاری پیشرفته پروتکل 3D Secure', 'امکان پرداخت آسان با کارت اعتباری']
    }
  ];

  const faqs = [
    {
      q_en: 'Do I need to pay the full tour amount in advance?',
      q_fa: 'آیا باید کل هزینه تور را از قبل پرداخت کنم؟',
      a_en: 'No. We only require a modest deposit (typically 20% to 30%) to secure your official Afghan visa approval and hotel reservations. The balance is settled upon your arrival in Kabul.',
      a_fa: 'خیر. ما تنها مبلغی به عنوان پیش‌پرداخت (معمولاً ۲۰ تا ۳۰ درصد) جهت صدور ویزای رسمی، مجوزها و رزرو هتل دریافت می‌کنیم. باقی‌مانده مبلغ به صورت نقدی در کابل تسویه می‌شود.'
    },
    {
      q_en: 'Which currencies are accepted for cash payments?',
      q_fa: 'چه ارزهایی برای پرداخت نقدی پذیرفته می‌شوند؟',
      a_en: 'We accept US Dollars (USD, preferably bills issued after 2013), Euros (EUR), and Afghan Afghanis (AFN) at the daily official central bank exchange rate.',
      a_fa: 'دالر آمریکا (USD - ترجیحاً اسکناس‌های چاپ ۲۰۱۳ به بعد و تمیز)، یورو (EUR) و افغانی (AFN) بر اساس نرخ رسمی روز بازار پذیرفته می‌شوند.'
    },
    {
      q_en: 'Will I receive an official invoice and receipt?',
      q_fa: 'آیا فاکتور و رسید رسمی دریافت خواهم کرد؟',
      a_en: 'Yes. Every transaction is documented with a signed and stamped commercial invoice and official receipt from Amovi Travel.',
      a_fa: 'بله. برای تمام پرداخت‌ها، فاکتور رسمی تجاری با مهر و امضای آژانس آمووی به همراه جزئیات کامل خدمات صادر می‌گردد.'
    },
    {
      q_en: 'What is the refund policy if my trip is cancelled?',
      q_fa: 'سیاست استرداد وجه در صورت لغو سفر چگونه است؟',
      a_en: 'If cancellation occurs more than 14 days before your departure date, advance deposits are refunded minus non-recoverable visa processing fees. Full terms are outlined in our Booking Terms.',
      a_fa: 'در صورت اعلام انصراف بیش از ۱۴ روز قبل از تاریخ حرکت، مبالغ پیش‌پرداخت به جز هزینه‌های غیرقابل‌برگشت صدور ویزا و هماهنگی‌ها مسترد خواهد شد. جزئیات دقیق در بخش شرایط و ضوابط رزرو آمده است.'
    }
  ];

  return (
    <div className={`w-full bg-[#F8FAFC] min-h-screen text-[#14213D] pb-24 ${isRtl ? 'font-[Sahel]' : 'font-[Inter]'}`}>
      <SEO 
        title={isRtl ? 'روش‌های پرداخت امن و بین‌المللی | آمووی ترول' : 'Secure Payment Methods | Amovi Travel'}
        description={isRtl 
          ? 'راهنمای کامل پرداخت‌های امن برای رزرو تورها و خدمات آمووی ترول در افغانستان: پرداخت نقدی در کابل، حواله بانکی سویفت، صرافی و ارز دیجیتال.' 
          : 'Comprehensive guide to secure payment methods for booking Afghanistan tours with Amovi Travel: Cash on arrival, bank wire, exchange, and crypto.'}
        canonicalUrl="https://amovi.travel/payment-methods"
      />

      {/* ۱. هیرو سکشن صفحه پرداخت */}
      <section className="relative w-full pt-36 pb-20 sm:pt-40 sm:pb-28 overflow-hidden bg-[#14213D] text-white">
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-45 scale-105"
          style={{ backgroundImage: `url(${heroBg})` }}
        />
        <div className="absolute inset-0 z-10 bg-gradient-to-b from-[#14213D]/95 via-[#14213D]/80 to-[#14213D] pointer-events-none" />

        <div className={`relative z-20 max-w-6xl mx-auto px-6 ${isRtl ? 'text-right' : 'text-left'}`}>
          <div className="inline-flex items-center gap-2 mb-2">
            <ShieldCheck size={16} className="text-[#FCA311]" />
            <span className="text-[#FCA311] text-xs font-bold uppercase tracking-[0.2em] font-[Inter]">
              {isRtl ? 'امنیت و شفافیت مالی' : 'SECURE TRANSACTIONS'}
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight">
            {isRtl ? 'روش‌های پرداخت و تسویه حساب' : 'Payment Methods & Options'}
          </h1>

          <p className="mt-4 text-slate-300 text-sm sm:text-base md:text-lg max-w-2xl font-light leading-relaxed">
            {isRtl 
              ? 'روشی امن، شفاف و متناسب با شرایط مسافران بین‌المللی جهت رزرو مطمئن سفرها و خدمات در افغانستان.' 
              : 'Flexible, transparent and secure payment solutions tailored for international travelers visiting Afghanistan.'}
          </p>
        </div>
      </section>

      {/* ۲. محتوای گزینه‌های پرداخت */}
      <section className="max-w-6xl mx-auto px-6 pt-16 sm:pt-20">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-[#FCA311] text-xs font-bold uppercase tracking-widest block font-[Inter] mb-2">
            {isRtl ? 'کانال‌های مجاز پرداخت' : 'ACCEPTED PAYMENT CHANNELS'}
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-[#14213D] tracking-tight">
            {isRtl ? 'شیوه‌های پرداخت مورد تایید آمووی' : 'Approved Payment Methods'}
          </h2>
          <p className="text-slate-500 text-sm sm:text-base mt-2">
            {isRtl 
              ? 'تمامی تراکنش‌ها با فاکتور رسمی، تاییدیه مکتوب و استانداردهای کامل امنیتی انجام می‌پذیرند.' 
              : 'All transactions are backed by official commercial invoicing and clear refund protection.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8" dir={isRtl ? 'rtl' : 'ltr'}>
          {paymentOptions.map((opt) => (
            <div 
              key={opt.id}
              className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1"
            >
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className="w-14 h-14 rounded-2xl bg-amber-500/10 flex items-center justify-center text-[#FCA311] group-hover:scale-110 transition-transform">
                    {opt.icon}
                  </div>
                  <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-[11px] font-bold">
                    {isRtl ? opt.badge_fa : opt.badge_en}
                  </span>
                </div>

                <h3 className="text-base sm:text-lg font-bold text-[#14213D] mb-2">
                  {isRtl ? opt.title_fa : opt.title_en}
                </h3>

                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-5 font-normal">
                  {isRtl ? opt.desc_fa : opt.desc_en}
                </p>

                <div className="space-y-2 pt-4 border-t border-slate-100">
                  {(isRtl ? opt.features_fa : opt.features_en).map((feat, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-slate-700 font-medium">
                      <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ۳. فرآیند سه مرحله‌ای پرداخت */}
      <section className="max-w-6xl mx-auto px-6 pt-20">
        <div className="bg-[#14213D] rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden shadow-2xl" dir={isRtl ? 'rtl' : 'ltr'}>
          <div className="relative z-10 max-w-3xl">
            <span className="text-[#FCA311] text-xs font-bold uppercase tracking-widest block font-[Inter] mb-2">
              {isRtl ? 'مراحل تسویه حساب' : 'SIMPLE 3-STEP PROCESS'}
            </span>
            <h2 className="text-2xl sm:text-3xl font-black mb-6">
              {isRtl ? 'رزرو سفر در سه گام شفاف' : 'Booking Your Journey in 3 Clear Steps'}
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-2">
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                <div className="w-8 h-8 rounded-full bg-[#FCA311] text-[#14213D] font-black flex items-center justify-center text-sm mb-3">
                  1
                </div>
                <h4 className="font-bold text-sm mb-1">{isRtl ? 'مشاوره و تایید برنامه' : 'Consultation & Itinerary'}</h4>
                <p className="text-xs text-slate-300 leading-relaxed font-light">
                  {isRtl ? 'برنامه سفر و هزینه نهایی مشخص و تایید می‌شود.' : 'We tailor your route and issue a clear commercial itinerary.'}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                <div className="w-8 h-8 rounded-full bg-[#FCA311] text-[#14213D] font-black flex items-center justify-center text-sm mb-3">
                  2
                </div>
                <h4 className="font-bold text-sm mb-1">{isRtl ? 'پیش‌پرداخت بیعانه' : 'Advance Deposit (20-30%)'}</h4>
                <p className="text-xs text-slate-300 leading-relaxed font-light">
                  {isRtl ? 'واریز بیعانه جهت صدور ویزا و هتل‌ها از طریق روش دلخواه شما.' : 'Pay minimum deposit via wire, Sarafi, or USDT to initiate visa processing.'}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                <div className="w-8 h-8 rounded-full bg-[#FCA311] text-[#14213D] font-black flex items-center justify-center text-sm mb-3">
                  3
                </div>
                <h4 className="font-bold text-sm mb-1">{isRtl ? 'تسویه نقدی در کابل' : 'Arrival Settlement'}</h4>
                <p className="text-xs text-slate-300 leading-relaxed font-light">
                  {isRtl ? 'پرداخت مابقی هزینه هنگام ورود به کابل همراه با صدور رسید.' : 'Settle the final balance upon welcoming you at Kabul office.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ۴. سوالات متداول (FAQ) */}
      <section className="max-w-4xl mx-auto px-6 pt-20">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-black text-[#14213D]">
            {isRtl ? 'پرسش‌های متداول پرداخت' : 'Payment Frequently Asked Questions'}
          </h2>
        </div>

        <div className="space-y-4" dir={isRtl ? 'rtl' : 'ltr'}>
          {faqs.map((faq, index) => {
            const isOpen = activeFaq === index;
            return (
              <div 
                key={index}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm"
              >
                <button
                  type="button"
                  onClick={() => setActiveFaq(isOpen ? null : index)}
                  className="w-full p-5 text-start flex items-center justify-between gap-4 font-bold text-sm sm:text-base text-[#14213D] hover:text-[#FCA311] transition-colors cursor-pointer"
                >
                  <span>{isRtl ? faq.q_fa : faq.q_en}</span>
                  <HelpCircle size={18} className={`shrink-0 transition-transform ${isOpen ? 'text-[#FCA311]' : 'text-slate-400'}`} />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100">
                    {isRtl ? faq.a_fa : faq.a_en}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-12 text-center">
          <p className="text-slate-500 text-xs sm:text-sm mb-4">
            {isRtl ? 'نیاز به راهنمایی بیشتر یا هماهنگی حساب بانکی خاص دارید؟' : 'Need customized invoicing details or specific corporate arrangements?'}
          </p>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#FCA311] text-[#14213D] font-bold text-xs sm:text-sm shadow-md hover:bg-amber-500 transition-colors"
          >
            <span>{isRtl ? 'ارتباط با واحد مالی و پشتیبانی' : 'Contact Support & Accounts'}</span>
            {isRtl ? <ArrowLeft size={14} /> : <ArrowRight size={14} />}
          </Link>
        </div>
      </section>
    </div>
  );
}