import { NextResponse } from "next/server";
import { validateUserId } from "@/lib/user-id";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { userId?: string };
    const candidate = body.userId ?? "";
    const result = validateUserId(candidate);

    if (!result.ok) {
      return NextResponse.json(
        { error: result.message ?? "Invalid user ID." },
        { status: 400 }
      );
    }

    const response = NextResponse.json({ ok: true, userId: result.sanitized });
    response.cookies.set("userId", result.sanitized, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
    });

    return response;
  } catch {
    return NextResponse.json(
      { error: "Invalid request payload." },
      { status: 400 }
    );
  }
}
