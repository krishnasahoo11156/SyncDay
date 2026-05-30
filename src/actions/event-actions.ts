"use server";

import { createClient } from "@/lib/supabase/server";
import { eventSchema, EventSchemaType } from "@/lib/validation/event-schema";
import { revalidatePath } from "next/cache";

/**
 * Fetch all events belonging to the currently authenticated user.
 * Row Level Security (RLS) ensures a user can only read their own rows.
 */
export async function getEventsAction() {
  try {
    const supabase = await createClient();
    const { data: events, error } = await supabase
      .from("events")
      .select("*")
      .order("start_at", { ascending: true });

    if (error) {
      return { error: error.message };
    }

    return { events };
  } catch (err: any) {
    return { error: err.message || "An unexpected error occurred while fetching events." };
  }
}

/**
 * Creates a new calendar event in the database after validating fields.
 */
export async function createEventAction(input: EventSchemaType) {
  try {
    // Validate inputs server-side using Zod
    const validated = eventSchema.safeParse(input);
    if (!validated.success) {
      return { error: validated.error.errors[0].message };
    }

    const supabase = await createClient();

    // Get current user session ID
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { error: "Authentication session has expired. Please log in again." };
    }

    const { data: event, error } = await supabase
      .from("events")
      .insert({
        user_id: user.id,
        title: validated.data.title,
        description: validated.data.description || null,
        location: validated.data.location || null,
        start_at: validated.data.startAt,
        end_at: validated.data.endAt,
        is_all_day: validated.data.isAllDay,
        color: validated.data.color,
        sync_status: "pending",
      })
      .select()
      .single();

    if (error) {
      return { error: error.message };
    }

    revalidatePath("/dashboard");
    return { event };
  } catch (err: any) {
    return { error: err.message || "An unexpected error occurred while creating the event." };
  }
}

/**
 * Updates an existing calendar event. Marks sync_status to 'pending' to prompt a sync update.
 */
export async function updateEventAction(id: string, input: EventSchemaType) {
  try {
    const validated = eventSchema.safeParse(input);
    if (!validated.success) {
      return { error: validated.error.errors[0].message };
    }

    const supabase = await createClient();

    const { data: event, error } = await supabase
      .from("events")
      .update({
        title: validated.data.title,
        description: validated.data.description || null,
        location: validated.data.location || null,
        start_at: validated.data.startAt,
        end_at: validated.data.endAt,
        is_all_day: validated.data.isAllDay,
        color: validated.data.color,
        sync_status: "pending", // Revert back to pending so one-click sync knows it changed
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return { error: error.message };
    }

    revalidatePath("/dashboard");
    return { event };
  } catch (err: any) {
    return { error: err.message || "An unexpected error occurred while updating the event." };
  }
}

/**
 * Deletes an event by its unique ID.
 */
export async function deleteEventAction(id: string) {
  try {
    const supabase = await createClient();

    const { error } = await supabase
      .from("events")
      .delete()
      .eq("id", id);

    if (error) {
      return { error: error.message };
    }

    revalidatePath("/dashboard");
    return { success: true };
  } catch (err: any) {
    return { error: err.message || "An unexpected error occurred while deleting the event." };
  }
}
