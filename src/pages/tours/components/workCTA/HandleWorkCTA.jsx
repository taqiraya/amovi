import WorkCTA from "./WorkCTA";
import { PackageOpen, Send, BadgeCheck, PlaneTakeoff } from "lucide-react";
import { useLangStore } from "../../../../store/useLangStore";

const HandleWorkCTA = () => {
  const { currentLang, translations } = useLangStore();
  const isRTL = currentLang === "fa";
  const workCTA = translations?.tourPage?.workCTA || {};
  const data = [
    {
      id: 1,
      icon: <PackageOpen size={22} />,
      number: workCTA.package?.number || "۰۱",
      title: workCTA.package?.title || (isRTL ? "انتخاب پکیج" : "Choose Package"),
      description: workCTA.package?.description || (isRTL ? "پکیج مورد نظر خود را متناسب با برنامه و مقصد انتخاب کنید." : "Choose your desired package matching your plans."),
    },
    {
      id: 2,
      icon: <Send size={22} />,
      number: workCTA.request?.number || "۰۲",
      title: workCTA.request?.title || (isRTL ? "ثبت درخواست" : "Send Inquiry"),
      description: workCTA.request?.description || (isRTL ? "مشخصات و زمان سفر خود را برای هماهنگی ارسال نمایید." : "Submit your journey dates and details."),
    },
    {
      id: 3,
      icon: <BadgeCheck size={22} />,
      number: workCTA.confirmJourney?.number || "۰۳",
      title: workCTA.confirmJourney?.title || (isRTL ? "تأیید برنامه" : "Confirm Journey"),
      description: workCTA.confirmJourney?.description || (isRTL ? "برنامه نهایی سفر و اقامتگاه‌ها توسط کارشناسان تأیید می‌شود." : "Finalize travel schedule and accommodations with our team."),
    },
    {
      id: 4,
      icon: <PlaneTakeoff size={22} />,
      number: workCTA.beginJourney?.number || "۰۴",
      title: workCTA.beginJourney?.title || (isRTL ? "آغاز سفر" : "Begin Adventure"),
      description: workCTA.beginJourney?.description || (isRTL ? "با آسودگی خاطر سفر خاطره‌انگیز خود را در افغانستان آغاز کنید." : "Embark on an unforgettable voyage across Afghanistan."),
    },
  ];
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 mb-8 sm:mb-16">
      <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12">
        <p className="text-[var(--color-amovi-gold)] text-xs sm:text-sm font-bold tracking-wider uppercase mb-2">
          {workCTA.eyebrow || (isRTL ? "نحوه رزرو سفر" : "How Booking Works")}
        </p>

        <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[var(--color-amovi-navy)] leading-tight">
          {workCTA.title || (isRTL ? "چگونه کار می‌کند" : "How It Works")}
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
