import { getAllResources } from "@/lib/api/resources";
import ResourceLibraryClient from "@/components/resources/ResourceLibraryClient";

export default async function ResourceLibraryPage() {
  const resources = await getAllResources();

  return (
    <div className="flex flex-col items-center w-full">
      {/* Hero Section */}
      <section className="relative w-full flex flex-col items-center px-6 pt-16 pb-20 overflow-hidden">
        <div className="absolute -right-24 -top-24 size-96 bg-[rgba(235,194,73,0.05)] blur-[60px] rounded-xl" />
        <div className="absolute -left-24 bottom-0 size-96 bg-[rgba(181,196,255,0.05)] blur-[60px] rounded-xl" />
        <div className="flex flex-col gap-6 items-center text-center max-w-[896px] relative">
          <h1 className="font-geist font-black text-[36px] md:text-[64px] leading-[1.05] tracking-[-2px] md:tracking-[-3.2px] uppercase text-[#e5e2e1]">
            Empowered <span className="font-normal text-[#ebc249]">Digital Sovereignty</span> for
            the next generation
          </h1>
          <p className="max-w-[672px] text-[18px] md:text-[20px] leading-7 text-[#d1c5af] opacity-90">
            Access curated health insights, professional courses, and technical toolkits designed
            for Africa&apos;s rising digital leaders.
          </p>
        </div>
      </section>

      {/* Resource Library */}
      <section className="w-full flex flex-col items-center px-6 pb-24">
        <div className="max-w-[1280px] w-full">
          <ResourceLibraryClient resources={resources} />
        </div>
      </section>
    </div>
  );
}
