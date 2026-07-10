import { loadAllSkills } from "@ultimate-multimodal/workflow-engine/server";
import { NextResponse } from "next/server";

export async function GET() {
  const skills = await loadAllSkills();
  return NextResponse.json({ skills });
}
