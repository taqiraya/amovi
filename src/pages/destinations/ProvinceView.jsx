import { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  MapPin, 
  ArrowRight, 
  ArrowLeft, 
  Sparkles, 
  Heart, 
  Utensils, 
  Award,
  Compass,
  Camera,
  Maximize2,
  X,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useLangStore } from '../../store/useLangStore';
import ProvinceHero from './components/ProvinceHero';
import { getProvinceBySlug } from '../../services/api';
import SEO from '../../components/SEO';

export default function ProvinceView() {
  const { slug } = useParams();
  const { currentLang, translations } = useLangStore();
  const isRtl = currentLang === 'fa';
  const t = useMemo(() => translations?.destinationsPage || {}, [translations?.destinationsPage]);

  const [province, setProvince] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [lightboxIndex, setLightboxIndex] = useState(null);

  useEffect(() => {
    let isMounted = true;

    getProvinceBySlug(slug).then((data) => {
      if (isMounted) {
        setProvince(data || null);
        setLoading(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [slug]);

  const categories = useMemo(() => [
    { id: 'all', label: t.all || (isRtl ? 'همه' : 'All') },
    { id: 'gallery', label: t.gallery || (isRtl ? 'گالری تصاویر' : 'Photo Gallery'), isGallery: true },
    { id: 'museum-and-galleries', label: t.museumAndGalleries || (isRtl ? 'موزه‌ها و گالری‌ها' : 'Museum and Galleries') },
    { id: 'gardens-and-parks', label: t.gardensAndParks || (isRtl ? 'باغ‌ها و بوستان‌ها' : 'Gardens and Parks') },
    { id: 'palaces', label: t.palaces || (isRtl ? 'کاخ‌ها و بناهای سلطنتی' : 'Palaces') },
    { id: 'archeological-sites', label: t.archeologicalSites || (isRtl ? 'محوطه‌های باستانی و تاریخی' : 'Archeological and Historical Sites') },
    { id: 'historic-landmarks', label: t.historicLandmarks || (isRtl ? 'بناها و یادمان‌های کهن' : 'Historic Structures and Landmarks') },
    { id: 'traditional-markets', label: t.traditionalMarkets || (isRtl ? 'بازارهای سنتی و گذرگاه‌های کهن' : 'Traditional Markets & Old Cities') },
    { id: 'modern-districts', label: t.modernDistricts || (isRtl ? 'محله‌ها و نقاط مدرن' : 'Modern Districts') },
  ], [isRtl, t]);

  const filteredPlaces = useMemo(() => {
    if (!province?.sub_destinations) return [];
    if (selectedCategory === 'all') return province.sub_destinations;
    if (selectedCategory === 'gallery') return [];
    return province.sub_destinations.filter(
      (place) => place.filter_category === selectedCategory
    );
  }, [province, selectedCategory]);

  const galleryItems = useMemo(() => {
    if (!province) return [];
    if (province.gallery && province.gallery.length > 0) {
      return province.gallery;
    }
    // Fallback if province.gallery is empty
    const items = [];
    if (province.images?.hero_cover) {
      items.push({
        id: 'hero',
        image: province.images.hero_cover,
        en: { title: `${province.en?.name || 'Province'} Landscape`, location: province.en?.name },
        fa: { title: `چشم‌انداز طبیعی ${province.fa?.name || 'ولایت'}`, location: province.fa?.name }
      });
    }
    if (province.images?.history_img) {
      items.push({
        id: 'hist',
        image: province.images.history_img,
        en: { title: 'Historical Heritage', location: province.en?.name },
        fa: { title: 'میراث و بناهای تاریخی', location: province.fa?.name }
      });
    }
    if (province.images?.culture_img) {
      items.push({
        id: 'cult',
        image: province.images.culture_img,
        en: { title: 'Living Culture & Traditions', location: province.en?.name },
        fa: { title: 'فرهنگ و سنت‌های بومی', location: province.fa?.name }
      });
    }
    if (province.sub_destinations) {
      province.sub_destinations.forEach((sub, sIdx) => {
        items.push({
          id: `sub-${sIdx}`,
          image: sub.image,
          en: { title: sub.en?.name || 'Attraction', location: province.en?.name },
          fa: { title: sub.fa?.name || 'جاذبه', location: province.fa?.name }
        });
      });
    }
    return items;
  }, [province]);

  const handleNextLightbox = (e) => {
    e.stopPropagation();
    if (galleryItems.length === 0) return;
    setLightboxIndex((prev) => (prev + 1) % galleryItems.length);
  };

  const handlePrevLightbox = (e) => {
    e.stopPropagation();
    if (galleryItems.length === 0) return;
    setLightboxIndex((prev) => (prev - 1 + galleryItems.length) % galleryItems.length);
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center pt-32">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-[#FCA311] border-t-transparent rounded-full animate-spin" />
          <div className="text-base font-bold text-slate-500 font-[Inter]">
            {isRtl ? 'در حال بارگذاری اطلاعات ولایت...' : 'Loading Province Details...'}
          </div>
        </div>
      </div>
    );
  }

  if (!province) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-4 pt-36">
        <h2 className="text-2xl font-bold text-[#14213D] mb-4">
          {isRtl ? "ولایت مورد نظر پیدا نشد" : "Province Not Found"}
        </h2>
        <Link 
          to="/destinations" 
          className="bg-[#FCA311] hover:bg-amber-500 text-[#14213D] font-bold py-2.5 px-6 rounded-full shadow-md transition-colors"
        >
          {isRtl ? "مشاهده تمام ولایات" : "View All Destinations"}
        </Link>
      </div>
    );
  }

  const localData = province[currentLang] || province.en || {};
  const livingHeritage = province.living_heritage || {};

  const destinationSchema = {
    "@context": "https://schema.org",
    "@type": "TouristDestination",
    "name": localData.name,
    "description": localData.intro || localData.history_text,
    "image": province.images?.hero_cover,
    "touristType": ["Cultural Tourism", "Adventure Tourism", "Heritage Tourism"],
    "containedInPlace": {
      "@type": "Country",
      "name": "Afghanistan"
    }
  };

  return (
    <div className={`w-full bg-[#F8FAFC] pb-16 ${isRtl ? 'font-[Sahel]' : 'font-[Inter]'}`}>
      <SEO 
        title={`${localData.name} — ${localData.tagline || (isRtl ? 'راهنمای سفر و جاذبه‌های گردشگری' : 'Travel Guide & Attractions')}`}
        description={localData.intro || localData.history_text}
        ogImage={province.images?.hero_cover}
        keywords={`${localData.name}, Afghanistan travel, visit ${localData.name}, ${localData.name} tourism, Amovi Travel`}
        schema={destinationSchema}
      />
      
      {/* ========================================================
          ۱. هیرو سکشن ولایت (Province Hero)
      ======================================================== */}
      <ProvinceHero 
        province={province} 
        localData={localData} 
        isRtl={isRtl} 
      />

      {/* نگهدارنده محتوای اصلی */}
      <div id="explore-hub" className="max-w-6xl mx-auto px-6 space-y-20 sm:space-y-28 pt-16 sm:pt-24">

        {/* ========================================================
            ۲. بخش تاریخ - پژواک گذشته (Echoes of the Past)
        ======================================================== */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center" dir={isRtl ? 'rtl' : 'ltr'}>
          <div className={`lg:col-span-6 space-y-4 ${isRtl ? 'text-right' : 'text-left'}`}>
            <div className="flex items-center gap-2">
              <span className="w-8 h-0.5 bg-[#FCA311] inline-block" />
              <span className="text-[#FCA311] text-xs font-bold uppercase tracking-widest font-[Inter]">
                {t.historyEyebrow || (isRtl ? 'تاریخ' : 'HISTORY')}
              </span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-extrabold text-[#14213D] tracking-tight">
              {localData.history_title || t.historyTitle || (isRtl ? 'پژواک روزگار کهن' : 'Echoes of the Past')}
            </h2>

            <p className="text-slate-600 text-sm sm:text-base leading-relaxed font-normal pt-2">
              {localData.history_text || localData.intro}
            </p>
          </div>

          <div className="lg:col-span-6">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-slate-200 aspect-[16/10] group">
              <img
                src={province.images?.history_img || province.images?.hero_cover}
                alt={localData.history_title || localData.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
            </div>
          </div>
        </section>

        {/* ========================================================
            ۳. بخش فرهنگ و میراث زنده (Living Heritage)
        ======================================================== */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center" dir={isRtl ? 'rtl' : 'ltr'}>
          {/* کلاژ تصاویر فرهنگ */}
          <div className="lg:col-span-6 order-2 lg:order-1">
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-2xl overflow-hidden shadow-xl border-4 border-white aspect-[4/3] group">
                <img
                  src={province.images?.culture_img || province.images?.hero_cover}
                  alt={localData.culture_title || localData.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  loading="lazy"
                />
              </div>
              <div className="rounded-2xl overflow-hidden shadow-xl border-4 border-white aspect-[4/3] group mt-6">
                <img
                  src={province.images?.culture_img2 || province.images?.history_img || province.images?.hero_cover}
                  alt={localData.culture_title || localData.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  loading="lazy"
                />
              </div>
            </div>
          </div>

          {/* متن فرهنگ و ۴ ویژگی شاخص */}
          <div className={`lg:col-span-6 order-1 lg:order-2 space-y-4 ${isRtl ? 'text-right' : 'text-left'}`}>
            <div className="flex items-center gap-2">
              <span className="w-8 h-0.5 bg-[#FCA311] inline-block" />
              <span className="text-[#FCA311] text-xs font-bold uppercase tracking-widest font-[Inter]">
                {t.cultureEyebrow || (isRtl ? 'فرهنگ' : 'CULTURE')}
              </span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-extrabold text-[#14213D] tracking-tight">
              {localData.culture_title || t.cultureTitle || (isRtl ? 'میراث زنده' : 'Living Heritage')}
            </h2>

            <p className="text-slate-600 text-sm sm:text-base leading-relaxed font-normal">
              {localData.culture_text || localData.marketing_pitch}
            </p>

            {/* گرید ۲در۲ ویژگی‌های فرهنگی */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              {/* ویژگی ۱: صنایع دستی */}
              <div className="flex items-start gap-3 p-3 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
                <div className="w-10 h-10 rounded-full bg-amber-500/15 text-[#FCA311] flex items-center justify-center shrink-0">
                  <Sparkles size={18} />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-[#14213D]">
                    {livingHeritage.crafts?.[currentLang]?.title || (isRtl ? 'صنایع دستی و سنتی' : 'Traditional Crafts')}
                  </h4>
                  <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5 leading-relaxed">
                    {livingHeritage.crafts?.[currentLang]?.desc || (isRtl ? 'قالین‌های دستباف و آثار هنری بومی.' : 'Handmade products, carpets and local art.')}
                  </p>
                </div>
              </div>

              {/* ویژگی ۲: مهمان‌نوازی */}
              <div className="flex items-start gap-3 p-3 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
                <div className="w-10 h-10 rounded-full bg-orange-500/15 text-orange-500 flex items-center justify-center shrink-0">
                  <Heart size={18} />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-[#14213D]">
                    {livingHeritage.hospitality?.[currentLang]?.title || (isRtl ? 'مهمان‌نوازی اصیل' : 'Warm Hospitality')}
                  </h4>
                  <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5 leading-relaxed">
                    {livingHeritage.hospitality?.[currentLang]?.desc || (isRtl ? 'استقبال گرم و فرهنگ صمیمانه مردم.' : 'Friendly people and rich traditions.')}
                  </p>
                </div>
              </div>

              {/* ویژگی ۳: خوراک محلی */}
              <div className="flex items-start gap-3 p-3 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
                <div className="w-10 h-10 rounded-full bg-amber-500/15 text-amber-600 flex items-center justify-center shrink-0">
                  <Utensils size={18} />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-[#14213D]">
                    {livingHeritage.cuisine?.[currentLang]?.title || (isRtl ? 'خوراک‌های لذیذ محلی' : 'Local Cuisine')}
                  </h4>
                  <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5 leading-relaxed">
                    {livingHeritage.cuisine?.[currentLang]?.desc || (isRtl ? 'غذاهای لذیذ و طعم‌های اصیل افغانی.' : 'Authentic flavors and traditional dishes.')}
                  </p>
                </div>
              </div>

              {/* ویژگی ۴: آیین‌ها و سنت‌ها */}
              <div className="flex items-start gap-3 p-3 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
                <div className="w-10 h-10 rounded-full bg-yellow-500/15 text-yellow-600 flex items-center justify-center shrink-0">
                  <Award size={18} />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-[#14213D]">
                    {livingHeritage.traditions?.[currentLang]?.title || (isRtl ? 'آیین‌ها و رسوم کهن' : 'Unique Traditions')}
                  </h4>
                  <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5 leading-relaxed">
                    {livingHeritage.traditions?.[currentLang]?.desc || (isRtl ? 'جشنواره‌ها، موسیقی سنتی و تجارب ناب.' : 'Festivals, music and cultural experiences.')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================
            ۴. بخش جاهای دیدنی و تب‌های فیلتر (Discover Places to Visit)
        ======================================================== */}
        <section id="places-to-visit" className="space-y-8 scroll-mt-24">
          <div className="text-center max-w-2xl mx-auto">
            <div className="flex items-center justify-center gap-2 mb-2">
              <span className="w-6 h-0.5 bg-[#FCA311] inline-block" />
              <span className="text-[#FCA311] text-xs font-bold uppercase tracking-widest font-[Inter]">
                {t.discoverEyebrow || (isRtl ? 'دیدنی‌ها' : 'DISCOVER')}
              </span>
              <span className="w-6 h-0.5 bg-[#FCA311] inline-block" />
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-[#14213D] tracking-tight">
              {t.discoverTitle || (isRtl ? 'جاهای دیدنی و جاذبه‌های برتر' : 'Discover Places to Visit')}
            </h2>
          </div>

          {/* تب‌های دسته‌بندی فیلتر (شامل تب جدید گالری) */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
            {categories.map((cat) => {
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'bg-[#14213D] text-[#FCA311] shadow-md border border-[#14213D]'
                      : cat.isGallery
                        ? 'bg-amber-50/80 text-[#14213D] hover:bg-amber-100 border border-amber-300/80 shadow-sm'
                        : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  {cat.isGallery && <Camera size={13} className="text-[#FCA311]" />}
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>

          {/* حالت اول: نمایش گالری عکس (وقتی تب گالری انتخاب شده است) */}
          {selectedCategory === 'gallery' ? (
            <div className="space-y-6 pt-4">
              <div className="text-center max-w-xl mx-auto">
                <span className="text-[#FCA311] text-xs font-bold uppercase tracking-widest block font-[Inter]">
                  {isRtl ? 'گالری تصاویر منتخب' : 'PHOTO GALLERY'}
                </span>
                <p className="text-slate-500 text-xs sm:text-sm mt-1">
                  {isRtl 
                    ? `جلوه‌های بصری، طبیعت شگفت‌انگیز و معماری تاریخی ولایت ${localData.name}` 
                    : `Visual beauty, stunning landscapes and historic heritage of ${localData.name}`}
                </p>
              </div>

              {galleryItems.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {galleryItems.map((item, gIdx) => {
                    const itemData = item[currentLang] || item.en || {};
                    return (
                      <div
                        key={item.id || gIdx}
                        onClick={() => setLightboxIndex(gIdx)}
                        className="group relative rounded-3xl overflow-hidden aspect-[4/3] bg-slate-200 shadow-md hover:shadow-2xl transition-all duration-500 cursor-pointer border-4 border-white"
                      >
                        <img
                          src={item.image}
                          alt={itemData.title || `Gallery photo ${gIdx + 1}`}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#14213D]/90 via-[#14213D]/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5 text-white" dir={isRtl ? 'rtl' : 'ltr'}>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-[#FCA311] font-semibold flex items-center gap-1">
                              <MapPin size={12} />
                              <span>{itemData.location || localData.name}</span>
                            </span>
                            <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white">
                              <Maximize2 size={14} />
                            </div>
                          </div>
                          <h4 className="text-sm sm:text-base font-bold text-white mt-1 drop-shadow">
                            {itemData.title}
                          </h4>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="py-16 text-center text-slate-400 bg-white rounded-3xl border border-dashed border-slate-200">
                  <Camera size={36} className="mx-auto mb-2 text-slate-300" />
                  <p className="text-sm">
                    {isRtl ? 'تصویری در این گالری موجود نیست.' : 'No photos available in this gallery.'}
                  </p>
                </div>
              )}
            </div>
          ) : (
            /* حالت دوم: گرید ۳ ستونه کارت‌های جاذبه‌ها */
            filteredPlaces.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 pt-4">
                {filteredPlaces.map((place) => {
                  const placeData = place[currentLang] || place.en || {};
                  return (
                    <div
                      key={place.id}
                      className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1"
                      dir={isRtl ? 'rtl' : 'ltr'}
                    >
                      {/* تصویر جاذبه */}
                      <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                        <img
                          src={place.image}
                          alt={placeData.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 select-none"
                          loading="lazy"
                          onError={(e) => {
                            if (!e.target.dataset.tried) {
                              e.target.dataset.tried = 'true';
                              e.target.src = province.images?.hero_cover || '/images/provinces/kabul/kabul-hero.webp';
                            }
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
                        
                        {/* بج دسته‌بندی در بالای عکس */}
                        <span className={`absolute top-3 ${isRtl ? 'right-3' : 'left-3'} px-2.5 py-1 rounded-full bg-[#14213D]/80 backdrop-blur-md text-[#FCA311] text-[11px] font-semibold border border-white/20`}>
                          {isRtl ? (place.categoryNameFa || place.categoryNameEn) : (place.categoryNameEn || 'Attraction')}
                        </span>
                      </div>

                      {/* محتوای متنی کارت */}
                      <div className="p-6 flex flex-col justify-between flex-grow space-y-4">
                        <div className="space-y-2">
                          <h3 className="text-lg sm:text-xl font-bold text-[#14213D] group-hover:text-[#FCA311] transition-colors">
                            {placeData.name}
                          </h3>
                          <p className="text-slate-600 text-xs sm:text-sm leading-relaxed line-clamp-3">
                            {placeData.teaser || placeData.lead}
                          </p>
                        </div>

                        {/* برچسب لوکیشن و دکمه مشاهده جزئیات */}
                        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                            <MapPin size={14} className="text-[#FCA311]" />
                            <span>{localData.name}</span>
                          </div>

                          <Link
                            to={`/destinations/${slug}/${place.id}`}
                            className="inline-flex items-center gap-1.5 bg-[#FCA311] hover:bg-amber-500 text-[#14213D] font-bold py-2 px-4 rounded-full text-xs transition-colors shadow-sm cursor-pointer"
                          >
                            <span>{t.exploreDetails || (isRtl ? 'مشاهده جزئیات' : 'Explore Details')}</span>
                            {isRtl ? <ArrowLeft size={13} /> : <ArrowRight size={13} />}
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="py-16 text-center text-slate-400 bg-white rounded-3xl border border-dashed border-slate-200">
                <Compass size={36} className="mx-auto mb-2 text-slate-300" />
                <p className="text-sm">
                  {isRtl ? 'در این دسته‌بندی جاذبه‌ای ثبت نشده است.' : 'No destinations found in this category.'}
                </p>
              </div>
            )
          )}
        </section>

        {/* ========================================================
            ۵. بنر دعوت به سفر (Your Journey Awaits CTA)
        ======================================================== */}
        <section className="relative rounded-3xl overflow-hidden shadow-2xl bg-[#14213D] text-white p-8 sm:p-14">
          <div 
            className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-35 scale-105"
            style={{ backgroundImage: `url(${province.images?.hero_cover})` }}
          />
          <div className="absolute inset-0 z-10 bg-gradient-to-r from-[#14213D]/95 via-[#14213D]/85 to-[#14213D]/90 pointer-events-none" />

          <div className="relative z-20 flex flex-col md:flex-row items-center justify-between gap-8" dir={isRtl ? 'rtl' : 'ltr'}>
            <div className={`space-y-3 max-w-xl ${isRtl ? 'text-right' : 'text-left'}`}>
              <span className="text-[#FCA311] text-xs font-bold uppercase tracking-widest block font-[Inter]">
                {t.ctaReady || (isRtl ? 'آماده آغاز سفر هستید؟' : 'READY TO EXPLORE')}
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">
                {isRtl ? `سفر رویایی شما به ${localData.name} در انتظار شماست` : `Your ${localData.name} Journey Awaits`}
              </h3>
              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed font-light">
                {t.ctaDesc || (isRtl 
                  ? `تاریخ، فرهنگ غنی و شگفتی‌های طبیعی این ولایت تماشایی را با همراهی آمووی تجربه کنید.` 
                  : `Discover the history, culture and natural beauty of this remarkable province.`)}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <Link
                to="/services"
                className="inline-flex items-center gap-2 bg-[#FCA311] hover:bg-amber-500 text-[#14213D] font-bold py-3.5 px-7 rounded-full shadow-lg transition-all duration-200 text-xs sm:text-sm uppercase font-[Inter] tracking-wider"
              >
                <span>{t.requestPackage || (isRtl ? 'ثبت درخواست سفر' : 'Request This Package')}</span>
                {isRtl ? <ArrowLeft size={16} /> : <ArrowRight size={16} />}
              </Link>

              <Link
                to="/contact"
                className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold py-3.5 px-6 rounded-full border border-white/25 backdrop-blur-sm transition-all duration-200 text-xs sm:text-sm"
              >
                <span>{t.contactAmovi || (isRtl ? 'تماس با ما' : 'Contact Amovi')}</span>
              </Link>
            </div>
          </div>
        </section>

      </div>

      {/* ========================================================
          ۶. مودال تمام‌صفحه لایت‌باکس عکس (Lightbox Modal)
      ======================================================== */}
      {lightboxIndex !== null && galleryItems[lightboxIndex] && (
        <div 
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setLightboxIndex(null)}
        >
          {/* دکمه بستن لایت‌باکس */}
          <button
            type="button"
            onClick={() => setLightboxIndex(null)}
            className="absolute top-5 right-5 z-50 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X size={24} />
          </button>

          {/* دکمه قبلی */}
          <button
            type="button"
            onClick={handlePrevLightbox}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-50 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            aria-label="Previous image"
          >
            <ChevronLeft size={28} />
          </button>

          {/* دکمه بعدی */}
          <button
            type="button"
            onClick={handleNextLightbox}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-50 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            aria-label="Next image"
          >
            <ChevronRight size={28} />
          </button>

          {/* کانتینر تصویر و کپشن */}
          <div 
            className="max-w-4xl w-full max-h-[85vh] flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={galleryItems[lightboxIndex].image}
              alt={galleryItems[lightboxIndex][currentLang]?.title || 'Enlarged photo'}
              className="max-h-[75vh] w-auto object-contain rounded-2xl shadow-2xl border border-white/10"
            />
            <div className="mt-4 text-center text-white space-y-1">
              <h3 className="text-base sm:text-lg font-bold">
                {galleryItems[lightboxIndex][currentLang]?.title || galleryItems[lightboxIndex].en?.title}
              </h3>
              <p className="text-xs text-slate-400">
                {galleryItems[lightboxIndex][currentLang]?.location || localData.name} — {lightboxIndex + 1} / {galleryItems.length}
              </p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
