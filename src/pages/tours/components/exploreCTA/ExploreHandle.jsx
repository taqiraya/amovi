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
    <section className="m-auto max-w-[1600px] ">
      <div className=" m-10 grid justify-items-center grid-cols-1 gap-4 min-[650px]:grid-cols-2 min-[900px]:grid-cols-3 min-[1162px]:grid-cols-4 text-[var(--color-amovi-navy)]">
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
