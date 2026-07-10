import Link from "next/link";
import { PrimaryCTA } from "@/components/studio/PrimaryCTA";
import { StatCounter } from "@/components/studio/FeatureChecklist";

export default function HomePage() {
  return (
    <>
      <section className="grid min-h-[70vh] md:grid-cols-[55%_45%]">
        <div className="flex flex-col justify-center bg-[var(--color-pure-white)] px-12 py-20">
          <h1 className="studio-headline text-5xl text-[var(--color-deep-ink)] md:text-[46px]">
            Create UGC ads that feel real
          </h1>
          <p className="mt-6 max-w-md text-lg text-[var(--color-ash-mid)]">
            Person + product + script → vertical video ads powered by MuAPI and
            100+ generative models.
          </p>
          <div className="mt-8 flex gap-4">
            <Link href="/ugc/video-factory">
              <PrimaryCTA>Start Creating</PrimaryCTA>
            </Link>
            <Link
              href="/studio/image"
              className="rounded border border-[var(--color-graphite-stroke)] px-4 py-2 text-sm font-medium"
            >
              Image Studio
            </Link>
          </div>
        </div>
        <div className="flex items-center justify-center bg-[var(--color-studio-black)] p-12">
          <div className="w-full max-w-[380px] bg-[var(--color-pure-white)] p-8">
            <h2 className="text-center text-xl font-bold text-[var(--color-deep-ink)]">
              Get started free
            </h2>
            <p className="mt-2 text-center text-sm text-[var(--color-ash-mid)]">
              Upload a person photo and product image to generate your first UGC ad.
            </p>
            <Link href="/ugc/video-factory" className="mt-6 block">
              <PrimaryCTA className="w-full text-center">Create UGC Video</PrimaryCTA>
            </Link>
            <Link
              href="/dashboard/settings"
              className="mt-4 block text-center text-sm text-[var(--color-creator-violet)]"
            >
              Configure API key →
            </Link>
          </div>
        </div>
      </section>

      <section className="studio-section-dark py-20">
        <div className="mx-auto max-w-[1280px] px-6">
          <div className="grid gap-6 sm:grid-cols-4">
            <StatCounter value="100+" label="Models" />
            <StatCounter value="41" label="Workflows" />
            <StatCounter value="3" label="UGC Pipelines" />
            <StatCounter value="9:16" label="Vertical Ready" />
          </div>
        </div>
      </section>
    </>
  );
}
