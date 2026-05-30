import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { exchangeAuthCode } from "@/lib/google/oauth";
import { encryptToken } from "@/lib/crypto/tokens";
import { cookies } from "next/headers";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const error = searchParams.get("error");

  const errorRedirect = new URL("/dashboard/integrations", request.nextUrl.origin);

  // If Google returned an error (e.g. user cancelled)
  if (error) {
    console.error("Google OAuth error:", error);
    errorRedirect.searchParams.set("error", `Google connection declined: ${error}`);
    return NextResponse.redirect(errorRedirect.toString());
  }

  if (!code || !state) {
    errorRedirect.searchParams.set("error", "Invalid authorization request parameters.");
    return NextResponse.redirect(errorRedirect.toString());
  }

  try {
    const cookieStore = await cookies();
    const savedState = cookieStore.get("google_oauth_state")?.value;

    // Verify CSRF state token match
    if (!savedState || savedState !== state) {
      errorRedirect.searchParams.set("error", "Cross-Site Request Forgery (CSRF) verification failed.");
      return NextResponse.redirect(errorRedirect.toString());
    }

    // Clear state cookie
    cookieStore.delete("google_oauth_state");

    const supabase = await createClient();

    // Verify authenticated user
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      errorRedirect.searchParams.set("error", "Your session expired. Please log in again.");
      return NextResponse.redirect(errorRedirect.toString());
    }

    // Exchange auth code for tokens
    const origin = request.nextUrl.origin;
    const tokens = await exchangeAuthCode(code, `${origin}/api/google/callback`);

    if (!tokens.refreshToken) {
      // Re-consent is required to get a refresh token if previously connected
      errorRedirect.searchParams.set(
        "error",
        "Failed to retrieve Google refresh token. Please disconnect and reconnect your account."
      );
      return NextResponse.redirect(errorRedirect.toString());
    }

    // Securely encrypt the Google refresh token using token encryption key
    const encryptedRefreshToken = encryptToken(tokens.refreshToken);

    // Extract the Google user's email address by decoding Google's id_token
    let googleEmail = "unknown@gmail.com";
    if (tokens.idToken) {
      try {
        const parts = tokens.idToken.split(".");
        if (parts.length >= 2) {
          const payload = JSON.parse(Buffer.from(parts[1], "base64").toString("utf-8"));
          if (payload.email) {
            googleEmail = payload.email;
          }
        }
      } catch (decodeErr: any) {
        console.warn("Failed to decode Google id_token payload:", decodeErr.message);
      }
    }

    // Check if user already has a connection record
    const { data: existingConnection } = await supabase
      .from("google_connections")
      .select("id")
      .eq("user_id", user.id)
      .maybeSingle();

    if (existingConnection) {
      // Update existing connection record
      const { error: updateErr } = await supabase
        .from("google_connections")
        .update({
          google_email: googleEmail,
          encrypted_refresh_token: encryptedRefreshToken,
          revoked_at: null,
          connected_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq("id", existingConnection.id);

      if (updateErr) throw updateErr;
    } else {
      // Insert new connection record
      const { error: insertErr } = await supabase
        .from("google_connections")
        .insert({
          user_id: user.id,
          google_email: googleEmail,
          encrypted_refresh_token: encryptedRefreshToken,
        });

      if (insertErr) throw insertErr;
    }

    const successRedirect = new URL("/dashboard/integrations", request.nextUrl.origin);
    successRedirect.searchParams.set("success", "Successfully connected to Google Calendar!");
    return NextResponse.redirect(successRedirect.toString());
  } catch (err: any) {
    console.error("Callback Google OAuth Error:", err.message);
    errorRedirect.searchParams.set("error", err.message || "Failed to complete Google Calendar connection.");
    return NextResponse.redirect(errorRedirect.toString());
  }
}
