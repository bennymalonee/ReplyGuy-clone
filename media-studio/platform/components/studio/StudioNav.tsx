"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV = [
  { href: "/studio/image", label: "Image" },
  { href: "/studio/video", label: "Video" },
  { href: "/ugc", label: "UGC Studio" },
  { href: "/workflow", label: "Workflows" },
];

export function StudioNav() {
  const pathname = usePathname();

  return (
    <nav className="sticky top-0 z-50 flex h-14 items-center justify-between border-b border-[var(--color-fog-border)] bg-[var(--color-pure-white)] px-6">
      <Link href="/" className="text-xl font-bold text-[var(--color-deep-ink)]">
        Ultimate Multimodal
      </Link>
      <div className="hidden items-center gap-6 md:flex">
        {NAV.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`text-sm font-medium ${
              pathname.startsWith(item.href)
                ? "text-[var(--color-deep-ink)]"
                : "text-[var(--color-ash-mid)]"
            }`}
          >
            {item.label}
          </Link>
        ))}
      </div>
      <div className="flex items-center gap-4">
        <Link
          href="/dashboard"
          className="text-sm font-medium text-[var(--color-creator-violet)]"
        >
          Dashboard
        </Link>
        <Link href="/ugc/video-factory" className="studio-cta text-sm">
          Create UGC
        </Link>
      </div>
    </nav>
  );
}
