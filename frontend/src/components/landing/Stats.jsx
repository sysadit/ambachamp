const stats = [
  { value: "1000+", label: "Active Competitions" },
  { value: "50k+",  label: "Global Users" },
  { value: "100+",  label: "Universities Partnered" },
];

export default function Stats() {
  return (
    <section className="py-xl bg-primary text-on-primary rounded-3xl overflow-hidden font-sans shadow-lg transition-all mt-xxl">
      <div className="max-w-container-max mx-auto px-gutter">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-lg text-center">
          {stats.map((stat, i) => (
            <div 
              key={i} 
              className={`flex flex-col items-center py-md ${i !== 0 ? 'border-t md:border-t-0 md:border-x border-on-primary-fixed-variant/30' : ''}`}
            >
              <span className="font-display text-display-md text-tertiary-fixed">{stat.value}</span>
              <span className="text-label-lg text-on-primary-container uppercase tracking-widest">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}