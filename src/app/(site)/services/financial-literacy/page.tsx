import Image from "next/image";
import Link from "next/link";

const FEATURES = [
  {
    title: "Budgeting Fundamentals",
    description:
      "Learn to build a budget that actually survives real life — irregular income, family obligations, and side hustles included. No spreadsheets required to start.",
    icon: "budget",
  },
  {
    title: "Saving & Investing Basics",
    description:
      "Understand emergency funds, compound interest, and low-risk investing in plain language, with examples pulled from African markets, not Wall Street.",
    icon: "growth",
  },
  {
    title: "Digital Assets Literacy",
    description:
      "Get a clear-eyed, non-hype introduction to mobile money, digital wallets, and crypto basics — what they are, how they work, and how to avoid common scams.",
    icon: "digital",
  },
  {
    title: "1:1 Financial Coaching",
    description:
      "Sit down with a coach to build a plan around your actual income and goals, whether that's paying off debt, saving for school, or starting a business.",
    icon: "coach",
  },
];

const STEPS = [
  {
    number: "01",
    title: "Assess Where You Stand",
    description:
      "Take a quick, judgment-free look at your income, spending, and goals so we know exactly where to start.",
  },
  {
    number: "02",
    title: "Follow a Learning Path",
    description:
      "Work through bite-sized modules on budgeting, saving, and investing, built specifically for young African earners.",
  },
  {
    number: "03",
    title: "Build With a Coach",
    description:
      "Turn what you've learned into a real plan with a 1:1 financial coach, and track your progress as your income grows.",
  },
];

const REASSURANCES = [
  {
    question: "Do I need to already have money saved to start?",
    answer:
      "Not at all. Finance Mastery is built for people starting from zero. Whether you're earning your first income or juggling several hustles, the fundamentals apply to any income level.",
  },
  {
    question: "Is my financial information kept private?",
    answer:
      "Yes. Your income details, goals, and coaching conversations stay tied to your anonymous profile and are never shared with employers, family, or third parties.",
  },
  {
    question: "Is this financial advice or just education?",
    answer:
      "Our modules and coaching sessions are educational, designed to build your financial confidence and literacy. For regulated investment advice, we'll always point you to a licensed professional.",
  },
  {
    question: "What does it cost?",
    answer:
      "Core learning modules will be free to access. Pricing for 1:1 coaching sessions will be shared as our coach network launches — accessibility is central to how we're building this.",
  },
];

