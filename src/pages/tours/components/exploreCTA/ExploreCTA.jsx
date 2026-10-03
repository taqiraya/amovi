import { Link } from "react-router-dom";
import { Bed, Car, User, ArrowRight, ArrowLeft } from "lucide-react";
import { useLangStore } from "../../../../store/useLangStore";

const ExploreCTA = ({ image, title, price, durationDay, durationNight }) => {
  const { currentLang, translations } = useLangStore();

  const isRTL = currentLang === "fa";
  const cta = translations.tourPage.exploreCTA;

  return (
    <section className="relative shadow rounded-lg  h-[300px] flex flex-col itmes-center justify-between w-full max-w-[325px]">
      {/* ====================Position on Image=================== */}
      <div className="absolute top-3 left-5 bg-[var(--color-amovi-navy)] text-[var(--color-amovi-gray-light)] px-3 py-1 rounded-full text-sm ">
        <p>
          {durationDay} {cta.days} / {durationNight} {cta.nights}
        </p>
      </div>
      <img 
        className="h-[150px] w-full object-cover rounded-t-lg bg-slate-100 select-none" 
        src={image || "/tours/images/kabulPictures.webp"} 
        alt={title || "Tour package"} 
        loading="lazy"
        onError={(e) => {
          if (!e.target.dataset.tried) {
            e.target.dataset.tried = 'true';
            e.target.src = '/tours/images/kabulPictures.webp';
          }
        }}
      />
      <h3 className="text-xl font-semibold ps-2 min-[350px]:ps-5 p-1 ">
        {title}
      </h3>
      {/* ===================Icon Container====================== */}
      <div className="px-2 min-[350px]:px-5 flex justify-between items-center pb-3">
        <div className="flex items-center gap-1">
          <Bed className="text-[var(--color-amovi-gold)]" size={18} />
          <p className="text-xs  ">{cta.bedroom}</p>
        </div>
        <div className="flex items-center gap-1">
          <Car className="text-[var(--color-amovi-gold)]" size={18} />
          <p className="text-xs  ">{cta.transport}</p>
        </div>
        <div className="flex items-center gap-1">
          <User className="text-[var(--color-amovi-gold)]" size={18} />
          <p className="text-xs ">{cta.people}</p>
        </div>
      </div>
      {/* =====================Price Container================== */}
      <div className="flex justify-between items-center px-2 min-[350px]:px-5 pb-2">
        <h3 className="text-xl font-semibold text-[var(--color-amovi-gold)] ">
          {price}
        </h3>
        <Link 
          to={`/contact?subject=${encodeURIComponent(title ? `Tour Booking: ${title}` : 'Tour Inquiry')}`}
          className="flex cursor-pointer gap-2 items-center rounded-full bg-[var(--color-amovi-gold)] px-3 py-1.5 text-xs sm:text-sm font-bold text-[var(--color-amovi-navy)] group hover:bg-[#e08f0a] transition-all duration-300 shadow-sm"
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
    </section>
  );
};

export default ExploreCTA;
