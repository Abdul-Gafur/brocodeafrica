import { EventItem } from "@/lib/types/event";
import { MOCK_EVENTS } from "@/lib/data/events";

/**
 * Swap the body of these functions for `apiFetch<EventItem[]>("/events")` once
 * the backend is available. The signatures are designed to match a typical
 * REST/GraphQL resource endpoint so callers never need to change.
 */
export async function getUpcomingEvents(limit?: number): Promise<EventItem[]> {
  const events = MOCK_EVENTS;
  return typeof limit === "number" ? events.slice(0, limit) : events;
}

export async function getEventBySlug(slug: string): Promise<EventItem | undefined> {
  return MOCK_EVENTS.find((event) => event.slug === slug);
}

export async function getEventById(id: string): Promise<EventItem | undefined> {
  return MOCK_EVENTS.find((event) => event.id === id);
}

export async function getAllEvents(): Promise<EventItem[]> {
  return MOCK_EVENTS;
}
