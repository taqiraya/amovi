const MoreCTA = ({ title, icon, description }) => {
  return (
    <div className="rounded-2xl p-4 sm:p-5 bg-white border border-slate-200/80 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col sm:flex-row gap-3 sm:gap-4 items-start">
      <div className="shrink-0 bg-[var(--color-amovi-gold)] text-[var(--color-amovi-navy)] flex h-10 w-10 items-center justify-center rounded-xl shadow-xs">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-bold text-sm sm:text-base text-[var(--color-amovi-navy)] mb-1">
          {title}
        </h3>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
};

export default MoreCTA;
