import TravelCTA from "./TravelCTA";
import { useLangStore } from "../../../../store/useLangStore";
import { Plane, Map, Mountain, Settings2, Crown, Landmark } from "lucide-react";

const HandelTravelCTA = ({ content }) => {
  const { currentLang, translations } = useLangStore();
  const isRTL = currentLang === "fa";
  const cta = translations?.tourPage?.travelCTA || {};

  const defaultItems = [
    {
      id: 1,
      icon: <Plane size={22} />,
      title: cta.plane?.title || (isRTL ? "تجربه‌های مقصد" : "Destination Experiences"),
      description: cta.plane?.description || (isRTL ? "مقصدهای مختلف را با سفرهایی که با دقت طراحی شده‌اند، کشف کنید." : "Discover individual destinations through carefully designed journeys."),
    },
    {
      id: 2,
      icon: <Map size={22} />,
      title: cta.map?.title || (isRTL ? "سفرهای چندمقصدی" : "Multi-Destination Journeys"),
      description: cta.map?.description || (isRTL ? "چندین مقصد را در قالب یک سفر یکپارچه در سراسر افغانستان تجربه کنید." : "Connect multiple destinations in one seamless journey across Afghanistan."),
    },
    {
      id: 3,
      icon: <Landmark size={22} />,
      title: cta.landmark?.title || (isRTL ? "فرهنگ و میراث" : "Cultural & Heritage"),
      description: cta.landmark?.description || (isRTL ? "تاریخ، فرهنگ، سنت‌ها و میراث افغانستان را کشف کنید." : "Explore Afghanistan's history, culture, traditions, and heritage."),
    },
    {
      id: 4,
      icon: <Mountain size={22} />,
      title: cta.mountain?.title || (isRTL ? "طبیعت و ماجراجویی" : "Nature & Adventure"),
      description: cta.mountain?.description || (isRTL ? "کوه‌ها، دره‌ها، دریاچه‌ها، مناظر طبیعی و فعالیت‌های فضای باز را تجربه کنید." : "Experience mountains, valleys, lakes, landscapes, and outdoor activities."),
    },
    {
      id: 5,
      icon: <Crown size={22} />,
      title: cta.crown?.title || (isRTL ? "سفرهای ویژه و VIP" : "Premium & VIP"),
      description: cta.crown?.description || (isRTL ? "با آسایش بیشتر، برنامه‌ریزی شخصی‌سازی‌شده و پشتیبانی اختصاصی سفر کنید." : "Travel with enhanced comfort, personalized arrangements, and dedicated support."),
    },
    {
      id: 6,
      icon: <Settings2 size={22} />,
      title: cta.setting?.title || (isRTL ? "سفرهای سفارشی" : "Customized Journeys"),
      description: cta.setting?.description || (isRTL ? "سفری متناسب با علایق، زمان‌بندی و ترجیحات سفر خود ایجاد کنید." : "Create a journey tailored to your interests, schedule, and travel preferences."),
    },
  ];

  const icons = [
    <Plane size={22} key="1" />,
    <Map size={22} key="2" />,
    <Landmark size={22} key="3" />,
    <Mountain size={22} key="4" />,
    <Crown size={22} key="5" />,
    <Settings2 size={22} key="6" />
  ];

  let displayItems = defaultItems;
  if (content && Array.isArray(content.travel_items) && content.travel_items.length > 0) {
    displayItems = content.travel_items.map((item, idx) => ({
      id: idx + 1,
      icon: icons[idx % icons.length],
      title: isRTL ? (item.title_fa || item.title) : (item.title_en || item.title),
      description: isRTL ? (item.description_fa || item.description) : (item.description_en || item.description)
    }));
  }

  const eyebrow = (isRTL ? content?.travel_eyebrow_fa : content?.travel_eyebrow_en) || cta.eyebrow || (isRTL ? "موضوعات سفر" : "Travel Themes");
  const title = (isRTL ? content?.travel_title_fa : content?.travel_title_en) || cta.title || (isRTL ? "تجربه سفر خود را انتخاب کنید" : "Choose Your Travel Experience");

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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 text-[var(--color-amovi-navy)]">
        {displayItems.map((item) => (
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
