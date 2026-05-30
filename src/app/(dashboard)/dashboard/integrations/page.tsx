import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import GoogleCalendarCard from "@/components/integrations/google-calendar-card";
import { CheckCircle2, AlertCircle } from "lucide-react";

interface IntegrationsPageProps {
  searchParams: Promise<{
    success?: string;
    error?: string;
  }>;
}

export default async function IntegrationsPage({ searchParams }: IntegrationsPageProps) {
  const supabase = await createClient();

  // Load the current authenticated user session
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Query database connection state
  const { data: connection } = await supabase
    .from("google_connections")
    .select("google_email, last_synced_at, revoked_at")
    .eq("user_id", user.id)
    .maybeSingle();

  const isConnected = !!connection && !connection.revoked_at;

  // Resolve search parameters for success/error alerts
  const params = await searchParams;
  const successMsg = params.success;
  const errorMsg = params.error;

  return (
    <div className="flex flex-col gap-6 h-full text-left">
      {/* Header section */}
      <div className="flex flex-col">
        <h1 className="text-2xl font-bold tracking-tight text-white">Integrations</h1>
        <p className="text-xs text-zinc-500 font-mono mt-0.5 uppercase tracking-wide">
          Connect external calendars and platform sync settings
        </p>
      </div>

      {/* Render Alert Messages */}
      {successMsg && (
        <div className="p-3.5 max-w-2xl rounded-lg border border-emerald-500/20 bg-emerald-500/5 text-xs text-emerald-400 font-medium flex items-center gap-2.5">
          <CheckCircle2 className="w-4.5 h-4.5 text-emerald-500 flex-shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-3.5 max-w-2xl rounded-lg border border-red-500/20 bg-red-500/5 text-xs text-red-400 font-medium flex items-center gap-2.5">
          <AlertCircle className="w-4.5 h-4.5 text-red-500 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Render Cards Grid */}
      <div className="mt-2">
        <GoogleCalendarCard
          initialConnected={isConnected}
          googleEmail={connection?.google_email}
          lastSyncedAt={connection?.last_synced_at}
        />
      </div>
    </div>
  );
}
