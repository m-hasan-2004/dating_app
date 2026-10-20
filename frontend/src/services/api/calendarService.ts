import { apiClient } from "./client";

export interface CalendarEventItem {
  id: number | string;
  user: string;
  user_username?: string;
  created_by?: string | null;
  created_by_username?: string | null;
  is_admin_created: boolean;
  title: string;
  description: string;
  start_date: string;
  end_date?: string | null;
  category: "primary" | "danger" | "success" | "warning" | string;
  created_at?: string;
  updated_at?: string;
}

export interface CreateCalendarEventPayload {
  user?: string;
  title: string;
  description?: string;
  start_date: string;
  end_date?: string | null;
  category?: string;
}

export interface UpdateCalendarEventPayload {
  title?: string;
  description?: string;
  start_date?: string;
  end_date?: string | null;
  category?: string;
}

/**
 * Fetch calendar events.
 * If userId is passed (admin usage), fetches all events for that specific user.
 * If no userId is passed, fetches current user's events.
 */
export async function fetchCalendarEvents(userId?: string): Promise<CalendarEventItem[]> {
  const params: Record<string, string> = {};
  if (userId) {
    params.user_id = userId;
  }
  const res = await apiClient<any>("/api/calendar-events/", { params });
  if (Array.isArray(res)) {
    return res;
  }
  if (res && Array.isArray(res.results)) {
    return res.results;
  }
  return [];
}

/**
 * Create a new calendar event.
 */
export async function createCalendarEvent(
  payload: CreateCalendarEventPayload
): Promise<CalendarEventItem> {
  return apiClient<CalendarEventItem>("/api/calendar-events/", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

/**
 * Update an existing calendar event.
 */
export async function updateCalendarEvent(
  id: number | string,
  payload: UpdateCalendarEventPayload
): Promise<CalendarEventItem> {
  return apiClient<CalendarEventItem>(`/api/calendar-events/${id}/`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

/**
 * Delete a calendar event.
 */
export async function deleteCalendarEvent(id: number | string): Promise<void> {
  return apiClient<void>(`/api/calendar-events/${id}/`, {
    method: "DELETE",
  });
}
