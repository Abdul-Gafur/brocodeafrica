interface RegisterButtonProps {
  registrationUrl?: string;
  isRegistrationOpen?: boolean;
  className?: string;
  label?: string;
}

const BASE_CLASS =
  "flex items-center justify-center gap-2 px-8 py-[18px] rounded-2xl font-geist font-black text-[16px] w-full sm:w-auto";

/**
 * Sends an attendee to the event's external sign-up link (registrationUrl).
 * Falls back to a disabled state when registration is closed or no link is set.
 */
export default function RegisterButton({
  registrationUrl,
  isRegistrationOpen = true,
  className,
  label = "Register Now",
}: RegisterButtonProps) {
  const canRegister = Boolean(registrationUrl) && isRegistrationOpen;

  if (!canRegister) {
    return (
      <button
        type="button"
        disabled
        className={`${className ?? BASE_CLASS} bg-[#353534] text-[rgba(229,226,225,0.4)] cursor-not-allowed`}
      >
        {isRegistrationOpen ? "Registration opening soon" : "Registration closed"}
      </button>
    );
  }

  return (
    <a
      href={registrationUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={`${className ?? BASE_CLASS} bg-[#ebc249] text-[#3d2e00] shadow-[0px_20px_25px_-5px_rgba(235,194,73,0.2),0px_8px_10px_-6px_rgba(235,194,73,0.2)]`}
    >
      {label}
    </a>
  );
}
