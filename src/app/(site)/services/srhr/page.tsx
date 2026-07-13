import Image from "next/image";
import Link from "next/link";

const FEATURES = [
  {
    title: "Private Consultations",
    description:
      "Speak one-on-one with certified SRHR clinicians about contraception, pregnancy, fertility, or anything on your mind — by video, voice, or chat, entirely on your terms.",
    icon: "consult",
  },
  {
    title: "Digital Prescriptions & Referrals",
    description:
      "Get prescriptions and clinic referrals sent straight to your device after a consultation, so you can access care without an awkward pharmacy conversation.",
    icon: "prescription",
  },
  {
    title: "STI & Health Education",
    description:
      "Judgment-free, medically accurate resources on STIs, contraception, consent, and reproductive health — written for young people, not textbooks.",
    icon: "book",
  },
  {
    title: "Wellness Tracking",
    description:
      "Track cycles, symptoms, and appointments privately in one place, and share only what you choose with your clinician.",
    icon: "track",
  },
];

const STEPS = [
  {
    number: "01",
    title: "Ask Privately",
    description:
      "Start with a question, a concern, or nothing specific at all. There's no wrong way to begin — and no one else will ever see it.",
  },
  {
    number: "02",
    title: "Consult a Clinician",
    description:
      "Get matched with a certified SRHR professional who listens without judgment and gives you clear, medically sound answers.",
  },
  {
    number: "03",
    title: "Get Care, Discreetly",
    description:
      "Receive a digital prescription, referral, or education plan — and follow up whenever you need to, at your own pace.",
  },
];

const REASSURANCES = [
  {
    question: "Can my parents, partner, or school see what I ask about?",
    answer:
      "Never. SRHR consultations are fully confidential and tied to your pseudonymous profile. Nothing is shared with family, partners, schools, or employers, ever.",
  },
  {
    question: "Is this a replacement for seeing a doctor in person?",
    answer:
      "Our clinicians provide real medical guidance, digital prescriptions, and referrals, but for procedures or emergencies you'll be referred to a trusted in-person provider near you.",
  },
  {
    question: "What if I just have a question and I'm not ready to talk to anyone?",
    answer:
      "That's exactly what our education library and Ma Guy assistant are for — browse judgment-free, medically accurate answers first, at your own pace, before ever booking a consultation.",
  },
  {
    question: "Will this cost anything?",
    answer:
      "Brocode Africa is committed to keeping SRHR care accessible. Pricing and subsidized consultation options will be shared as our clinician network goes live.",
  },
];

