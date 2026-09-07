export type EventCategory = "Health" | "Wealth" | "Community";

export interface EventItem {
  id: string;
  slug: string;
  title: string;
  description: string;
  /** Short display date used on cards, e.g. "AUG 15 • 4:00 PM" */
  date: string;
  /** ISO date (yyyy-mm-dd) used for sorting/filtering once a real calendar is wired up */
  isoDate: string;
  /** Display time only, e.g. "4:00 PM - 6:00 PM" */
  time: string;
  category: EventCategory;
  image: string;
  location?: string;
  /** Full venue/address line for the detail page */
  venue?: string;
  attendees?: number;
  /** "Free" or a formatted price string, e.g. "Free", "GHS 50" */
  price?: string;
  /** Longer copy for the event detail page */
  fullDescription?: string;
  /** Bullet points describing what attendees can expect */
  highlights?: string[];
  /** ISO 8601 start/end timestamps */
  startsAt?: string;
  endsAt?: string;
  /** Whether sign-ups are currently open */
  isRegistrationOpen?: boolean;
  /** External sign-up link the "Register" button sends attendees to */
  registrationUrl?: string;
}
