import { loadAllSkills } from "@ultimate-multimodal/workflow-engine/server";

import { StudioShell } from "@/components/media-studio/studio-shell";

export default async function MediaStudioWorkflowsPage() {
  const skills = await loadAllSkills();

  return (
    <StudioShell
      title="Workflow recipes"
      description="Browse the Generative-Media-Skills catalog from inside the main ReplyGuy app."
    >
      <div className="space-y-3">
        {skills.slice(0, 24).map((skill) => (
          <div
            key={skill.slug}
            className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-zinc-950 p-5 md:flex-row md:items-center md:justify-between"
          >
            <div>
              <p className="text-lg font-semibold">{skill.name}</p>
              <p className="mt-1 text-sm text-white/60">{skill.category}</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-white/70">
                {skill.inputs.length} inputs
              </span>
              <span className="max-w-md text-sm text-white/60">{skill.description}</span>
            </div>
          </div>
        ))}
      </div>
    </StudioShell>
  );
}