export default function FinancialLiteracyPage() {
  return (
    <div className="flex flex-col items-center w-full">
      {/* Hero */}
      <section className="relative w-full flex items-center justify-center overflow-hidden px-6 py-24">
        <div className="grid md:grid-cols-2 gap-12 max-w-[1280px] w-full items-center">
          <div className="flex flex-col gap-6 order-2 md:order-1">
            <span className="inline-block w-fit bg-[#201f1f] border border-[rgba(77,70,53,0.2)] px-[17px] py-[7px] rounded-xl font-geist font-black text-[10px] tracking-[2px] uppercase text-[#ebc249]">
              Finance Mastery
            </span>
            <h1 className="font-geist font-black text-[48px] md:text-[72px] leading-[1] tracking-[-3.6px] text-[#e5e2e1]">
              Master your money,
              <br />
              <span className="font-normal text-[#ebc249]">on your terms.</span>
            </h1>
            <p className="max-w-[512px] text-[20px] leading-7 text-[rgba(229,226,225,0.7)]">
              Youth-tailored financial planning tools that meet you where you are. Learn
              budgeting, saving, investing, and digital assets from real coaches, at your own
              pace, in a space built for African realities.
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <Link
                href="/ma-guy"
                className="flex items-center justify-center px-8 py-[17px] rounded-lg font-geist font-black text-[18px] text-[#3d2e00] shadow-[0px_10px_15px_-3px_rgba(235,194,73,0.2),0px_4px_6px_-4px_rgba(235,194,73,0.2)]"
                style={{
                  backgroundImage:
                    "linear-gradient(135deg, rgb(203, 164, 45) 0%, rgb(166, 133, 37) 100%)",
                }}
              >
                Start Learning
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
            <div className="-rotate-2 aspect-[4/5] w-full max-w-[420px] rounded-[32px] border border-[rgba(235,194,73,0.1)] shadow-[0px_25px_50px_-12px_rgba(0,0,0,0.25)] overflow-hidden relative">
              <Image
                src="/images/services/financial-literacy.jpg"
                alt="Brocode Africa financial literacy"
                fill
                className="object-cover mix-blend-luminosity"
                priority
              />
            </div>
            <div className="absolute -bottom-6 -right-5 max-w-[320px] backdrop-blur-md bg-[rgba(42,42,42,0.8)] border border-[rgba(235,194,73,0.3)] rounded-3xl px-8 py-8 pl-16 shadow-[0px_20px_25px_-5px_rgba(0,0,0,0.5),0px_8px_10px_-6px_rgba(0,0,0,0.5)] flex flex-col gap-4">
              <GrowthIcon />
              <p className="font-bold text-[16px] leading-6 text-[#e5e2e1]">
                Built for real
                <br />
                African income.
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
              Financial confidence, <span className="font-normal text-[#ebc249]">built up.</span>
            </h2>
            <p className="max-w-[672px] text-[18px] leading-7 text-[rgba(229,226,225,0.6)]">
              Practical money skills for the realities young Africans actually face — irregular
              income, mobile money, and building wealth from scratch.
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
            Three steps to financial confidence.
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
              {["Budgeting", "Saving", "Investing", "Digital Assets", "Debt"].map((label) => (
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
              Good to Know
            </span>
            <h2 className="font-geist font-black text-[36px] md:text-[48px] tracking-[-1.2px] text-[#e5e2e1] text-center">
              Learn without pressure.
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
              Build Your Future
            </span>
            <h2 className="font-geist font-black text-[36px] md:text-[60px] tracking-[-1.5px] text-[#e5e2e1] text-center">
              Your wealth journey starts now.
            </h2>
            <p className="text-[20px] leading-7 text-[rgba(229,226,225,0.6)] text-center">
              Take real steps towards financial independence with Brocode experts at your side.
            </p>
            <div className="flex flex-col items-center gap-3 pt-6">
              <button
                type="button"
                disabled
                className="flex items-center justify-center px-8 py-[18px] rounded-2xl font-geist font-black text-[16px] text-[#3d2e00] bg-[#ebc249] opacity-60 cursor-not-allowed shadow-[0px_20px_25px_-5px_rgba(235,194,73,0.2),0px_8px_10px_-6px_rgba(235,194,73,0.2)]"
              >
                Start Learning
              </button>
              <span className="text-[13px] text-[rgba(229,226,225,0.4)]">
                Coming soon — pending backend integration.
              </span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function GrowthIcon() {
  return (
    <svg width="28" height="24" viewBox="0 0 28 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M2 20l6-8 5 4 7-11 6 7" stroke="#ebc249" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M20 5h6v6" stroke="#ebc249" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function FeatureIcon({ icon }: { icon: string }) {
  const color = "#ebc249";
  if (icon === "budget") {
    return (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="3" y="5" width="18" height="14" rx="2" stroke={color} strokeWidth="1.5" />
        <path d="M3 9.5h18" stroke={color} strokeWidth="1.5" />
        <path d="M7 14h4" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    );
  }
  if (icon === "growth") {
    return (
      <svg width="24" height="20" viewBox="0 0 24 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M2 17l5-7 4.5 3.5L18 3l4 5" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M17 3h5v5" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }
  if (icon === "digital") {
    return (
      <svg width="22" height="24" viewBox="0 0 22 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="11" cy="12" r="9.5" stroke={color} strokeWidth="1.5" />
        <path d="M8 9.5c0-1 1-1.5 3-1.5s3 .6 3 1.6c0 2.4-6 1-6 3.4 0 1 1 1.6 3 1.6s3-.5 3-1.5" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
        <path d="M11 6.5v1M11 16v1" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    );
  }
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="9" cy="7" r="3.5" stroke={color} strokeWidth="1.5" />
      <path d="M2.5 20c0-3.5 2.9-6 6.5-6s6.5 2.5 6.5 6" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M16 4.5a3.5 3.5 0 010 6.9" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M17 14c2.8.4 4.5 2.2 4.5 5.4" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}
