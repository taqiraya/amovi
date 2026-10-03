const TravelCTA = ({ icon, title, description }) => {
  return (
    <div className="rounded-2xl p-6 bg-white border border-slate-200/80 shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-300 flex flex-col items-center text-center">
      <div className="shrink-0 bg-[var(--color-amovi-gold)] text-[var(--color-amovi-navy)] flex h-12 w-12 items-center justify-center rounded-2xl shadow-sm mb-4">
        {icon}
      </div>
      <h3 className="font-bold text-base sm:text-lg text-[var(--color-amovi-navy)] mb-2">
        {title}
      </h3>
      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
        {description}
      </p>
    </div>
  );
};

export default TravelCTA;
