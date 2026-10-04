import TravelCTA from "./TravelCTA";
import { useLangStore } from "../../../../store/useLangStore";
import { Plane, Map, Mountain, Settings2, Crown, Landmark } from "lucide-react";

const HandelTravelCTA = () => {
  const { currentLang, translations } = useLangStore();
  const isRTL = currentLang === "fa";
  const cta = translations?.tourPage?.travelCTA || {};

  const data = [
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

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12">
        <p className="text-[var(--color-amovi-gold)] text-xs sm:text-sm font-bold tracking-wider uppercase mb-2">
          {cta.eyebrow || (isRTL ? "موضوعات سفر" : "Travel Themes")}
        </p>

        <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[var(--color-amovi-navy)] leading-tight">
          {cta.title || (isRTL ? "تجربه سفر خود را انتخاب کنید" : "Choose Your Travel Experience")}
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
