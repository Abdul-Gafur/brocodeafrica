import { getAllEvents } from "@/lib/api/events";
import EventsListingClient from "@/components/events/EventsListingClient";

export default async function EventsPage() {
  const events = await getAllEvents();

  return (
    <div className="flex flex-col items-center w-full">
      {/* Header */}
      <section className="relative w-full flex flex-col items-center px-6 pt-16 pb-20 overflow-hidden">
        <div className="flex flex-col gap-6 items-center text-center max-w-[720px] relative">
          <span className="inline-block w-fit bg-[#2a2a2a] px-4 py-[6px] rounded-xl font-geist font-black text-[10px] tracking-[1px] uppercase text-[#ebc249]">
            Community Calendar
          </span>
          <h1 className="font-geist font-black text-[36px] md:text-[60px] tracking-[-2px] text-[#e5e2e1]">
            Events <span className="font-normal text-[#ebc249]">Listing.</span>
          </h1>
          <p className="max-w-[560px] text-[18px] leading-7 text-[rgba(229,226,225,0.6)]">
            Connect, learn, and grow with the Brocode community. Browse upcoming workshops,
            summits, and support circles across health, wealth, and community.
          </p>
        </div>
        <div className="absolute -right-1/4 top-[-200px] w-1/3 h-[400px] bg-[rgba(235,194,73,0.05)] blur-[60px] rounded-xl" />
      </section>

      {/* Listing */}
      <section className="w-full flex flex-col items-center px-6 pb-24">
        <div className="max-w-[1280px] w-full">
          <EventsListingClient events={events} />
        </div>
      </section>
    </div>
  );
}
