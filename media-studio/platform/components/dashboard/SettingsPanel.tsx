interface SettingsPanelProps {
  title: string;
  children: React.ReactNode;
}

export function SettingsPanel({ title, children }: SettingsPanelProps) {
  return (
    <div className="dashboard-card max-w-xl">
      <h2 className="text-lg font-semibold text-[var(--color-charcoal)]">{title}</h2>
      <div className="mt-6 space-y-6">{children}</div>
    </div>
  );
}
