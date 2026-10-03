import heroImage from "./images/imageFirst.webp";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { useLangStore } from "../../../store/useLangStore";

const TourHero = () => {
  const { currentLang, translations } = useLangStore();
  const hero = translations.tourPage.heroSection;
  const isRTL = currentLang === "fa";

  const handleExplore = () => {
    document.getElementById("explore-packages")?.scrollIntoView({
      behavior: "smooth",
    });
  };

  return (
    <div
      className="relative w-full min-h-[480px] sm:min-h-[540px] md:min-h-[580px] bg-cover bg-center bg-no-repeat flex items-center pt-28 sm:pt-32 pb-16 sm:pb-20"
      style={{ backgroundImage: `url(${heroImage})` }}
    >
      {/*============================== Gradient ====================================*/}
      <div
        className={`absolute inset-0 ${
          isRTL
            ? "bg-gradient-to-l from-[#14213D]/95 via-[#14213D]/80 to-transparent"
            : "bg-gradient-to-r from-[#14213D]/95 via-[#14213D]/80 to-transparent"
        }`}
      />

      {/*=============================== Content ====================================*/}
      <div
        className="relative z-10 w-full max-w-4xl px-4 sm:px-8 md:px-16 lg:px-20"
      >
        <p className="text-xs sm:text-sm font-bold text-[#FCA311] uppercase tracking-widest mb-1.5 sm:mb-2">{hero.label}</p>

        <h1 className="mb-2 sm:mb-3 text-3xl font-extrabold text-white sm:text-4xl md:text-5xl lg:text-6xl leading-tight">
          {hero.title}{" "}
          <span className="text-[#FCA311]">
            {hero.titleHighlight}
          </span>
        </h1>

        <p className="mb-5 sm:mb-6 text-sm text-slate-200 sm:text-base md:text-lg lg:text-xl font-light max-w-2xl leading-relaxed">
          {hero.subtitle}
        </p>

        <button
          type="button"
          onClick={handleExplore}
          className="inline-flex items-center justify-center cursor-pointer gap-2.5 rounded-full bg-[#FCA311] px-6 py-3.5 text-xs sm:text-sm font-extrabold text-[#14213D] group hover:bg-amber-500 transition-all duration-300 shadow-lg tracking-wider uppercase"
        >
          <span>{hero.button}</span>
          {isRTL ? (
            <ArrowLeft
              className="group-hover:-translate-x-1 transition-transform duration-300"
              size={16}
            />
          ) : (
            <ArrowRight
              className="group-hover:translate-x-1 transition-transform duration-300"
              size={16}
            />
          )}
        </button>
      </div>
    </div>
  );
};

export default TourHero;
