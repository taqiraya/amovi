import { useState, useEffect } from "react";
import DiscoverSection from "./components/DiscoverSection.jsx";
import ExploreHandle from "./components/exploreCTA/ExploreHandle.jsx";
import ExploreSection from "./components/ExploreSection.jsx";
import HandleMoreCTA from "./components/moreThanCTA/HandleMoreCTA.jsx";
import TourHero from "./components/TourHero.jsx";
import HandelTravelCTA from "./components/travelCTA/HandelTravelCTA.jsx";
import HandleWorkCTA from "./components/workCTA/HandleWorkCTA.jsx";
import { useLangStore } from "../../store/useLangStore";
import { getTourPageSettings } from "../../services/api";
import SEO from "../../components/SEO";

export default function Tours() {
  const { currentLang } = useLangStore();
  const isRtl = currentLang === "fa";
  const [pageSettings, setPageSettings] = useState(null);

  useEffect(() => {
    let isMounted = true;
    getTourPageSettings().then((data) => {
      if (isMounted && data) {
        setPageSettings(data);
      }
    }).catch(() => {
      // fallback to static translations
    });
    return () => {
      isMounted = false;
    };
  }, []);

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
      <DiscoverSection content={pageSettings} />
      <ExploreSection />
      <ExploreHandle />
      <HandelTravelCTA content={pageSettings} />
      <HandleMoreCTA content={pageSettings} />
      <HandleWorkCTA content={pageSettings} />
    </div>
  );
}
