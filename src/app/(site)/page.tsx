import Image from "next/image";
import Link from "next/link";
import { getFeaturedResources } from "@/lib/api/resources";
import { getUpcomingEvents } from "@/lib/api/events";

const CORE_SERVICES = [
  {
    title: "Mental Health Support",
    description:
      "Confidential counseling and therapy sessions with professionals who understand the unique pressures of young adulthood.",
    tags: ["ANXIETY", "STRESS", "IDENTITY"],
    href: "/services/mental-health",
    variant: "default" as const,
  },
  {
    title: "SRHR Services",
    description:
      "Expert advice on sexual and reproductive health. Private consultations, digital prescriptions, and wellness trackers.",
    tags: ["HEALTH", "ADVICE", "PRIVATE"],
    href: "/services/srhr",
    variant: "default" as const,
  },
  {
    title: "Crisis Support",
    description:
      "Immediate intervention for urgent situations. Connect with a rapid response coordinator within 60 seconds.",
    tags: ["IMMEDIATE", "EMERGENCY"],
    href: "/support",
    variant: "crisis" as const,
    badge: "24/7 PRIORITY",
  },
];

const JOURNEY_STEPS = [
  {
    number: "01",
    title: "Connect Anonymously",
    description: "Create your profile with a pseudonym. Your privacy is our highest priority.",
  },
];

