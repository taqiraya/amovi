import MoreCTA from "./MoreCTA";
import { useLangStore } from "../../../../store/useLangStore";
import { Hotel, Bus, UserRoundCheck, Headset, FileCheck2 } from "lucide-react";

const HandleMoreCTA = () => {
  const { translations } = useLangStore();
  const moreCTA = translations.tourPage.moreCTA;

  const data = [
    {
      id: 1,
      icon: <Hotel size={25} />,
      title: moreCTA.accommodation.title,
      description: moreCTA.accommodation.description,
    },
    {
      id: 2,
      icon: <Bus size={25} />,
      title: moreCTA.transportation.title,
      description: moreCTA.transportation.description,
    },
    {
      id: 3,
      icon: <UserRoundCheck size={25} />,
      title: moreCTA.professional.title,
      description: moreCTA.professional.description,
    },
    {
      id: 4,
      icon: <Headset size={25} />,
      title: moreCTA.travel.title,
      description: moreCTA.travel.description,
    },
    {
      id: 5,
      icon: <FileCheck2 size={25} />,
      title: moreCTA.visa.title,
      description: moreCTA.visa.description,
    },
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      <div className="mb-8 sm:mb-12">
        <p className="text-[var(--color-amovi-gold)] text-xs sm:text-sm font-bold tracking-wider uppercase mb-2">
          {moreCTA.eyebrow}
        </p>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[var(--color-amovi-navy)] leading-tight">
          {moreCTA.title}
        </h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 sm:gap-5 text-[var(--color-amovi-navy)]">
        {data.map((item) => (
          <MoreCTA
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

export default HandleMoreCTA;
