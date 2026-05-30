import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { revokeGoogleToken } from "@/lib/google/oauth";

export async function POST(request: NextRequest) {
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

    // Retrieve active connection details
    const { data: connection, error: fetchErr } = await supabase
      .from("google_connections")
      .select("id, encrypted_refresh_token")
      .eq("user_id", user.id)
      .maybeSingle();

    if (fetchErr) {
      return NextResponse.json(
        { error: `Database error: ${fetchErr.message}` },
        { status: 500 }
      );
    }

    if (!connection) {
      return NextResponse.json(
        { error: "No active Google connection found to disconnect." },
        { status: 404 }
      );
    }

    // Attempt to revoke the token on Google's authorization servers
    try {
      await revokeGoogleToken(connection.encrypted_refresh_token);
    } catch (revokeErr: any) {
      console.warn("Failed to revoke Google token on disconnect:", revokeErr.message);
      // Proceed with local database disconnect even if Google token revoke fails
    }

    // Purge the connection record from the database
    const { error: deleteErr } = await supabase
      .from("google_connections")
      .delete()
      .eq("id", connection.id);

    if (deleteErr) {
      return NextResponse.json(
        { error: `Failed to remove connection: ${deleteErr.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Disconnect Google OAuth Error:", err.message);
    return NextResponse.json(
      { error: err.message || "An unexpected error occurred during disconnect." },
      { status: 500 }
    );
  }
}
