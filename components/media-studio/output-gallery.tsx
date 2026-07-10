interface OutputGalleryProps {
  items: { title: string; url: string; subtitle?: string }[];
}

export function OutputGallery({ items }: OutputGalleryProps) {
  if (!items.length) {
    return <p className="text-sm text-muted-foreground">No outputs yet.</p>;
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {items.map((item, index) => (
        <div
          key={item.url + index}
          className="overflow-hidden rounded-xl border border-border bg-card"
        >
          <div className="relative aspect-[4/3] bg-muted">
            {/\.(mp4|webm|mov)$/i.test(item.url) ? (
              <video src={item.url} controls className="h-full w-full object-cover" />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={item.url} alt={item.title} className="h-full w-full object-cover" />
            )}
          </div>
          <div className="space-y-1 p-4">
            <p className="text-sm font-semibold">{item.title}</p>
            {item.subtitle ? (
              <p className="text-xs text-muted-foreground">{item.subtitle}</p>
            ) : null}
          </div>
        </div>
      ))}
    </div>
  );
}
