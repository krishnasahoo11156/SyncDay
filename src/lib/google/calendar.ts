const GOOGLE_CALENDAR_API_BASE = "https://www.googleapis.com/calendar/v3";

export interface GoogleCalendar {
  id: string;
  summary: string;
  description?: string;
  timeZone?: string;
}

/**
 * Checks if a specific Google Calendar ID exists and is accessible
 */
export async function getGoogleCalendar(accessToken: string, calendarId: string): Promise<GoogleCalendar | null> {
  const url = `${GOOGLE_CALENDAR_API_BASE}/calendars/${encodeURIComponent(calendarId)}`;

  const res = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  });

  if (res.status === 404) {
    return null;
  }

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error?.message || "Failed to fetch Google Calendar details.");
  }

  return {
    id: data.id,
    summary: data.summary,
    description: data.description,
    timeZone: data.timeZone,
  };
}

/**
 * Lists all calendars in the authenticated user's Google Calendar list
 */
export async function listGoogleCalendars(accessToken: string): Promise<GoogleCalendar[]> {
  const url = `${GOOGLE_CALENDAR_API_BASE}/users/me/calendarList`;

  const res = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error?.message || "Failed to retrieve Google Calendar list.");
  }

  return (data.items || []).map((item: any) => ({
    id: item.id,
    summary: item.summary,
    description: item.description,
    timeZone: item.timeZone,
  }));
}

/**
 * Creates a new secondary calendar in the user's Google Calendar
 */
export async function createGoogleCalendar(accessToken: string, summary: string): Promise<GoogleCalendar> {
  const url = `${GOOGLE_CALENDAR_API_BASE}/calendars`;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      summary: summary,
      description: "Dedicated calendar managed by SyncDay (https://syncday.app)",
    }),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error?.message || "Failed to create secondary Google Calendar.");
  }

  return {
    id: data.id,
    summary: data.summary,
    description: data.description,
    timeZone: data.timeZone,
  };
}

/**
 * Dynamic resolution manager: Resolves, verifies, or creates the dedicated 'SyncDay Events' calendar
 */
export async function getOrCreateSyncCalendar(accessToken: string, savedCalendarId: string | null): Promise<string> {
  const CALENDAR_NAME = "SyncDay Events";

  // 1. If we have a saved ID, check if it still exists and is accessible
  if (savedCalendarId) {
    try {
      const calendar = await getGoogleCalendar(accessToken, savedCalendarId);
      if (calendar) {
        return calendar.id;
      }
    } catch (err: any) {
      console.warn("Saved SyncDay calendar ID check failed, looking for replacement:", err.message);
    }
  }

  // 2. If no saved ID or the saved calendar was deleted, list all calendars to see if an active one exists
  const calendars = await listGoogleCalendars(accessToken);
  const existingCalendar = calendars.find(
    (cal) => cal.summary.toLowerCase() === CALENDAR_NAME.toLowerCase()
  );

  if (existingCalendar) {
    return existingCalendar.id;
  }

  // 3. If no calendar with this name exists, create it
  const newCalendar = await createGoogleCalendar(accessToken, CALENDAR_NAME);
  return newCalendar.id;
}
