import { useState, useEffect } from "react";
import ExploreCTA from "./ExploreCTA";
import { getTours } from "../../../../services/api";
import { useLangStore } from "../../../../store/useLangStore";
import localDb from "../../../../../db.json";

const ExploreHandle = () => {
  const { currentLang } = useLangStore();
  const [tours, setTours] = useState(localDb.tours || []);

  useEffect(() => {
    let isMounted = true;
    getTours().then((data) => {
      if (isMounted && data) {
        setTours(data);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section id="tours-package-grid" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 scroll-mt-24">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 text-[var(--color-amovi-navy)]">
        {tours.map((tour) => {
          const tourData = tour[currentLang] || tour.en || {};
          return (
            <ExploreCTA
              key={tour.id}
              title={tourData.title}
              price={tour.price ? `$${tour.price}` : "$150"}
              durationDay={tourData.days || 3}
              durationNight={tourData.nights || 2}
              image={tour.image}
            />
          );
        })}
      </div>
    </section>
  );
};

export default ExploreHandle;
