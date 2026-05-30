"use server";

import { createClient } from "@/lib/supabase/server";
import { refreshAccessToken } from "@/lib/google/oauth";
import { getOrCreateSyncCalendar } from "@/lib/google/calendar";
import { revalidatePath } from "next/cache";

const GOOGLE_CALENDAR_API_BASE = "https://www.googleapis.com/calendar/v3";

interface SyncResult {
  success: boolean;
  attempted: number;
  succeeded: number;
  failed: number;
  error?: string;
}

/**
 * Orchestrates one-click sync, pushing local pending events to the Google secondary calendar
 */
export async function syncEventsAction(): Promise<SyncResult> {
  const supabase = await createClient();

  // 1. Authenticate user session
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, attempted: 0, succeeded: 0, failed: 0, error: "Session expired. Please log in again." };
  }

  // 2. Fetch the user's active Google Calendar connection
  const { data: connection, error: connErr } = await supabase
    .from("google_connections")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle();

  if (connErr) {
    return { success: false, attempted: 0, succeeded: 0, failed: 0, error: `Database error: ${connErr.message}` };
  }

  if (!connection || connection.revoked_at) {
    return { success: false, attempted: 0, succeeded: 0, failed: 0, error: "Google Calendar is not connected. Please connect via settings." };
  }

  let attempted = 0;
  let succeeded = 0;
  let failed = 0;
  let syncError: string | undefined;

  try {
    // 3. Refresh Access Token automatically
    const { accessToken } = await refreshAccessToken(connection.encrypted_refresh_token);

    // 4. Resolve the secondary SyncDay Events Google Calendar
    const googleCalendarId = await getOrCreateSyncCalendar(accessToken, connection.google_calendar_id);

    // If a new calendar was created, save its ID in our database
    if (googleCalendarId !== connection.google_calendar_id) {
      await supabase
        .from("google_connections")
        .update({
          google_calendar_id: googleCalendarId,
          updated_at: new Date().toISOString(),
        })
        .eq("id", connection.id);
    }

    // 5. Query local events marked as 'pending' or 'failed'
    const { data: pendingEvents, error: eventErr } = await supabase
      .from("events")
      .select("*")
      .eq("user_id", user.id)
      .in("sync_status", ["pending", "failed"]);

    if (eventErr) {
      throw new Error(`Failed to load unsynced events: ${eventErr.message}`);
    }

    if (!pendingEvents || pendingEvents.length === 0) {
      return { success: true, attempted: 0, succeeded: 0, failed: 0 };
    }

    attempted = pendingEvents.length;

    // 6. Iterate through local pending events and sync them one by one
    for (const event of pendingEvents) {
      try {
        // Query if an existing sync mapping already exists
        const { data: link } = await supabase
          .from("event_sync_links")
          .select("google_event_id")
          .eq("event_id", event.id)
          .maybeSingle();

        // Format dates correctly for Google Calendar v3 Event schemas
        const start = event.is_all_day
          ? { date: event.start_at.split("T")[0] }
          : { dateTime: event.start_at, timeZone: "UTC" };

        const end = event.is_all_day
          ? { date: event.end_at.split("T")[0] }
          : { dateTime: event.end_at, timeZone: "UTC" };

        const googleEventPayload = {
          summary: event.title,
          description: event.description || "",
          location: event.location || "",
          start: start,
          end: end,
          colorId: mapColorToGoogleId(event.color),
        };

        if (link?.google_event_id) {
          // ----------------------------------------------------
          // UPDATE existing Google Event (PUT)
          // ----------------------------------------------------
          const updateUrl = `${GOOGLE_CALENDAR_API_BASE}/calendars/${encodeURIComponent(
            googleCalendarId
          )}/events/${encodeURIComponent(link.google_event_id)}`;

          const res = await fetch(updateUrl, {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(googleEventPayload),
          });

          if (!res.ok) {
            const errData = await res.json().catch(() => ({}));
            throw new Error(errData.error?.message || `Failed to update event in Google Calendar (status ${res.status}).`);
          }

          // Update local sync mapping metadata
          await supabase
            .from("event_sync_links")
            .update({
              last_synced_at: new Date().toISOString(),
              last_event_updated_at: event.updated_at,
            })
            .eq("event_id", event.id);
        } else {
          // ----------------------------------------------------
          // INSERT brand new Google Event (POST)
          // ----------------------------------------------------
          const insertUrl = `${GOOGLE_CALENDAR_API_BASE}/calendars/${encodeURIComponent(
            googleCalendarId
          )}/events`;

          const res = await fetch(insertUrl, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(googleEventPayload),
          });

          if (!res.ok) {
            const errData = await res.json().catch(() => ({}));
            throw new Error(errData.error?.message || `Failed to insert event to Google Calendar (status ${res.status}).`);
          }

          const googleEvent = await res.json();

          // Create local sync mapping link row
          await supabase
            .from("event_sync_links")
            .insert({
              event_id: event.id,
              user_id: user.id,
              google_event_id: googleEvent.id,
              google_calendar_id: googleCalendarId,
              last_synced_at: new Date().toISOString(),
              last_event_updated_at: event.updated_at,
            });
        }

        // Mark local event sync status as 'synced'
        await supabase
          .from("events")
          .update({ sync_status: "synced", updated_at: event.updated_at })
          .eq("id", event.id);

        succeeded++;
      } catch (evtErr: any) {
        console.error(`Sync failed for event [${event.id}]:`, evtErr.message);
        failed++;
        
        // Mark local event status as failed
        await supabase
          .from("events")
          .update({ sync_status: "failed" })
          .eq("id", event.id);
      }
    }

    // 7. Update google_connections.last_synced_at
    await supabase
      .from("google_connections")
      .update({
        last_synced_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", connection.id);

  } catch (err: any) {
    console.error("General Sync Action Error:", err.message);
    syncError = err.message || "A general error halted synchronization.";
  }

  // 8. Record the transaction attempt in the `sync_logs` table
  await supabase
    .from("sync_logs")
    .insert({
      user_id: user.id,
      sync_type: "manual",
      events_attempted: attempted,
      events_succeeded: succeeded,
      events_failed: failed,
      error_message: syncError || null,
    });

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/sync-history");

  return {
    success: !syncError && failed === 0,
    attempted,
    succeeded,
    failed,
    error: syncError,
  };
}

/**
 * Maps standard hex colors to Google Calendar v3 colorIds
 * Presets: Violet (#7c3aed), Indigo (#4f46e5), Blue (#2563eb), Emerald (#059669), Amber (#d97706), Rose (#e11d48)
 */
function mapColorToGoogleId(hexColor?: string): string | undefined {
  if (!hexColor) return undefined;
  
  const lowerHex = hexColor.toLowerCase();
  
  // Google v3 Color Map:
  // 1: Lavender (Blueish), 2: Sage (Greenish), 3: Grape (Purple), 4: Flamingo (Rose), 
  // 5: Banana (Yellow), 6: Tangerine (Orange), 7: Peacock (Light Blue), 8: Graphite (Gray),
  // 9: Blueberry (Deep Blue), 10: Basil (Green), 11: Tomato (Red)
  switch (lowerHex) {
    case "#4f46e5": return "1"; // Indigo -> Lavender
    case "#059669": return "2"; // Emerald -> Sage
    case "#7c3aed": return "3"; // Violet -> Grape
    case "#e11d48": return "4"; // Rose -> Flamingo
    case "#d97706": return "6"; // Amber -> Tangerine
    case "#2563eb": return "9"; // Blue -> Blueberry
    default: return undefined;
  }
}
