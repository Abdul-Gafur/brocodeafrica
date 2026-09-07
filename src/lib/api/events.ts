import { EventItem } from "@/lib/types/event";
import { apiFetch } from "@/lib/api/client";

/**
 * Real API calls for Events (3.1).
 *
 * `/events` is paginated ({ data: EventItem[], meta, links }) and takes a
 * `scope` of upcoming | past | all. Single lookups return { data: EventItem }
 * and are keyed by slug; `getEventById` resolves an id against the full list
 * since the API has no by-id route.
 */

const REVALIDATE = 300;
const MAX_PER_PAGE = 60;

interface Paginated<T> {
  data: T[];
}

export async function getUpcomingEvents(limit?: number): Promise<EventItem[]> {
  const perPage = typeof limit === "number" ? limit : MAX_PER_PAGE;
  const { data } = await apiFetch<Paginated<EventItem>>(
    `/events?scope=upcoming&per_page=${perPage}`,
    { next: { revalidate: REVALIDATE } }
  );
  return typeof limit === "number" ? data.slice(0, limit) : data;
}

export async function getEventBySlug(
  slug: string
): Promise<EventItem | undefined> {
  try {
    const { data } = await apiFetch<{ data: EventItem }>(
      `/events/${encodeURIComponent(slug)}`,
      { next: { revalidate: REVALIDATE } }
    );
    return data;
  } catch {
    return undefined;
  }
}

export async function getEventById(id: string): Promise<EventItem | undefined> {
  const events = await getAllEvents();
  return events.find((event) => event.id === id);
}

export async function getAllEvents(): Promise<EventItem[]> {
  const { data } = await apiFetch<Paginated<EventItem>>(
    `/events?scope=all&per_page=${MAX_PER_PAGE}`,
    { next: { revalidate: REVALIDATE } }
  );
  return data;
}
