import { getSupportChannels } from "@/lib/api/support";
import { CoordinatorForm } from "@/components/support/CoordinatorForm";

export const metadata = {
  title: "Contact — Brocode Africa",
  description:
    "Reach the Brocode Africa team — anonymously, on your terms. Send a message or use a support channel.",
};

export default async function ContactPage() {
  const channels = await getSupportChannels();

  return (
    <div className="flex flex-col items-center w-full">
      <section className="relative w-full flex flex-col items-center px-6 pt-16 pb-12 overflow-hidden">
        <div className="absolute -right-24 -top-24 size-96 bg-[rgba(235,194,73,0.05)] blur-[60px] rounded-xl" />
        <div className="flex flex-col gap-6 items-center text-center max-w-[720px] relative">
          <span className="inline-block w-fit bg-[#2a2a2a] px-4 py-[6px] rounded-xl font-geist font-black text-[10px] tracking-[1px] uppercase text-[#ebc249]">
            Get in Touch
          </span>
          <h1 className="font-geist font-black text-[36px] md:text-[60px] tracking-[-2px] text-[#e5e2e1]">
            Contact <span className="font-normal text-[#ebc249]">us.</span>
          </h1>
          <p className="max-w-[560px] text-[18px] leading-7 text-[rgba(229,226,225,0.6)]">
            Questions, partnerships, press, or you just need someone to talk to — send a message
            below, or reach us directly through one of our channels.
          </p>
        </div>
      </section>

      <section className="w-full flex flex-col items-center px-6 pb-24">
        <div className="max-w-[1280px] w-full grid lg:grid-cols-2 gap-12">
          <div className="bg-[#1c1b1b] border border-[rgba(77,70,53,0.1)] rounded-[32px] p-8 md:p-10">
            <h2 className="font-geist font-black text-2xl text-[#e5e2e1] mb-6">
              Send a message
            </h2>
            <CoordinatorForm />
          </div>

          <div className="flex flex-col gap-4">
            <h2 className="font-geist font-black text-2xl text-[#e5e2e1] mb-2">
              Other ways to reach us
            </h2>
            {channels.map((channel) => (
              <a
                key={channel.id}
                href={channel.href}
                target={channel.external ? "_blank" : undefined}
                rel={channel.external ? "noopener noreferrer" : undefined}
                className="group bg-[#1c1b1b] border border-[rgba(77,70,53,0.1)] rounded-2xl p-6 flex flex-col gap-2 hover:border-[rgba(235,194,73,0.3)] transition-colors"
              >
                <div className="flex items-center justify-between gap-4">
                  <span className="font-geist font-black text-lg text-[#e5e2e1]">
                    {channel.title}
                  </span>
                  <span className="font-geist font-black text-[10px] tracking-[1px] uppercase text-[#ebc249]">
                    {channel.ctaLabel}
                  </span>
                </div>
                <p className="text-sm leading-6 text-[rgba(229,226,225,0.5)]">
                  {channel.description}
                </p>
                <span className="text-[12px] tracking-[0.5px] uppercase text-[rgba(229,226,225,0.4)]">
                  {channel.availability}
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
