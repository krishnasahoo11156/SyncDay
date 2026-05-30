"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { revokeGoogleToken } from "@/lib/google/oauth";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const profileSchema = z.object({
  displayName: z
    .string()
    .trim()
    .min(2, "Display name must be at least 2 characters")
    .max(50, "Display name must be under 50 characters"),
  timezone: z.string().trim().min(1, "Timezone is required"),
});

export async function updateProfileSettings(formData: FormData) {
  try {
    const displayName = formData.get("displayName") as string;
    const timezone = formData.get("timezone") as string;

    const result = profileSchema.safeParse({ displayName, timezone });
    if (!result.success) {
      return { error: result.error.errors[0].message };
    }

    const supabase = await createClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      return { error: "Unauthorized access" };
    }

    const { error: updateError } = await supabase
      .from("profiles")
      .update({
        display_name: displayName,
        timezone,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id);

    if (updateError) {
      return { error: updateError.message };
    }

    revalidatePath("/dashboard/settings");
    revalidatePath("/dashboard");
    return { success: true };
  } catch (err: any) {
    return { error: err.message || "An unexpected error occurred." };
  }
}

export async function deleteAccountAction() {
  let shouldRedirect = false;

  try {
    const supabase = await createClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      return { error: "Unauthorized access" };
    }

    // 1. Fetch any active Google connection
    const { data: connection } = await supabase
      .from("google_connections")
      .select("encrypted_refresh_token, revoked_at")
      .eq("user_id", user.id)
      .maybeSingle();

    // 2. Revoke access on Google servers if there's a token
    if (connection && !connection.revoked_at && connection.encrypted_refresh_token) {
      try {
        await revokeGoogleToken(connection.encrypted_refresh_token);
      } catch (revokeErr: any) {
        console.warn("Failed to revoke Google token during account deletion:", revokeErr.message);
      }
    }

    // 3. Delete the user from Supabase auth. Cascades to public schema tables.
    const adminClient = createAdminClient();
    const { error: deleteError } = await adminClient.auth.admin.deleteUser(user.id);

    if (deleteError) {
      return { error: deleteError.message };
    }

    // 4. Force session clear local client side
    await supabase.auth.signOut();
    shouldRedirect = true;
  } catch (err: any) {
    return { error: err.message || "An unexpected error occurred during deletion." };
  }

  if (shouldRedirect) {
    redirect("/signup");
  }
}
