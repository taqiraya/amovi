import DiscoverSection from "./components/DiscoverSection.jsx";
import ExploreHandle from "./components/exploreCTA/ExploreHandle.jsx";
import ExploreSection from "./components/ExploreSection.jsx";
import HandleMoreCTA from "./components/moreThanCTA/HandleMoreCTA.jsx";
import TourHero from "./components/TourHero.jsx";
import HandelTravelCTA from "./components/travelCTA/HandelTravelCTA.jsx";
import HandleWorkCTA from "./components/workCTA/HandleWorkCTA.jsx";
import { useLangStore } from "../../store/useLangStore";
import SEO from "../../components/SEO";

export default function Tours() {
  const { currentLang } = useLangStore();
  const isRtl = currentLang === "fa";

  return (
    <div
      className={`w-full overflow-x-hidden ${
        isRtl
          ? "font-['Sahel',system-ui,sans-serif]"
          : "font-['Inter',system-ui,sans-serif]"
      }`}
    >
      <SEO 
        title={isRtl ? "تورهای افغانستان | آمووی ترول" : "Afghanistan Tours & Expeditions | Amovi Travel"}
        description={isRtl 
          ? "تورهای اختصاصی، هیئت‌های تخصصی و سفرهای ماجراجویانه در سراسر ولایات افغانستان با راهنمایان مجرب." 
          : "Bespoke itineraries, cultural expeditions, and adventurous tours across Afghanistan with expert local leadership."}
        canonicalUrl="https://amovi.travel/tours"
      />
      <TourHero />
      <DiscoverSection />
      <ExploreSection />
      <ExploreHandle />
      <HandelTravelCTA />
      <HandleMoreCTA />
      <HandleWorkCTA />
    </div>
  );
}
