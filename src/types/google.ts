export interface GoogleConnection {
  id: string;
  userId: string;
  googleEmail: string;
  googleCalendarId?: string;
  connectedAt: string;
  lastSyncedAt?: string;
  revokedAt?: string;
}

export interface SyncLog {
  id: string;
  userId: string;
  syncType: string;
  eventsAttempted: number;
  eventsSucceeded: number;
  eventsFailed: number;
  errorMessage?: string;
  createdAt: string;
}
