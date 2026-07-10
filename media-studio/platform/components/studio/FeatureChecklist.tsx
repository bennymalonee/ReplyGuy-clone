interface FeatureChecklistProps {
  items: string[];
  completed?: number;
}

export function FeatureChecklist({ items, completed = 0 }: FeatureChecklistProps) {
  return (
    <ul className="space-y-3">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-3">
          <span
            className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
              i < completed
                ? "bg-[var(--color-neon-pulse)] text-[var(--color-studio-black)]"
                : "border border-[var(--color-graphite-stroke)] text-[var(--color-ash-mid)]"
            }`}
          >
            {i < completed ? "✓" : i + 1}
          </span>
          <span className="text-base text-[var(--color-pure-white)]">{item}</span>
        </li>
      ))}
    </ul>
  );
}

interface DarkSplitSectionProps {
  headline: string;
  children: React.ReactNode;
}

export function DarkSplitSection({ headline, children }: DarkSplitSectionProps) {
  return (
    <section className="studio-section-dark py-20">
      <div className="mx-auto grid max-w-[1280px] gap-12 px-6 md:grid-cols-2">
        <h2 className="studio-headline text-4xl md:text-[46px]">{headline}</h2>
        <div>{children}</div>
      </div>
    </section>
  );
}

interface StatCounterProps {
  value: string;
  label: string;
}

export function StatCounter({ value, label }: StatCounterProps) {
  return (
    <div className="rounded-lg bg-[var(--color-charcoal-surface)] p-4">
      <p className="text-3xl font-bold text-white">{value}</p>
      <p className="mt-1 text-[11px] font-medium uppercase tracking-widest text-[var(--color-ash-mid)]">
        {label}
      </p>
    </div>
  );
}
