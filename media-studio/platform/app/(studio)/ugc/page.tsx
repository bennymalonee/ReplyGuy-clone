import Link from "next/link";
import { UGC_WORKFLOWS } from "@ultimate-multimodal/workflow-engine";

const ROUTES: Record<string, string> = {
  "muapi-ugc-video-factory": "/ugc/video-factory",
  "muapi-ugc-ads-workflow": "/ugc/ads-workflow",
  "muapi-ugc-lifestyle-try-on": "/ugc/lifestyle-try-on",
};

export default function UgcIndexPage() {
  return (
    <div>
      <section className="studio-section-light py-16">
        <div className="mx-auto max-w-[1280px] px-6">
          <h1 className="studio-headline text-4xl">UGC Studio</h1>
          <p className="mt-2 max-w-xl text-[var(--color-ash-mid)]">
            Create authentic user-generated content ads — person + product videos,
            lifestyle try-ons, and influencer-style campaigns.
          </p>
        </div>
      </section>
      <section className="studio-section-dark py-16">
        <div className="mx-auto grid max-w-[1280px] gap-6 px-6 md:grid-cols-3">
          {UGC_WORKFLOWS.map((wf) => (
            <Link
              key={wf.slug}
              href={ROUTES[wf.slug] ?? "/ugc"}
              className="block rounded-lg bg-[var(--color-charcoal-surface)] p-6 transition hover:opacity-90"
            >
              <p className="text-[11px] font-medium uppercase tracking-widest text-[var(--color-neon-pulse)]">
                UGC Workflow
              </p>
              <h2 className="mt-2 text-xl font-bold text-white">{wf.title}</h2>
              <p className="mt-2 text-sm text-[var(--color-ash-mid)]">
                {wf.description}
              </p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
