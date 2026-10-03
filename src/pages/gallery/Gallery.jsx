import { useState, useMemo } from 'react';
import { Camera, X, ChevronLeft, ChevronRight, Eye, MapPin } from 'lucide-react';
import { useLangStore } from '../../store/useLangStore';
import SEO from '../../components/SEO';
import heroBg from '../../assets/images/hero-bg.webp';

// لیست جامع تصاویر منتخب و واقعی گالری سراسری افغانستان با تصاویر بهینه‌شده WebP
const galleryDatabase = [
  // ==================== کابل (Kabul) ====================
  {
    id: 1,
    category: 'kabul',
    image: '/images/destinations/kabul/1ca023080c9829f1a83baabc4178a909.webp',
    en: { title: 'Bagh-e Babur (Babur Gardens)', location: 'Kabul', desc: '16th-century terraced Mughal royal garden with historic marble pavilion and lush cypress trees.' },
    fa: { title: 'باغ تاریخی بابر', location: 'کابل', desc: 'باغ‌های پلکانی سده شانزدهم میلادی گورکانی همراه با کوشک مرمرین و چنارهای کهنسال.' }
  },
  {
    id: 2,
    category: 'kabul',
    image: '/images/destinations/kabul/3e610b13953ec79379b8fce1462a8a65.webp',
    en: { title: 'Darul Aman Palace', location: 'Kabul', desc: 'Neoclassical 1920s royal palace commissioned by King Amanullah Khan, an iconic architectural landmark.' },
    fa: { title: 'قصر دارالامان', location: 'کابل', desc: 'کاخ نئوکلاسیک دوران شاه امان‌الله خان و از برجسته‌ترین نمادهای معماری پایتخت.' }
  },
  {
    id: 3,
    category: 'kabul',
    image: '/images/destinations/kabul/3edd5432cab059e10b7670ac14f33bb7.webp',
    en: { title: 'Paghman Royal Gardens & Palaces', location: 'Kabul', desc: 'Summer royal retreat nestled at the foothills of the Paghman mountains with European-style fountains.' },
    fa: { title: 'باغ‌ها و کوشک‌های پغمان', location: 'کابل', desc: 'اقامتگاه ییلاقی شاهی در دامنه کوهپایه‌های پغمان با فواره‌ها و چشم‌انداز دل‌انگیز.' }
  },
  {
    id: 4,
    category: 'kabul',
    image: '/images/destinations/kabul/30e93d072f56af0481f2cd6de33a93ca.webp',
    en: { title: 'Taq-e Zafar (Arch of Victory)', location: 'Kabul', desc: 'Iconic triumphal arch commemorating Afghanistan independence, set amidst mountain gardens.' },
    fa: { title: 'طاق ظفر پغمان', location: 'کابل', desc: 'بنای یادبود و طاق نصرت تاریخی به نشانه استقلال کشور در دل باغستان‌های پغمان.' }
  },
  {
    id: 5,
    category: 'kabul',
    image: '/images/destinations/kabul/3abc82b853537940bc93e6c61f1654bf.webp',
    en: { title: 'Chihil Sutun Palace', location: 'Kabul', desc: '19th-century royal palace surrounded by extensive restored botanical gardens and walnut groves.' },
    fa: { title: 'قصر و باغ چهل‌ستون', location: 'کابل', desc: 'کاخ باشکوه سده نوزدهم میلادی احاطه‌شده در میان باغستان‌های سرسبز و چنارستان‌های دلگشا.' }
  },
  {
    id: 6,
    category: 'kabul',
    image: '/images/destinations/kabul/37f17e6e7470188bad7ef4717d7ae762.webp',
    en: { title: 'National Museum of Afghanistan', location: 'Kabul', desc: 'Preserving over five millennia of Silk Road artifacts, Greco-Buddhist treasures and Kushan relics.' },
    fa: { title: 'موزه ملی افغانستان', location: 'کابل', desc: 'گنجینه آثار باستانی جاده ابریشم، تندیس‌های بودایی یونانی و تمدن ۵۰۰۰ ساله باختر.' }
  },
  {
    id: 7,
    category: 'kabul',
    image: '/images/destinations/kabul/0c8c8378a034947760afa71f41778429.webp',
    en: { title: 'Bibi Mahro Hill Panorama', location: 'Kabul', desc: 'Sweeping panoramic vantage point over modern and historic neighborhoods of the Kabul valley.' },
    fa: { title: 'تپه بی‌بی مهرو', location: 'کابل', desc: 'چشم‌انداز پانورامای فراخ بر فراز پایتخت، تپه‌ها و معماری نوین و کهن کابل.' }
  },
  {
    id: 8,
    category: 'kabul',
    image: '/images/destinations/kabul/2997745e50df412b8e5d721744ac66fc-1.webp',
    en: { title: 'Buddhist Stupa of Shewaki', location: 'Kabul', desc: 'Ancient 3rd-century Kushan-era Buddhist stupa monument restored in the southeastern hills.' },
    fa: { title: 'استوپای باستانی شیوکی', location: 'کابل', desc: 'یادگار دوران کوشانی‌ها از سده سوم میلادی در تپه‌های جنوب‌شرقی کابل.' }
  },
  {
    id: 9,
    category: 'kabul',
    image: '/images/destinations/kabul/2f29d4f2a2e712e893270523f17bf5d9.webp',
    en: { title: 'Murad Khani Historic Quarter', location: 'Kabul', desc: 'Timber-framed heritage district with restored cedar-wood courtyards and artisan craft studios.' },
    fa: { title: 'گذر تاریخی مرادخانی', location: 'کابل', desc: 'محله بازسازی‌شده کابل قدیم با معماری ارسی، چوب‌تراشی‌های هنری و کارگاه‌های صنایع دستی.' }
  },

  // ==================== بامیان (Bamyan) ====================
  {
    id: 10,
    category: 'bamyan',
    image: '/images/destinations/bamyan/43216cd43374487aa9b318aed4a8cec3.webp',
    en: { title: 'Band-e-Amir National Park', location: 'Bamyan', desc: 'Six natural turquoise travertine lakes set dramatically amidst the rugged Hindu Kush canyons.' },
    fa: { title: 'پارک ملی بند امیر', location: 'بامیان', desc: 'دریاچه‌های طبیعی فیروزه‌ای و صخره‌های بلورین تراورتن در دل کوهستان‌های پرصلابت.' }
  },
  {
    id: 11,
    category: 'bamyan',
    image: '/images/destinations/bamyan/171e9a06774b94ed2e5740aa1e743ae2.webp',
    en: { title: 'Giant Buddha Niches & Cliff Caves', location: 'Bamyan', desc: 'Monumental 6th-century cliff niches and monastic cave networks carved into sandstone cliffs.' },
    fa: { title: 'تندیس‌ها و غارهای بودای بامیان', location: 'بامیان', desc: 'طاق‌های صخره‌ای سترگ سده ششم میلادی و مجموعه مغاره‌های کهن راهبان در صخره‌های سرخ.' }
  },
  {
    id: 12,
    category: 'bamyan',
    image: '/images/destinations/bamyan/1eead6bc-cc50-42af-a15c-986112fda6c0.webp',
    en: { title: 'Shahr-e Gholghola (City of Screams)', location: 'Bamyan', desc: '5th-century fortified citadel citadel overlooking the Bamyan valley, conquered during the Mongol era.' },
    fa: { title: 'شهر غلغله بامیان', location: 'بامیان', desc: 'دژ استوار تاریخی سده پنجم میلادی مشرف بر دره باستانی بامیان و شاهدی بر گذر دوران‌ها.' }
  },
  {
    id: 13,
    category: 'bamyan',
    image: '/images/destinations/bamyan/127c717c46db98c65f3cd9600051faaf.webp',
    en: { title: 'Shahr-e Zohak (The Red Fortress)', location: 'Bamyan', desc: 'Strategic citadel perched on towering crimson mudstone cliffs guard the entrance to the Bamyan basin.' },
    fa: { title: 'شهر ضحاک (دژ سرخ)', location: 'بامیان', desc: 'باروی سرخ‌رنگ صخره‌ای مستحکم در مدخل دره بامیان و دژ دیدبانی باستانی جاده ابریشم.' }
  },
  {
    id: 14,
    category: 'bamyan',
    image: '/images/destinations/bamyan/0984a798701785cf1e58bc320ed83b7a.webp',
    en: { title: 'Bamyan Valley Panoramic Landscape', location: 'Bamyan', desc: 'Golden wheat terraces, willow trees, and mountain backdrop of the central highlands.' },
    fa: { title: 'دشت و دره‌های سرسبز بامیان', location: 'بامیان', desc: 'مزارع پلکانی، درختان بید و دورنمای برفی قله‌های سرفراز کوه بابا.' }
  },

  // ==================== هرات (Herat) ====================
  {
    id: 15,
    category: 'herat',
    image: '/images/destinations/herat/12_58_291.webp',
    en: { title: 'Citadel of Herat (Qala Ikhtiyaruddin)', location: 'Herat', desc: 'Alexander the Great era fortress towering over the city, featuring Timurid towers and museum halls.' },
    fa: { title: 'ارگ باستانی اختیارالدین هرات', location: 'هرات', desc: 'قلعه تاریخی و استوار هرات با پیشینه‌ای بیش از ۲۰۰۰ سال، برج‌های تیموری و موزه میراث.' }
  },
  {
    id: 16,
    category: 'herat',
    image: '/images/destinations/herat/4c3n5fe27845be2bxjs_800c450.webp',
    en: { title: 'Great Mosque of Herat (Masjid Jami)', location: 'Herat', desc: 'Masterpiece of Persian turquoise and cobalt mosaic tiles with a grand 800-year courtyard.' },
    fa: { title: 'مسجد جامع بزرگ هرات', location: 'هرات', desc: 'شاهکار هنر کاشی‌کاری معرق لاجوردی و فیروزه‌ای غوری و تیموری با حیاطی به قدمت ۸ سده.' }
  },
  {
    id: 17,
    category: 'herat',
    image: '/images/destinations/herat/240752b59ed183d8bb6995f0e94bcd01.webp',
    en: { title: 'Musalla Complex & Minarets', location: 'Herat', desc: 'Slender 15th-century Timurid minarets adorned with intricate geometric and floral glazed bricks.' },
    fa: { title: 'مناره‌های تاریخی مصلی هرات', location: 'هرات', desc: 'مناره‌های برافراشته سده پانزدهم میلادی تیموری آراسته به نقوش هندسی و لعاب‌های نیلگون.' }
  },
  {
    id: 18,
    category: 'herat',
    image: '/images/destinations/herat/435b386fc33a5548dc01eb9976aa3a87.webp',
    en: { title: 'Mausoleum of Gawhar Shad Begum', location: 'Herat', desc: 'Timurid architectural crown jewel featuring ribbed turquoise turquoise dome and muqarnas.' },
    fa: { title: 'آرامگاه گوهرشاد بیگم', location: 'هرات', desc: 'نگین معماری رنسانس تیموری با گنبد ترک‌دار فیروزه‌ای و مقرنس‌های ظریف و چشم‌نواز.' }
  },
  {
    id: 19,
    category: 'herat',
    image: '/images/destinations/herat/4c3n09dc3285002bxjx_800c450.webp',
    en: { title: 'Gazargah Shrine of Khwaja Abdullah Ansari', location: 'Herat', desc: 'Historic 15th-century Sufi pilgrimage complex with intricate stonework and tranquil pine gardens.' },
    fa: { title: 'زیارتگاه گازرگاه خواجه عبدالله انصاری', location: 'هرات', desc: 'آرامگاه عارف نامدار در فضایی آرام‌بخش با سنگ‌تراشی‌های نفیس هفت‌قلم و کاشی‌های کهن.' }
  },
  {
    id: 20,
    category: 'herat',
    image: '/images/destinations/herat/4c3nafe7d552982bxjn_800c450.webp',
    en: { title: 'Mausoleum of Nur al-Din Jami', location: 'Herat', desc: 'Resting place of the celebrated 15th-century Persian poet surrounded by shaded gardens.' },
    fa: { title: 'آرامگاه مولانا عبدالرحمن جامی', location: 'هرات', desc: 'مزار شاعر و ادیب بزرگ مشرق‌زمین احاطه‌شده در سایه‌سار درختان و باغ‌های هرات.' }
  },

  // ==================== بلخ و مزار شریف (Balkh & Mazar) ====================
  {
    id: 21,
    category: 'balkh',
    image: '/tours/images/mazarPictures.webp',
    en: { title: 'Blue Mosque (Rawza-e Sharif)', location: 'Mazar-i-Sharif', desc: 'Vibrant cobalt and turquoise tiled sacred complex glowing under northern Afghan skies.' },
    fa: { title: 'مسجد کبود (روضه شریف مزار)', location: 'مزار شریف', desc: 'مجموعه زیارتی منحصربه‌فرد با کاشی‌کاری‌های لاجوردی و فیروزه‌ای در قلب شمال افغانستان.' }
  },
  {
    id: 22,
    category: 'balkh',
    image: '/images/provinces/kabul/kabul-history.webp',
    en: { title: 'Ancient City Walls of Balkh (Bactra)', location: 'Balkh', desc: 'Massive earthen fortifications of the "Mother of Cities" along the ancient Silk Route.' },
    fa: { title: 'دیوارهای کهن شهر باستانی بلخ', location: 'بلخ', desc: 'باروهای خشتی سترگ ام‌البلاد (باختر باستان) در پیوندگاه تجارت کهن جاده ابریشم.' }
  },

  // ==================== طبیعت و مناظر (Nature & Landscapes) ====================
  {
    id: 23,
    category: 'nature',
    image: '/tours/images/noristanPictures.webp',
    en: { title: 'Nuristan Alpine Valleys & Cedar Forests', location: 'Nuristan', desc: 'Lush alpine evergreen woodlands, terraced wooden villages and clear crystal rivers.' },
    fa: { title: 'دره‌های سرسبز و جنگل‌های سدر نورستان', location: 'نورستان', desc: 'طبیعت بکر و جنگل‌های انبوه، روستاهای چوبی پلکانی و رودهای خروشان کوهستانی.' }
  },
  {
    id: 24,
    category: 'nature',
    image: '/tours/images/ghorPictures.webp',
    en: { title: 'Minaret of Jam & River Canyons', location: 'Ghor', desc: 'UNESCO World Heritage 65-meter minaret soaring from a dramatic canyon in Ghor province.' },
    fa: { title: 'منار باستانی جام و دره‌های غور', location: 'غور', desc: 'منار ۶۵ متری ثبت یونسکو از دوره غوریان برافراشته در میان صخره‌های تنگه هریرود.' }
  },
  {
    id: 25,
    category: 'nature',
    image: '/images/destinations/bamyan/4df3b4c6e1f2016ab693f906a5d1aed5.webp',
    en: { title: 'Band-e Haibat Crystal Waters', location: 'Bamyan', desc: 'Deep sapphire-blue water framed by pure mineral travertine shores at Band-e-Amir.' },
    fa: { title: 'آب‌های نیلگون بند هیبت', location: 'بامیان', desc: 'رنگ شگفت‌انگیز آب‌های عمیق بند هیبت در پهنه پارک ملی بند امیر.' }
  },

  // ==================== فرهنگ و سنت‌ها (Culture & Heritage) ====================
  {
    id: 26,
    category: 'culture',
    image: '/tours/images/kandaharPictures.webp',
    en: { title: 'Kandahar Architecture & Heritage', location: 'Kandahar', desc: 'Ahmad Shah Durrani mausoleum, historic bazaars and famed pomegranate orchards.' },
    fa: { title: 'معماری و میراث تاریخی قندهار', location: 'قندهار', desc: 'گنبد آرامگاه احمد شاه بابا، بازارهای چهارسو و شکوه تاریخی جنوب افغانستان.' }
  },
  {
    id: 27,
    category: 'culture',
    image: '/images/destinations/kabul/4b1c96e9a0f11fec4e20a870caa2cea9.webp',
    en: { title: 'Ka Faroshi Historic Bird Market', location: 'Kabul', desc: 'Centuries-old lively alleyways filled with singing canaries, partridges, and heritage birdcages.' },
    fa: { title: 'بازار سنتی کوچه کاه فروشی', location: 'کابل', desc: 'گذرگاهی چند صد ساله از نغمه کبک‌ها و قناری‌ها در بافت سنتی و نوستالژیک کابل.' }
  },
  {
    id: 28,
    category: 'culture',
    image: '/images/destinations/herat/763de7666e6b4b239ec31a8833cfd756.webp',
    en: { title: 'Traditional Tile & Craft Guilds of Herat', location: 'Herat', desc: 'Living tradition of handmade glaze tiles, glassblowing, and miniature painting schools.' },
    fa: { title: 'هنر کاشی‌سازی سنتی و صنایع دستی هرات', location: 'هرات', desc: 'میراث زنده کارگاه‌های کاشی معرق، شیشه‌گری سنتی و مکتب نگارگری کهن هرات.' }
  }
];

