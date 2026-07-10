import Link from "next/link";
import { loadAllSkills } from "@ultimate-multimodal/workflow-engine/server";

export default async function WorkflowBrowserPage() {
  const skills = await loadAllSkills();
  const byCategory = skills.reduce<Record<string, typeof skills>>((acc, s) => {
    (acc[s.category] ??= []).push(s);
    return acc;
  }, {});

  return (
    <div>
      <section className="studio-section-light py-16">
        <div className="mx-auto max-w-[1280px] px-6">
          <h1 className="studio-headline text-4xl">Workflow Recipes</h1>
          <p className="mt-2 text-[var(--color-ash-mid)]">
            {skills.length} recipes from Generative-Media-Skills
          </p>
        </div>
      </section>
      {Object.entries(byCategory).map(([category, items]) => (
        <section key={category} className="studio-section-dark py-12">
          <div className="mx-auto max-w-[1280px] px-6">
            <h2 className="mb-6 text-2xl font-bold capitalize text-white">{category}</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((skill) => (
                <div
                  key={skill.slug}
                  className="rounded bg-[var(--color-charcoal-surface)] p-4"
                >
                  <p className="text-[11px] uppercase tracking-widest text-[var(--color-neon-pulse)]">
                    {skill.slug}
                  </p>
                  <h3 className="mt-1 font-bold text-white">{skill.name}</h3>
                  <p className="mt-2 line-clamp-2 text-sm text-[var(--color-ash-mid)]">
                    {skill.description}
                  </p>
                  {skill.inputs.length > 0 && (
                    <p className="mt-2 text-xs text-[var(--color-ash-mid)]">
                      {skill.inputs.length} inputs
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      ))}
      <section className="studio-section-light py-12 text-center">
        <Link href="/ugc" className="studio-cta inline-block">
          Try UGC Workflows
        </Link>
      </section>
    </div>
  );
}
