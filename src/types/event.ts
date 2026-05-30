export interface CalendarEvent {
  id?: string;
  userId: string;
  title: string;
  description?: string;
  location?: string;
  startAt: string; // ISO String
  endAt: string; // ISO String
  isAllDay: boolean;
  color?: string;
  syncStatus: 'pending' | 'synced' | 'failed';
  createdAt?: string;
  updatedAt?: string;
}

export type EventInput = Omit<CalendarEvent, 'id' | 'userId' | 'syncStatus' | 'createdAt' | 'updatedAt'>;
