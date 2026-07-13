import Image from "next/image";
import Link from "next/link";

const FEATURES = [
  {
    title: "Confidential 1:1 Counseling",
    description:
      "Book private video, voice, or text sessions with licensed therapists who specialize in the pressures facing young Africans — academic stress, family expectations, identity, and burnout.",
    icon: "chat",
  },
  {
    title: "Group Support Circles",
    description:
      "Join small, moderated peer circles built around shared experiences. Show up under a pseudonym, listen, share only what you're ready to, and never feel like the only one carrying it.",
    icon: "group",
  },
  {
    title: "Crisis Escalation Path",
    description:
      "Every session is monitored for risk signals. If things become urgent, you're routed straight into our 24/7 Crisis Support line — no forms, no waiting rooms, no explaining yourself twice.",
    icon: "shield",
  },
  {
    title: "Anonymous Mood & Journaling Tools",
    description:
      "Track your mood privately between sessions and journal freely in a space that's yours alone. Your counselor only sees what you choose to share.",
    icon: "journal",
  },
];

const STEPS = [
  {
    number: "01",
    title: "Create an Anonymous Profile",
    description:
      "No real name required. Pick a pseudonym and tell us just enough for us to match you with the right kind of support.",
  },
  {
    number: "02",
    title: "Match With a Counselor",
    description:
      "We pair you with a licensed professional based on what you're going through — anxiety, grief, identity, relationships, or anything else on your mind.",
  },
  {
    number: "03",
    title: "Begin Your Sessions",
    description:
      "Meet on your schedule, by video, voice, or chat. Reschedule freely, switch counselors anytime, and go at the pace that feels right for you.",
  },
];

const REASSURANCES = [
  {
    question: "Will my family or school ever find out I'm using this?",
    answer:
      "No. Brocode Africa never shares your identity or session content with parents, guardians, schools, or employers under any circumstance short of an active, immediate safety risk to your life — and even then, only trained coordinators are involved, never institutions.",
  },
  {
    question: "Do I have to use my real name?",
    answer:
      "Never. Every account runs on a pseudonym by default. Counselors see only what's relevant to your care — never legal names, addresses, or identifying details unless you choose to share them.",
  },
  {
    question: "What happens if I'm in crisis during a session?",
    answer:
      "Your counselor can escalate you directly into our Crisis Support line in real time, connecting you with a rapid response coordinator within 60 seconds. You're never left to handle an emergency alone.",
  },
  {
    question: "Is this really free or low-cost?",
    answer:
      "Brocode Africa is built to be accessible. Pricing details and subsidized session slots will be confirmed as our counselor network rolls out — no one is turned away for lack of funds.",
  },
];

