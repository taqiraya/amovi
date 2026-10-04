import { ArrowLeft, ArrowRight } from "lucide-react";
import { useLangStore } from "../../../store/useLangStore";
const ExploreSection = () => {
  const { currentLang, translations } = useLangStore();
  const isRTL = currentLang === "fa";
  const explore = translations?.tourPage?.exploreSection || {
    label: isRTL ? "پکیج‌های سفر ما را کشف کنید" : "EXPLORE OUR PACKAGES",
    title: isRTL ? "پکیج‌های سفر ما را ببینید" : "Explore Our Packages",
    description: isRTL ? "سفرهایی را کشف کنید که بر اساس فرهنگ، تاریخ و مکان‌های دیدنی افغانستان طراحی شده‌اند." : "Discover journeys designed around Afghanistan's culture, history, and interesting places.",
    button: isRTL ? "مشاهده پکیج‌ها" : "Explore Package"
  };

  return (
    <section
      id="explore-packages"
      className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 scroll-mt-24"
    >
      <div className="text-center max-w-2xl mx-auto space-y-2.5 sm:space-y-3">
        <p className="text-xs sm:text-sm font-bold text-[#FCA311] uppercase tracking-widest font-[Inter]">
          {explore.label}
        </p>

        <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#14213D] tracking-tight">
          {explore.title}
        </h2>
        <p className="text-center text-xs sm:text-sm md:text-base text-slate-600 leading-relaxed font-normal">
          {explore.description}
        </p>
        <div className="pt-2">
          <button 
            type="button"
            onClick={() => {
              const el = document.getElementById("tours-package-grid");
              if (el) {
                el.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            className="inline-flex items-center justify-center cursor-pointer gap-2.5 rounded-full bg-[#FCA311] px-6 py-3 text-xs sm:text-sm font-bold text-[#14213D] hover:bg-amber-500 transition-all duration-300 shadow-md active:scale-95 uppercase font-[Inter] tracking-wider"
          >
            <span>{explore.button}</span>
            {isRTL ? (
              <ArrowLeft className="group-hover:-translate-x-1 transition-transform" size={16} />
            ) : (
              <ArrowRight className="group-hover:translate-x-1 transition-transform" size={16} />
            )}
          </button>
        </div>
      </div>
    </section>
  );
};

export default ExploreSection;
