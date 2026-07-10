import { UGC_WORKFLOWS } from "@ultimate-multimodal/workflow-engine";
import { loadAllSkills } from "@ultimate-multimodal/workflow-engine/server";
import Link from "next/link";

export default async function DashboardWorkflowsPage() {
  const allSkills = await loadAllSkills();

  return (
    <div>
      <h1 className="dashboard-headline">Workflow <em>recipes</em></h1>
      <p className="mt-4 text-[var(--color-stone)]">
        {allSkills.length} recipes from Generative-Media-Skills
      </p>

      <h2 className="mt-12 text-xl font-semibold">UGC Pipelines</h2>
      <div className="mt-6 grid gap-6 md:grid-cols-3">
        {UGC_WORKFLOWS.map((wf, i) => (
          <div
            key={wf.slug}
            className={
              i === 2
                ? "dashboard-card-bordered"
                : i === 0
                  ? "dashboard-card-dark"
                  : "dashboard-card border border-[var(--color-cream-border)] shadow-none"
            }
          >
            <span className="dashboard-badge">UGC</span>
            <h3 className="mt-4 text-lg font-semibold">{wf.title}</h3>
            <p className="mt-2 text-sm opacity-80">{wf.description}</p>
            <Link
              href={
                wf.slug === "muapi-ugc-video-factory"
                  ? "/ugc/video-factory"
                  : wf.slug === "muapi-ugc-ads-workflow"
                    ? "/ugc/ads-workflow"
                    : "/ugc/lifestyle-try-on"
              }
              className="mt-4 inline-block text-sm text-[var(--color-electric-cobalt)]"
            >
              Open in Studio →
            </Link>
          </div>
        ))}
      </div>

      <h2 className="mt-12 text-xl font-semibold">All Recipes</h2>
      <div className="dashboard-card mt-6 !p-0 overflow-hidden">
        {allSkills.slice(0, 20).map((skill) => (
          <div
            key={skill.slug}
            className="dashboard-accordion-row flex items-center justify-between px-8"
          >
            <div>
              <p className="font-medium">{skill.name}</p>
              <p className="text-sm text-[var(--color-stone)]">{skill.category}</p>
            </div>
            <span className="dashboard-badge">{skill.inputs.length} inputs</span>
          </div>
        ))}
      </div>
    </div>
  );
}
