import DiscoverSection from "./components/DiscoverSection.jsx";
import ExploreHandle from "./components/exploreCTA/ExploreHandle.jsx";
import ExploreSection from "./components/ExploreSection.jsx";
import HandleMoreCTA from "./components/moreThanCTA/HandleMoreCTA.jsx";
import TourHero from "./components/TourHero.jsx";
import HandelTravelCTA from "./components/travelCTA/HandelTravelCTA.jsx";
import HandleWorkCTA from "./components/workCTA/HandleWorkCTA.jsx";
import { useLangStore } from "../../store/useLangStore";

export default function Tours() {
  const { currentLang } = useLangStore();

  return (
    <div
      className={`m-auto max-w-[1440px] ${
        currentLang === "fa"
          ? "font-['Sahel',system-ui,sans-serif]"
          : "font-['Inter',system-ui,sans-serif]"
      }`}
    >
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
