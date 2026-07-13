"use client";

export default function RegisterButton() {
  return (
    <button
      type="button"
      onClick={() =>
        window.alert(
          "Registration is coming soon. This event's booking flow will go live once the Brocode backend is connected."
        )
      }
      className="flex items-center justify-center gap-2 px-8 py-[18px] rounded-2xl bg-[#ebc249] font-geist font-black text-[16px] text-[#3d2e00] shadow-[0px_20px_25px_-5px_rgba(235,194,73,0.2),0px_8px_10px_-6px_rgba(235,194,73,0.2)] w-full sm:w-auto"
    >
      Register Now
    </button>
  );
}
