import WorkCTA from "./WorkCTA";
import { PackageOpen, Send, BadgeCheck, PlaneTakeoff } from "lucide-react";
import { useLangStore } from "../../../../store/useLangStore";

const HandleWorkCTA = () => {
  const { translations } = useLangStore();
  const workCTA = translations.tourPage.workCTA;
  const data = [
    {
      id: 1,
      icon: <PackageOpen size={22} />,
      number: workCTA.package.number,
      title: workCTA.package.title,
      description: workCTA.package.description,
    },
    {
      id: 2,
      icon: <Send size={22} />,
      number: workCTA.request.number,
      title: workCTA.request.title,
      description: workCTA.request.description,
    },
    {
      id: 3,
      icon: <BadgeCheck size={22} />,
      number: workCTA.confirmJourney.number,
      title: workCTA.confirmJourney.title,
      description: workCTA.confirmJourney.description,
    },
    {
      id: 4,
      icon: <PlaneTakeoff size={22} />,
      number: workCTA.beginJourney.number,
      title: workCTA.beginJourney.title,
      description: workCTA.beginJourney.description,
    },
  ];
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 mb-8 sm:mb-16">
      <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12">
        <p className="text-[var(--color-amovi-gold)] text-xs sm:text-sm font-bold tracking-wider uppercase mb-2">
          {workCTA.eyebrow}
        </p>

        <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[var(--color-amovi-navy)] leading-tight">
          {workCTA.title}
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 text-[var(--color-amovi-navy)]">
        {data.map((item) => (
          <WorkCTA
            key={item.id}
            icon={item.icon}
            number={item.number}
            title={item.title}
            description={item.description}
          />
        ))}
      </div>
    </section>
  );
};

export default HandleWorkCTA;
