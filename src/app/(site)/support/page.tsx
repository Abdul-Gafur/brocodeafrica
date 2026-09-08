import Link from "next/link";
import { getSupportChannels, getSupportFaqs } from "@/lib/api/support";
import { SupportChannel } from "@/lib/types/support";
import { FaqAccordion } from "@/components/support/FaqAccordion";
import { CoordinatorForm } from "@/components/support/CoordinatorForm";

export default async function SupportPage() {
  const [channels, faqs] = await Promise.all([getSupportChannels(), getSupportFaqs()]);
  const emergencyChannel = channels.find((channel) => channel.urgency === "emergency");
  const standardChannels = channels.filter((channel) => channel.urgency !== "emergency");

  return (
    <div className="flex flex-col items-center w-full">
      {/* Hero */}
      <section className="relative w-full flex items-center justify-center overflow-hidden px-6 py-24">
        <div className="flex flex-col gap-6 items-center text-center max-w-[768px] w-full relative">

          <h1 className="font-geist font-black text-[48px] md:text-[72px] leading-[1] tracking-[-3.6px] text-[#e5e2e1]">
            You&apos;re not alone.
            <br />
            <span className="font-normal text-[#ebc249]">We&apos;re here now.</span>
          </h1>
          <p className="max-w-[560px] text-[20px] leading-7 text-[rgba(229,226,225,0.7)]">
            Whether it&apos;s urgent or you just need someone to talk to, Brocode Africa&apos;s
            support center connects you to real help, anonymously and on your terms.
          </p>
        </div>
        <div className="absolute -left-1/4 top-[-200px] w-1/3 h-[600px] bg-[rgba(235,194,73,0.05)] blur-[60px] rounded-xl" />
      </section>

      {/* Emergency Banner */}
      {emergencyChannel && (
        <section className="w-full flex flex-col items-center px-6 pb-24">
          <div className="max-w-[1280px] w-full bg-[#201f1f] border border-[rgba(235,194,73,0.2)] rounded-[32px] p-8 md:p-12 flex flex-col md:flex-row items-center gap-8 shadow-[0px_10px_30px_0px_rgba(0,0,0,0.5),0px_4px_12px_0px_rgba(235,194,73,0.04)]">
            <div className="size-20 rounded-2xl bg-[rgba(235,194,73,0.1)] flex items-center justify-center shrink-0">
              <PhoneIconLarge />
            </div>
            <div className="flex flex-col gap-3 flex-1 text-center md:text-left">
              <span className="mx-auto md:mx-0 w-fit bg-[#ffb4ab] text-[#690005] font-geist font-black text-[10px] tracking-[1px] uppercase px-4 py-1 rounded-xl">
                In crisis? Start here.
              </span>
              <h2 className="font-geist font-black text-3xl md:text-4xl text-[#e5e2e1]">
                {emergencyChannel.title}
              </h2>
              <p className="text-[16px] leading-[26px] text-[rgba(229,226,225,0.6)] max-w-xl">
                {emergencyChannel.description}
              </p>
              <span className="font-geist font-black text-[12px] tracking-[1px] uppercase text-[#ebc249]">
                {emergencyChannel.availability}
              </span>
            </div>
            <a
              href={emergencyChannel.href}
              className="shrink-0 flex items-center justify-center gap-2 px-8 py-[17px] rounded-2xl font-geist font-black text-[18px] text-[#3d2e00] shadow-[0px_10px_15px_-3px_rgba(235,194,73,0.2),0px_4px_6px_-4px_rgba(235,194,73,0.2)]"
              style={{
                backgroundImage:
                  "linear-gradient(135deg, rgb(203, 164, 45) 0%, rgb(166, 133, 37) 100%)",
              }}
            >
              <PhoneIcon />
              {emergencyChannel.ctaLabel}
            </a>
          </div>
        </section>
      )}

      {/* Contact Channels */}
      <section className="bg-[#1c1b1b] w-full flex flex-col items-center px-6 py-24">
        <div className="flex flex-col gap-16 max-w-[1280px] w-full">
          <div className="flex flex-col gap-6 items-center text-center">
            <span className="bg-[#201f1f] border border-[rgba(77,70,53,0.2)] px-[17px] py-[7px] rounded-xl font-geist font-black text-[10px] tracking-[2px] uppercase text-[#ebc249]">
              Reach Us
            </span>
            <h2 className="font-geist font-black text-[36px] md:text-[48px] tracking-[-1.2px] text-[#e5e2e1]">
              Choose how you connect.
            </h2>
            <p className="max-w-[576px] text-[18px] leading-7 text-[rgba(229,226,225,0.6)]">
              Every channel is confidential and judgment-free. Pick whichever feels right for you
              right now.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {standardChannels.map((channel) => (
              <ChannelCard key={channel.id} channel={channel} />
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="w-full flex flex-col items-center px-6 py-24">
        <div className="flex flex-col gap-16 max-w-[768px] w-full">
          <div className="flex flex-col gap-6 items-center text-center">
            <span className="bg-[#201f1f] border border-[rgba(77,70,53,0.2)] px-[17px] py-[7px] rounded-xl font-geist font-black text-[10px] tracking-[2px] uppercase text-[#ebc249]">
              FAQ
            </span>
            <h2 className="font-geist font-black text-[36px] md:text-[48px] tracking-[-1.2px] text-[#e5e2e1] text-center">
              Common questions
            </h2>
          </div>
          <FaqAccordion items={faqs} />
        </div>
      </section>

      {/* Talk to a Coordinator */}
      <section className="bg-[#1c1b1b] w-full flex flex-col items-center px-6 py-24">
        <div className="grid md:grid-cols-2 gap-16 max-w-[1280px] w-full items-start">
          <div className="flex flex-col gap-6">
            <span className="w-fit bg-[#201f1f] border border-[rgba(77,70,53,0.2)] px-[17px] py-[7px] rounded-xl font-geist font-black text-[10px] tracking-[2px] uppercase text-[#ebc249]">
              Not Urgent?
            </span>
            <h2 className="font-geist font-black text-[36px] md:text-[48px] tracking-[-1.2px] text-[#e5e2e1]">
              Talk to a coordinator.
            </h2>
            <p className="max-w-md text-[18px] leading-7 text-[rgba(229,226,225,0.6)]">
              Send us a message and one of our trained coordinators will follow up privately,
              usually within a few hours.
            </p>
            <div className="flex flex-col gap-4 pt-4">
              {[
                "Confidential and anonymous by default",
                "No account required to reach out",
                "Handled by trained, empathetic humans",
              ].map((point) => (
                <div key={point} className="flex items-center gap-3">
                  <span className="size-8 rounded-full bg-[rgba(235,194,73,0.1)] flex items-center justify-center shrink-0">
                    <CheckIconSmall />
                  </span>
                  <span className="text-[15px] text-[rgba(229,226,225,0.7)]">{point}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#201f1f] border border-[rgba(77,70,53,0.1)] rounded-[32px] p-8">
            <CoordinatorForm />
          </div>
        </div>
      </section>
    </div>
  );
}

function ChannelCard({ channel }: { channel: SupportChannel }) {
  return (
    <div className="flex flex-col gap-4 p-8 rounded-[32px] bg-[#201f1f] border border-[rgba(77,70,53,0.1)] shadow-[0px_10px_30px_0px_rgba(0,0,0,0.5),0px_4px_12px_0px_rgba(235,194,73,0.04)]">
      <div className="size-16 rounded-2xl bg-[#2a2a2a] flex items-center justify-center">
        <ChannelIcon icon={channel.icon} />
      </div>
      <h3 className="font-geist font-black text-2xl tracking-[-0.6px] text-[#e5e2e1]">
        {channel.title}
      </h3>
      <p className="text-[16px] leading-[26px] text-[rgba(229,226,225,0.5)]">
        {channel.description}
      </p>
      <span className="font-geist font-black text-[10px] tracking-[1px] uppercase text-[#ebc249]">
        {channel.availability}
      </span>
      {channel.external ? (
        <a
          href={channel.href}
          className="mt-2 flex items-center justify-center gap-2 py-4 rounded-2xl bg-[#353534] font-geist font-black text-[16px] text-[#e5e2e1]"
        >
          {channel.ctaLabel}
          <ArrowRightIcon />
        </a>
      ) : (
        <Link
          href={channel.href}
          className="mt-2 flex items-center justify-center gap-2 py-4 rounded-2xl bg-[#ebc249] font-geist font-black text-[16px] text-[#3d2e00]"
        >
          {channel.ctaLabel}
          <ArrowRightIcon dark />
        </Link>
      )}
    </div>
  );
}

function ArrowRightIcon({ dark }: { dark?: boolean }) {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={dark ? "text-[#3d2e00]" : "text-[#e5e2e1]"}
    >
      <path
        d="M2 6h8M6 2l4 4-4 4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function AlertIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M6 1l5 9.5H1L6 1z"
        stroke="#ffb4ab"
        strokeWidth="1"
        strokeLinejoin="round"
      />
      <path d="M6 5v2" stroke="#ffb4ab" strokeWidth="1" strokeLinecap="round" />
      <circle cx="6" cy="8.7" r="0.5" fill="#ffb4ab" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M2.5 1.5h2.7l1.1 3-1.4 1.4a8 8 0 003.7 3.7l1.4-1.4 3 1.1v2.7a1.4 1.4 0 01-1.5 1.4A11 11 0 011.1 3a1.4 1.4 0 011.4-1.5z"
        stroke="#3d2e00"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function PhoneIconLarge() {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M4 3h4.5l2 5-2.5 2.5a13 13 0 006 6l2.5-2.5 5 2V20a2 2 0 01-2 2A18 18 0 012 5a2 2 0 012-2z"
        stroke="#ebc249"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CheckIconSmall() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M11.5 3.5l-6 6-3-3"
        stroke="#ebc249"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ChannelIcon({ icon }: { icon: SupportChannel["icon"] }) {
  const color = "#ebc249";
  if (icon === "phone") {
    return (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M4 3h4.5l2 5-2.5 2.5a13 13 0 006 6l2.5-2.5 5 2V20a2 2 0 01-2 2A18 18 0 012 5a2 2 0 012-2z"
          stroke={color}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }
  if (icon === "chat") {
    return (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M4 4h16v11H8l-4 4V4z"
          stroke={color}
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        <path d="M8 9h8M8 12.5h5" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    );
  }
  if (icon === "sms") {
    return (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="3" y="4" width="18" height="13" rx="2" stroke={color} strokeWidth="1.5" />
        <path d="M8 20l3.5-3H16" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M7 9h10M7 12h6" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    );
  }
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="3" y="5" width="18" height="14" rx="2" stroke={color} strokeWidth="1.5" />
      <path d="M3.5 6.5l8.5 6 8.5-6" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
