import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllResources, getResourceBySlug } from "@/lib/api/resources";

export async function generateStaticParams() {
  const resources = await getAllResources();
  return resources.map((resource) => ({ slug: resource.slug }));
}

export default async function ResourceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const resource = await getResourceBySlug(slug);

  if (!resource) {
    notFound();
  }

  const isDownload = resource.type === "download";
  const isCourse = resource.type === "course";

  return (
    <div className="flex flex-col items-center w-full">
      <article className="w-full flex flex-col items-center px-6 py-16">
        <div className="max-w-[768px] w-full flex flex-col gap-8">
          <Link
            href="/resources"
            className="flex items-center gap-2 w-fit font-bold text-sm text-[#ebc249]"
          >
            <BackArrowIcon />
            Back to Resource Library
          </Link>

          <div className="flex flex-col gap-4">
            <span className="w-fit px-3 py-1 rounded-xl font-geist font-black text-[10px] tracking-[1px] uppercase text-[#3d2e00] bg-[#ebc249]">
              {resource.category}
            </span>
            <h1 className="font-geist font-black text-[32px] md:text-[48px] leading-[1.1] tracking-[-1.2px] text-[#e5e2e1]">
              {resource.title}
            </h1>
            <div className="flex flex-wrap items-center gap-3 text-sm text-[rgba(229,226,225,0.5)]">
              {resource.author && <span>{resource.author}</span>}
              {resource.author && (resource.publishedAt || resource.readTimeMinutes) && (
                <span className="opacity-50">•</span>
              )}
              {resource.publishedAt && <span>{resource.publishedAt}</span>}
              {resource.readTimeMinutes && (
                <>
                  <span className="opacity-50">•</span>
                  <span>{resource.readTimeMinutes} min read</span>
                </>
              )}
              {isCourse && (
                <>
                  <span className="opacity-50">•</span>
                  <span>{resource.duration}</span>
                </>
              )}
              {isDownload && (
                <>
                  <span className="opacity-50">•</span>
                  <span>
                    {resource.fileType} • {resource.fileSize}
                  </span>
                </>
              )}
            </div>
          </div>

          <div className="relative h-[320px] md:h-[420px] w-full rounded-[32px] overflow-hidden border border-[rgba(77,70,53,0.1)]">
            <Image src={resource.image} alt={resource.title} fill className="object-cover" />
          </div>

          {resource.excerpt && (
            <p className="text-[20px] leading-8 text-[rgba(229,226,225,0.7)]">
              {resource.excerpt}
            </p>
          )}

          <div className="flex flex-col gap-6 text-[16px] leading-[28px] text-[rgba(229,226,225,0.6)]">
            <p>
              This is placeholder editorial content for &ldquo;{resource.title}&rdquo;. The full
              article, course curriculum, or guide content will be wired up once the Brocode
              Africa content backend is available.
            </p>
            <p>
              In the meantime, this page demonstrates the layout and structure that real content
              will occupy: a title, key metadata, a hero image, and a body of supporting
              paragraphs.
            </p>
          </div>

          {isCourse && (
            <Link
              href="/support"
              className="flex items-center justify-center py-4 rounded-2xl bg-[#ebc249] font-geist font-black text-[16px] text-[#3d2e00] w-fit px-10"
            >
              Enroll Now
            </Link>
          )}

          {isDownload && (
            <a
              href={resource.image}
              download
              className="flex items-center justify-center gap-2 py-4 rounded-2xl bg-[#ebc249] font-geist font-black text-[16px] text-[#3d2e00] w-fit px-10"
            >
              Download {resource.fileType}
            </a>
          )}
        </div>
      </article>
    </div>
  );
}

function BackArrowIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M10 6H2M6 2L2 6l4 4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