export default function SrhrPage() {
  return (
    <div className="flex flex-col items-center w-full">
      {/* Hero */}
      <section className="relative w-full flex items-center justify-center overflow-hidden px-6 py-24">
        <div className="grid md:grid-cols-2 gap-12 max-w-[1280px] w-full items-center">
          <div className="flex flex-col gap-6 order-2 md:order-1">
            <span className="inline-block w-fit bg-[#201f1f] border border-[rgba(77,70,53,0.2)] px-[17px] py-[7px] rounded-xl font-geist font-black text-[10px] tracking-[2px] uppercase text-[#ebc249]">
              SRHR Services
            </span>
            <h1 className="font-geist font-black text-[48px] md:text-[72px] leading-[1] tracking-[-3.6px] text-[#e5e2e1]">
              Your body, your
              <br />
              <span className="font-normal text-[#ebc249]">business.</span>
            </h1>
            <p className="max-w-[512px] text-[20px] leading-7 text-[rgba(229,226,225,0.7)]">
              Expert, judgment-free advice on sexual and reproductive health. Private
              consultations, digital prescriptions, and wellness tracking — built for young Africans
              who deserve real answers without the shame.
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
                Book a Consultation
              </Link>
              <Link
                href="/resources"
                className="flex items-center justify-center px-8 py-[17px] rounded-lg font-geist font-black text-[18px] text-[#ebc249] bg-[#353534] border border-[rgba(235,194,73,0.2)]"
              >
                Browse Health Library
              </Link>
            </div>
          </div>

          <div className="relative order-1 md:order-2 flex items-center justify-center">
            <div className="rotate-2 aspect-[4/5] w-full max-w-[420px] rounded-[32px] border border-[rgba(235,194,73,0.1)] shadow-[0px_25px_50px_-12px_rgba(0,0,0,0.25)] overflow-hidden relative">
              <Image
                src="/images/srhr-resource.png"
                alt="Brocode Africa SRHR services"
                fill
                className="object-cover mix-blend-luminosity"
                priority
              />
            </div>
            <div className="absolute -bottom-6 -left-5 max-w-[320px] backdrop-blur-md bg-[rgba(42,42,42,0.8)] border border-[rgba(235,194,73,0.3)] rounded-3xl px-8 py-8 pr-16 shadow-[0px_20px_25px_-5px_rgba(0,0,0,0.5),0px_8px_10px_-6px_rgba(0,0,0,0.5)] flex flex-col gap-4">
              <LockIcon />
              <p className="font-bold text-[16px] leading-6 text-[#e5e2e1]">
                Private consultations,
                <br />
                zero judgment.
              </p>
            </div>
          </div>
        </div>
        <div className="absolute -right-1/4 top-[-200px] w-1/3 h-[600px] bg-[rgba(235,194,73,0.05)] blur-[60px] rounded-xl" />
      </section>

      {/* What you get */}
      <section className="bg-[#1c1b1b] w-full flex flex-col items-center px-6 py-24">
        <div className="flex flex-col gap-16 max-w-[1280px] w-full">
          <div className="flex flex-col gap-6 items-center text-center">
            <span className="bg-[#201f1f] border border-[rgba(77,70,53,0.2)] px-[17px] py-[7px] rounded-xl font-geist font-black text-[10px] tracking-[2px] uppercase text-[#ebc249]">
              What You Get
            </span>
            <h2 className="font-geist font-black text-[36px] md:text-[48px] tracking-[-1.2px] text-[#e5e2e1]">
              Real answers, <span className="font-normal text-[#ebc249]">real privacy.</span>
            </h2>
            <p className="max-w-[672px] text-[18px] leading-7 text-[rgba(229,226,225,0.6)]">
              Everything you need to make informed choices about your sexual and reproductive
              health, without the awkward waiting room.
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
            Three steps to answers you can trust.
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
              {["Contraception", "STIs", "Pregnancy", "Fertility", "Consent"].map((label) => (
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
              Take Control
            </span>
            <h2 className="font-geist font-black text-[36px] md:text-[60px] tracking-[-1.5px] text-[#e5e2e1] text-center">
              Your health, your decision.
            </h2>
            <p className="text-[20px] leading-7 text-[rgba(229,226,225,0.6)] text-center">
              Booking a consultation is private, discreet, and entirely in your control. Reach out
              whenever you&apos;re ready.
            </p>
            <div className="flex flex-col items-center gap-3 pt-6">
              <button
                type="button"
                disabled
                className="flex items-center justify-center px-8 py-[18px] rounded-2xl font-geist font-black text-[16px] text-[#3d2e00] bg-[#ebc249] opacity-60 cursor-not-allowed shadow-[0px_20px_25px_-5px_rgba(235,194,73,0.2),0px_8px_10px_-6px_rgba(235,194,73,0.2)]"
              >
                Book a Consultation
              </button>
              <span className="text-[13px] text-[rgba(229,226,225,0.4)]">
                Coming soon — pending backend integration. Have an urgent concern?{" "}
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

function LockIcon() {
  return (
    <svg width="24" height="28" viewBox="0 0 24 28" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="3" y="12" width="18" height="14" rx="2" stroke="#e5e2e1" strokeWidth="1.5" />
      <path d="M7 12V8a5 5 0 0110 0v4" stroke="#ebc249" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="12" cy="19" r="1.5" fill="#ebc249" />
    </svg>
  );
}

function FeatureIcon({ icon }: { icon: string }) {
  const color = "#ebc249";
  if (icon === "consult") {
    return (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M4 4h16v11H8l-4 4V4z" stroke={color} strokeWidth="1.5" strokeLinejoin="round" />
        <path d="M9 9.5a1.5 1.5 0 013 0c0 1.5-1.5 1.5-1.5 3" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="10.5" cy="15" r="0.6" fill={color} />
      </svg>
    );
  }
  if (icon === "prescription") {
    return (
      <svg width="20" height="24" viewBox="0 0 20 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M3 2h11l3 3v17H3V2z" stroke={color} strokeWidth="1.5" strokeLinejoin="round" />
        <path d="M6.5 9h7M6.5 13h5" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
        <path d="M7 17.5l2-2.5 1.5 2 2-3" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }
  if (icon === "book") {
    return (
      <svg width="24" height="20" viewBox="0 0 24 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 4c-2-2-6-2.5-10-1.5v14c4-1 8-.5 10 1.5 2-2 6-2.5 10-1.5v-14c-4-1-8-.5-10 1.5z" stroke={color} strokeWidth="1.5" strokeLinejoin="round" />
        <path d="M12 4v14" stroke={color} strokeWidth="1.5" />
      </svg>
    );
  }
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M4 18l4-6 4 3 4-8 4 5" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M3 21h18" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}
