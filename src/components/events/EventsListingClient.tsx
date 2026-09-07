"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { EventCategory, EventItem } from "@/lib/types/event";

const FILTERS: Array<EventCategory | "All"> = ["All", "Health", "Wealth", "Community"];

export default function EventsListingClient({ events }: { events: EventItem[] }) {
  const [activeFilter, setActiveFilter] = useState<(typeof FILTERS)[number]>("All");

  const filteredEvents = useMemo(() => {
    if (activeFilter === "All") return events;
    return events.filter((event) => event.category === activeFilter);
  }, [events, activeFilter]);

  return (
    <div className="flex flex-col gap-12 w-full">
      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-3">
        {FILTERS.map((filter) => {
          const isActive = filter === activeFilter;
          return (
            <button
              key={filter}
              type="button"
              onClick={() => setActiveFilter(filter)}
              className={`px-6 py-3 rounded-2xl font-geist font-black text-sm tracking-[0.2px] uppercase transition-colors ${
                isActive
                  ? "bg-[#ebc249] text-[#3d2e00]"
                  : "bg-[#201f1f] text-[rgba(229,226,225,0.6)] border border-[rgba(77,70,53,0.2)] hover:border-[rgba(235,194,73,0.3)] hover:text-[#e5e2e1]"
              }`}
            >
              {filter}
            </button>
          );
        })}
      </div>

      {/* Results count */}
      <p className="text-sm text-[rgba(229,226,225,0.5)]">
        Showing {filteredEvents.length} of {events.length} events
      </p>

      {/* Grid */}
      {filteredEvents.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredEvents.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center gap-4 py-24 text-center bg-[#1c1b1b] border border-[rgba(77,70,53,0.1)] rounded-[32px]">
          <p className="font-geist font-black text-xl text-[#e5e2e1]">No events found</p>
          <p className="max-w-sm text-sm text-[rgba(229,226,225,0.5)]">
            There are no upcoming {activeFilter} events right now. Check back soon or explore
            another category.
          </p>
        </div>
      )}
    </div>
  );
}

function EventCard({ event }: { event: EventItem }) {
  return (
    <div className="bg-[#201f1f] border border-[rgba(77,70,53,0.1)] rounded-[32px] overflow-hidden flex flex-col">
      <div className="relative h-48 w-full">
        <Image src={event.image} alt={event.title} fill className="object-cover" />
        <span className="absolute left-4 top-4 bg-[#ebc249] px-3 py-1 rounded-xl font-geist font-black text-[10px] tracking-[1px] uppercase text-[#3d2e00]">
          {event.category}
        </span>
        {event.price && (
          <span className="absolute right-4 top-4 backdrop-blur-md bg-[rgba(42,42,42,0.8)] border border-[rgba(235,194,73,0.2)] px-3 py-1 rounded-xl font-geist font-black text-[10px] tracking-[0.5px] uppercase text-[#e5e2e1]">
            {event.price}
          </span>
        )}
      </div>
      <div className="flex flex-col gap-2 p-8">
        <span className="font-geist font-black text-[12px] tracking-[1.2px] uppercase text-[#ebc249]">
          {event.date}
        </span>
        <h3 className="font-geist font-black text-2xl tracking-[-0.6px] text-[#e5e2e1]">
          {event.title}
        </h3>
        <p className="pb-2 pt-2 text-sm leading-5 text-[rgba(229,226,225,0.5)]">
          {event.description}
        </p>
        {event.location && (
          <div className="flex items-center gap-2 pb-6 text-sm text-[rgba(229,226,225,0.5)]">
            <PinIcon />
            {event.location}
          </div>
        )}
        <div className="flex flex-col gap-2">
          <Link
            href={`/events/${event.id}`}
            className="flex items-center justify-center py-4 rounded-2xl bg-[#353534] font-geist font-black text-[16px] text-[#e5e2e1]"
          >
            View Details
          </Link>
          {event.registrationUrl && event.isRegistrationOpen !== false && (
            <a
              href={event.registrationUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center py-4 rounded-2xl bg-[#ebc249] font-geist font-black text-[16px] text-[#3d2e00]"
            >
              Register Now
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

function PinIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M7 13s4.5-4.2 4.5-7.5a4.5 4.5 0 10-9 0C2.5 8.8 7 13 7 13z"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
      <circle cx="7" cy="5.5" r="1.5" stroke="currentColor" strokeWidth="1.3" />
    </svg>
  );
}
