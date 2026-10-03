import { useState, useMemo } from 'react';
import { Camera, X, ChevronLeft, ChevronRight, Eye, MapPin } from 'lucide-react';
import { useLangStore } from '../../store/useLangStore';
import SEO from '../../components/SEO';
import heroBg from '../../assets/images/hero-bg.webp';

// لیست تصاویر منتخب گالری سراسری افغانستان
const galleryDatabase = [
  {
    id: 1,
    category: 'bamyan',
    image: '/images/provinces/bamyan/bamyan-hero.webp',
    en: { title: 'Bamyan Valley & Cliffs', location: 'Bamyan', desc: 'Ancient cliffs, cave dwellings and high-altitude agricultural valleys.' },
    fa: { title: 'دره باستانی بامیان', location: 'بامیان', desc: 'صخره‌های تاریخی، مغاره‌های کهن و دشت‌های سرسبز بامیان.' }
  },
  {
    id: 2,
    category: 'bamyan',
    image: '/tours/images/bamyanPictures.webp',
    en: { title: 'Band-e-Amir National Park', location: 'Bamyan', desc: 'Turquoise natural lakes nestled in the Hindu Kush mountains.' },
    fa: { title: 'پارک ملی بند امیر', location: 'بامیان', desc: 'دریاچه‌های فیروزه‌ای طبیعی در دل رشته‌کوه هندوکش.' }
  },
  {
    id: 3,
    category: 'bamyan',
    image: '/images/provinces/bamyan/Buddha-1.webp',
    en: { title: 'Giant Buddha Niches', location: 'Bamyan', desc: 'Historic 6th-century monumental Buddha niches carved into the red rock.' },
    fa: { title: 'تندیس‌های صلصال و شهمامه', location: 'بامیان', desc: 'تندیس‌های سترگ بودا تراشیده‌شده در صخره‌های سرخ سده ششم میلادی.' }
  },
  {
    id: 4,
    category: 'kabul',
    image: '/images/provinces/kabul/kabul-hero.webp',
    en: { title: 'Kabul Cityscape & Mountains', location: 'Kabul', desc: 'The historic capital nestled in a high mountain valley.' },
    fa: { title: 'چشم‌انداز شهر کابل', location: 'کابل', desc: 'پایتخت تاریخی افغانستان احاطه‌شده در میان کوه‌های سر به فلک کشیده.' }
  },
  {
    id: 5,
    category: 'kabul',
    image: '/images/provinces/kabul/bagh-e-babur.webp',
    en: { title: 'Bagh-e Babur (Babur Gardens)', location: 'Kabul', desc: '16th-century terraced Mughal gardens with marble pavilion.' },
    fa: { title: 'باغ تاریخی بابر', location: 'کابل', desc: 'باغ‌های پلکانی دوره گورکانی با کوشک مرمرین و چنارهای کهنسال.' }
  },
  {
    id: 6,
    category: 'kabul',
    image: '/images/provinces/kabul/kabul-culture.webp',
    en: { title: 'Old Kabul Artisan Traditions', location: 'Kabul', desc: 'Coppersmiths, spice bazaars, and traditional hospitality.' },
    fa: { title: 'بازار سنتی و صنایع دستی کابل', location: 'کابل', desc: 'راسته مسگران، بازارهای ادویه و مهمان‌نوازی اصیل کابل قدیم.' }
  },
  {
    id: 7,
    category: 'kabul',
    image: '/images/provinces/kabul/bibi-mahro.webp',
    en: { title: 'Bibi Mahro Hill Panorama', location: 'Kabul', desc: 'Sweeping panoramic vantage point over modern and historic Kabul.' },
    fa: { title: 'تپه بی‌بی مهرو', location: 'کابل', desc: 'چشم‌انداز فراخ و پانورامیک بر فراز بخش‌های نوین و کهن کابل.' }
  },
  {
    id: 8,
    category: 'herat',
    image: '/tours/images/heratPictures.webp',
    en: { title: 'Citadel of Herat (Qala Ikhtiyaruddin)', location: 'Herat', desc: 'Alexander the Great era fortress, mosaic tiles and historical museum.' },
    fa: { title: 'ارگ باستانی اختیارالدین هرات', location: 'هرات', desc: 'دژ استوار دوره اسکندر، کاشی‌کاری‌های ایلخانی و موزه تاریخی.' }
  },
  {
    id: 9,
    category: 'balkh',
    image: '/tours/images/mazarPictures.webp',
    en: { title: 'Blue Mosque of Mazar-i-Sharif', location: 'Balkh', desc: 'Turquoise and lapis glazed tiles of the historic shrine complex.' },
    fa: { title: 'مسجد کبود مزار شریف (روضه سخی)', location: 'بلخ', desc: 'شاهکار کاشی‌کاری‌های فیروزه‌ای و لاجوردی در کهن‌شهر بلخ.' }
  },
  {
    id: 10,
    category: 'nature',
    image: '/tours/images/noristanPictures.webp',
    en: { title: 'Nuristan Alpine Valleys', location: 'Nuristan', desc: 'Dense cedar forests, terraced timber houses and mountain rivers.' },
    fa: { title: 'دره‌های سرسبز نورستان', location: 'نورستان', desc: 'جنگل‌های انبوه سدر، خانه‌های چوبی پلکانی و رودهای خروشان.' }
  },
  {
    id: 11,
    category: 'nature',
    image: '/tours/images/ghorPictures.webp',
    en: { title: 'Ghor Landscapes & Valleys', location: 'Ghor', desc: 'Canyon rivers, rugged central highlands, and turquoise skies.' },
    fa: { title: 'طبیعت کوهستانی غور', location: 'غور', desc: 'دره‌های ژرف، تنگه‌های طبیعی و آسمان فیروزه‌ای ارتفاعات مرکزی.' }
  },
  {
    id: 12,
    category: 'culture',
    image: '/tours/images/kandaharPictures.webp',
    en: { title: 'Kandahar Architecture & Gardens', location: 'Kandahar', desc: 'Historic domes, pomegranates orchards and southern Afghan heritage.' },
    fa: { title: 'معماری و باغات قندهار', location: 'قندهار', desc: 'گنبدها و ابنیه تاریخی، باغات انار و شکوه جنوب افغانستان.' }
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
