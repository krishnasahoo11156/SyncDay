import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import SettingsForm from "@/components/settings/settings-form";
import { updateProfileSettings, deleteAccountAction } from "@/actions/settings-actions";

export default async function SettingsPage() {
  const supabase = await createClient();

  // Load the current authenticated user session
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch the user's profile information
  const { data: profile } = await supabase
    .from("profiles")
    .select("display_name, timezone")
    .eq("id", user.id)
    .single();

  return (
    <div className="flex flex-col gap-6 h-full text-left">
      {/* Header section */}
      <div className="flex flex-col">
        <h1 className="text-2xl font-bold tracking-tight text-white">Settings</h1>
        <p className="text-xs text-zinc-500 font-mono mt-0.5 uppercase tracking-wide">
          Manage system preferences, calendar operations, and system profile states
        </p>
      </div>

      {/* Main Settings Form Grid */}
      <div className="mt-2 flex justify-start">
        <SettingsForm
          initialProfile={{
            display_name: profile?.display_name || "",
            timezone: profile?.timezone || "UTC",
          }}
          updateProfileSettings={updateProfileSettings}
          deleteAccountAction={deleteAccountAction}
        />
      </div>
    </div>
  );
}
