interface FeatureChecklistProps {
  items: string[];
  completed?: number;
}

export function FeatureChecklist({
  items,
  completed = 0,
}: FeatureChecklistProps) {
  return (
    <ul className="space-y-3">
      {items.map((item, index) => (
        <li key={item} className="flex items-start gap-3">
          <span
            className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
              index < completed
                ? "bg-emerald-400 text-black"
                : "border border-white/20 text-white/70"
            }`}
          >
            {index < completed ? "✓" : index + 1}
          </span>
          <span className="text-sm text-white/90">{item}</span>
        </li>
      ))}
    </ul>
  );
}
