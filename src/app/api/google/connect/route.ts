import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getGoogleAuthUrl } from "@/lib/google/oauth";
import { cookies } from "next/headers";
import crypto from "crypto";

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Verify user is authenticated
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Authentication session expired" },
        { status: 401 }
      );
    }

    // Generate secure random state token to prevent CSRF attacks
    const state = crypto.randomBytes(16).toString("hex");

    // Save state token in secure cookie (valid for 10 minutes)
    const cookieStore = await cookies();
    cookieStore.set("google_oauth_state", state, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 600, // 10 minutes
      path: "/",
      sameSite: "lax",
    });

    const origin = request.nextUrl.origin;
    const redirectUrl = getGoogleAuthUrl(state, `${origin}/api/google/callback`);
    return NextResponse.redirect(redirectUrl);
  } catch (err: any) {
    console.error("Connect Google OAuth Error:", err.message);
    const errorUrl = new URL("/dashboard/integrations", request.nextUrl.origin);
    errorUrl.searchParams.set("error", "Failed to initiate Google connection");
    return NextResponse.redirect(errorUrl.toString());
  }
}
