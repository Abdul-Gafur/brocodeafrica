import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllEvents, getEventById } from "@/lib/api/events";
import RegisterButton from "@/components/events/RegisterButton";

export async function generateStaticParams() {
  const events = await getAllEvents();
  return events.map((event) => ({ id: event.id }));
}

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const event = await getEventById(id);

  if (!event) {
    notFound();
  }

  return (
    <div className="flex flex-col items-center w-full">
      {/* Hero image */}
      <section className="relative w-full flex flex-col items-center px-6 pt-12 pb-16">
        <div className="max-w-[1280px] w-full flex flex-col gap-8">
          <Link
            href="/events"
            className="flex items-center gap-2 w-fit text-sm font-bold text-[rgba(229,226,225,0.6)] hover:text-[#ebc249]"
          >
            <ArrowLeftIcon />
            Back to Events
          </Link>

          <div className="relative h-[280px] md:h-[420px] w-full rounded-[32px] overflow-hidden border border-[rgba(77,70,53,0.1)]">
            <Image src={event.image} alt={event.title} fill sizes="(max-width: 1024px) 100vw, 900px" className="object-cover" priority />
            <span className="absolute left-6 top-6 bg-[#ebc249] px-4 py-[6px] rounded-xl font-geist font-black text-[10px] tracking-[1px] uppercase text-[#3d2e00]">
              {event.category}
            </span>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="w-full flex flex-col items-center px-6 pb-24">
        <div className="max-w-[1280px] w-full grid md:grid-cols-3 gap-12">
          {/* Main column */}
          <div className="md:col-span-2 flex flex-col gap-6">
            <span className="font-geist font-black text-[14px] tracking-[1.2px] uppercase text-[#ebc249]">
              {event.date}
            </span>
            <h1 className="font-geist font-black text-[36px] md:text-[48px] leading-tight tracking-[-1.2px] text-[#e5e2e1]">
              {event.title}
            </h1>
            <p className="text-[18px] leading-7 text-[rgba(229,226,225,0.7)]">
              {event.fullDescription ?? event.description}
            </p>

            {event.highlights && event.highlights.length > 0 && (
              <div className="flex flex-col gap-4 pt-4">
                <h2 className="font-geist font-black text-xl text-[#e5e2e1]">
                  What to expect
                </h2>
                <ul className="flex flex-col gap-3">
                  {event.highlights.map((highlight) => (
                    <li
                      key={highlight}
                      className="flex items-start gap-3 text-[16px] leading-6 text-[rgba(229,226,225,0.6)]"
                    >
                      <span className="mt-[10px] size-1.5 rounded-full bg-[#ebc249] shrink-0" />
                      {highlight}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="flex flex-col gap-6">
            <div className="bg-[#1c1b1b] border border-[rgba(77,70,53,0.1)] rounded-[32px] p-8 flex flex-col gap-6">
              <DetailRow icon={<CalendarIcon />} label="Date & Time" value={event.time} />
              {event.venue && (
                <DetailRow icon={<PinIcon />} label="Venue" value={event.venue} />
              )}
              {event.location && (
                <DetailRow icon={<PinIcon />} label="Location" value={event.location} />
              )}
              {event.attendees !== undefined && (
                <DetailRow
                  icon={<UsersIcon />}
                  label="Attending"
                  value={`${event.attendees} people`}
                />
              )}
              {event.price && (
                <DetailRow icon={<TagIcon />} label="Price" value={event.price} />
              )}

              <div className="pt-2">
                <RegisterButton
                  registrationUrl={event.registrationUrl}
                  isRegistrationOpen={event.isRegistrationOpen}
                  className="flex items-center justify-center gap-2 w-full px-8 py-[16px] rounded-2xl font-geist font-black text-[16px]"
                />
                <p className="pt-3 text-xs text-[rgba(229,226,225,0.4)]">
                  You&apos;ll be taken to the event sign-up page in a new tab.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function DetailRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="size-9 rounded-xl bg-[#2a2a2a] flex items-center justify-center text-[#ebc249] shrink-0">
        {icon}
      </div>
      <div className="flex flex-col gap-0.5">
        <span className="text-xs uppercase tracking-[0.5px] text-[rgba(229,226,225,0.4)]">
          {label}
        </span>
        <span className="text-[15px] font-bold text-[#e5e2e1]">{value}</span>
      </div>
    </div>
  );
}

function ArrowLeftIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M13.333 8H2.667M2.667 8L7.333 3.333M2.667 8l4.666 4.667"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="2" y="3" width="12" height="11" rx="1.5" stroke="currentColor" strokeWidth="1.3" />
      <path d="M2 6.5h12M5 1.5v3M11 1.5v3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}

function PinIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
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

function UsersIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="6" cy="5" r="2.3" stroke="currentColor" strokeWidth="1.3" />
      <path
        d="M1.5 13.5c0-2.5 2-4 4.5-4s4.5 1.5 4.5 4M10.5 4.2a2.3 2.3 0 010 4.4M14.5 13c0-2-1.6-3.5-3.5-3.9"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
    </svg>
  );
}

function TagIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M8.7 1.5H3a1.5 1.5 0 00-1.5 1.5v5.7c0 .4.16.78.44 1.06l6.6 6.6c.58.58 1.53.58 2.12 0l4.24-4.24c.58-.58.58-1.53 0-2.12l-6.6-6.6a1.5 1.5 0 00-1.06-.44V1.5z"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
      <circle cx="5" cy="5" r="1" fill="currentColor" />
    </svg>
  );
}
