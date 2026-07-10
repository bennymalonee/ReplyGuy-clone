interface MediaCardProps {
  title: string;
  subtitle?: string;
  imageUrl: string;
  label?: string;
}

export function MediaCard({ title, subtitle, imageUrl, label = "OUTPUT" }: MediaCardProps) {
  return (
    <div className="overflow-hidden rounded-t-[4px] rounded-b-lg shadow-[var(--shadow-sm)]">
      <div className="relative aspect-[3/4]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={imageUrl} alt={title} className="h-full w-full object-cover" />
        <div className="media-card-scrim absolute inset-x-0 bottom-0 p-4">
          <p className="text-[11px] font-medium uppercase tracking-widest text-white">
            {label}
          </p>
          <p className="text-xl font-bold text-white">{title}</p>
          {subtitle && (
            <p className="text-xs uppercase text-white/80">{subtitle}</p>
          )}
        </div>
      </div>
    </div>
  );
}

interface OutputGalleryProps {
  items: { title: string; url: string; subtitle?: string }[];
}

export function OutputGallery({ items }: OutputGalleryProps) {
  if (!items.length) {
    return (
      <p className="text-sm text-[var(--color-ash-mid)]">No outputs yet.</p>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((item, i) => (
        <MediaCard
          key={i}
          title={item.title}
          subtitle={item.subtitle}
          imageUrl={item.url}
        />
      ))}
    </div>
  );
}
