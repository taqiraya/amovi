import WorkCTA from "./WorkCTA";
import { PackageOpen, Send, BadgeCheck, PlaneTakeoff } from "lucide-react";
import { useLangStore } from "../../../../store/useLangStore";

const HandleWorkCTA = ({ content }) => {
  const { currentLang, translations } = useLangStore();
  const isRTL = currentLang === "fa";
  const workCTA = translations?.tourPage?.workCTA || {};

  const defaultItems = [
    {
      id: 1,
      icon: <PackageOpen size={22} />,
      title: workCTA.package?.title || (isRTL ? "انتخاب پکیج" : "Choose Package"),
      description: workCTA.package?.description || (isRTL ? "پکیج مورد نظر خود را متناسب با برنامه و مقصد انتخاب کنید." : "Choose your desired package matching your plans."),
    },
    {
      id: 2,
      icon: <Send size={22} />,
      title: workCTA.request?.title || (isRTL ? "ثبت درخواست" : "Send Inquiry"),
      description: workCTA.request?.description || (isRTL ? "مشخصات و زمان سفر خود را برای هماهنگی ارسال نمایید." : "Submit your journey dates and details."),
    },
    {
      id: 3,
      icon: <BadgeCheck size={22} />,
      title: workCTA.confirmJourney?.title || (isRTL ? "تأیید برنامه" : "Confirm Journey"),
      description: workCTA.confirmJourney?.description || (isRTL ? "برنامه نهایی سفر و اقامتگاه‌ها توسط کارشناسان تأیید می‌شود." : "Finalize travel schedule and accommodations with our team."),
    },
    {
      id: 4,
      icon: <PlaneTakeoff size={22} />,
      title: workCTA.beginJourney?.title || (isRTL ? "آغاز سفر" : "Begin Adventure"),
      description: workCTA.beginJourney?.description || (isRTL ? "با آسودگی خاطر سفر خاطره‌انگیز خود را در افغانستان آغاز کنید." : "Embark on an unforgettable voyage across Afghanistan."),
    },
  ];

  const icons = [<PackageOpen size={22} key="1" />, <Send size={22} key="2" />, <BadgeCheck size={22} key="3" />, <PlaneTakeoff size={22} key="4" />];

  let displayItems = defaultItems;
  if (content && Array.isArray(content.work_items) && content.work_items.length > 0) {
    displayItems = content.work_items.map((item, idx) => ({
      id: idx + 1,
      icon: icons[idx % icons.length],
      title: isRTL ? (item.title_fa || item.title) : (item.title_en || item.title),
      description: isRTL ? (item.description_fa || item.description) : (item.description_en || item.description)
    }));
  }

  const eyebrow = (isRTL ? content?.work_eyebrow_fa : content?.work_eyebrow_en) || workCTA.eyebrow || (isRTL ? "نحوه رزرو سفر" : "How Booking Works");
  const title = (isRTL ? content?.work_title_fa : content?.work_title_en) || workCTA.title || (isRTL ? "چگونه کار می‌کند" : "How It Works");

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 mb-8 sm:mb-16">
      <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12">
        <p className="text-[var(--color-amovi-gold)] text-xs sm:text-sm font-bold tracking-wider uppercase mb-2">
          {eyebrow}
        </p>

        <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[var(--color-amovi-navy)] leading-tight">
          {title}
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 text-[var(--color-amovi-navy)]">
        {displayItems.map((item) => (
          <WorkCTA
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

export default HandleWorkCTA;
