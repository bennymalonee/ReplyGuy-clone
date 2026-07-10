import Link from "next/link";

import { StudioShell } from "@/components/media-studio/studio-shell";

export const metadata = {
  title: "Media Studio",
  description: "Use the native ReplyGuy media studio.",
};

const cards = [
  {
    href: "/dashboard/media-studio/image",
    title: "Image Studio",
    text: "Generate product, lifestyle, and campaign-ready stills.",
  },
  {
    href: "/dashboard/media-studio/video",
    title: "Video Studio",
    text: "Run vertical video generations directly in ReplyGuy.",
  },
  {
    href: "/dashboard/media-studio/ugc",
    title: "UGC Workflows",
    text: "Launch native ad workflows without leaving the app shell.",
  },
  {
    href: "/dashboard/media-studio/settings",
    title: "MuAPI Settings",
    text: "Configure your API key and default generation models.",
  },
];

export default function MediaStudioOverviewPage() {
  return (
    <StudioShell
      title="Native media studio"
      description="The standalone media-studio app is now mounted directly inside ReplyGuy. Use the same auth, navigation, and dashboard context without an iframe handoff."
    >
      <div className="grid gap-4 lg:grid-cols-2">
        {cards.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="rounded-2xl border border-white/10 bg-zinc-950 p-6 transition hover:border-white/30"
          >
            <p className="text-xl font-semibold">{card.title}</p>
            <p className="mt-2 text-sm text-white/65">{card.text}</p>
          </Link>
        ))}
      </div>
    </StudioShell>
  );
}
