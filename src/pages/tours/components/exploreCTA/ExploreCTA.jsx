import { Link } from "react-router-dom";
import { Bed, Car, User, ArrowRight, ArrowLeft } from "lucide-react";
import { useLangStore } from "../../../../store/useLangStore";
import { getAssetUrl } from "../../../../config/assets";

const ExploreCTA = ({ image, title, price, durationDay, durationNight }) => {
  const { currentLang, translations } = useLangStore();

  const isRTL = currentLang === "fa";
  const cta = translations.tourPage.exploreCTA;

  return (
    <div className="group relative bg-white rounded-2xl border border-slate-200/80 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden w-full">
      {/* ====================Position on Image=================== */}
      <div className={`absolute top-3 ${isRTL ? 'right-3' : 'left-3'} z-10 bg-[var(--color-amovi-navy)]/90 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-medium shadow-md`}>
        <p>
          {durationDay} {cta.days} / {durationNight} {cta.nights}
        </p>
      </div>

      <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100 select-none">
        <img 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
          src={getAssetUrl(image || "/tours/images/kabulPictures.webp")} 
          alt={title || "Tour package"} 
          loading="lazy"
          onError={(e) => {
            if (!e.target.dataset.tried) {
              e.target.dataset.tried = 'true';
              e.target.src = getAssetUrl('/tours/images/kabulPictures.webp');
            }
          }}
        />
      </div>

      <div className="p-4 sm:p-5 flex flex-col flex-1 justify-between gap-3">
        <h3 className="text-base sm:text-lg font-bold text-[var(--color-amovi-navy)] line-clamp-1">
          {title}
        </h3>

        {/* ===================Icon Container====================== */}
        <div className="flex justify-between items-center py-2.5 border-y border-slate-100 text-slate-600 text-xs sm:text-sm">
          <div className="flex items-center gap-1.5">
            <Bed className="text-[var(--color-amovi-gold)] shrink-0" size={16} />
            <span>{cta.bedroom}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Car className="text-[var(--color-amovi-gold)] shrink-0" size={16} />
            <span>{cta.transport}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <User className="text-[var(--color-amovi-gold)] shrink-0" size={16} />
            <span>{cta.people}</span>
          </div>
        </div>

        {/* =====================Price Container================== */}
        <div className="flex justify-between items-center pt-1">
          <h3 className="text-lg sm:text-xl font-extrabold text-[var(--color-amovi-gold)]">
            {price}
          </h3>
          <Link 
            to={`/contact?subject=${encodeURIComponent(title ? `Tour Booking: ${title}` : 'Tour Inquiry')}`}
            className="inline-flex cursor-pointer gap-1.5 items-center rounded-full bg-[var(--color-amovi-gold)] px-3.5 py-1.5 text-xs sm:text-sm font-bold text-[var(--color-amovi-navy)] hover:bg-[#e08f0a] transition-all duration-300 shadow-sm active:scale-95"
          >
            <span>{cta.meetNow}</span>
            {isRTL ? (
              <ArrowLeft
                className="group-hover:-translate-x-1 transition-transform duration-300"
                size={14}
              />
            ) : (
              <ArrowRight
                className="group-hover:translate-x-1 transition-transform duration-300"
                size={14}
              />
            )}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ExploreCTA;
