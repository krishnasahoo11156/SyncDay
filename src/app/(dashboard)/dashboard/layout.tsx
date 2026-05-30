import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Sidebar from "@/components/dashboard/sidebar";
import Topbar from "@/components/dashboard/topbar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  // Load the current user session
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch user profile settings
  const { data: profile } = await supabase
    .from("profiles")
    .select("display_name, timezone")
    .eq("id", user.id)
    .single();

  // Fetch google connection status
  const { data: connection } = await supabase
    .from("google_connections")
    .select("google_email, last_synced_at, revoked_at")
    .eq("user_id", user.id)
    .maybeSingle();

  const isGoogleConnected = !!connection && !connection.revoked_at;

  return (
    <div className="flex min-h-screen bg-[#09090b]">
      {/* Left Sidebar Shell */}
      <Sidebar
        userEmail={user.email}
        displayName={profile?.display_name || ""}
      />

      {/* Main Page Viewport Container */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header Topbar Navigation */}
        <Topbar
          isGoogleConnected={isGoogleConnected}
          lastSyncedAt={connection?.last_synced_at}
        />

        {/* Viewport Content Node */}
        <main className="flex-1 overflow-y-auto p-6 sm:p-8 bg-[#09090b]">
          <div className="max-w-7xl mx-auto h-full flex flex-col">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