export default function Gallery() {
  const { currentLang } = useLangStore();
  const isRtl = currentLang === 'fa';

  const [activeCategory, setActiveCategory] = useState('all');
  const [lightboxIndex, setLightboxIndex] = useState(null);

  const categories = useMemo(() => [
    { id: 'all', label: isRtl ? 'همه تصاویر' : 'All Photos' },
    { id: 'kabul', label: isRtl ? 'کابل' : 'Kabul' },
    { id: 'bamyan', label: isRtl ? 'بامیان' : 'Bamyan' },
    { id: 'herat', label: isRtl ? 'هرات' : 'Herat' },
    { id: 'balkh', label: isRtl ? 'بلخ و مزار' : 'Balkh & Mazar' },
    { id: 'nature', label: isRtl ? 'طبیعت و مناظر' : 'Nature & Landscapes' },
    { id: 'culture', label: isRtl ? 'فرهنگ و سنت‌ها' : 'Culture & Heritage' },
  ], [isRtl]);

  const filteredPhotos = useMemo(() => {
    if (activeCategory === 'all') return galleryDatabase;
    return galleryDatabase.filter((item) => item.category === activeCategory);
  }, [activeCategory]);

  const handleNext = (e) => {
    e.stopPropagation();
    if (lightboxIndex === null) return;
    setLightboxIndex((prev) => (prev + 1) % filteredPhotos.length);
  };

  const handlePrev = (e) => {
    e.stopPropagation();
    if (lightboxIndex === null) return;
    setLightboxIndex((prev) => (prev - 1 + filteredPhotos.length) % filteredPhotos.length);
  };

  return (
    <div className={`w-full bg-[#F8FAFC] min-h-screen text-[#14213D] pb-24 ${isRtl ? 'font-[Sahel]' : 'font-[Inter]'}`}>
      <SEO 
        title={isRtl ? 'گالری تصاویر افغانستان | آمووی ترول' : 'Photo Gallery of Afghanistan | Amovi Travel'}
        description={isRtl 
          ? 'آلبوم و گالری اختصاصی از زیباترین مناظر، آبدات تاریخی، فرهنگ اصیل و ولایات افغانستان با آمووی ترول.'
          : 'High-definition curated photography of landscapes, cultural heritage, and historic monuments across Afghanistan.'}
        canonicalUrl="https://amovi.travel/gallery"
      />

      {/* ۱. هیرو سکشن اصلی گالری */}
      <section className="relative w-full pt-36 pb-20 sm:pt-40 sm:pb-28 overflow-hidden bg-[#14213D] text-white">
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-45 scale-105"
          style={{ backgroundImage: `url(${heroBg})` }}
        />
        <div className="absolute inset-0 z-10 bg-gradient-to-b from-[#14213D]/95 via-[#14213D]/80 to-[#14213D] pointer-events-none" />

        <div className={`relative z-20 max-w-6xl mx-auto px-6 ${isRtl ? 'text-right' : 'text-left'}`}>
          <div className="inline-flex items-center gap-2 mb-2">
            <Camera size={16} className="text-[#FCA311]" />
            <span className="text-[#FCA311] text-xs font-bold uppercase tracking-[0.2em] font-[Inter]">
              {isRtl ? 'گالری تصاویر اختصاصی' : 'CURATED PHOTO GALLERY'}
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight">
            {isRtl ? 'افغانستان از قاب تصویر' : 'Afghanistan Through the Lens'}
          </h1>

          <p className="mt-4 text-slate-300 text-sm sm:text-base max-w-2xl font-light leading-relaxed">
            {isRtl 
              ? 'مجموعه‌ای برگزیده از شگفتی‌های طبیعی بامیان، یادمان‌های تاریخی هرات و بلخ، زندگی روزمره کابل و زیبایی‌های کمتر دیده‌شده افغانستان.'
              : 'A curated photographic journey through the natural wonders of Bamyan, historical landmarks of Herat and Balkh, vibrant Kabul life, and untouched landscapes.'}
          </p>
        </div>
      </section>

      {/* ۲. تب‌های فیلتر دسته‌بندی گالری */}
      <section className="max-w-6xl mx-auto px-6 pt-10 pb-8">
        <div className="flex flex-wrap items-center justify-center gap-2.5">
          {categories.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategory(cat.id)}
                className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'bg-[#14213D] text-[#FCA311] shadow-lg shadow-[#14213D]/20 scale-105 border border-[#14213D]'
                    : 'bg-white text-slate-600 hover:text-[#14213D] hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </section>

      {/* ۳. گرید ریسپانسیو تصاویر */}
      <section className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" dir={isRtl ? 'rtl' : 'ltr'}>
          {filteredPhotos.map((item, idx) => {
            const text = item[currentLang] || item.en;
            return (
              <div
                key={item.id}
                onClick={() => setLightboxIndex(idx)}
                className="group relative rounded-3xl overflow-hidden aspect-[4/3] bg-slate-100 shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-1.5 cursor-pointer border border-slate-200/80"
              >
                <img
                  src={item.image}
                  alt={text.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-108 select-none"
                  loading="lazy"
                  onError={(e) => {
                    if (!e.target.dataset.tried) {
                      e.target.dataset.tried = 'true';
                      e.target.src = '/images/provinces/kabul/kabul-hero.webp';
                    }
                  }}
                />

                {/* گرادینت تاریک شیک برای خوانایی متن */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#14213D]/90 via-[#14213D]/20 to-transparent opacity-80 group-hover:opacity-95 transition-opacity duration-300" />

                {/* نشان لوکیشن در بالا */}
                <div className={`absolute top-4 ${isRtl ? 'right-4' : 'left-4'} z-10`}>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#14213D]/80 backdrop-blur-md text-[#FCA311] text-[11px] font-bold shadow-md">
                    <MapPin size={12} />
                    <span>{text.location}</span>
                  </span>
                </div>

                {/* آیکون زوم در مرکز */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 pointer-events-none">
                  <div className="w-12 h-12 rounded-full bg-[#FCA311] text-[#14213D] flex items-center justify-center shadow-xl transform scale-75 group-hover:scale-100 transition-transform duration-300">
                    <Eye size={20} strokeWidth={2.5} />
                  </div>
                </div>

                {/* عنوان و توضیحات پایین کارت */}
                <div className={`absolute bottom-0 inset-x-0 p-5 z-10 ${isRtl ? 'text-right' : 'text-left'}`}>
                  <h3 className="text-white text-base sm:text-lg font-black leading-tight drop-shadow-sm group-hover:text-[#FCA311] transition-colors">
                    {text.title}
                  </h3>
                  <p className="text-slate-300 text-xs mt-1 line-clamp-2 font-light leading-relaxed">
                    {text.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ۴. مودال لایت‌باکس تمام‌صفحه (Fullscreen Lightbox) */}
      {lightboxIndex !== null && filteredPhotos[lightboxIndex] && (
        <div 
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4 select-none animate-fadeIn"
          onClick={() => setLightboxIndex(null)}
        >
          {/* دکمه بستن */}
          <button
            type="button"
            onClick={() => setLightboxIndex(null)}
            className="absolute top-6 right-6 z-50 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X size={24} />
          </button>

          {/* دکمه قبلی */}
          <button
            type="button"
            onClick={handlePrev}
            className="absolute left-4 sm:left-8 z-50 w-12 h-12 rounded-full bg-white/10 hover:bg-[#FCA311] hover:text-[#14213D] text-white flex items-center justify-center transition-all cursor-pointer shadow-lg"
          >
            <ChevronLeft size={28} />
          </button>

          {/* محتوای تصویر و کپشن */}
          <div 
            className="relative max-w-5xl max-h-[90vh] flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={filteredPhotos[lightboxIndex].image}
              alt={filteredPhotos[lightboxIndex][currentLang]?.title || 'Gallery'}
              className="max-w-full max-h-[75vh] object-contain rounded-2xl shadow-2xl border border-white/15"
            />
            
            <div className={`mt-4 text-center max-w-2xl px-4 ${isRtl ? 'font-[Sahel]' : 'font-[Inter]'}`}>
              <div className="inline-flex items-center gap-1.5 text-[#FCA311] text-xs font-bold mb-1">
                <MapPin size={13} />
                <span>{filteredPhotos[lightboxIndex][currentLang]?.location || filteredPhotos[lightboxIndex].en.location}</span>
                <span className="text-white/40">•</span>
                <span className="text-slate-400">{lightboxIndex + 1} / {filteredPhotos.length}</span>
              </div>
              <h2 className="text-white text-lg sm:text-2xl font-black">
                {filteredPhotos[lightboxIndex][currentLang]?.title || filteredPhotos[lightboxIndex].en.title}
              </h2>
              <p className="text-slate-300 text-xs sm:text-sm mt-1 leading-relaxed font-light">
                {filteredPhotos[lightboxIndex][currentLang]?.desc || filteredPhotos[lightboxIndex].en.desc}
              </p>
            </div>
          </div>

          {/* دکمه بعدی */}
          <button
            type="button"
            onClick={handleNext}
            className="absolute right-4 sm:right-8 z-50 w-12 h-12 rounded-full bg-white/10 hover:bg-[#FCA311] hover:text-[#14213D] text-white flex items-center justify-center transition-all cursor-pointer shadow-lg"
          >
            <ChevronRight size={28} />
          </button>
        </div>
      )}
    </div>
  );
}
