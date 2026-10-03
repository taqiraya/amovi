import TravelCTA from "./TravelCTA";
import { useLangStore } from "../../../../store/useLangStore";
import { Plane, Map, Mountain, Settings2, Crown, Landmark } from "lucide-react";

const HandelTravelCTA = () => {
  const { translations } = useLangStore();
  const cta = translations.tourPage.travelCTA;

  const data = [
    {
      id: 1,
      icon: <Plane size={22} />,
      title: cta.plane.title,
      description: cta.plane.description,
    },
    {
      id: 2,
      icon: <Map size={22} />,
      title: cta.map.title,
      description: cta.map.description,
    },
    {
      id: 3,
      icon: <Landmark size={22} />,
      title: cta.landmark.title,
      description: cta.landmark.description,
    },
    {
      id: 4,
      icon: <Mountain size={22} />,
      title: cta.mountain.title,
      description: cta.mountain.description,
    },
    {
      id: 5,
      icon: <Crown size={22} />,
      title: cta.crown.title,
      description: cta.crown.description,
    },
    {
      id: 6,
      icon: <Settings2 size={22} />,
      title: cta.setting.title,
      description: cta.setting.description,
    },
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12">
        <p className="text-[var(--color-amovi-gold)] text-xs sm:text-sm font-bold tracking-wider uppercase mb-2">
          {cta.eyebrow}
        </p>

        <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[var(--color-amovi-navy)] leading-tight">
          {cta.title}
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 text-[var(--color-amovi-navy)]">
        {data.map((item) => (
          <TravelCTA
            key={item.id}
            icon={item.icon}
            title={item.title}
            description={item.description}
          />
        ))}
      </div>
    </section>
  );
};

export default HandelTravelCTA;
