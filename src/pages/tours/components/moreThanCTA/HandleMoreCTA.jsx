import MoreCTA from "./MoreCTA";
import { useLangStore } from "../../../../store/useLangStore";
import { Hotel, Bus, UserRoundCheck, Headset, FileCheck2 } from "lucide-react";

const HandleMoreCTA = () => {
  const { currentLang, translations } = useLangStore();
  const isRTL = currentLang === "fa";
  const moreCTA = translations?.tourPage?.moreCTA || {};

  const data = [
    {
      id: 1,
      icon: <Hotel size={25} />,
      title: moreCTA.accommodation?.title || (isRTL ? "اقامت" : "Accommodation"),
      description: moreCTA.accommodation?.description || (isRTL ? "اقامتگاه‌های منتخب برای سفر شما." : "Selected stays for your journey."),
    },
    {
      id: 2,
      icon: <Bus size={25} />,
      title: moreCTA.transportation?.title || (isRTL ? "حمل‌ونقل" : "Transportation"),
      description: moreCTA.transportation?.description || (isRTL ? "هماهنگی رفت‌وآمد میان مقصدهای مختلف." : "Coordinated travel between destinations."),
    },
    {
      id: 3,
      icon: <UserRoundCheck size={25} />,
      title: moreCTA.professional?.title || (isRTL ? "راهنمایان حرفه‌ای" : "Professional Guides"),
      description: moreCTA.professional?.description || (isRTL ? "راهنمایی محلی و آشنایی با فرهنگ و جاذبه‌های منطقه." : "Local guidance and cultural insight."),
    },
    {
      id: 4,
      icon: <Headset size={25} />,
      title: moreCTA.travel?.title || (isRTL ? "پشتیبانی سفر" : "Travel Support"),
      description: moreCTA.travel?.description || (isRTL ? "کمک و پشتیبانی عملی در طول سفر شما." : "Practical assistance throughout your journey."),
    },
    {
      id: 5,
      icon: <FileCheck2 size={25} />,
      title: moreCTA.visa?.title || (isRTL ? "کمک در امور ویزا" : "Visa Assistance"),
      description: moreCTA.visa?.description || (isRTL ? "راهنمایی برای آماده‌سازی مدارک و مراحل ویزا." : "Guidance with your visa preparation."),
    },
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      <div className="mb-8 sm:mb-12">
        <p className="text-[var(--color-amovi-gold)] text-xs sm:text-sm font-bold tracking-wider uppercase mb-2">
          {moreCTA.eyebrow || (isRTL ? "فراتر از یک سفر ساده" : "More Than a Tour")}
        </p>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[var(--color-amovi-navy)] leading-tight">
          {moreCTA.title || (isRTL ? "خدماتی فراتر از یک سفر ساده" : "More Than a Tour")}
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
