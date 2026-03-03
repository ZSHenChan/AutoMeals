import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import {
  DEFAULT_PREFERENCES,
  mergePreferences,
} from "@/lib/preferences";
import {
  getUserPreferences,
  isRedisConfigured,
  setUserPreferences,
} from "@/lib/redis";
import type { UserPreferences } from "@/types/preferences";

export const runtime = "nodejs";

const preferencesSchema = z.object({
  pantryShelf: z.array(z.string()),
  ingredients: z.array(z.string()),
  equipments: z.array(z.string()),
  cookingSkill: z.string(),
});

const getUserId = (request: NextRequest) =>
  request.nextUrl.searchParams.get("userId") || "default-user";

export async function GET(request: NextRequest) {
  const userId = getUserId(request);

  try {
    const saved = await getUserPreferences(userId);
    return NextResponse.json({
      preferences: saved ?? DEFAULT_PREFERENCES,
      storage: isRedisConfigured() ? "redis" : "memory-default",
    });
  } catch (error) {
    console.error("Failed to read preferences from Redis:", error);
    return NextResponse.json(
      {
        preferences: DEFAULT_PREFERENCES,
        storage: "memory-default",
      },
      { status: 200 }
    );
  }
}

export async function POST(request: NextRequest) {
  const userId = getUserId(request);

  try {
    const body = (await request.json()) as Partial<UserPreferences>;
    const parsed = preferencesSchema.safeParse(mergePreferences(body));

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid preferences payload" },
        { status: 400 }
      );
    }

    await setUserPreferences(userId, parsed.data);

    return NextResponse.json({
      ok: true,
      storage: isRedisConfigured() ? "redis" : "memory-default",
    });
  } catch (error) {
    console.error("Failed to save preferences:", error);
    return NextResponse.json(
      { error: "Failed to save preferences" },
      { status: 500 }
    );
  }
}
