const WorkCTA = ({ icon, number, title, description }) => {
  return (
    <div className="rounded-2xl p-5 sm:p-6 bg-white border border-slate-200/80 shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-300 flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="shrink-0 h-11 w-11 bg-[var(--color-amovi-gold)] text-[var(--color-amovi-navy)] rounded-xl flex items-center justify-center shadow-xs">
            {icon}
          </div>
          <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600">
            {number}
          </span>
        </div>
        <h3 className="font-bold text-base sm:text-lg text-[var(--color-amovi-navy)] mb-2">
          {title}
        </h3>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
};

export default WorkCTA;
