import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLangStore } from '../../store/useLangStore';
import { getProvinces } from '../../services/api';
import SEO from '../../components/SEO';
import { MapPin, ArrowRight, ArrowLeft } from 'lucide-react';

export default function Destinations() {
  const { currentLang } = useLangStore();
  const isRtl = currentLang === 'fa';

  const [provinces, setProvinces] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    getProvinces().then((data) => {
      if (isMounted) {
        setProvinces(data || []);
        setLoading(false);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className={`pt-32 pb-24 px-6 max-w-7xl mx-auto ${isRtl ? 'text-right font-[Sahel]' : 'text-left font-[Inter]'}`}>
      <SEO 
        title={isRtl ? 'مقاصد رویایی در سراسر افغانستان | آمووی ترول' : 'Iconic Destinations Across Afghanistan | Amovi Travel'}
        description={isRtl 
          ? 'از پایتخت کهن کابل تا دره‌های زمردین بامیان، شکوه تاریخی هرات، بلخ، کندهار، غزنی، سمنگان، غور، هلمند و نورستان با آمووی ترول.' 
          : 'Explore iconic destinations across Afghanistan: Kabul, Bamyan, Herat, Balkh, Kandahar, Ghazni, Samangan, Ghor, Helmand, and Nuristan with Amovi Travel.'}
        keywords="Afghanistan destinations, Kabul, Bamyan, Herat, Balkh, Kandahar, Ghazni, Samangan, Ghor, Helmand, Nuristan, visit Afghanistan, Amovi Travel"
        canonicalUrl="https://amovi.travel/destinations"
      />

      <div className="text-center max-w-3xl mx-auto mb-14">
        <span className="text-[#FCA311] font-bold text-xs uppercase tracking-widest block mb-2 font-[Inter]">
          {isRtl ? 'کشف ولایات و مقاصد گردشگری' : 'EXPLORE PROVINCES & DESTINATIONS'}
        </span>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#14213D] mb-4">
          {isRtl ? 'مقاصد رویایی در سراسر افغانستان' : 'Iconic Destinations Across Afghanistan'}
        </h1>
        <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
          {isRtl
            ? 'سفر به زیباترین ولایات و شاهکارهای تمدنی افغانستان؛ از پایتخت تاریخی تا کوهساران سرسبز و آبدات باستانی ثبت‌شده.'
            : 'From the historic capital of Kabul to the emerald valleys of Bamyan, minarets of Herat, and sacred shrines of Balkh.'}
        </p>
      </div>

      {loading ? (
        <div className="min-h-[40vh] flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-[#FCA311] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" dir={isRtl ? 'rtl' : 'ltr'}>
          {provinces.map((prov) => {
            const name = isRtl ? (prov.fa?.name || prov.nameFa || prov.slug) : (prov.en?.name || prov.nameEn || prov.slug);
            const tagline = isRtl ? (prov.fa?.tagline || prov.descFa || prov.fa?.intro) : (prov.en?.tagline || prov.descEn || prov.en?.intro);
            const coverImage = prov.images?.hero_cover || prov.image || '/images/provinces/kabul/kabul-hero.webp';
            const placesCount = prov.sub_destinations?.length || 0;

            return (
              <Link
                key={prov.slug || prov.id}
                to={`/destinations/${prov.slug}`}
                className="group relative overflow-hidden rounded-3xl bg-white border border-slate-200/80 shadow-sm hover:shadow-2xl transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between"
              >
                <div className="h-56 w-full overflow-hidden relative bg-slate-100">
                  <img
                    src={coverImage}
                    alt={name}
                    className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 select-none"
                    loading="lazy"
                    onError={(e) => {
                      if (!e.target.dataset.tried) {
                        e.target.dataset.tried = 'true';
                        e.target.src = '/images/provinces/kabul/kabul-hero.webp';
                      }
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#14213D]/85 via-black/20 to-transparent" />
                  
                  {placesCount > 0 && (
                    <div className={`absolute top-3 ${isRtl ? 'left-3' : 'right-3'}`}>
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-md text-[#14213D] text-[11px] font-bold shadow-md">
                        <MapPin size={11} className="text-[#FCA311]" />
                        <span>{isRtl ? `${placesCount} جاذبه` : `${placesCount} Places`}</span>
                      </span>
                    </div>
                  )}

                  <h2 className={`absolute bottom-3 ${isRtl ? 'right-4 left-4' : 'left-4 right-4'} text-white text-xl font-black drop-shadow`}>
                    {name}
                  </h2>
                </div>

                <div className="p-5 flex flex-col justify-between flex-grow">
                  <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-4 line-clamp-3 font-normal">
                    {tagline}
                  </p>
                  
                  <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-[#FCA311] group-hover:text-amber-600 font-bold text-xs">
                    <span>{isRtl ? 'مشاهده دیدنی‌ها و جزئیات' : 'Explore Attractions'}</span>
                    {isRtl ? (
                      <ArrowLeft size={15} className="group-hover:-translate-x-1 transition-transform" />
                    ) : (
                      <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
                    )}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
