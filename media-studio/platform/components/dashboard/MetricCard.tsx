interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
}

export function MetricCard({ title, value, subtitle }: MetricCardProps) {
  return (
    <div className="dashboard-card">
      <p className="text-sm font-medium text-[var(--color-stone)]">{title}</p>
      <p className="mt-2 text-4xl font-bold text-[var(--color-ink-navy)]">{value}</p>
      {subtitle && (
        <p className="mt-1 text-sm text-[var(--color-stone)]">{subtitle}</p>
      )}
    </div>
  );
}

interface StepCardProps {
  number: number;
  title: string;
  description: string;
  variant?: "dark" | "light" | "bordered";
}

export function StepCard({
  number,
  title,
  description,
  variant = "light",
}: StepCardProps) {
  const cls =
    variant === "dark"
      ? "dashboard-card-dark"
      : variant === "bordered"
        ? "dashboard-card-bordered"
        : "dashboard-card border border-[var(--color-cream-border)] shadow-none";

  return (
    <div className={cls}>
      <span className="dashboard-badge">Step {number}</span>
      <h3 className="mt-4 text-xl font-semibold">{title}</h3>
      <p className="mt-2 text-sm opacity-80">{description}</p>
    </div>
  );
}
