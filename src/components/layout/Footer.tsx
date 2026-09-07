import Image from "next/image";
import Link from "next/link";

const COMPANY_LINKS = [
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Support", href: "/support" },
  { label: "Contact", href: "/contact" },
];

const LEGAL_LINKS = [
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Terms of Service", href: "/terms-of-service" },
];

const SOCIAL_LINKS = [
  { label: "Instagram", href: "https://instagram.com" },
  { label: "Twitter", href: "https://twitter.com" },
  { label: "LinkedIn", href: "https://linkedin.com" },
];

export default function Footer() {
  return (
    <footer className="bg-[#0e0e0e] border-t border-[rgba(77,70,53,0.1)] flex flex-col gap-12 pb-12 pt-[49px] px-8 w-full">
      <div className="max-w-[1280px] w-full mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        <div className="flex flex-col gap-4">
          <Image src="/images/logo.png" alt="Brocode Africa" width={125} height={32} />
          <p className="text-[#99907c] text-sm leading-5 max-w-[280px]">
            Empowering the digital sovereigns of Africa with curated lifestyle and financial
            essentials.
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <h3 className="font-bold text-[#ebc249] text-lg leading-7">Company</h3>
          {COMPANY_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className="text-[#99907c] text-sm leading-5 hover:text-[#e5e2e1] transition-colors">
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex flex-col gap-4">
          <h3 className="font-bold text-[#ebc249] text-lg leading-7">Legal</h3>
          {LEGAL_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className="text-[#99907c] text-sm leading-5 hover:text-[#e5e2e1] transition-colors">
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex flex-col gap-[15.5px]">
          <h3 className="font-bold text-[#ebc249] text-lg leading-7">Contact</h3>
          <div className="flex gap-2 items-center text-[#99907c] text-sm leading-5">
            <MailIcon />
            <span>hello@brocodeafrica.org</span>
          </div>
          <div className="flex gap-2 items-center text-[#99907c] text-sm leading-5">
            <PinIcon />
            <span>Accra, Ghana</span>
          </div>
        </div>
      </div>

      <div className="max-w-[1280px] w-full mx-auto border-t border-[rgba(77,70,53,0.1)] pt-[33px] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <p className="text-[#99907c] text-sm leading-[21px]">
          © {new Date().getFullYear()} BroCode Africa SE.
        </p>
        <div className="flex gap-6">
          {SOCIAL_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noreferrer"
              className="text-[#99907c] text-sm leading-[21px] hover:text-[#e5e2e1] transition-colors"
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}

function MailIcon() {
  return (
    <svg width="14" height="11" viewBox="0 0 14 11" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M1 1h12a1 1 0 011 1v7a1 1 0 01-1 1H1a1 1 0 01-1-1V2a1 1 0 011-1z"
        stroke="currentColor"
        strokeWidth="1"
      />
      <path d="M0 2l7 5 7-5" stroke="currentColor" strokeWidth="1" />
    </svg>
  );
}

function PinIcon() {
  return (
    <svg width="11" height="14" viewBox="0 0 11 14" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M5.5 13S10 8.5 10 5.5a4.5 4.5 0 10-9 0C1 8.5 5.5 13 5.5 13z"
        stroke="currentColor"
        strokeWidth="1"
      />
      <circle cx="5.5" cy="5.5" r="1.5" stroke="currentColor" strokeWidth="1" />
    </svg>
  );
}
