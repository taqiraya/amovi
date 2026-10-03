import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ChevronRight, 
  ChevronLeft,
  Clock, 
  Ticket, 
  Shirt, 
  Sun, 
  MapPin, 
  Info, 
  Star, 
  ArrowRight, 
  ArrowLeft,
  Building2,
  TreePine,
  Eye,
  BookOpen
} from 'lucide-react';
import { useLangStore } from '../../store/useLangStore';
import { getPlaceBySlug, getProvinceBySlug } from '../../services/api';
import SEO from '../../components/SEO';

export default function PlaceDetail() {
  const { slug, placeId } = useParams();
  const { currentLang, translations } = useLangStore();
  const isRtl = currentLang === 'fa';
  const t = translations?.placeDetailPage || {};
  const tDest = translations?.destinationsPage || {};

  const [province, setProvince] = useState(null);
  const [place, setPlace] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    Promise.all([
      getProvinceBySlug(slug),
      getPlaceBySlug(slug, placeId)
    ]).then(([provData, placeData]) => {
      if (isMounted) {
        setProvince(provData || null);
        setPlace(placeData || null);
        setLoading(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [slug, placeId]);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center pt-32">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-[#FCA311] border-t-transparent rounded-full animate-spin" />
          <div className="text-base font-bold text-slate-500 font-[Inter]">
            {isRtl ? 'در حال بارگذاری جزئیات جاذبه...' : 'Loading Attraction Details...'}
          </div>
        </div>
      </div>
    );
  }

  if (!province || !place) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-4 pt-36">
        <h2 className="text-2xl font-bold text-[#14213D] mb-4">
          {isRtl ? 'جاذبه گردشگری مورد نظر پیدا نشد' : 'Attraction Not Found'}
        </h2>
        <Link 
          to={`/destinations/${slug}`} 
          className="bg-[#FCA311] hover:bg-amber-500 text-[#14213D] font-bold py-2.5 px-6 rounded-full shadow-md transition-colors"
        >
          {isRtl ? `بازگشت به دیدنی‌های ${province?.fa?.name || province?.en?.name || 'ولایت'}` : `Back to ${province?.en?.name || 'Province'}`}
        </Link>
      </div>
    );
  }

  const provData = province[currentLang] || province.en || {};
  const placeData = place[currentLang] || place.en || {};
  const gallery = place.gallery || [place.image, province.images?.hero_cover, province.images?.culture_img].filter(Boolean);
  const quickFacts = placeData.quickFacts || place.en?.quickFacts || {};
  const thingsToDo = placeData.thingsToDo || place.en?.thingsToDo || [];

  const activityIcons = [
    <Building2 key="bld" size={18} className="text-[#FCA311]" />,
    <TreePine key="tree" size={18} className="text-[#FCA311]" />,
    <Eye key="eye" size={18} className="text-[#FCA311]" />,
    <BookOpen key="book" size={18} className="text-[#FCA311]" />
  ];

  const mapLat = quickFacts.coordinates?.lat || 34.5028;
  const mapLng = quickFacts.coordinates?.lng || 69.1594;
  const bboxPadding = 0.015;
  const mapBbox = `${mapLng - bboxPadding},${mapLat - bboxPadding},${mapLng + bboxPadding},${mapLat + bboxPadding}`;

  const attractionSchema = {
    "@context": "https://schema.org",
    "@type": "TouristAttraction",
    "name": placeData.name,
    "description": placeData.lead || placeData.overview || placeData.teaser,
    "image": gallery[0] || place.image,
    "touristType": ["Historical Tourism", "Sightseeing", "Cultural Heritage"],
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": mapLat,
      "longitude": mapLng
    },
    "containedInPlace": {
      "@type": "City",
      "name": provData.name
    }
  };

  return (
    <div className={`w-full bg-[#F8FAFC] pt-28 sm:pt-36 pb-16 sm:pb-24 ${isRtl ? 'font-[Sahel]' : 'font-[Inter]'}`}>
      <SEO 
        title={`${placeData.name} — ${provData.name}`}
        description={placeData.lead || placeData.overview || placeData.teaser}
        ogImage={gallery[0] || place.image}
        keywords={`${placeData.name}, ${provData.name}, Afghanistan tourism, things to do in ${provData.name}, visit ${placeData.name}`}
        schema={attractionSchema}
      />
      
      {/* ========================================================
          ۱. نوار آدرس و مسیر پیمایش (Breadcrumb Navigation)
      ======================================================== */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-4 sm:mb-6">
        <nav className="flex items-center flex-wrap gap-1.5 sm:gap-2 text-xs sm:text-sm text-slate-500 font-medium" dir={isRtl ? 'rtl' : 'ltr'}>
          <Link to="/destinations" className="hover:text-[#FCA311] transition-colors">
            {tDest.breadcrumbDestinations || (isRtl ? 'مقاصد' : 'Destinations')}
          </Link>

          {isRtl ? <ChevronLeft size={13} className="text-slate-400" /> : <ChevronRight size={13} className="text-slate-400" />}

          <Link to={`/destinations/${slug}`} className="hover:text-[#FCA311] transition-colors">
            {provData.name}
          </Link>

          {isRtl ? <ChevronLeft size={13} className="text-slate-400" /> : <ChevronRight size={13} className="text-slate-400" />}

          <span className="text-slate-400">
            {isRtl ? (place.categoryNameFa || place.categoryNameEn) : (place.categoryNameEn || 'Gardens & Parks')}
          </span>

          {isRtl ? <ChevronLeft size={13} className="text-slate-400" /> : <ChevronRight size={13} className="text-slate-400" />}

          <span className="text-[#14213D] font-bold">
            {placeData.name}
          </span>
        </nav>
      </div>

      {/* ========================================================
          ۲. گالری تصاویر بالای صفحه (Top Photo Gallery - 1 Large + 2 Stacked)
      ======================================================== */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 sm:mb-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-4 h-auto lg:h-[480px]">
          {/* عکس اصلی بزرگ چپ */}
          <div className="lg:col-span-8 rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl border-2 sm:border-4 border-white bg-slate-200 aspect-[16/10] lg:aspect-auto lg:h-full group">
            <img
              src={gallery[0] || place.image}
              alt={placeData.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 select-none"
              onError={(e) => {
                if (!e.target.dataset.tried) {
                  e.target.dataset.tried = 'true';
                  e.target.src = '/images/provinces/kabul/kabul-hero.webp';
                }
              }}
            />
          </div>

          {/* دو عکس استک‌شده در ستون راست */}
          <div className="lg:col-span-4 grid grid-cols-2 lg:grid-cols-1 gap-3 sm:gap-4 lg:h-full">
            <div className="rounded-xl sm:rounded-2xl lg:rounded-3xl overflow-hidden shadow-lg border-2 sm:border-4 border-white bg-slate-200 aspect-[16/10] lg:aspect-auto lg:h-[calc(50%-8px)] group">
              <img
                src={gallery[1] || gallery[0] || place.image}
                alt={`${placeData.name} gallery 1`}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 select-none"
                onError={(e) => {
                  if (!e.target.dataset.tried) {
                    e.target.dataset.tried = 'true';
                    e.target.src = '/images/provinces/kabul/kabul-culture.webp';
                  }
                }}
              />
            </div>
            <div className="rounded-xl sm:rounded-2xl lg:rounded-3xl overflow-hidden shadow-lg border-2 sm:border-4 border-white bg-slate-200 aspect-[16/10] lg:aspect-auto lg:h-[calc(50%-8px)] group">
              <img
                src={gallery[2] || gallery[0] || place.image}
                alt={`${placeData.name} gallery 2`}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 select-none"
                onError={(e) => {
                  if (!e.target.dataset.tried) {
                    e.target.dataset.tried = 'true';
                    e.target.src = '/images/provinces/bamyan/bamyan-hero.webp';
                  }
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================
          ۳. ساختار دو ستونه: محتوای تشریحی (چپ) + کارت اطلاعات کلیدی (راست)
      ======================================================== */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start" dir={isRtl ? 'rtl' : 'ltr'}>
          
          {/* ستون اصلی محتوا (۸ ستون در دسکتاپ) */}
          <div className={`lg:col-span-8 space-y-8 sm:space-y-10 ${isRtl ? 'text-right' : 'text-left'}`}>
            
            {/* عنوان، زیرعنوان و تگ دسته‌بندی */}
            <div className="space-y-2.5 sm:space-y-3">
              <div className="flex items-center gap-2">
                <span className="w-6 h-0.5 bg-[#FCA311] inline-block" />
                <span className="text-[#FCA311] text-xs font-bold uppercase tracking-widest font-[Inter]">
                  {isRtl ? (place.categoryNameFa || place.categoryNameEn) : (place.categoryNameEn || 'GARDENS & PARKS')}
                </span>
              </div>

              <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-[#14213D] tracking-tight">
                {placeData.name}
              </h1>

              {placeData.subtitle && (
                <p className="text-sm sm:text-base md:text-lg font-semibold text-slate-700">
                  {placeData.subtitle}
                </p>
              )}

              <p className="text-slate-600 text-xs sm:text-sm md:text-base leading-relaxed pt-1 sm:pt-2 font-normal">
                {placeData.lead || placeData.teaser}
              </p>
            </div>

            {/* بخش ۱: نمای کلی (GENERAL OVERVIEW) */}
            {placeData.overview && (
              <div className="space-y-3 border-t border-slate-200/80 pt-6 sm:pt-8">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-0.5 bg-[#FCA311] inline-block" />
                  <h3 className="text-xs sm:text-sm font-bold uppercase tracking-widest text-[#FCA311] font-[Inter]">
                    {t.generalOverview || (isRtl ? 'نمای کلی و معرفی' : 'GENERAL OVERVIEW')}
                  </h3>
                </div>
                <p className="text-slate-600 text-xs sm:text-sm md:text-base leading-relaxed">
                  {placeData.overview}
                </p>
              </div>
            )}

            {/* بخش ۲: پیشینه و اهمیت تاریخی (HISTORICAL CONTEXT & SIGNIFICANCE) */}
            {placeData.historicalContext && (
              <div className="space-y-3 border-t border-slate-200/80 pt-6 sm:pt-8">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-0.5 bg-[#FCA311] inline-block" />
                  <h3 className="text-xs sm:text-sm font-bold uppercase tracking-widest text-[#FCA311] font-[Inter]">
                    {t.historicalContext || (isRtl ? 'پیشینه و اهمیت تاریخی' : 'HISTORICAL CONTEXT & SIGNIFICANCE')}
                  </h3>
                </div>
                <p className="text-slate-600 text-xs sm:text-sm md:text-base leading-relaxed">
                  {placeData.historicalContext}
                </p>
              </div>
            )}

            {/* بخش ۳: فعالیت‌ها و تجربیات (THINGS TO DO) */}
            {thingsToDo.length > 0 && (
              <div className="space-y-4 border-t border-slate-200/80 pt-6 sm:pt-8">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-5 h-0.5 bg-[#FCA311] inline-block" />
                  <h3 className="text-xs sm:text-sm font-bold uppercase tracking-widest text-[#FCA311] font-[Inter]">
                    {t.thingsToDo || (isRtl ? 'فعالیت‌ها و تجربیات برتر' : 'THINGS TO DO')}
                  </h3>
                </div>

                <div className="space-y-3 sm:space-y-3.5">
                  {thingsToDo.map((item, idx) => (
                    <div 
                      key={idx}
                      className="p-3.5 sm:p-4 rounded-2xl bg-white border border-slate-200/80 shadow-sm flex items-start gap-3 sm:gap-4 hover:border-[#FCA311]/60 transition-colors"
                    >
                      <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-amber-500/10 flex items-center justify-center shrink-0">
                        {activityIcons[idx % activityIcons.length]}
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-xs sm:text-sm font-bold text-[#14213D]">
                          {item.title}
                        </h4>
                        <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* بخش ۴: چرا باید بازدید کرد؟ (WHY VISIT Callout) */}
            <div className="p-5 sm:p-7 md:p-8 rounded-2xl sm:rounded-3xl bg-amber-500/5 border border-amber-500/25 relative overflow-hidden space-y-2.5 sm:space-y-3">
              <div className="flex items-center gap-2 text-[#FCA311]">
                <Star size={17} className="fill-[#FCA311]" />
                <span className="text-xs font-bold uppercase tracking-widest font-[Inter]">
                  {t.whyVisit || (isRtl ? 'چرا باید بازدید کرد؟' : 'WHY VISIT')}
                </span>
              </div>

              <blockquote className="text-base sm:text-lg md:text-xl font-bold text-[#14213D] italic leading-snug">
                {placeData.quote || (isRtl ? `«${placeData.name} فراتر از یک مکان است؛ جایی که تاریخ در آن زنده می‌شود.»` : `"${placeData.name} is more than a destination — it's a place where history comes to life."`)}
              </blockquote>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-light">
                {placeData.quoteAuthor || (isRtl ? 'مقصدی ضروری و به‌یادماندنی برای تمام شیفتگان اصالت، تاریخ و زیبایی‌های طبیعی افغانستان.' : 'A must-visit destination for anyone who wants to experience the natural beauty, rich history and peaceful atmosphere.')}
              </p>
            </div>

          </div>

          {/* ستون راست: کارت اطلاعات کلیدی (استیکی در دسکتاپ، مرتب در تبلت و موبایل) */}
          <div className="lg:col-span-4 lg:sticky lg:top-28 space-y-6 w-full">
            <div className="bg-[#14213D] text-white rounded-2xl sm:rounded-3xl p-5 sm:p-7 shadow-2xl border border-white/10 space-y-5 sm:space-y-6">
              
              {/* هدر کارت اطلاعات کلیدی */}
              <div className="flex items-center gap-2.5 pb-3.5 sm:pb-4 border-b border-white/15">
                <div className="w-8 h-8 rounded-full bg-[#FCA311]/20 text-[#FCA311] flex items-center justify-center">
                  <Info size={18} />
                </div>
                <h3 className="text-base sm:text-lg font-bold text-white tracking-wide">
                  {t.quickFacts || (isRtl ? 'اطلاعات کلیدی' : 'Quick Facts')}
                </h3>
              </div>

              {/* ردیف ۱: ساعات بازدید */}
              <div className="flex items-start gap-3">
                <Clock size={17} className="text-[#FCA311] shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <div className="text-xs font-semibold text-slate-300">
                    {t.openingHours || (isRtl ? 'ساعات بازدید' : 'Opening Hours')}
                  </div>
                  <div className="text-xs sm:text-sm font-medium text-white">
                    {quickFacts.openingHours || (isRtl ? '۸:۰۰ صبح تا ۶:۰۰ بعد از ظهر (همه‌روزه)' : '8:00 AM – 6:00 PM (Daily)')}
                  </div>
                </div>
              </div>

              {/* ردیف ۲: بهای بلیت / ورودی */}
              <div className="flex items-start gap-3 pt-3 border-t border-white/10">
                <Ticket size={17} className="text-[#FCA311] shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <div className="text-xs font-semibold text-slate-300">
                    {t.entryTickets || (isRtl ? 'بهای بلیت و ورودی' : 'Entry Tickets / Fees')}
                  </div>
                  <div className="text-xs sm:text-sm font-medium text-white">
                    {quickFacts.tickets || (isRtl ? '۵۰ افغانی (داخلی) / ۲۰۰ افغانی (بین‌المللی)' : 'AFN 50 (Local) / AFN 200 (International)')}
                  </div>
                </div>
              </div>

              {/* ردیف ۳: پوشش و توصیه‌ها */}
              <div className="flex items-start gap-3 pt-3 border-t border-white/10">
                <Shirt size={17} className="text-[#FCA311] shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <div className="text-xs font-semibold text-slate-300">
                    {t.dressCode || (isRtl ? 'نکات و پوشش مناسب' : 'Dress Code / Guidelines')}
                  </div>
                  <div className="text-xs sm:text-sm font-medium text-white">
                    {quickFacts.dressCode || (isRtl ? 'پوشش آراسته و کفش راحتی پیاده‌روی.' : 'Modest dress is recommended. Comfortable walking shoes.')}
                  </div>
                </div>
              </div>

              {/* ردیف ۴: بهترین زمان بازدید */}
              <div className="flex items-start gap-3 pt-3 border-t border-white/10">
                <Sun size={17} className="text-[#FCA311] shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <div className="text-xs font-semibold text-slate-300">
                    {t.bestTimeToVisit || (isRtl ? 'بهترین زمان بازدید' : 'Best Time to Visit')}
                  </div>
                  <div className="text-xs sm:text-sm font-medium text-white">
                    {quickFacts.bestTime || (isRtl ? 'بهار (حمل تا ثور) و پاییز (سنبله تا عقرب)' : 'Spring (March – May) and Autumn (Sep – Nov)')}
                  </div>
                </div>
              </div>

              {/* ردیف ۵: موقعیت مکانی */}
              <div className="flex items-start gap-3 pt-3 border-t border-white/10">
                <MapPin size={17} className="text-[#FCA311] shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <div className="text-xs font-semibold text-slate-300">
                    {t.location || (isRtl ? 'موقعیت جغرافیایی' : 'Location')}
                  </div>
                  <div className="text-xs sm:text-sm font-medium text-white">
                    {quickFacts.location || `${placeData.name}, ${provData.name}, Afghanistan`}
                  </div>
                </div>
              </div>

              {/* نقشه تعاملی مینیاتوری از موقعیت دقیق جاذبه */}
              <div className="pt-2">
                <div className="rounded-xl sm:rounded-2xl overflow-hidden border border-white/15 h-40 sm:h-44 w-full relative bg-slate-800 shadow-inner">
                  <iframe
                    title={`${placeData.name} Location Map`}
                    src={`https://www.openstreetmap.org/export/embed.html?bbox=${mapBbox}&layer=mapnik&marker=${mapLat},${mapLng}`}
                    className="w-full h-full border-0 filter contrast-[1.05] brightness-[0.95]"
                    loading="lazy"
                  />
                  <div className={`absolute bottom-2 ${isRtl ? 'left-2' : 'right-2'} bg-[#14213D]/90 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] text-[#FCA311] font-semibold border border-white/20`}>
                    {placeData.name}
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>

      {/* ========================================================
          ۴. بنر پایانی دعوت به رزرو و سفر (Ready to Explore Bottom Banner)
      ======================================================== */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 sm:mt-20">
        <div className="rounded-2xl sm:rounded-3xl bg-[#14213D] text-white p-6 sm:p-10 lg:p-12 shadow-2xl relative overflow-hidden">
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6" dir={isRtl ? 'rtl' : 'ltr'}>
            <div className={`space-y-2 max-w-xl ${isRtl ? 'text-right' : 'text-left'}`}>
              <h3 className="text-xl sm:text-2xl font-extrabold text-white">
                {t.readyToExplore || (isRtl ? 'آماده سفر به این مقصد شگفت‌انگیز هستید؟' : 'Ready to explore this destination?')}
              </h3>
              <p className="text-slate-300 text-xs sm:text-sm font-light">
                {t.amoviHandle || (isRtl ? 'برنامه‌ریزی، ترانسفر و راهنمایی سفر خود را با اطمینان به آمووی بسپارید.' : 'Let Amovi handle your itinerary safely and elegantly.')}
              </p>
            </div>

            <div className="shrink-0 w-full md:w-auto">
              <Link
                to="/services"
                className="inline-flex items-center justify-center gap-2 bg-[#FCA311] hover:bg-amber-500 text-[#14213D] font-bold py-3.5 px-8 rounded-full shadow-lg transition-all duration-200 text-xs sm:text-sm uppercase font-[Inter] tracking-wider cursor-pointer w-full md:w-auto"
              >
                <span>{t.inquireTrip || (isRtl ? 'استعلام و رزرو این سفر' : 'Inquire / Book This Trip')}</span>
                {isRtl ? <ArrowLeft size={16} /> : <ArrowRight size={16} />}
              </Link>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
