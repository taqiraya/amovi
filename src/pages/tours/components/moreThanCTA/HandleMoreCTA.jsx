import MoreCTA from "./MoreCTA";
import { useLangStore } from "../../../../store/useLangStore";
import { Hotel, Bus, UserRoundCheck, Headset, FileCheck2 } from "lucide-react";

const HandleMoreCTA = ({ content }) => {
  const { currentLang, translations } = useLangStore();
  const isRTL = currentLang === "fa";
  const moreCTA = translations?.tourPage?.moreCTA || {};

  const defaultItems = [
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

  const icons = [
    <Hotel size={25} key="1" />,
    <Bus size={25} key="2" />,
    <UserRoundCheck size={25} key="3" />,
    <Headset size={25} key="4" />,
    <FileCheck2 size={25} key="5" />
  ];

  let displayItems = defaultItems;
  if (content && Array.isArray(content.more_items) && content.more_items.length > 0) {
    displayItems = content.more_items.map((item, idx) => ({
      id: idx + 1,
      icon: icons[idx % icons.length],
      title: isRTL ? (item.title_fa || item.title) : (item.title_en || item.title),
      description: isRTL ? (item.description_fa || item.description) : (item.description_en || item.description)
    }));
  }

  const eyebrow = (isRTL ? content?.more_eyebrow_fa : content?.more_eyebrow_en) || moreCTA.eyebrow || (isRTL ? "فراتر از یک سفر ساده" : "More Than a Tour");
  const title = (isRTL ? content?.more_title_fa : content?.more_title_en) || moreCTA.title || (isRTL ? "خدماتی فراتر از یک سفر ساده" : "More Than a Tour");

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12">
        <p className="text-[var(--color-amovi-gold)] text-xs sm:text-sm font-bold tracking-wider uppercase mb-2">
          {eyebrow}
        </p>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[var(--color-amovi-navy)] leading-tight">
          {title}
        </h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 sm:gap-5 text-[var(--color-amovi-navy)]">
        {displayItems.map((item) => (
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
