import { useLangStore } from '../../store/useLangStore';

export default function Services() {
  const { currentLang } = useLangStore();
  const isRtl = currentLang === 'fa';

  return (
    <div className={`pt-32 pb-20 px-6 max-w-5xl mx-auto ${isRtl ? 'text-right font-[Sahel]' : 'text-left font-[Inter]'}`}>
      <h1 className="text-3xl sm:text-4xl font-extrabold text-[#14213D] mb-4">
        {isRtl ? 'خدمات گردشگری و سفر' : 'Our Travel Services'}
      </h1>
      <p className="text-slate-600 leading-relaxed text-base sm:text-lg">
        {isRtl
          ? 'از خدمات ویزا تا رزرو برترین اقامتگاه‌ها و ترانسفر VIP در تمام ولایات افغانستان همراه شما هستیم.'
          : 'From visa support to premium accommodation and VIP transportation across Afghanistan provinces.'}
      </p>
    </div>
  );
}