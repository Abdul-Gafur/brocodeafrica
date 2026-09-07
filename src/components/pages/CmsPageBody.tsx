import Link from "next/link";
import { CmsPage } from "@/lib/types/page";

/**
 * Renders a CMS-managed page (About, Privacy Policy, Terms, …). The `body`
 * HTML is authored in the admin dashboard's rich-text editor and is trusted.
 */
export default function CmsPageBody({ page }: { page: CmsPage }) {
  return (
    <div className="flex flex-col items-center w-full">
      <article className="w-full flex flex-col items-center px-6 py-16">
        <div className="max-w-[768px] w-full flex flex-col gap-8">
          <Link
            href="/"
            className="flex items-center gap-2 w-fit font-bold text-sm text-[#ebc249]"
          >
            ← Back home
          </Link>

          <div className="flex flex-col gap-3">
            <h1 className="font-geist font-black text-[32px] md:text-[48px] leading-[1.1] tracking-[-1.2px] text-[#e5e2e1]">
              {page.title}
            </h1>
            {page.updatedAt && (
              <p className="text-sm text-[rgba(229,226,225,0.4)]">
                Last updated {new Date(page.updatedAt).toLocaleDateString("en-GB", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            )}
          </div>

          {page.body ? (
            <div
              className="flex flex-col gap-5 text-[16px] leading-[28px] text-[rgba(229,226,225,0.65)] [&_h2]:font-geist [&_h2]:font-black [&_h2]:text-[22px] [&_h2]:text-[#e5e2e1] [&_h2]:pt-4 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:flex [&_ul]:flex-col [&_ul]:gap-2 [&_a]:text-[#ebc249] [&_a]:underline [&_strong]:text-[#e5e2e1]"
              dangerouslySetInnerHTML={{ __html: page.body }}
            />
          ) : (
            <p className="text-[rgba(229,226,225,0.6)]">{page.excerpt}</p>
          )}
        </div>
      </article>
    </div>
  );
}