export default function MentalHealthPage() {
  return (
    <div className="flex flex-col items-center w-full">
      {/* Hero */}
      <section className="relative w-full flex items-center justify-center overflow-hidden px-6 py-24">
        <div className="grid md:grid-cols-2 gap-12 max-w-[1280px] w-full items-center">
          <div className="flex flex-col gap-6 order-2 md:order-1">
            <span className="inline-block w-fit bg-[#201f1f] border border-[rgba(77,70,53,0.2)] px-[17px] py-[7px] rounded-xl font-geist font-black text-[10px] tracking-[2px] uppercase text-[#ebc249]">
              Mental Health Support
            </span>
            <h1 className="font-geist font-black text-[48px] md:text-[72px] leading-[1] tracking-[-3.6px] text-[#e5e2e1]">
              Your mind matters,
              <br />
              <span className="font-normal text-[#ebc249]">just as much.</span>
            </h1>
            <p className="max-w-[512px] text-[20px] leading-7 text-[rgba(229,226,225,0.7)]">
              Confidential counseling and therapy with professionals who understand the unique
              pressures of young adulthood in Africa today — anxiety, stress, identity, and
              everything in between. No stigma. No judgment. Just support.
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
                Talk to a Counselor
              </Link>
              <Link
                href="/ma-guy"
                className="flex items-center justify-center px-8 py-[17px] rounded-lg font-geist font-black text-[18px] text-[#ebc249] bg-[#353534] border border-[rgba(235,194,73,0.2)]"
              >
                Ask Ma Guy First
              </Link>
            </div>
          </div>

          <div className="relative order-1 md:order-2 flex items-center justify-center">
            <div className="-rotate-2 aspect-[4/5] w-full max-w-[420px] rounded-[32px] border border-[rgba(235,194,73,0.1)] shadow-[0px_25px_50px_-12px_rgba(0,0,0,0.25)] overflow-hidden relative">
              <Image
                src="/images/health-event.png"
                alt="Brocode Africa mental health support"
                fill
                className="object-cover mix-blend-luminosity"
                priority
              />
            </div>
            <div className="absolute -bottom-6 -right-5 max-w-[320px] backdrop-blur-md bg-[rgba(42,42,42,0.8)] border border-[rgba(235,194,73,0.3)] rounded-3xl px-8 py-8 pl-16 shadow-[0px_20px_25px_-5px_rgba(0,0,0,0.5),0px_8px_10px_-6px_rgba(0,0,0,0.5)] flex flex-col gap-4">
              <ShieldIcon />
              <p className="font-bold text-[16px] leading-6 text-[#e5e2e1]">
                Every session is
                <br />
                100% confidential.
              </p>
            </div>
          </div>
        </div>
        <div className="absolute -left-1/4 top-[-200px] w-1/3 h-[600px] bg-[rgba(235,194,73,0.05)] blur-[60px] rounded-xl" />
      </section>

      {/* What you get */}
      <section className="bg-[#1c1b1b] w-full flex flex-col items-center px-6 py-24">
        <div className="flex flex-col gap-16 max-w-[1280px] w-full">
          <div className="flex flex-col gap-6 items-center text-center">
            <span className="bg-[#201f1f] border border-[rgba(77,70,53,0.2)] px-[17px] py-[7px] rounded-xl font-geist font-black text-[10px] tracking-[2px] uppercase text-[#ebc249]">
              What You Get
            </span>
            <h2 className="font-geist font-black text-[36px] md:text-[48px] tracking-[-1.2px] text-[#e5e2e1]">
              Support built around <span className="font-normal text-[#ebc249]">you.</span>
            </h2>
            <p className="max-w-[672px] text-[18px] leading-7 text-[rgba(229,226,225,0.6)]">
              Every tool here was designed for real African youth, dealing with real pressure — not
              a one-size-fits-all wellness app.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {FEATURES.map((feature) => (
              <div
                key={feature.title}
                className="flex flex-col gap-4 p-8 rounded-[32px] bg-[#201f1f] border border-[rgba(77,70,53,0.1)] shadow-[0px_10px_30px_0px_rgba(0,0,0,0.5),0px_4px_12px_0px_rgba(235,194,73,0.04)]"
              >
                <div className="size-16 rounded-2xl bg-[#2a2a2a] flex items-center justify-center">
                  <FeatureIcon icon={feature.icon} />
                </div>
                <h3 className="font-geist font-black text-xl tracking-[-0.4px] text-[#e5e2e1]">
                  {feature.title}
                </h3>
                <p className="text-[15px] leading-[24px] text-[rgba(229,226,225,0.5)]">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="flex flex-col gap-16 max-w-[1280px] w-full px-6 py-24">
        <div className="flex flex-col gap-6 items-center text-center">
          <span className="bg-[#201f1f] border border-[rgba(77,70,53,0.2)] px-[17px] py-[7px] rounded-xl font-geist font-black text-[10px] tracking-[2px] uppercase text-[#ebc249]">
            How It Works
          </span>
          <h2 className="font-geist font-black text-[36px] md:text-[48px] tracking-[-1.2px] text-[#e5e2e1] text-center">
            Three steps to feeling supported.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <div className="md:col-span-4 relative bg-[#201f1f] border border-[rgba(77,70,53,0.1)] rounded-[32px] p-8 flex flex-col justify-end overflow-hidden min-h-[280px]">
            <span className="absolute right-8 top-8 font-geist text-[60px] text-[#ebc249] opacity-20">
              {STEPS[0].number}
            </span>
            <div className="absolute -right-10 -top-10 size-40 bg-[rgba(235,194,73,0.1)] blur-2xl rounded-xl" />
            <div className="flex flex-col gap-2">
              <h4 className="font-geist font-black text-2xl text-[#e5e2e1]">{STEPS[0].title}</h4>
              <p className="text-[16px] leading-6 text-[rgba(229,226,225,0.6)]">
                {STEPS[0].description}
              </p>
            </div>
          </div>

          <div className="md:col-span-8 relative bg-[#2a2a2a] border border-[rgba(77,70,53,0.1)] rounded-[32px] px-8 pt-20 pb-8 flex flex-col gap-12 overflow-hidden min-h-[280px]">
            <span className="absolute right-8 top-8 font-geist text-[60px] text-[#ebc249] opacity-20">
              {STEPS[1].number}
            </span>
            <div className="max-w-[448px] flex flex-col gap-4">
              <h4 className="font-geist font-black text-3xl text-[#e5e2e1]">{STEPS[1].title}</h4>
              <p className="text-[18px] leading-7 text-[rgba(229,226,225,0.7)]">
                {STEPS[1].description}
              </p>
            </div>
            <div className="flex gap-4 overflow-x-auto">
              {["Anxiety", "Grief", "Identity", "Family", "Burnout"].map((label) => (
                <div
                  key={label}
                  className="bg-[#2a2a2a] border border-[rgba(235,194,73,0.1)] rounded-2xl h-32 w-48 shrink-0 flex items-center justify-center font-geist font-bold text-sm text-[rgba(229,226,225,0.6)]"
                >
                  {label}
                </div>
              ))}
            </div>
          </div>

          <div className="md:col-span-12 relative bg-[#201f1f] border border-[rgba(77,70,53,0.1)] rounded-[32px] p-8 flex flex-col md:flex-row md:items-center gap-6 overflow-hidden">
            <span className="absolute right-8 top-8 font-geist text-[60px] text-[#ebc249] opacity-20">
              {STEPS[2].number}
            </span>
            <div className="max-w-xl flex flex-col gap-2">
              <h4 className="font-geist font-black text-2xl text-[#e5e2e1]">{STEPS[2].title}</h4>
              <p className="text-[16px] leading-6 text-[rgba(229,226,225,0.6)]">
                {STEPS[2].description}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Reassurance / FAQ */}
      <section className="bg-[#1c1b1b] w-full flex flex-col items-center px-6 py-24">
        <div className="flex flex-col gap-16 max-w-[768px] w-full">
          <div className="flex flex-col gap-6 items-center text-center">
            <span className="bg-[#201f1f] border border-[rgba(77,70,53,0.2)] px-[17px] py-[7px] rounded-xl font-geist font-black text-[10px] tracking-[2px] uppercase text-[#ebc249]">
              Privacy First
            </span>
            <h2 className="font-geist font-black text-[36px] md:text-[48px] tracking-[-1.2px] text-[#e5e2e1] text-center">
              Your privacy, guaranteed.
            </h2>
          </div>
          <div className="flex flex-col gap-4 w-full">
            {REASSURANCES.map((item) => (
              <div
                key={item.question}
                className="bg-[#201f1f] border border-[rgba(77,70,53,0.1)] rounded-2xl p-6 flex flex-col gap-2"
              >
                <h3 className="font-geist font-bold text-[16px] md:text-[18px] text-[#e5e2e1]">
                  {item.question}
                </h3>
                <p className="text-[15px] leading-[26px] text-[rgba(229,226,225,0.6)]">
                  {item.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="bg-[#ebc249] w-full flex flex-col items-center px-6 py-24">
        <div className="relative max-w-[1280px] w-full bg-[#0e0e0e] rounded-[48px] overflow-hidden flex flex-col items-center px-6 md:px-[120px] pt-24 pb-28">
          <div className="absolute -right-24 -top-24 size-64 bg-[rgba(235,194,73,0.05)] blur-3xl rounded-xl" />
          <div className="absolute -bottom-24 -left-24 size-64 bg-[rgba(235,194,73,0.05)] blur-3xl rounded-xl" />
          <div className="flex flex-col gap-6 items-center max-w-3xl w-full relative">
            <span className="bg-[rgba(235,194,73,0.1)] px-4 py-[6px] rounded-xl font-geist font-black text-[10px] tracking-[1px] uppercase text-[#ebc249]">
              Take the First Step
            </span>
            <h2 className="font-geist font-black text-[36px] md:text-[60px] tracking-[-1.5px] text-[#e5e2e1] text-center">
              You deserve to feel supported.
            </h2>
            <p className="text-[20px] leading-7 text-[rgba(229,226,225,0.6)] text-center">
              Booking is confidential, judgment-free, and entirely on your terms. Reach out
              whenever you&apos;re ready.
            </p>
            <div className="flex flex-col items-center gap-3 pt-6">
              <button
                type="button"
                disabled
                className="flex items-center justify-center px-8 py-[18px] rounded-2xl font-geist font-black text-[16px] text-[#3d2e00] bg-[#ebc249] opacity-60 cursor-not-allowed shadow-[0px_20px_25px_-5px_rgba(235,194,73,0.2),0px_8px_10px_-6px_rgba(235,194,73,0.2)]"
              >
                Book a Session
              </button>
              <span className="text-[13px] text-[rgba(229,226,225,0.4)]">
                Coming soon — pending backend integration. In crisis?{" "}
                <Link href="/support" className="text-[#ebc249] underline">
                  Get immediate help
                </Link>
                .
              </span>
            </div>
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

function FeatureIcon({ icon }: { icon: string }) {
  const color = "#ebc249";
  if (icon === "chat") {
    return (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M4 4h16v11H8l-4 4V4z" stroke={color} strokeWidth="1.5" strokeLinejoin="round" />
        <path d="M8 9h8M8 12.5h5" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    );
  }
  if (icon === "group") {
    return (
      <svg width="26" height="20" viewBox="0 0 26 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="9" cy="6" r="3.5" stroke={color} strokeWidth="1.5" />
        <circle cx="19" cy="7" r="3" stroke={color} strokeWidth="1.5" />
        <path d="M2 19c0-4 3-6.5 7-6.5s7 2.5 7 6.5" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
        <path d="M16 19c0-3 2-5.5 5-5.5s5 2.5 5 5.5" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    );
  }
  if (icon === "shield") {
    return (
      <svg width="20" height="24" viewBox="0 0 20 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M10 1l8 3.2v6.4c0 6.4-3.6 10-8 12.8-4.4-2.8-8-6.4-8-12.8V4.2L10 1z"
          stroke={color}
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        <path d="M10 8v4M10 15.5v.01" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    );
  }
  return (
    <svg width="20" height="24" viewBox="0 0 20 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M3 2h11l3 3v17H3V2z" stroke={color} strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M6.5 9h7M6.5 13h7M6.5 17h4" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}
