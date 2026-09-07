import Image from "next/image";
import Link from "next/link";
import { getCoreServices, getSecondaryServices } from "@/lib/api/services";
import ReferralButton from "@/components/services/ReferralButton";

export default async function ServicesPage() {
  const [coreServices, secondaryServices] = await Promise.all([
    getCoreServices(),
    getSecondaryServices(),
  ]);

  return (
    <div className="flex flex-col items-center w-full">
      <section className="w-full flex flex-col items-center px-6 pt-24 pb-40">
        <div className="flex flex-col gap-12 max-w-[1280px] w-full">
          {/* Hero Header */}
          <div className="flex flex-col gap-6 items-start">
            <span className="inline-block w-fit bg-[#201f1f] border border-[rgba(77,70,53,0.2)] px-[17px] py-[7px] rounded-xl font-geist font-black text-[10px] tracking-[2px] uppercase text-[#ebc249]">
              Digital Sovereign
            </span>
            <h1 className="font-geist font-black text-[48px] md:text-[72px] leading-[1] tracking-[-3.6px] text-[#e5e2e1]">
              Support on <span className="italic text-[#ebc249]">your terms.</span>
            </h1>
            <p className="max-w-[672px] text-[20px] leading-7 text-[rgba(229,226,225,0.6)]">
              Expert-backed services designed for the modern African youth by Brocode Africa.
              Secure, confidential, and always within reach.
            </p>
          </div>

          {/* Services Grid */}
          <div className="grid md:grid-cols-3 gap-8 pt-12">
            {coreServices.map((service) => (
              <div
                key={service.id}
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
                  <ServiceIcon slug={service.slug} />
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
                {service.referralUrl ? (
                  <ReferralButton
                    referralUrl={service.referralUrl}
                    partnerName={service.partnerName}
                    className="flex items-center justify-center gap-2 py-4 rounded-2xl bg-[#ebc249] font-geist font-black text-[16px] text-[#3d2e00] shadow-[0px_10px_15px_-3px_rgba(235,194,73,0.2),0px_4px_6px_-4px_rgba(235,194,73,0.2)] disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    Get Help
                    {service.variant === "crisis" ? <PhoneIcon /> : <ArrowRightIcon />}
                  </ReferralButton>
                ) : (
                  <Link
                    href={service.href}
                    className="flex items-center justify-center gap-2 py-4 rounded-2xl bg-[#ebc249] font-geist font-black text-[16px] text-[#3d2e00] shadow-[0px_10px_15px_-3px_rgba(235,194,73,0.2),0px_4px_6px_-4px_rgba(235,194,73,0.2)]"
                  >
                    Get Help
                    {service.variant === "crisis" ? <PhoneIcon /> : <ArrowRightIcon />}
                  </Link>
                )}
              </div>
            ))}
          </div>

          {/* Secondary Services */}
          <div className="grid md:grid-cols-2 gap-8">
            {secondaryServices.map((service) => (
              <div
                key={service.id}
                className="bg-[#1c1b1b] border border-[rgba(77,70,53,0.1)] rounded-[32px] p-8 flex flex-col sm:flex-row gap-8 items-center"
              >
                <div className="relative w-full sm:w-1/2 aspect-[16/9] rounded-2xl overflow-hidden shrink-0">
                  <Image
                    src={service.image}
                    alt={service.title}
                    fill
                    className="object-cover mix-blend-luminosity"
                  />
                </div>
                <div className="flex flex-col gap-3 w-full sm:w-1/2">
                  <h4 className="font-geist font-bold text-xl text-[#ebc249]">
                    {service.title}
                  </h4>
                  <p className="text-sm leading-[1.625] text-[rgba(229,226,225,0.4)]">
                    {service.description}
                  </p>
                  <Link
                    href={service.href}
                    className="flex items-center gap-2 pt-1 font-geist font-bold text-sm text-[#ebc249]"
                  >
                    {service.ctaLabel}
                    <ArrowRightIcon />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function ArrowRightIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
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

function PhoneIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
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

function ServiceIcon({ slug }: { slug: string }) {
  const color = "#ebc249";
  if (slug === "mental-health") {
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
  if (slug === "srhr") {
    return (
      <svg width="20" height="25" viewBox="0 0 20 25" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M10 1v8m0 0a6 6 0 106 6" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="10" cy="17" r="6" stroke={color} strokeWidth="1.5" />
      </svg>
    );
  }
  return (
    <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12.5 2L2 21h21L12.5 2z" stroke={color} strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M12.5 10v5" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="12.5" cy="18" r="0.75" fill={color} />
    </svg>
  );
}
