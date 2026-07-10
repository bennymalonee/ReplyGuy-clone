import { NextResponse } from "next/server";

import { getCurrentUser } from "@/lib/session";

export async function requireMediaStudioUser() {
  const user = await getCurrentUser();

  if (!user?.id) {
    return {
      user: null,
      response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    };
  }

  return { user, response: null };
}