export default async function HomePage() {
  const [events, resources] = await Promise.all([
    getUpcomingEvents(3),
    getFeaturedResources(4),
  ]);

  return (
    <div className="flex flex-col items-center w-full">
      {/* Hero Section */}
      <section className="relative w-full flex items-center justify-center min-h-[600px] md:min-h-[870px] overflow-hidden px-6 py-16">
        <div className="grid md:grid-cols-2 gap-12 max-w-[1280px] w-full items-center">
          <div className="flex flex-col gap-6 order-2 md:order-1">
            <span className="inline-block w-fit bg-[#2a2a2a] px-4 py-[6px] rounded-xl font-geist font-black text-[10px] tracking-[1px] uppercase text-[#ebc249]">
              Brocode Digital Sovereign
            </span>
            <h1 className="font-geist font-black text-[48px] md:text-[72px] lg:text-[96px] leading-[1] tracking-[-4.8px] text-[#e5e2e1]">
              Your Future,
              <br />
              <span className="font-normal text-[#ebc249]">Your Choice.</span>
            </h1>
            <p className="max-w-[512px] text-[20px] leading-7 text-[rgba(229,226,225,0.7)]">
              A dedicated digital sanctuary designed for the modern African youth. Access
              critical SRHR resources, mental wellness support, and financial literacy training
              in one safe, anonymous space.
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <Link
                href="/support"
                className="flex items-center justify-center px-8 py-[17px] rounded-lg font-geist font-black text-[18px] text-[#3d2e00] shadow-[0px_10px_15px_-3px_rgba(235,194,73,0.2),0px_4px_6px_-4px_rgba(235,194,73,0.2)]"
                style={{
                  backgroundImage:
                    "linear-gradient(135deg, rgb(203, 164, 45) 0%, rgb(166, 133, 37) 100%)",
                }}
              >
                Get Support
              </Link>
              <Link
                href="/resources"
                className="flex items-center justify-center px-8 py-[17px] rounded-lg font-geist font-black text-[18px] text-[#ebc249] bg-[#353534] border border-[rgba(235,194,73,0.2)]"
              >
                Explore Resources
              </Link>
            </div>
          </div>

          <div className="relative order-1 md:order-2 flex items-center justify-center">
            <div className="rotate-2 aspect-[4/5] w-full max-w-[420px] rounded-[32px] border border-[rgba(235,194,73,0.1)] shadow-[0px_25px_50px_-12px_rgba(0,0,0,0.25)] overflow-hidden relative">
              <Image
                src="/images/community.png"
                alt="Brocode Africa community"
                fill
                className="object-cover mix-blend-luminosity"
                priority
              />
            </div>
            <div className="absolute -bottom-6 -left-5 max-w-[320px] backdrop-blur-md bg-[rgba(42,42,42,0.8)] border border-[rgba(235,194,73,0.3)] rounded-3xl px-8 py-8 pr-16 shadow-[0px_20px_25px_-5px_rgba(0,0,0,0.5),0px_8px_10px_-6px_rgba(0,0,0,0.5)] flex flex-col gap-4">
              <ShieldIcon />
              <p className="font-bold text-[16px] leading-6 text-[#e5e2e1]">
                100% Anonymous &amp; Secure
                <br />
                Brocode Space.
              </p>
            </div>
          </div>
        </div>
        <div className="absolute -right-1/4 top-[-435px] bottom-[435px] w-1/3 bg-[rgba(235,194,73,0.05)] blur-[60px] rounded-xl" />
      </section>

      {/* Core Support Services */}
      <section className="bg-[#0e0e0e] w-full flex flex-col items-center px-6 py-24">
        <div className="flex flex-col gap-24 max-w-[1280px] w-full">
          <div className="flex flex-col gap-6 items-center text-center">
            <span className="bg-[#201f1f] border border-[rgba(77,70,53,0.2)] px-[17px] py-[7px] rounded-xl font-geist font-black text-[10px] tracking-[2px] uppercase text-[#ebc249]">
              Digital Sovereign
            </span>
            <h2 className="font-geist font-black text-[36px] md:text-[60px] tracking-[-3px] text-[#e5e2e1]">
              Support on <span className="font-normal text-[#ebc249]">your terms.</span>
            </h2>
            <p className="max-w-[672px] text-[20px] leading-7 text-[rgba(229,226,225,0.6)]">
              Expert-backed services designed for the modern African youth. Secure, confidential,
              and always within reach.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {CORE_SERVICES.map((service) => (
              <div
                key={service.title}
                className={`relative flex flex-col gap-4 p-8 rounded-[32px] shadow-[0px_10px_30px_0px_rgba(0,0,0,0.5),0px_4px_12px_0px_rgba(235,194,73,0.04)] border ${
                  service.variant === "crisis"
                    ? "bg-[#201f1f] border-[rgba(235,194,73,0.2)]"
                    : "bg-[#1c1b1b] border-[rgba(77,70,53,0.1)]"
                }`}
              >
                {service.badge && (
                  <span className="absolute -top-4 right-8 bg-[#ffb4ab] text-[#690005] font-geist font-black text-[10px] tracking-[1px] uppercase px-4 py-1 rounded-xl">
                    {service.badge}
                  </span>
                )}
                <div
                  className={`size-16 rounded-2xl flex items-center justify-center ${
                    service.variant === "crisis" ? "bg-[rgba(235,194,73,0.1)]" : "bg-[#2a2a2a]"
                  }`}
                >
                  <ServiceIcon variant={service.variant} title={service.title} />
                </div>
                <h3 className="font-geist font-black text-2xl tracking-[-0.6px] text-[#e5e2e1]">
                  {service.title}
                </h3>
                <p className="text-[16px] leading-[26px] text-[rgba(229,226,225,0.5)]">
                  {service.description}
                </p>
                <div className="flex gap-2 pb-2">
                  {service.tags.map((tag) => (
                    <span
                      key={tag}
                      className={`px-3 py-1 rounded-xl font-geist font-black text-[10px] tracking-[0.5px] uppercase ${
                        service.variant === "crisis"
                          ? "bg-[rgba(255,180,171,0.1)] text-[#ffb4ab]"
                          : "bg-[rgba(53,53,52,0.3)] text-[rgba(229,226,225,0.4)]"
                      }`}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <Link
                  href={service.href}
                  className="flex items-center justify-center gap-2 py-4 rounded-2xl bg-[#ebc249] font-geist font-black text-[16px] text-[#3d2e00]"
                >
                  Get Help
                  <ArrowRightIcon />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="bg-[#1c1b1b] w-full flex flex-col items-center px-6 py-24">
        <div className="flex flex-col gap-16 max-w-[1280px] w-full">
          <div className="flex flex-col sm:flex-row items-end justify-between gap-6">
            <div className="flex flex-col gap-4">
              <h2 className="font-geist font-black text-[36px] md:text-[48px] tracking-[-1.2px] text-[#e5e2e1]">
                Upcoming Events
              </h2>
              <p className="max-w-md text-[16px] leading-6 text-[rgba(229,226,225,0.6)]">
                Connect, learn, and grow with the Brocode community at our next gathering.
              </p>
            </div>
            <Link href="/events" className="flex items-center gap-2 font-bold text-[#ebc249]">
              See All Events
              <ArrowRightIcon small />
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {events.map((event) => (
              <div
                key={event.id}
                className="bg-[#201f1f] border border-[rgba(77,70,53,0.1)] rounded-[32px] overflow-hidden flex flex-col"
              >
                <div className="relative h-48 w-full">
                  <Image src={event.image} alt={event.title} fill className="object-cover" />
                  <span className="absolute left-4 top-4 bg-[#ebc249] px-3 py-1 rounded-xl font-geist font-black text-[10px] tracking-[1px] uppercase text-[#3d2e00]">
                    {event.category}
                  </span>
                </div>
                <div className="flex flex-col gap-2 p-8">
                  <span className="font-geist font-black text-[12px] tracking-[1.2px] uppercase text-[#ebc249]">
                    {event.date}
                  </span>
                  <h3 className="font-geist font-black text-2xl tracking-[-0.6px] text-[#e5e2e1]">
                    {event.title}
                  </h3>
                  <p className="pb-6 pt-2 text-sm leading-5 text-[rgba(229,226,225,0.5)]">
                    {event.description}
                  </p>
                  <Link
                    href={`/events/${event.id}`}
                    className="flex items-center justify-center py-4 rounded-2xl bg-[#353534] font-geist font-black text-[16px] text-[#e5e2e1]"
                  >
                    Register Now
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* The Brocode Journey */}
      <section className="flex flex-col gap-16 max-w-[1280px] w-full px-6 py-24">
        <h2 className="font-geist font-black text-[36px] md:text-[48px] tracking-[-1.2px] text-[#e5e2e1] text-center">
          The Brocode Journey
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <div className="md:col-span-4 relative bg-[#201f1f] border border-[rgba(77,70,53,0.1)] rounded-[32px] p-8 flex flex-col justify-end overflow-hidden min-h-[280px]">
            <span className="absolute right-8 top-8 font-geist text-[60px] text-[#ebc249] opacity-20">
              {JOURNEY_STEPS[0].number}
            </span>
            <div className="absolute -right-10 -top-10 size-40 bg-[rgba(235,194,73,0.1)] blur-2xl rounded-xl" />
            <div className="flex flex-col gap-2">
              <h4 className="font-geist font-black text-2xl text-[#e5e2e1]">
                {JOURNEY_STEPS[0].title}
              </h4>
              <p className="text-[16px] leading-6 text-[rgba(229,226,225,0.6)]">
                {JOURNEY_STEPS[0].description}
              </p>
            </div>
          </div>

          <div className="md:col-span-8 relative bg-[#2a2a2a] border border-[rgba(77,70,53,0.1)] rounded-[32px] px-8 pt-20 pb-8 flex flex-col gap-12 overflow-hidden min-h-[280px]">
            <span className="absolute right-8 top-8 font-geist text-[60px] text-[#ebc249] opacity-20">
              02
            </span>
            <div className="max-w-[448px] flex flex-col gap-4">
              <h4 className="font-geist font-black text-3xl text-[#e5e2e1]">Find Your Resource</h4>
              <p className="text-[18px] leading-7 text-[rgba(229,226,225,0.7)]">
                {`Browse our editorial-grade library or use "Ma Guy" to find exactly what you need in seconds.`}
              </p>
            </div>
            <div className="flex gap-4 overflow-x-auto">
              {["Library", "Ma Guy", "Marketplace"].map((label) => (
                <div
                  key={label}
                  className="bg-[#2a2a2a] border border-[rgba(235,194,73,0.1)] rounded-2xl h-32 w-48 shrink-0 flex items-center justify-center font-geist font-bold text-sm text-[rgba(229,226,225,0.6)]"
                >
                  {label}
                </div>
              ))}
            </div>
          </div>

          <div className="md:col-span-12 relative bg-[#ebc249] rounded-[32px] p-8 flex items-center overflow-hidden shadow-[0px_20px_25px_-5px_rgba(235,194,73,0.1),0px_8px_10px_-6px_rgba(235,194,73,0.1)]">
            <div className="max-w-xl flex flex-col gap-4">
              <h4 className="font-geist font-black text-3xl md:text-4xl text-[#3d2e00]">
                Empower Your Life
              </h4>
              <p className="font-geist font-black text-[20px] leading-7 text-[rgba(61,46,0,0.8)]">
                Take real steps towards independence and health with Brocode experts at your
                side.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Resources */}
      <section className="bg-[#1c1b1b] w-full flex flex-col items-center px-6 py-24">
        <div className="flex flex-col gap-12 max-w-[1280px] w-full">
          <div className="flex items-end justify-between">
            <h2 className="font-geist font-black text-[36px] text-[#e5e2e1]">
              Featured Resources
            </h2>
            <Link href="/resources" className="font-bold text-[#ebc249]">
              View All
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {resources.map((resource) => (
              <div
                key={resource.id}
                className="bg-[#201f1f] border border-[rgba(77,70,53,0.05)] rounded-2xl overflow-hidden flex flex-col"
              >
                <div className="relative h-48 w-full">
                  <Image src={resource.image} alt={resource.title} fill className="object-cover" />
                </div>
                <div className="flex flex-col gap-2 p-6">
                  <span className="font-geist font-black text-[10px] tracking-[1px] uppercase text-[#ebc249]">
                    {resource.category}
                  </span>
                  <h3 className="pb-2 font-geist font-black text-lg text-[#e5e2e1]">
                    {resource.title}
                  </h3>
                  <Link
                    href={`/resources/${resource.slug}`}
                    className="flex items-center justify-center py-3 rounded bg-[#353534] font-geist font-black text-sm text-[#e5e2e1]"
                  >
                    Read Article
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="bg-[#ebc249] w-full flex flex-col items-center px-6 py-24">
        <div className="relative max-w-[1280px] w-full bg-[#0e0e0e] rounded-[48px] overflow-hidden flex flex-col items-center px-6 md:px-[120px] pt-24 pb-28">
          <div className="absolute -right-24 -top-24 size-64 bg-[rgba(235,194,73,0.05)] blur-3xl rounded-xl" />
          <div className="absolute -bottom-24 -left-24 size-64 bg-[rgba(235,194,73,0.05)] blur-3xl rounded-xl" />
          <div className="flex flex-col gap-6 items-center max-w-3xl w-full relative">
            <span className="bg-[rgba(235,194,73,0.1)] px-4 py-[6px] rounded-xl font-geist font-black text-[10px] tracking-[1px] uppercase text-[#ebc249]">
              Join the Squad
            </span>
            <h2 className="font-geist font-black text-[36px] md:text-[60px] tracking-[-1.5px] text-[#e5e2e1] text-center">
              Code the Future with Us
            </h2>
            <p className="text-[20px] leading-7 text-[rgba(229,226,225,0.6)] text-center">
              Weekly insights on tech, wealth, and wellness delivered straight to your inbox. No
              spam, just sovereignty.
            </p>
            <form className="flex flex-col sm:flex-row gap-4 max-w-xl w-full pt-6">
              <input
                type="email"
                required
                placeholder="Enter your email"
                className="flex-1 bg-[#2a2a2a] border border-[rgba(77,70,53,0.2)] rounded-2xl px-6 py-[18px] text-[16px] text-[#e5e2e1] placeholder:text-[rgba(229,226,225,0.3)] outline-none focus:border-[#ebc249]"
              />
              <button
                type="submit"
                className="bg-[#ebc249] rounded-2xl px-8 py-[18px] font-geist font-black text-[16px] text-[#3d2e00] shadow-[0px_20px_25px_-5px_rgba(235,194,73,0.2),0px_8px_10px_-6px_rgba(235,194,73,0.2)]"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}

function ShieldIcon() {
  return (
    <svg width="24" height="30" viewBox="0 0 24 30" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M12 1l10 4v8c0 8-4.5 12.5-10 16C6.5 25.5 2 21 2 13V5l10-4z"
        stroke="#e5e2e1"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path d="M8 14l3 3 5-6" stroke="#ebc249" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ArrowRightIcon({ small }: { small?: boolean }) {
  const size = small ? 11 : 12;
  return (
    <svg width={size} height={size} viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M2 6h8M6 2l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ServiceIcon({
  variant,
  title,
}: {
  variant: "default" | "crisis";
  title: string;
}) {
  const color = variant === "crisis" ? "#ebc249" : "#ebc249";
  if (title === "Mental Health Support") {
    return (
      <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M12 21s-8-4.5-8-11a5 5 0 019-3 5 5 0 019 3c0 6.5-8 11-8 11z"
          stroke={color}
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
      </svg>
    );
  }
  if (title === "SRHR Services") {
    return (
      <svg width="20" height="25" viewBox="0 0 20 25" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M10 1v8m0 0a6 6 0 106 6" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="10" cy="17" r="6" stroke={color} strokeWidth="1.5" />
      </svg>
    );
  }
  return (
    <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M12.5 2L2 21h21L12.5 2z"
        stroke={color}
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path d="M12.5 10v5" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="12.5" cy="18" r="0.75" fill={color} />
    </svg>
  );
}
