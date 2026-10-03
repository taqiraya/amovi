import imageTwo from "./images/imageTwo.webp";
import { useLangStore } from "../../../store/useLangStore";
const DiscoverSection = () => {
  const { translations } = useLangStore();
  const discover = translations.tourPage.discoverSection;
  return (
    <section
      className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center"
    >
      <div className="lg:order-2 space-y-3">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#14213D] leading-tight">
          {discover.title}
        </h2>
        <p className="text-xs sm:text-sm md:text-base text-slate-600 leading-relaxed font-normal">
          {discover.description}
        </p>
      </div>
      <div className="lg:order-1 max-w-xl mx-auto lg:max-w-none w-full">
        <img
          className="rounded-2xl sm:rounded-3xl aspect-[16/10] w-full object-cover shadow-xl border-2 sm:border-4 border-white bg-slate-100"
          src={imageTwo}
          alt={discover.title}
          loading="lazy"
          onError={(e) => {
            if (!e.target.dataset.tried) {
              e.target.dataset.tried = 'true';
              e.target.src = '/tours/images/bamyanPictures.webp';
            }
          }}
        />
      </div>
    </section>
  );
};

export default DiscoverSection;
