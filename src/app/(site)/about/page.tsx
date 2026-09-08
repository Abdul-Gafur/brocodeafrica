import Image from "next/image";
import Link from "next/link";

const CORE_VALUES = [
  {
    title: "Privacy First",
    description:
      "No real names required, no judgment passed. Every conversation, booking, and record is built to protect your identity by default, not as an afterthought.",
    icon: "privacy" as const,
  },
  {
    title: "Radical Accessibility",
    description:
      "Free or low-cost by design. We build for the youth on a shared data bundle in a small town, not just the youth with fibre in the capital.",
    icon: "access" as const,
  },
  {
    title: "Pan-African Pride",
    description:
      "Our content, our clinicians, our context. We speak to African realities in African voices, without importing shame from elsewhere.",
    icon: "pride" as const,
  },
  {
    title: "Evidence-Based Care",
    description:
      "Every resource is reviewed by licensed professionals. Compassion opens the door; clinical rigor is what you find on the other side.",
    icon: "care" as const,
  },
];

const IMPACT_STATS = [
  { value: "50,000+", label: "Anonymous Sessions Held" },
  { value: "15", label: "African Countries Reached" },
  { value: "24/7", label: "Crisis Support Availability" },
  { value: "100%", label: "Confidential, Always" },
];

export default function AboutPage() {
  return (
    <div className="flex flex-col items-center w-full">
      {/* Hero */}
      <section className="relative w-full flex items-center justify-center overflow-hidden px-6 py-24">
        <div className="flex flex-col gap-6 items-center text-center max-w-[768px] w-full relative">
          <span className="inline-block w-fit bg-[#2a2a2a] px-4 py-[6px] rounded-xl font-geist font-black text-[10px] tracking-[1px] uppercase text-[#ebc249]">
            Our Story
          </span>
          <h1 className="font-geist font-black text-[48px] md:text-[72px] leading-[1] tracking-[-3.6px] text-[#e5e2e1]">
            Built By Africa,
            <br />
            <span className="font-normal text-[#ebc249]">For Africa&apos;s Future.</span>
          </h1>
          <p className="max-w-[620px] text-[20px] leading-7 text-[rgba(229,226,225,0.7)]">
            Brocode Africa is a digital sanctuary for young people across the continent —
            a place to ask the questions you can&apos;t ask at home, get care you can afford,
            and grow into your future without shame or gatekeeping standing in the way.
          </p>
        </div>
        <div className="absolute -left-1/4 top-[-200px] w-1/3 h-[600px] bg-[rgba(235,194,73,0.05)] blur-[60px] rounded-xl" />
      </section>

      {/* Mission / Story */}
      <section className="bg-[#1c1b1b] w-full flex flex-col items-center px-6 py-24">
        <div className="grid md:grid-cols-2 gap-12 max-w-[1280px] w-full items-center">
          <div className="flex flex-col gap-6 order-2 md:order-1">
            <span className="inline-block w-fit bg-[#201f1f] border border-[rgba(77,70,53,0.2)] px-[17px] py-[7px] rounded-xl font-geist font-black text-[10px] tracking-[2px] uppercase text-[#ebc249]">
              Why We Exist
            </span>
            <h2 className="font-geist font-black text-[36px] md:text-[48px] tracking-[-1.2px] text-[#e5e2e1]">
              The gap we&apos;re closing.
            </h2>
            <p className="text-[18px] leading-7 text-[rgba(229,226,225,0.7)]">
              Across the continent, millions of young Africans grow up with unanswered
              questions about their bodies, their minds, and their money — questions their
              schools won&apos;t teach, their clinics are too far or too judgmental to answer,
              and their families are too silent to raise.
            </p>
            <p className="text-[18px] leading-7 text-[rgba(229,226,225,0.6)]">
              Brocode Africa was founded to close that gap. We built a single, anonymous home
              for sexual and reproductive health information, mental wellness support, and
              financial literacy — designed for a generation that deserves privacy, dignity,
              and a service that actually looks and sounds like them.
            </p>
            <p className="text-[18px] leading-7 text-[rgba(229,226,225,0.6)]">
              This isn&apos;t a foreign app localized for Africa. It&apos;s a Pan-African
              platform, built from the ground up by people who understand what it costs — in
              stigma, in silence, in missed opportunity — when young people don&apos;t have
              somewhere safe to turn.
            </p>
          </div>

          <div className="relative order-1 md:order-2 flex items-center justify-center">
            <div className="-rotate-2 aspect-[4/5] w-full max-w-[420px] rounded-[32px] border border-[rgba(235,194,73,0.1)] shadow-[0px_25px_50px_-12px_rgba(0,0,0,0.25)] overflow-hidden relative">
              <Image
                src="/images/community.png"
                alt="Young Africans building community together"
                fill
                sizes="(max-width: 768px) 100vw, 420px"
                className="object-cover mix-blend-luminosity"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="w-full flex flex-col items-center px-6 py-24">
        <div className="flex flex-col gap-16 max-w-[1280px] w-full">
          <div className="flex flex-col gap-6 items-center text-center">
            <span className="bg-[#201f1f] border border-[rgba(77,70,53,0.2)] px-[17px] py-[7px] rounded-xl font-geist font-black text-[10px] tracking-[2px] uppercase text-[#ebc249]">
              What Guides Us
            </span>
            <h2 className="font-geist font-black text-[36px] md:text-[60px] tracking-[-3px] text-[#e5e2e1]">
              Our <span className="font-normal text-[#ebc249]">core values.</span>
            </h2>
            <p className="max-w-[672px] text-[20px] leading-7 text-[rgba(229,226,225,0.6)]">
              Four commitments that shape every feature we ship and every resource we publish.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-8">
            {CORE_VALUES.map((value) => (
              <div
                key={value.title}
                className="flex flex-col gap-4 p-8 rounded-[32px] bg-[#1c1b1b] border border-[rgba(77,70,53,0.1)] shadow-[0px_10px_30px_0px_rgba(0,0,0,0.5),0px_4px_12px_0px_rgba(235,194,73,0.04)]"
              >
                <div className="size-16 rounded-2xl bg-[#2a2a2a] flex items-center justify-center">
                  <ValueIcon icon={value.icon} />
                </div>
                <h3 className="font-geist font-black text-2xl tracking-[-0.6px] text-[#e5e2e1]">
                  {value.title}
                </h3>
                <p className="text-[16px] leading-[26px] text-[rgba(229,226,225,0.5)]">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Impact Stats */}
      <section className="flex flex-col gap-16 max-w-[1280px] w-full px-6 py-24">
        <div className="flex flex-col gap-6 items-center text-center">
          <h2 className="font-geist font-black text-[36px] md:text-[48px] tracking-[-1.2px] text-[#e5e2e1]">
            The impact so far.
          </h2>
          <p className="max-w-[576px] text-[18px] leading-7 text-[rgba(229,226,225,0.6)]">
            Numbers we&apos;re proud of — and a floor, not a ceiling, for where we&apos;re
            headed next.
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {IMPACT_STATS.map((stat, index) => (
            <div
              key={stat.label}
              className={`relative rounded-[32px] p-6 md:p-8 flex flex-col justify-center items-center text-center gap-2 overflow-hidden border ${
                index === 0
                  ? "bg-[#ebc249] border-transparent shadow-[0px_20px_25px_-5px_rgba(235,194,73,0.1),0px_8px_10px_-6px_rgba(235,194,73,0.1)]"
                  : "bg-[#201f1f] border-[rgba(77,70,53,0.1)]"
              }`}
            >
              <div
                className={`absolute -right-8 -top-8 size-32 blur-2xl rounded-xl ${
                  index === 0 ? "bg-[rgba(61,46,0,0.15)]" : "bg-[rgba(235,194,73,0.1)]"
                }`}
              />
              <span
                className={`relative font-geist font-black text-4xl md:text-5xl tracking-[-1.5px] ${
                  index === 0 ? "text-[#3d2e00]" : "text-[#ebc249]"
                }`}
              >
                {stat.value}
              </span>
              <span
                className={`relative text-[15px] leading-6 ${
                  index === 0 ? "text-[rgba(61,46,0,0.8)] font-bold" : "text-[rgba(229,226,225,0.6)]"
                }`}
              >
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Who's Behind This */}
      <section className="bg-[#1c1b1b] w-full flex flex-col items-center px-6 py-24">
        <div className="flex flex-col gap-8 items-center text-center max-w-[768px] w-full">
          <span className="bg-[#201f1f] border border-[rgba(77,70,53,0.2)] px-[17px] py-[7px] rounded-xl font-geist font-black text-[10px] tracking-[2px] uppercase text-[#ebc249]">
            Who&apos;s Behind This
          </span>
          <h2 className="font-geist font-black text-[36px] md:text-[48px] tracking-[-1.2px] text-[#e5e2e1]">
            A coalition, not a company.
          </h2>
          <p className="text-[18px] leading-7 text-[rgba(229,226,225,0.6)]">
            Brocode Africa is built by a coalition of clinicians, therapists, financial
            educators, technologists, and community organizers from across the continent.
            Some of us have sat in the same clinic waiting rooms we now redesign. Some of us
            have counseled the young people this platform serves. All of us share the belief
            that privacy and dignity shouldn&apos;t be luxuries — they should be the default.
          </p>
          <p className="text-[18px] leading-7 text-[rgba(229,226,225,0.5)]">
            We work with local health partners, verified professionals, and community
            volunteers in every market we operate in, so that the support behind &quot;Ma
            Guy&quot; and every Brocode service is never just an algorithm — there&apos;s
            always a real, accountable human standing behind it.
          </p>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="bg-[#ebc249] w-full flex flex-col items-center px-6 py-24">
        <div className="relative max-w-[1280px] w-full bg-[#0e0e0e] rounded-[48px] overflow-hidden flex flex-col items-center px-6 md:px-[120px] pt-24 pb-28">
          <div className="absolute -right-24 -top-24 size-64 bg-[rgba(235,194,73,0.05)] blur-3xl rounded-xl" />
          <div className="absolute -bottom-24 -left-24 size-64 bg-[rgba(235,194,73,0.05)] blur-3xl rounded-xl" />
          <div className="flex flex-col gap-6 items-center max-w-3xl w-full relative">
            <span className="bg-[rgba(235,194,73,0.1)] px-4 py-[6px] rounded-xl font-geist font-black text-[10px] tracking-[1px] uppercase text-[#ebc249]">
              Join the Movement
            </span>
            <h2 className="font-geist font-black text-[36px] md:text-[60px] tracking-[-1.5px] text-[#e5e2e1] text-center">
              Your story is still being written.
            </h2>
            <p className="text-[20px] leading-7 text-[rgba(229,226,225,0.6)] text-center">
              Explore the services built for you, or reach out the moment you need someone —
              anonymously, securely, on your terms.
            </p>
            <div className="flex flex-wrap gap-4 justify-center pt-6">
              <Link
                href="/services"
                className="flex items-center justify-center px-8 py-[17px] rounded-lg font-geist font-black text-[18px] text-[#3d2e00] shadow-[0px_10px_15px_-3px_rgba(235,194,73,0.2),0px_4px_6px_-4px_rgba(235,194,73,0.2)]"
                style={{
                  backgroundImage:
                    "linear-gradient(135deg, rgb(203, 164, 45) 0%, rgb(166, 133, 37) 100%)",
                }}
              >
                Explore Services
              </Link>
              <Link
                href="/support"
                className="flex items-center justify-center px-8 py-[17px] rounded-lg font-geist font-black text-[18px] text-[#ebc249] bg-[#353534] border border-[rgba(235,194,73,0.2)]"
              >
                Get Support
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function ValueIcon({ icon }: { icon: "privacy" | "access" | "pride" | "care" }) {
  const color = "#ebc249";
  if (icon === "privacy") {
    return (
      <svg width="24" height="30" viewBox="0 0 24 30" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M12 1l10 4v8c0 8-4.5 12.5-10 16C6.5 25.5 2 21 2 13V5l10-4z"
          stroke={color}
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        <path d="M8 14l3 3 5-6" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }
  if (icon === "access") {
    return (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="10" stroke={color} strokeWidth="1.5" />
        <path
          d="M2 12h20M12 2c2.5 2.7 4 6.2 4 10s-1.5 7.3-4 10c-2.5-2.7-4-6.2-4-10s1.5-7.3 4-10z"
          stroke={color}
          strokeWidth="1.5"
        />
      </svg>
    );
  }
  if (icon === "pride") {
    return (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M12 21s-8-4.5-8-11a5 5 0 019-3 5 5 0 019 3c0 6.5-8 11-8 11z"
          stroke={color}
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        <path d="M12 8v6M9 11h6" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    );
  }
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M4 12l4 4L20 6"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="12" r="10" stroke={color} strokeWidth="1.5" />
    </svg>
  );
}
