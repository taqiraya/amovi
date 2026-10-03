import { Link } from 'react-router-dom';
import { useLangStore } from '../../store/useLangStore';
import SEO from '../../components/SEO';

const featuredProvinces = [
  {
    slug: 'kabul',
    nameEn: 'Kabul',
    nameFa: 'کابل',
    descEn: 'The historic capital of Afghanistan, crossroads of culture and empires.',
    descFa: 'پایتخت تاریخی افغانستان، محل پیوند فرهنگ‌ها، بازارها و ابنیه باشکوه.',
    image: '/images/provinces/kabul/kabul-hero.webp'
  },
  {
    slug: 'bamyan',
    nameEn: 'Bamyan',
    nameFa: 'بامیان',
    descEn: 'The valley of Giant Buddha niches, Band-e-Amir lakes, and majestic peaks.',
    descFa: 'دره تندیس‌های کهن بودا، دریاچه‌های فیروزه‌ای پارک ملی بند امیر و زیبایی‌های بکر.',
    image: '/images/provinces/bamyan/bamyan-hero.webp'
  },
  {
    slug: 'herat',
    nameEn: 'Herat',
    nameFa: 'هرات',
    descEn: 'The pearl of Khorasan, ancient Citadel, minarets, and artistic legacy.',
    descFa: 'مروارید خراسان، ارگ تاریخی اختیارالدین، مناره‌های کهن و هنر معماری اصیل.',
    image: '/tours/images/heratPictures.webp'
  },
  {
    slug: 'balkh',
    nameEn: 'Balkh & Mazar-i-Sharif',
    nameFa: 'بلخ و مزار شریف',
    descEn: 'The Mother of Cities, Blue Mosque, and rich Silk Road traditions.',
    descFa: 'ام‌البلاد، زیارتگاه آبی‌فام مزار شریف و یادگار درخشان جاده ابریشم.',
    image: '/tours/images/mazarPictures.webp'
  }
];

export default function Destinations() {
  const { currentLang } = useLangStore();
  const isRtl = currentLang === 'fa';

  return (
    <div className={`pt-32 pb-24 px-6 max-w-7xl mx-auto ${isRtl ? 'text-right font-[Sahel]' : 'text-left font-[Inter]'}`}>
      <SEO 
        title={isRtl ? 'مقاصد رویایی در سراسر افغانستان' : 'Iconic Destinations Across Afghanistan'}
        description={isRtl 
          ? 'از پایتخت کهن کابل تا دره‌های زمردین بامیان و شکوه تاریخی هرات و بلخ، سفرهای منحصربه‌فرد با آمووی ترول.' 
          : 'Explore iconic destinations across Afghanistan: Kabul, Bamyan, Herat, Balkh and beyond with Amovi Travel.'}
        keywords="Afghanistan destinations, Kabul, Bamyan, Herat, Balkh, visit Afghanistan, Amovi Travel"
      />
      <div className="text-center max-w-2xl mx-auto mb-14">
        <span className="text-[#FCA311] font-bold text-xs uppercase tracking-widest block mb-2 font-[Inter]">
          {isRtl ? 'کشف ولایات' : 'EXPLORE PROVINCES'}
        </span>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#14213D] mb-4">
          {isRtl ? 'مقاصد رویایی در سراسر افغانستان' : 'Iconic Destinations Across Afghanistan'}
        </h1>
        <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
          {isRtl
            ? 'از پایتخت کهن تا دره‌های بامیان و تاریخ پرشکوه هرات و بلخ، سفرهای منحصر به فرد آمووی ترول را تجربه کنید.'
            : 'From the ancient capital to the valleys of Bamyan and the historic splendors of Herat and Balkh.'}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" dir={isRtl ? 'rtl' : 'ltr'}>
        {featuredProvinces.map((prov) => (
          <Link
            key={prov.slug}
            to={`/destinations/${prov.slug}`}
            className="group relative overflow-hidden rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between"
          >
            <div className="h-52 w-full overflow-hidden relative">
              <img
                src={prov.image}
                alt={isRtl ? prov.nameFa : prov.nameEn}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 select-none"
                loading="lazy"
                onError={(e) => {
                  if (!e.target.dataset.tried) {
                    e.target.dataset.tried = 'true';
                    e.target.src = '/images/provinces/kabul/kabul-hero.webp';
                  }
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <h2 className="absolute bottom-3 right-4 left-4 text-white text-xl font-bold">
                {isRtl ? prov.nameFa : prov.nameEn}
              </h2>
            </div>
            <div className="p-5 flex flex-col justify-between flex-grow">
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-4">
                {isRtl ? prov.descFa : prov.descEn}
              </p>
              <span className="text-[#FCA311] font-bold text-xs uppercase tracking-wide group-hover:underline">
                {isRtl ? 'مشاهده جزئیات مقصد ←' : 'View Destination →'}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
